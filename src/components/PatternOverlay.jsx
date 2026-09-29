/**
 * Subtle geometric overlay for dark/marine sections.
 *
 * Point it at `/public/pattern-marine.png` (the concentric-squares tile
 * the user provided). Renders as a tiled background at low opacity so
 * it reads as texture, not decoration.
 *
 * Falls back to an inline SVG data-URI approximation if the image file
 * hasn't been added yet — same vibe (nested squares), zero request cost.
 * The fallback uses a light stroke that composites well on marine-dark
 * without needing mix-blend-mode (which flattens to invisible if the
 * base layer has no colour spread).
 */
const FALLBACK_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><g fill='none' stroke='%23EFE7D6' stroke-width='0.75'><rect x='2' y='2' width='44' height='44'/><rect x='7' y='7' width='34' height='34'/><rect x='12' y='12' width='24' height='24'/><rect x='17' y='17' width='14' height='14'/><rect x='22' y='22' width='4' height='4'/></g></svg>\")"

export default function PatternOverlay({
  className = '',
  opacity = 0.14,
  size = 48,
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        opacity,
        backgroundImage: `url('/pattern-marine.png'), ${FALLBACK_SVG}`,
        backgroundSize: `${size * 6}px, ${size}px`,
        backgroundRepeat: 'repeat',
      }}
    />
  )
}
