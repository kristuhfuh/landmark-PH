/**
 * Tropical floral cluster rendered as inline SVG so it inherits the current
 * palette via CSS variables. Cluster of 5-petal hibiscus silhouettes plus
 * bougainvillea-style small blooms and palm fronds, arranged into a corner
 * bouquet. Position with the `position` prop.
 */
export default function FloralDecoration({
  position = 'top-left', // 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
}) {
  const cornerClass = {
    'top-left': 'top-0 left-0 origin-top-left',
    'top-right': 'top-0 right-0 origin-top-right -scale-x-100',
    'bottom-left': 'bottom-0 left-0 origin-bottom-left -scale-y-100',
    'bottom-right': 'bottom-0 right-0 origin-bottom-right -scale-100',
  }[position]

  const sizeClass = {
    sm: 'w-40 md:w-56',
    md: 'w-56 md:w-80',
    lg: 'w-72 md:w-[28rem]',
  }[size]

  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none select-none ${cornerClass} ${sizeClass} ${className}`}
    >
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        {/* Palm fronds — long curved leaves */}
        <g style={{ stroke: 'rgb(var(--c-marine-dark))', fill: 'rgb(var(--c-marine-dark))', opacity: 0.35 }}>
          <path
            d="M 20 20 Q 90 40 150 90 Q 170 110 165 130 Q 160 108 140 92 Q 100 60 40 45 Q 25 40 20 20 Z"
          />
          <path
            d="M 30 30 Q 40 100 90 160 Q 105 175 118 175 Q 100 165 88 148 Q 55 105 45 55 Q 40 40 30 30 Z"
          />
          <path
            d="M 40 20 Q 110 30 180 60 Q 200 70 200 84 Q 185 74 160 66 Q 110 52 55 42 Q 45 35 40 20 Z"
          />
        </g>

        {/* Hibiscus silhouettes — larger 5-petal blooms */}
        <g style={{ fill: 'rgb(var(--c-orange))', opacity: 0.55 }}>
          {[
            { cx: 140, cy: 110, r: 34, rot: 12 },
            { cx: 210, cy: 60, r: 26, rot: -20 },
            { cx: 105, cy: 175, r: 22, rot: 45 },
          ].map((f, i) => (
            <g key={i} transform={`translate(${f.cx} ${f.cy}) rotate(${f.rot})`}>
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
              <circle r={f.r * 0.28} style={{ fill: 'rgb(var(--c-orange-dark))' }} />
            </g>
          ))}
        </g>

        {/* Bougainvillea — tight cluster of small dots for the papery blooms */}
        <g style={{ fill: 'rgb(var(--c-orange-dark))', opacity: 0.7 }}>
          {generateClusterPoints({ cx: 240, cy: 130, count: 40, spread: 55 }).map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={p.r} />
          ))}
          {generateClusterPoints({ cx: 190, cy: 220, count: 28, spread: 42 }).map((p, i) => (
            <circle key={`b-${i}`} cx={p.x} cy={p.y} r={p.r} />
          ))}
        </g>
      </svg>
    </div>
  )
}

// Small deterministic cluster generator so re-renders don't reshuffle.
function generateClusterPoints({ cx, cy, count, spread }) {
  const points = []
  let seed = cx + cy
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
  for (let i = 0; i < count; i++) {
    const angle = random() * Math.PI * 2
    const dist = Math.pow(random(), 0.6) * spread
    points.push({
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      r: 3 + random() * 4,
    })
  }
  return points
}
