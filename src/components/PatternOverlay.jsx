/**
 * Subtle geometric overlay for dark/marine sections.
 *
 * Point it at `/public/pattern-marine.png` (the concentric-squares tile
 * the user provided). Renders as a tiled background at very low opacity
 * so it reads as texture, not decoration.
 *
 * Falls back to an inline SVG data-URI approximation if the image file
 * hasn't been added yet — same vibe (nested squares), zero request cost.
 */
const FALLBACK_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='42' height='42' viewBox='0 0 42 42'><g fill='none' stroke='%23FFFFFF' stroke-opacity='0.5'><rect x='2' y='2' width='38' height='38'/><rect x='7' y='7' width='28' height='28'/><rect x='12' y='12' width='18' height='18'/><rect x='17' y='17' width='8' height='8'/></g></svg>\")"

export default function PatternOverlay({
  className = '',
  opacity = 0.06,
  size = 42,
  mixBlendMode = 'overlay',
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        opacity,
        mixBlendMode,
        // Prefer the user-supplied PNG when present, fall back to SVG.
        backgroundImage: `url('/pattern-marine.png'), ${FALLBACK_SVG}`,
        backgroundSize: `${size * 6}px, ${size}px`,
        backgroundRepeat: 'repeat',
      }}
    />
  )
}
