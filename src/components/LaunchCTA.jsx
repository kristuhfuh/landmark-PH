import FloralDecoration from './FloralDecoration'
import FAQ from './FAQ'

export default function LaunchCTA() {
  return (
    <section id="visit" aria-label="Frequently asked questions" className="relative bg-sand text-ink py-24 md:py-32 px-6 md:px-10 overflow-hidden">
      <FloralDecoration position="top-right" size="sm" opacity={0.18} />
      <FloralDecoration position="bottom-left" size="sm" opacity={0.18} />
      <span aria-hidden="true" className="pointer-events-none select-none absolute -bottom-6 md:-bottom-10 -right-4 md:right-8 font-display text-marine-dark/10 leading-none" style={{ fontSize: 'clamp(6rem, 18vw, 18rem)' }}>return to.</span>
      <FAQ />
    </section>
  )
}
