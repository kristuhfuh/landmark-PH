/**
 * Round CTA button with a slowly-rotating dashed stroke. Era-style "book a
 * call" button. Renders as a button or link.
 *
 * Props: `as` (default 'button'), `size` ('sm' | 'md' | 'lg'), children.
 */
export default function CircleButton({
  as = 'button',
  size = 'md',
  tone = 'ink', // 'ink' for light backgrounds, 'sand' for dark photos
  className = '',
  children,
  ...rest
}) {
  const Tag = as
  const dimension = {
    sm: 'h-24 w-24 text-[10px]',
    md: 'h-36 w-36 text-[11px]',
    lg: 'h-48 w-48 text-xs',
  }[size]
  const toneClass =
    tone === 'sand'
      ? 'text-sand hover:text-orange-light'
      : 'text-marine-dark hover:text-orange-dark'

  return (
    <Tag
      {...rest}
      className={`group relative inline-flex items-center justify-center rounded-full ${dimension} tracking-widest2 uppercase ${toneClass} transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-dark ${className}`}
    >
      {/* Rotating dashed stroke */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full transition-transform duration-300 group-hover:scale-105"
        style={{ animation: 'landmark-spin 22s linear infinite' }}
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="1 3"
          opacity="0.85"
        />
      </svg>
      {/* Solid inner ring on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-1 rounded-full border border-transparent group-hover:border-orange-dark/40 transition-colors duration-300"
      />
      <span className="relative z-10 text-center px-3 leading-tight">
        {children}
      </span>
    </Tag>
  )
}
