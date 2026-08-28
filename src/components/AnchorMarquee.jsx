/**
 * Slow horizontal marquee band. Repeats a stylistic anchor phrase across the
 * page as an editorial rhythm device (era-residence pattern).
 *
 * Kept as pure CSS animation for performance — no GSAP timeline per instance.
 */
export default function AnchorMarquee({
  phrase = 'A place to return to.',
  separator = '·',
  duration = 60,
  className = '',
}) {
  // Repeat the phrase enough times that a single strip covers 2x viewport,
  // guaranteeing seamless loop when we translate -50%.
  const items = Array.from({ length: 8 }, (_, i) => `${phrase} ${separator}`)

  return (
    <div
      aria-hidden="true"
      className={`relative w-full overflow-hidden py-6 md:py-8 border-y border-marine-dark/10 bg-sand ${className}`}
    >
      <div
        className="flex whitespace-nowrap will-change-transform"
        style={{
          animation: `landmark-marquee ${duration}s linear infinite`,
        }}
      >
        {[...items, ...items].map((text, i) => (
          <span
            key={i}
            className="font-display italic text-3xl md:text-5xl text-marine-dark/35 pr-8 md:pr-12 tracking-tight"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
