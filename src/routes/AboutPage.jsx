import { useEffect } from 'react'
import PageNav from '../components/PageNav'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import PatternOverlay from '../components/PatternOverlay'
import { useContent } from '../lib/content'

const PRINCIPLES = [
  {
    n: '01',
    title: 'Designed, not adapted.',
    body: 'An upside-down attraction built from a concept with no precedent anywhere in the world — every space reasoned through from scratch for this shoreline, not copied from a park already open somewhere else.',
  },
  {
    n: '02',
    title: 'Grounds, not a park.',
    body: 'Nine distinct quarters held together by water, walkways and green. Built to be explored over a full day at your own pace — not queued through in an hour.',
  },
  {
    n: '03',
    title: 'Made for return visits.',
    body: 'A resident membership, a curated food line-up and a beach club designed around the people who will come back every weekend — not once for a photo.',
  },
]

const TIMELINE = [
  { year: '2021', label: 'Concept commissioned' },
  { year: '2023', label: 'Master plan locked' },
  { year: '2024', label: 'The Ring & Green opened' },
  { year: '2025', label: 'Waterfront + Beach Club opened' },
  { year: '2026', label: 'Full grounds live — you are here' },
]

const STATS = [
  { value: '9', label: 'Quarters across the grounds' },
  { value: '3,734', label: 'sqm — the Beach Club footprint' },
  { value: '45m', label: 'Flagship walkthrough duration' },
  { value: '10%', label: 'Citizen savings on every ticket' },
]

