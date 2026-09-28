import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageNav from '../components/PageNav'
import Footer from '../components/Footer'
import { useContent } from '../lib/content'

const ZONE_ORDER = ['The Ring', 'The Green', 'The Waterfront']

export default function ThingsToDoPage() {
  const ring = useContent('ring')
  const green = useContent('green')
  const waterfront = useContent('waterfront')
  const settings = useContent('siteSettings')
  const brand = settings.brand || 'Landmark'

  const zones = useMemo(
    () => [
      {
        key: 'the-ring',
        name: ring.title || 'The Ring',
        label: ring.zoneLabel || 'Zone One',
        intro: ring.intro,
        items: ring.items || [],
      },
      {
        key: 'the-green',
        name: green.title || 'The Green',
        label: green.zoneLabel || 'Zone Two',
        intro: green.intro,
        items: green.items || [],
      },
      {
        key: 'the-waterfront',
        name: waterfront.title || 'The Waterfront',
        label: waterfront.zoneLabel || 'Zone Three',
        intro: waterfront.intro,
        items: (waterfront.gallery || []).map((g) => ({
          title: g.title,
          area: g.tag,
          body: '',
          imageUrl: g.imageUrl,
        })),
      },
    ],
    [ring, green, waterfront]
  )

  const [filter, setFilter] = useState('all')

  useEffect(() => {
    document.title = `Things to Do · ${brand} Port Harcourt`
    window.scrollTo(0, 0)
  }, [brand])

  const visibleZones = filter === 'all' ? zones : zones.filter((z) => z.name === filter)

  return (
    <div className="bg-sand text-ink min-h-screen">
      <PageNav />

      {/* Hero */}
      <section className="relative border-b border-ink/10 overflow-hidden">
        {/* Photo backdrop */}
        <div className="absolute inset-0 -z-10">
          <img
            src="/concert live.jpg"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/50 to-sand" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-24 md:pt-40 pb-16 md:pb-24">
          <p className="inline-flex items-center gap-4 text-orange-light text-xs tracking-widest2 uppercase mb-10">
            <span className="font-display italic text-orange-light text-base tabular-nums">
              00
            </span>
            <span aria-hidden="true" className="h-px w-10 bg-orange-light/60" />
            Things to do
          </p>
          <h1
            className="font-display font-light leading-[0.95] tracking-tight text-sand max-w-5xl"
            style={{ fontSize: 'clamp(2.75rem, 8vw, 6.5rem)' }}
          >
            Every attraction, on a{' '}
            <span className="italic text-orange-light">single loop.</span>
          </h1>
          <p className="mt-10 max-w-2xl text-sand/80 text-base md:text-lg leading-relaxed">
            Move through the ring, cross into the green, then follow the
            approach out to the waterfront. Filter by zone, or scroll and take
            it in the way the grounds are laid out.
          </p>

          {/* Filter chips */}
          <div className="mt-10 flex flex-wrap gap-2">
            {['all', ...ZONE_ORDER].map((f) => {
              const active = filter === f
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={active}
                  className={`px-3 py-1.5 text-[11px] tracking-widest2 uppercase border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark ${
                    active
                      ? 'bg-orange text-ink border-orange'
                      : 'text-sand/80 border-sand/40 hover:border-orange-light hover:text-orange-light'
                  }`}
                >
                  {f === 'all' ? 'All zones' : f}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Zones */}
      {visibleZones.map((zone, zi) => (
        <section key={zone.key} id={zone.key} className="border-b border-ink/10">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28">
            <div className="grid md:grid-cols-12 gap-10 md:gap-14 mb-14">
              <div className="md:col-span-4">
                <p className="text-orange-dark text-[11px] tracking-widest2 uppercase mb-4">
                  {zone.label}
                </p>
                <h2 className="font-display text-4xl md:text-5xl leading-tight text-marine">
                  {zone.name}
                </h2>
              </div>
              {zone.intro && (
                <p className="md:col-span-7 md:col-start-6 text-ink/70 text-base md:text-lg leading-relaxed max-w-xl">
                  {zone.intro}
                </p>
              )}
            </div>

            {/* Editorial grid — alternating column spans, like Intro pillars */}
            <div className="grid md:grid-cols-12 md:gap-x-8 md:gap-y-16 gap-y-12">
              {zone.items.map((item, i) => {
                const layouts = [
                  'md:col-span-6 md:col-start-1',
                  'md:col-span-5 md:col-start-8',
                  'md:col-span-7 md:col-start-1',
                  'md:col-span-5 md:col-start-8',
                  'md:col-span-6 md:col-start-2',
                  'md:col-span-5 md:col-start-8',
                ]
                return (
                  <article
                    key={item.title + i}
                    className={layouts[i % layouts.length]}
                  >
                    {item.imageUrl && !item.imageUrl.includes('youtu') && !item.imageUrl.endsWith('.mp4') && (
                      <div className="aspect-[4/3] overflow-hidden bg-ink/5 mb-5">
                        <img
                          src={item.imageUrl}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-baseline gap-4 mb-3">
                      <span className="font-display italic text-orange-dark text-sm tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="h-px flex-1 bg-ink/15" />
                      {item.area && (
                        <span className="text-[10px] tracking-widest2 uppercase text-ink/55">
                          {item.area}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl text-marine mb-2 leading-tight">
                      {item.title}
                    </h3>
                    {item.body && (
                      <p className="text-ink/70 leading-relaxed max-w-md">
                        {item.body}
                      </p>
                    )}
                  </article>
                )
              })}
            </div>

            {/* Zone footer */}
            <div className="mt-16 pt-8 border-t border-ink/15 flex flex-wrap items-baseline justify-between gap-4">
              <p className="text-orange-dark text-[11px] tracking-widest2 uppercase">
                {zi < visibleZones.length - 1
                  ? `Next · ${visibleZones[zi + 1].name}`
                  : 'End of the loop'}
              </p>
              <Link
                to="/bookings"
                className="group inline-flex items-baseline gap-3 font-display italic text-marine text-xl md:text-2xl hover:text-orange-dark transition-colors"
              >
                Book something here
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1 not-italic"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>
      ))}

      <Footer />
    </div>
  )
}
