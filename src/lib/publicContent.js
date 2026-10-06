const AREA_UNIT = /\b(?:sqm|sq\.?\s*m|square\s*met(?:er|re)s?)\b|\bm(?:²|2\b)/i
const AREA_MEASUREMENT = /\b\d[\d,.]*\s*(?:sqm\b|sq\.?\s*m\b|square\s*met(?:er|re)s?\b|m[²2])/gi

// Apply the same public content rules to local data and CMS responses.
export function publicContent(value) {
  if (typeof value === 'string') {
    return value.replace(AREA_MEASUREMENT, '').replace(/ {2,}/g, ' ').trim()
  }
  if (Array.isArray(value)) {
    return value
      .filter(item => !(item && typeof item === 'object' && typeof item.value === 'string' && AREA_UNIT.test(item.value)))
      .map(publicContent)
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== 'area' && key !== 'size')
        .map(([key, entry]) => [key, publicContent(entry)])
    )
  }
  return value
}
