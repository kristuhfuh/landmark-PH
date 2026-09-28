import { Router } from 'express'
import { query } from '../db.js'
import { COLLECTIONS, toApiRow } from '../collections.js'

const router = Router()

/**
 * Public content endpoint. Returns the same shape as the legacy
 * `src/content.json` so the frontend can drop it in without refactoring
 * every component that uses `useContent(key)`.
 */
router.get('/content', async (_req, res) => {
  try {
    const [settingRows, navLinks, introPillars, zones, zoneItems, gallery, vendors, ticketCategories, ticketItems, citizenFeatures, rooms, chapters, callouts] =
      await Promise.all([
        query('SELECT section, value FROM settings'),
        loadCollection('navLinks'),
        loadCollection('introPillars'),
        loadCollection('zones'),
        loadCollection('zoneItems'),
        loadCollection('waterfrontGallery'),
        loadCollection('fnbVendors'),
        loadCollection('ticketCategories'),
        loadCollection('ticketItems'),
        loadCollection('citizenFeatures'),
        loadCollection('rooms'),
        loadCollection('panoramaChapters'),
        loadCollection('revealCallouts'),
      ])

    const settings = {}
    for (const row of settingRows) {
      settings[row.section] =
        typeof row.value === 'string' ? JSON.parse(row.value) : row.value
    }

    // Reassemble into the content.json shape the frontend expects.
    const shape = {
      siteSettings: {
        ...(settings.siteSettings || {}),
        navLinks: navLinks.map(({ label, href }) => ({ label, href })),
      },
      hero: settings.hero || {},
      intro: {
        ...(settings.intro || {}),
        pillars: introPillars.map(({ title, body }) => ({ title, body })),
      },
      flagship: settings.flagship || {},
      ring: hydrateZone(zones, zoneItems, 'ring', settings.ring),
      green: hydrateZone(zones, zoneItems, 'green', settings.green),
      waterfront: {
        ...(settings.waterfront || {}),
        ...zoneCoreFields(zones.find((z) => z.slug === 'waterfront')),
        gallery: gallery.map(({ title, tag, imageUrl }) => ({
          title,
          tag,
          imageUrl,
        })),
      },
      fnbMarketplace: {
        ...(settings.fnbMarketplace || {}),
        vendors: vendors.map(({ name, kind, body }) => ({ name, kind, body })),
      },
      tickets: {
        ...(settings.tickets || {}),
        categories: ticketCategories.map(({ key, label }) => ({ key, label })),
        items: ticketItems.map((t) => ({
          id: t.id,
          category: t.category,
          name: t.name,
          tag: t.tag,
          priceNGN: t.priceNGN,
          priceUnit: t.priceUnit,
          body: t.body,
          featured: t.featured || undefined,
          includes: t.includes || [],
        })),
      },
      citizenApp: {
        ...(settings.citizenApp || {}),
        features: citizenFeatures.map(({ icon, label, body }) => ({
          icon,
          label,
          body,
        })),
      },
      overlap: settings.overlap || {},
      panorama: {
        ...(settings.panorama || {}),
        chapters: chapters.map(({ title, body }) => ({ title, body })),
      },
      rooms: {
        ...(settings.rooms || {}),
        items: rooms.map((r) => ({
          name: r.name,
          tag: r.tag,
          size: r.size,
          guests: r.guests,
          priceFrom: r.priceFrom,
          body: r.body,
          imageUrl: r.imageUrl,
          features: r.features || [],
        })),
      },
      reveal: {
        ...(settings.reveal || {}),
        callouts: callouts.map((c) => c.label),
      },
      siteMap: settings.siteMap || {},
      visit: settings.visit || {},
    }

    res.json(shape)
  } catch (err) {
    console.error('[content] load failed', err)
    res.status(500).json({ error: err.message })
  }
})

async function loadCollection(key) {
  const c = COLLECTIONS[key]
  const rows = await query(
    `SELECT * FROM \`${c.table}\` ORDER BY sort_order ASC, id ASC`
  )
  return rows.map((r) => toApiRow(c, r))
}

function zoneCoreFields(z) {
  if (!z) return {}
  return {
    zoneLabel: z.zoneLabel,
    title: z.title,
    intro: z.intro,
    heroImageUrl: z.heroImageUrl,
    heroImage: z.heroImageUrl,
    asideImage: z.asideImage,
    ctaLabel: z.ctaLabel,
    dayPassLabel: z.dayPassLabel,
    callout: z.callout,
    features: z.features || [],
    stats: z.stats || [],
  }
}

function hydrateZone(zones, zoneItems, slug, override = {}) {
  const zone = zones.find((z) => z.slug === slug)
  if (!zone) return override
  const items = zoneItems
    .filter((i) => i.zoneId === zone.id)
    .map((i) => ({
      title: i.title,
      area: i.area,
      body: i.body,
      imageUrl: i.imageUrl,
      icon: i.icon,
    }))
  return { ...override, ...zoneCoreFields(zone), items }
}

export default router
