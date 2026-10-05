import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageNav from '../components/PageNav'
import Footer from '../components/Footer'
import Media from '../components/Media'
import { useContent } from '../lib/content'

/**
 * Browse page for all rooms. Translates the reference's "accommodation
 * list" pattern into the Landmark idiom (Instrument Serif italics,
 * sand/marine/orange-dark, numbered eyebrows, 16px radii).
 *
 * Row structure, left -> right:
 *   image (with corner chip) | details column | features + price + CTA
 */

function slugify(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function kindFromTag(tag) {
  // "Suite · Shore-facing" -> "Suite"
  return String(tag || '').split('·')[0].trim() || 'Room'
}

export default function RoomsPage() {
  const rooms = useContent('rooms')
  const settings = useContent('siteSettings')
  const brand = settings.brand || 'Landmark'
  const items = rooms.items || []
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    document.title = `Rooms · ${brand} Port Harcourt`
    window.scrollTo(0, 0)
  }, [brand])

  // Build filter chips from the unique kinds present in content.
  const kinds = useMemo(() => {
    const unique = Array.from(new Set(items.map((r) => kindFromTag(r.tag))))
    return ['All', ...unique]
  }, [items])

  const filtered = useMemo(
    () =>
      filter === 'All' ? items : items.filter((r) => kindFromTag(r.tag) === filter),
    [items, filter]
  )

  return (
    <div className="bg-sand text-ink min-h-screen">
      <PageNav />

      {/* Hero */}
      <section className="border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-14 md:pb-16">
          <p className="inline-flex items-center gap-4 text-orange-dark text-xs tracking-widest2 uppercase mb-10">
            <span className="font-display italic text-orange-dark/90 text-base tabular-nums">
              00
            </span>
            Where you stay
          </p>

          <div className="grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-7">
              <h1
                className="font-display font-light leading-[0.95] tracking-tight text-ink"
                style={{ fontSize: 'clamp(2.75rem, 8vw, 6rem)' }}
              >
                Rooms held close to the{' '}
                <span className="italic text-marine">water.</span>
              </h1>
              <p className="mt-8 max-w-xl text-ink/70 text-base md:text-lg leading-relaxed">
                {rooms.body ||
                  'A limited number of stays across the grounds — each within a short walk of the ring, the green or the shore.'}
              </p>
            </div>
            <p className="md:col-span-5 text-ink/60 text-sm md:text-right leading-relaxed">
              {items.length} rooms · prices from <span className="font-display italic text-marine text-base">₦85k</span>
            </p>
          </div>

          {/* Filter chips */}
          <div className="mt-10 flex flex-wrap gap-2">
            {kinds.map((k) => {
              const active = filter === k
              const count = k === 'All' ? items.length : items.filter((r) => kindFromTag(r.tag) === k).length
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setFilter(k)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] tracking-widest2 uppercase border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark ${
                    active
                      ? 'bg-ink text-sand border-ink'
                      : 'text-ink/70 border-ink/20 hover:border-orange-dark hover:text-orange-dark'
                  }`}
                >
                  {k === 'All' ? 'All rooms' : `${k}s`}
                  <span className={`text-[10px] tabular-nums ${active ? 'text-sand/60' : 'text-ink/40'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Room rows */}
      <section className="border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 md:py-20">
          <ul className="space-y-10 md:space-y-12">
            {filtered.map((room, i) => {
              const slug = slugify(room.name)
              const kind = kindFromTag(room.tag)
              return (
                <li
                  key={room.name}
                  className="bg-white border border-ink/10 rounded-[16px] overflow-hidden grid md:grid-cols-12 shadow-[0_1px_2px_rgba(0,5,41,0.03)]"
                >
                  {/* Image */}
                  <div className="relative md:col-span-4 aspect-[4/3] md:aspect-auto md:min-h-[260px]">
                    {room.imageUrl && (
                      <Media
                        src={room.imageUrl}
                        alt={room.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-sand/90 backdrop-blur-sm px-2.5 py-1 text-[10px] tracking-widest2 uppercase text-ink">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-dark" />
                      {kind}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="md:col-span-5 p-6 md:p-8 border-t md:border-t-0 md:border-l md:border-r border-ink/10">
                    <p className="text-orange-dark text-[10px] tracking-widest2 uppercase mb-2">
                      {String(i + 1).padStart(2, '0')} · {room.tag}
                    </p>
                    <h2 className="font-display text-3xl md:text-4xl leading-tight text-marine mb-3">
                      {room.name}
                    </h2>
                    <p className="text-ink/70 text-sm leading-relaxed mb-6 max-w-md">
                      {room.body}
                    </p>

                    <dl className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                      <SpecRow label="Size" value={room.size} />
                      <SpecRow label="Guests" value={room.guests} />
                      <SpecRow label="Rooms" value="1" />
                      <SpecRow label="Wi-Fi" value="Fibre" />
                    </dl>
                  </div>

                  {/* Features + price + CTA */}
                  <div className="md:col-span-3 p-6 md:p-8 flex flex-col justify-between gap-6 bg-[#F8F6EF]">
                    {room.features?.length > 0 && (
                      <ul className="flex flex-wrap gap-1.5">
                        {room.features.map((f) => (
                          <li
                            key={f}
                            className="text-[10px] tracking-widest2 uppercase text-marine-dark/75 border border-marine-dark/15 rounded-full px-2.5 py-1"
                          >
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div>
                      <p className="text-[10px] tracking-widest2 uppercase text-ink/55 mb-1">
                        From
                      </p>
                      <p
                        className="font-display italic text-marine leading-none mb-5"
                        style={{ fontSize: 'clamp(1.5rem, 2.2vw, 2rem)' }}
                      >
                        {room.priceFrom}
                      </p>
                      <Link
                        to={`/bookings/rooms?room=${slug}`}
                        className="w-full inline-flex items-center justify-center gap-3 bg-marine text-sand rounded-[16px] px-5 py-3 text-xs tracking-widest2 uppercase hover:bg-marine-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-marine"
                      >
                        Reserve Room
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          {filtered.length === 0 && (
            <p className="text-center text-ink/60 text-sm py-10">
              No {filter.toLowerCase()} rooms right now. Try a different type.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

function SpecRow({ label, value }) {
  if (!value) return null
  return (
    <div>
      <dt className="text-[10px] tracking-widest2 uppercase text-ink/50 mb-0.5">
        {label}
      </dt>
      <dd className="font-display italic text-marine text-base leading-tight">
        {value}
      </dd>
    </div>
  )
}
