import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import bcrypt from 'bcryptjs'
import mysql from 'mysql2/promise'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CONTENT_PATH = path.join(__dirname, '..', '..', 'src', 'content.json')
const SETTING_SECTIONS = [
  'siteSettings', 'hero', 'intro', 'flagship', 'citizenApp',
  'overlap', 'panorama', 'rooms', 'reveal', 'siteMap', 'visit',
  'fnbMarketplace', 'tickets', 'ring', 'green', 'waterfront',
]

const sslEnabled = String(process.env.DB_SSL).toLowerCase() === 'true'

async function main() {
  const content = JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf-8'))
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ...(sslEnabled ? { ssl: { rejectUnauthorized: false } } : {}),
  })

  console.log('[seed] connected')

  // --- 1. Wipe collection tables so re-seeding is idempotent ---
  const toWipe = [
    'nav_links', 'intro_pillars', 'zone_items', 'zones',
    'waterfront_gallery', 'fnb_vendors', 'ticket_items', 'ticket_categories',
    'citizen_features', 'rooms', 'panorama_chapters', 'reveal_callouts',
    'settings',
  ]
  for (const t of toWipe) {
    await conn.query(`DELETE FROM \`${t}\``)
  }
  console.log('[seed] cleared collection tables')

  // --- 2. Settings (whole-section JSON blobs) ---
  for (const section of SETTING_SECTIONS) {
    if (!content[section]) continue
    // Strip nested collections that live in their own tables to avoid
    // duplicating source-of-truth.
    const value = { ...content[section] }
    if (section === 'siteSettings') delete value.navLinks
    if (section === 'intro') delete value.pillars
    if (section === 'fnbMarketplace') delete value.vendors
    if (section === 'tickets') { delete value.items; delete value.categories }
    if (section === 'citizenApp') delete value.features
    if (section === 'rooms') delete value.items
    if (section === 'panorama') delete value.chapters
    if (section === 'reveal') delete value.callouts
    if (['ring', 'green', 'waterfront'].includes(section)) delete value.items

    await conn.query(
      `INSERT INTO settings (section, value) VALUES (?, CAST(? AS JSON))`,
      [section, JSON.stringify(value)]
    )
  }
  console.log(`[seed] settings: ${SETTING_SECTIONS.length} sections`)

  // --- 3. Nav links ---
  const navLinks = content.siteSettings?.navLinks || []
  for (let i = 0; i < navLinks.length; i++) {
    const l = navLinks[i]
    await conn.query(
      'INSERT INTO nav_links (label, href, sort_order) VALUES (?, ?, ?)',
      [l.label, l.href, i]
    )
  }
  console.log(`[seed] nav_links: ${navLinks.length}`)

  // --- 4. Intro pillars ---
  const pillars = content.intro?.pillars || []
  for (let i = 0; i < pillars.length; i++) {
    await conn.query(
      'INSERT INTO intro_pillars (title, body, sort_order) VALUES (?, ?, ?)',
      [pillars[i].title, pillars[i].body, i]
    )
  }
  console.log(`[seed] intro_pillars: ${pillars.length}`)

  // --- 5. Zones + zone items ---
  const zoneSlugs = ['ring', 'green', 'waterfront']
  for (let i = 0; i < zoneSlugs.length; i++) {
    const slug = zoneSlugs[i]
    const z = content[slug] || {}
    const [result] = await conn.query(
      `INSERT INTO zones
        (slug, zone_label, title, intro, hero_image_url, aside_image,
         cta_label, day_pass_label, callout, features, stats, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CAST(? AS JSON), CAST(? AS JSON), ?)`,
      [
        slug,
        z.zoneLabel || null,
        z.title || slug,
        z.intro || null,
        z.heroImageUrl || z.heroImage || null,
        z.asideImage || null,
        z.ctaLabel || null,
        z.dayPassLabel || null,
        z.callout || null,
        JSON.stringify(z.features || []),
        JSON.stringify(z.stats || []),
        i,
      ]
    )
    const zoneId = result.insertId
    const items = z.items || []
    for (let j = 0; j < items.length; j++) {
      const it = items[j]
      await conn.query(
        `INSERT INTO zone_items
          (zone_id, title, area, body, image_url, icon, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [zoneId, it.title, it.area || null, it.body || null,
         it.imageUrl || null, it.icon || null, j]
      )
    }
    console.log(`[seed] zone ${slug}: ${items.length} items`)
  }

  // --- 6. Waterfront gallery ---
  const gallery = content.waterfront?.gallery || []
  for (let i = 0; i < gallery.length; i++) {
    const g = gallery[i]
    await conn.query(
      `INSERT INTO waterfront_gallery (title, tag, image_url, sort_order)
       VALUES (?, ?, ?, ?)`,
      [g.title, g.tag || null, g.imageUrl, i]
    )
  }
  console.log(`[seed] waterfront_gallery: ${gallery.length}`)

  // --- 7. F&B vendors ---
  const vendors = content.fnbMarketplace?.vendors || []
  for (let i = 0; i < vendors.length; i++) {
    const v = vendors[i]
    await conn.query(
      `INSERT INTO fnb_vendors (name, kind, body, sort_order)
       VALUES (?, ?, ?, ?)`,
      [v.name, v.kind || null, v.body || null, i]
    )
  }
  console.log(`[seed] fnb_vendors: ${vendors.length}`)

  // --- 8. Ticket categories + items ---
  const categories = content.tickets?.categories || []
  for (let i = 0; i < categories.length; i++) {
    const c = categories[i]
    await conn.query(
      `INSERT INTO ticket_categories (key_slug, label, sort_order)
       VALUES (?, ?, ?)`,
      [c.key, c.label, i]
    )
  }
  const items = content.tickets?.items || []
  for (let i = 0; i < items.length; i++) {
    const t = items[i]
    await conn.query(
      `INSERT INTO ticket_items
        (slug, category_key, name, tag, price_ngn, price_unit, body,
         featured, includes, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CAST(? AS JSON), ?)`,
      [
        t.id, t.category, t.name, t.tag || null,
        t.priceNGN || 0, t.priceUnit || null, t.body || null,
        t.featured ? 1 : 0,
        JSON.stringify(t.includes || []),
        i,
      ]
    )
  }
  console.log(`[seed] tickets: ${categories.length} categories, ${items.length} items`)

  // --- 9. Citizen features ---
  const feats = content.citizenApp?.features || []
  for (let i = 0; i < feats.length; i++) {
    const f = feats[i]
    await conn.query(
      `INSERT INTO citizen_features (icon, label, body, sort_order)
       VALUES (?, ?, ?, ?)`,
      [f.icon || null, f.label, f.body || null, i]
    )
  }
  console.log(`[seed] citizen_features: ${feats.length}`)

  // --- 10. Rooms ---
  const rooms = content.rooms?.items || []
  for (let i = 0; i < rooms.length; i++) {
    const r = rooms[i]
    await conn.query(
      `INSERT INTO rooms
        (name, tag, size, guests, price_from, body, image_url, features, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, CAST(? AS JSON), ?)`,
      [
        r.name, r.tag || null, r.size || null, r.guests || null,
        r.priceFrom || null, r.body || null, r.imageUrl || null,
        JSON.stringify(r.features || []), i,
      ]
    )
  }
  console.log(`[seed] rooms: ${rooms.length}`)

  // --- 11. Panorama chapters ---
  const chapters = content.panorama?.chapters || []
  for (let i = 0; i < chapters.length; i++) {
    const c = chapters[i]
    await conn.query(
      `INSERT INTO panorama_chapters (title, body, sort_order)
       VALUES (?, ?, ?)`,
      [c.title, c.body || null, i]
    )
  }
  console.log(`[seed] panorama_chapters: ${chapters.length}`)

  // --- 12. Reveal callouts ---
  const callouts = content.reveal?.callouts || []
  for (let i = 0; i < callouts.length; i++) {
    await conn.query(
      'INSERT INTO reveal_callouts (label, sort_order) VALUES (?, ?)',
      [callouts[i], i]
    )
  }
  console.log(`[seed] reveal_callouts: ${callouts.length}`)

  // --- 13. Admin user (idempotent — skip if exists) ---
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@landmark-portharcourt.ng'
  const password = process.env.SEED_ADMIN_PASSWORD || 'change-me-please'
  const name = process.env.SEED_ADMIN_NAME || 'Landmark Admin'
  const [existing] = await conn.query(
    'SELECT id FROM admin_users WHERE email = ? LIMIT 1',
    [email]
  )
  if (!existing.length) {
    const hash = await bcrypt.hash(password, 12)
    await conn.query(
      'INSERT INTO admin_users (email, password_hash, name) VALUES (?, ?, ?)',
      [email, hash, name]
    )
    console.log(`[seed] admin user created: ${email}`)
  } else {
    console.log(`[seed] admin user already exists: ${email}`)
  }

  await conn.end()
  console.log('[seed] done.')
}

main().catch((err) => {
  console.error('[seed] failed:', err)
  process.exit(1)
})
