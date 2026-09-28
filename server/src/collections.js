/**
 * Registry of admin-managed collections.
 *
 * Each entry maps an API slug (`/api/admin/collections/:key`) to a MySQL
 * table + column list. The generic CRUD router in `routes/collections.js`
 * uses this metadata to render forms + validate payloads without
 * per-collection boilerplate.
 *
 *   dbField  — snake_case column name in MySQL
 *   apiField — camelCase field returned by / accepted from the API
 *   type     — 'string' | 'text' | 'int' | 'bool' | 'json' | 'url' | 'slug'
 *   required — boolean
 */
export const COLLECTIONS = {
  navLinks: {
    table: 'nav_links',
    label: 'Nav Links',
    orderable: true,
    fields: [
      { db: 'label', api: 'label', type: 'string', required: true },
      { db: 'href', api: 'href', type: 'string', required: true },
    ],
  },
  introPillars: {
    table: 'intro_pillars',
    label: 'Concept Pillars',
    orderable: true,
    fields: [
      { db: 'title', api: 'title', type: 'string', required: true },
      { db: 'body', api: 'body', type: 'text', required: true },
    ],
  },
  zones: {
    table: 'zones',
    label: 'Zones',
    orderable: true,
    fields: [
      { db: 'slug', api: 'slug', type: 'slug', required: true, unique: true },
      { db: 'zone_label', api: 'zoneLabel', type: 'string' },
      { db: 'title', api: 'title', type: 'string', required: true },
      { db: 'intro', api: 'intro', type: 'text' },
      { db: 'hero_image_url', api: 'heroImageUrl', type: 'url' },
      { db: 'aside_image', api: 'asideImage', type: 'url' },
      { db: 'cta_label', api: 'ctaLabel', type: 'string' },
      { db: 'day_pass_label', api: 'dayPassLabel', type: 'string' },
      { db: 'callout', api: 'callout', type: 'text' },
      { db: 'features', api: 'features', type: 'json' },
      { db: 'stats', api: 'stats', type: 'json' },
    ],
  },
  zoneItems: {
    table: 'zone_items',
    label: 'Zone Items',
    orderable: true,
    fields: [
      { db: 'zone_id', api: 'zoneId', type: 'int', required: true },
      { db: 'title', api: 'title', type: 'string', required: true },
      { db: 'area', api: 'area', type: 'string' },
      { db: 'body', api: 'body', type: 'text' },
      { db: 'image_url', api: 'imageUrl', type: 'url' },
      { db: 'icon', api: 'icon', type: 'string' },
    ],
  },
  waterfrontGallery: {
    table: 'waterfront_gallery',
    label: 'Waterfront Gallery',
    orderable: true,
    fields: [
      { db: 'title', api: 'title', type: 'string', required: true },
      { db: 'tag', api: 'tag', type: 'string' },
      { db: 'image_url', api: 'imageUrl', type: 'url', required: true },
    ],
  },
  fnbVendors: {
    table: 'fnb_vendors',
    label: 'F&B Vendors',
    orderable: true,
    fields: [
      { db: 'name', api: 'name', type: 'string', required: true },
      { db: 'kind', api: 'kind', type: 'string' },
      { db: 'body', api: 'body', type: 'text' },
    ],
  },
  ticketCategories: {
    table: 'ticket_categories',
    label: 'Ticket Categories',
    orderable: true,
    fields: [
      { db: 'key_slug', api: 'key', type: 'slug', required: true, unique: true },
      { db: 'label', api: 'label', type: 'string', required: true },
    ],
  },
  ticketItems: {
    table: 'ticket_items',
    label: 'Ticket Items',
    orderable: true,
    fields: [
      { db: 'slug', api: 'id', type: 'slug', required: true, unique: true },
      { db: 'category_key', api: 'category', type: 'string', required: true },
      { db: 'name', api: 'name', type: 'string', required: true },
      { db: 'tag', api: 'tag', type: 'string' },
      { db: 'price_ngn', api: 'priceNGN', type: 'int', required: true },
      { db: 'price_unit', api: 'priceUnit', type: 'string' },
      { db: 'body', api: 'body', type: 'text' },
      { db: 'featured', api: 'featured', type: 'bool' },
      { db: 'includes', api: 'includes', type: 'json' },
    ],
  },
  citizenFeatures: {
    table: 'citizen_features',
    label: 'Citizen App Features',
    orderable: true,
    fields: [
      { db: 'icon', api: 'icon', type: 'string' },
      { db: 'label', api: 'label', type: 'string', required: true },
      { db: 'body', api: 'body', type: 'text' },
    ],
  },
  rooms: {
    table: 'rooms',
    label: 'Rooms & Stays',
    orderable: true,
    fields: [
      { db: 'name', api: 'name', type: 'string', required: true },
      { db: 'tag', api: 'tag', type: 'string' },
      { db: 'size', api: 'size', type: 'string' },
      { db: 'guests', api: 'guests', type: 'string' },
      { db: 'price_from', api: 'priceFrom', type: 'string' },
      { db: 'body', api: 'body', type: 'text' },
      { db: 'image_url', api: 'imageUrl', type: 'url' },
      { db: 'features', api: 'features', type: 'json' },
    ],
  },
  panoramaChapters: {
    table: 'panorama_chapters',
    label: 'Panorama Chapters',
    orderable: true,
    fields: [
      { db: 'title', api: 'title', type: 'string', required: true },
      { db: 'body', api: 'body', type: 'text' },
    ],
  },
  revealCallouts: {
    table: 'reveal_callouts',
    label: 'Reveal Callouts',
    orderable: true,
    fields: [
      { db: 'label', api: 'label', type: 'string', required: true },
    ],
  },
}

/** Sections stored as JSON blobs in `settings` (one row per section). */
export const SETTING_SECTIONS = [
  'siteSettings',
  'hero',
  'intro',
  'flagship',
  'citizenApp',
  'overlap',
  'panorama',
  'rooms',
  'reveal',
  'siteMap',
  'visit',
  'fnbMarketplace',
  'tickets',
  'ring',
  'green',
  'waterfront',
]

export function toApiRow(collection, row) {
  const out = { id: row.id, sortOrder: row.sort_order }
  for (const f of collection.fields) {
    let v = row[f.db]
    if (f.type === 'json' && typeof v === 'string') {
      try { v = JSON.parse(v) } catch { /* keep string */ }
    }
    if (f.type === 'bool') v = Boolean(v)
    out[f.api] = v
  }
  return out
}

export function toDbInsert(collection, payload) {
  const cols = ['sort_order']
  const values = [Number(payload.sortOrder) || 0]
  for (const f of collection.fields) {
    if (!(f.api in payload)) continue
    cols.push(f.db)
    values.push(serialiseField(f, payload[f.api]))
  }
  return { cols, values }
}

export function toDbUpdate(collection, payload) {
  const sets = []
  const values = []
  if ('sortOrder' in payload) {
    sets.push('sort_order = ?')
    values.push(Number(payload.sortOrder) || 0)
  }
  for (const f of collection.fields) {
    if (!(f.api in payload)) continue
    sets.push(`${f.db} = ?`)
    values.push(serialiseField(f, payload[f.api]))
  }
  return { sets, values }
}

function serialiseField(f, value) {
  if (value === undefined || value === null || value === '') {
    return f.required ? '' : null
  }
  switch (f.type) {
    case 'int':
      return Number(value)
    case 'bool':
      return value ? 1 : 0
    case 'json':
      return JSON.stringify(value)
    default:
      return String(value)
  }
}
