import { useMemo } from 'react'
import { useContent } from '../lib/content'

const KEY_TO_VAR = {
  marine: '--c-marine',
  marineDark: '--c-marine-dark',
  marineLight: '--c-marine-light',
  orange: '--c-orange',
  orangeLight: '--c-orange-light',
  orangeDark: '--c-orange-dark',
  sand: '--c-sand',
  ink: '--c-ink',
}

function hexToRgbTriplet(hex) {
  if (!hex || typeof hex !== 'string') return null
  const cleaned = hex.replace('#', '')
  if (cleaned.length !== 6) return null
  const n = parseInt(cleaned, 16)
  if (Number.isNaN(n)) return null
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}

/**
 * Reads siteSettings.palette from content.json and overrides the
 * :root --c-* CSS variables. Tailwind classes like bg-marine, text-orange/50
 * pick up the change automatically.
 */
export default function PaletteInjector() {
  const settings = useContent('siteSettings')
  const palette = settings.palette || {}

  const css = useMemo(() => {
    const decls = Object.entries(KEY_TO_VAR)
      .map(([key, varName]) => {
        const triplet = hexToRgbTriplet(palette[key])
        return triplet ? `${varName}: ${triplet};` : null
      })
      .filter(Boolean)
      .join(' ')
    return decls ? `:root { ${decls} }` : ''
  }, [palette])

  if (!css) return null
  return <style>{css}</style>
}