export default function AboutPage() {
  const settings = useContent('siteSettings')
  const brand = settings.brand || 'Landmark'

  useEffect(() => {
    document.title = `About · ${brand} Port Harcourt`
    window.scrollTo(0, 0)
  }, [brand])

  return (
    <div className="bg-sand text-ink min-h-screen">
      <PageNav />

      {/* Hero */}
      <section className="relative border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-16 md:pb-24">
          <p className="inline-flex items-center gap-3 text-orange-dark text-xs tracking-widest2 uppercase mb-10">
            <span className="font-display italic text-orange-dark/90 text-base tabular-nums">
              00
            </span>
            About the grounds
          </p>

          <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-end">
            <div className="md:col-span-7">
              <h1
                className="font-display font-light leading-[0.95] tracking-tight text-ink"
                style={{ fontSize: 'clamp(2.75rem, 8vw, 6.5rem)' }}
              >
                A waterfront quarter, held together by{' '}
                <span className="italic text-marine">one long walk.</span>
              </h1>

              <p className="mt-10 max-w-xl text-ink/70 text-base md:text-lg leading-relaxed">
                {brand} Port Harcourt is a nine-quarter destination on the
                Rivers State shore — designed as a single place to spend a
                day, not a catalogue of unrelated attractions. Everything sits
                on one loop, from the attractions ring at the centre to the
                beach club along the waterfront edge.
              </p>
            </div>

            <figure className="md:col-span-5 relative">
              <div className="aspect-[4/5] w-full overflow-hidden bg-ink/5">
                <img
                  src="/DSC05456.jpg"
                  alt="Aerial view of the grounds"
                  loading="eager"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between text-[10px] tracking-widest2 uppercase text-ink/55">
                <span>Fig. 01</span>
                <span className="font-display italic normal-case tracking-normal text-ink/70">
                  From above
                </span>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Watermark */}
        <div className="pointer-events-none overflow-hidden">
          <p
            aria-hidden="true"
            className="font-display italic text-orange-dark/10 leading-none whitespace-nowrap select-none px-6 md:px-10"
            style={{ fontSize: 'clamp(6rem, 22vw, 22rem)' }}
          >
            {brand}.
          </p>
        </div>
      </section>

      {/* Wide plate */}
      <section className="border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 md:py-20">
          <figure>
            <div className="aspect-[21/9] w-full overflow-hidden bg-ink/5">
              <img
                src="/hero.jpg"
                alt="Landmark Port Harcourt at dusk"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-3 text-[10px] tracking-widest2 uppercase text-ink/55">
              <span>Fig. 02 · The approach from the shore</span>
              <span className="font-display italic normal-case tracking-normal text-ink/70">
                Photography · on-site
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Principles */}
      <section className="border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-4">
              <p className="text-orange-dark text-[11px] tracking-widest2 uppercase mb-6">
                What we hold to
              </p>
              <h2 className="font-display text-4xl md:text-5xl leading-tight text-marine">
                Three principles behind every{' '}
                <span className="italic">decision.</span>
              </h2>
            </div>
            <div className="md:col-span-8 space-y-14">
              {PRINCIPLES.map((p) => (
                <article key={p.n}>
                  <span className="font-display italic text-orange-dark text-sm tabular-nums block mb-4">
                    {p.n}
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl text-marine mb-3 leading-tight">
                    {p.title}
                  </h3>
                  <p className="text-ink/70 leading-relaxed max-w-xl">
                    {p.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Three-image plate */}
      <section className="border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 md:py-20">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { src: '/concert live 2.jpg', label: 'The Green · concert lawn' },
              { src: '/photo-1540541338287-41700207dee6.avif', label: 'The Waterfront · cabanas' },
              { src: '/Padel 2.jpeg', label: 'The Green · padel court' },
            ].map((img, i) => (
              <figure key={img.src} className={i === 0 ? 'col-span-2 md:col-span-1' : ''}>
                <div className="aspect-[4/5] w-full overflow-hidden bg-ink/5">
                  <img
                    src={img.src}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-[10px] tracking-widest2 uppercase text-ink/55">
                  {String(i + 3).padStart(2, '0')} · {img.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative isolate bg-marine-dark text-sand overflow-hidden">
        <PatternOverlay />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-24">
          <p className="text-orange-light text-[11px] tracking-widest2 uppercase mb-10">
            By the numbers
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-10">
            {STATS.map((s, i) => (
              <div key={s.label} className="border-t border-sand/20 pt-6">
                <p className="font-display italic text-orange-light text-xs tabular-nums mb-3">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p
                  className="font-display leading-none text-sand"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
                >
                  {s.value}
                </p>
                <p className="mt-4 text-sand/70 text-sm leading-relaxed max-w-[16ch]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
          <p className="text-orange-dark text-[11px] tracking-widest2 uppercase mb-6">
            How we got here
          </p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight text-marine mb-14 max-w-3xl">
            From commissioned concept to open{' '}
            <span className="italic">grounds.</span>
          </h2>

          <ol className="relative border-l border-ink/15 pl-8 md:pl-10 space-y-10">
            {TIMELINE.map((t, i) => (
              <li key={t.year} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[41px] md:-left-[45px] top-1.5 h-2.5 w-2.5 rounded-full bg-orange-dark ring-4 ring-sand"
                />
                <div className="flex flex-col md:flex-row md:items-baseline md:gap-8">
                  <p className="font-display italic text-orange-dark text-xl md:text-2xl tabular-nums w-24 shrink-0">
                    {t.year}
                  </p>
                  <p className="text-ink/80 font-display text-2xl md:text-3xl leading-tight">
                    {t.label}
                  </p>
                </div>
                {i < TIMELINE.length - 1 && (
                  <span aria-hidden="true" className="block h-px bg-ink/10 mt-10" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-sand">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32 flex flex-col md:flex-row items-start md:items-center gap-12 md:gap-16">
          <div className="flex-1">
            <p className="text-orange-dark text-[11px] tracking-widest2 uppercase mb-6">
              Come see the grounds
            </p>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.05] text-ink max-w-2xl">
              Plan your first walk-through with{' '}
              <span className="italic text-marine">us.</span>
            </h2>
          </div>
          <Link
            to="/bookings/walkthrough"
            className="inline-flex items-center gap-3 bg-orange-dark text-sand px-8 py-3.5 text-xs tracking-widest2 uppercase hover:bg-orange transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-dark"
          >
            Book Walkthrough
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
