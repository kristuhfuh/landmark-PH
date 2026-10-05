/**
 * Corner floral decoration — rendered as inline SVG so it's truly
 * transparent against any background and uses the live palette via
 * CSS custom properties.
 *
 * Each corner draws a bouquet composed of:
 *   - Palm fronds (long curved leaves) in marine-dark
 *   - Hibiscus silhouettes (5-petal blooms) in orange
 *   - Bougainvillea cluster (small papery dots) in orange-dark
 *
 * Position + size driven by props. The whole SVG is flipped per corner
 * so the fronds always radiate inward from the corner.
 */

const CORNER = {
  'top-left': { top: 0, left: 0, scaleX: 1, scaleY: 1 },
  'top-right': { top: 0, right: 0, scaleX: -1, scaleY: 1 },
  'bottom-left': { bottom: 0, left: 0, scaleX: 1, scaleY: -1 },
  'bottom-right': { bottom: 0, right: 0, scaleX: -1, scaleY: -1 },
}

const SIZE_CLASS = {
  sm: 'w-40 md:w-56',
  md: 'w-56 md:w-80',
  lg: 'w-72 md:w-[28rem]',
}

export default function FloralDecoration({
  position = 'top-left',
  size = 'md',
  className = '',
  opacity = 1,
}) {
  const corner = CORNER[position]
  const sizeClass = SIZE_CLASS[size]

  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none select-none ${sizeClass} ${className}`}
      style={{
        top: corner.top,
        left: corner.left,
        right: corner.right,
        bottom: corner.bottom,
        aspectRatio: '1 / 1',
        opacity,
        transform: `scale(${corner.scaleX}, ${corner.scaleY})`,
        transformOrigin: 'center',
      }}
    >
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Palm fronds — long leaf strokes radiating from the corner. */}
        <g
          style={{
            fill: 'rgb(var(--c-marine-dark))',
            opacity: 0.3,
          }}
        >
          <path d="M 20 20 Q 90 40 150 90 Q 170 110 165 130 Q 160 108 140 92 Q 100 60 40 45 Q 25 40 20 20 Z" />
          <path d="M 30 30 Q 40 100 90 160 Q 105 175 118 175 Q 100 165 88 148 Q 55 105 45 55 Q 40 40 30 30 Z" />
          <path d="M 40 20 Q 110 30 180 60 Q 200 70 200 84 Q 185 74 160 66 Q 110 52 55 42 Q 45 35 40 20 Z" />
          <path d="M 20 60 Q 100 90 160 160 Q 175 178 168 192 Q 158 170 140 150 Q 90 100 30 75 Q 22 70 20 60 Z" />
        </g>

        {/* Hibiscus blooms — 5-petal flowers in the warm orange. */}
        <g style={{ fill: 'rgb(var(--c-orange))', opacity: 0.72 }}>
          {[
            { cx: 140, cy: 110, r: 36, rot: 12 },
            { cx: 215, cy: 60, r: 26, rot: -20 },
            { cx: 105, cy: 180, r: 24, rot: 45 },
            { cx: 60, cy: 90, r: 18, rot: -8 },
          ].map((f, i) => (
            <g
              key={i}
              transform={`translate(${f.cx} ${f.cy}) rotate(${f.rot})`}
            >
              {[0, 72, 144, 216, 288].map((deg) => (
                <ellipse
                  key={deg}
                  cx="0"
                  cy={-f.r * 0.85}
                  rx={f.r * 0.55}
                  ry={f.r * 0.9}
                  transform={`rotate(${deg})`}
                />
              ))}
              <circle
                r={f.r * 0.28}
                style={{ fill: 'rgb(var(--c-orange-dark))' }}
              />
            </g>
          ))}
        </g>

        {/* Bougainvillea — tight cluster of small papery dots in orange-dark. */}
        <g style={{ fill: 'rgb(var(--c-orange-dark))', opacity: 0.72 }}>
          {generateCluster({ cx: 240, cy: 130, count: 44, spread: 60 }).map(
            (p, i) => (
              <circle key={`a-${i}`} cx={p.x} cy={p.y} r={p.r} />
            )
          )}
          {generateCluster({ cx: 195, cy: 225, count: 30, spread: 46 }).map(
            (p, i) => (
              <circle key={`b-${i}`} cx={p.x} cy={p.y} r={p.r} />
            )
          )}
        </g>
      </svg>
    </div>
  )
}

// Deterministic cluster so re-renders don't reshuffle the dots.
function generateCluster({ cx, cy, count, spread }) {
  const points = []
  let seed = cx * 1000 + cy
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
  for (let i = 0; i < count; i++) {
    const angle = rand() * Math.PI * 2
    const dist = Math.pow(rand(), 0.6) * spread
    points.push({
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      r: 3 + rand() * 4,
    })
  }
  return points
}
