import { MapPin } from 'lucide-react'
import useRevealOnScroll from '../hooks/useRevealOnScroll'

/**
 * Replaces the old SiteMap section — a four-card showcase of the
 * other Landmark Group properties so visitors see this is part of a
 * broader network, with a location tag on each card.
 */

const OFFERINGS = [
  {
    name: 'Upside Down House',
    location: 'Lagos',
    tagline: 'The flagship inverted-house attraction, on Victoria Island.',
    image:
      'https://images.unsplash.com/photo-1557660559-42497241f74c?auto=format&fit=crop&w=1200&q=80',
    href: 'https://landmarkafrica.com',
  },
  {
    name: 'Landmark Hotel',
    location: 'Lagos',
    tagline: 'A 160-room beachfront hotel overlooking the Atlantic.',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    href: 'https://landmarkafrica.com',
  },
  {
    name: 'POP Landmark',
    location: 'Lagos',
    tagline: 'Open-air food court, retail and events quarter.',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    href: 'https://landmarkafrica.com',
  },
  {
    name: 'Landmark Nike Lake Resort',
    location: 'Enugu',
    tagline: 'Lakeside resort set across 72 hectares of grounds.',
    image:
      'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=1200&q=80',
    href: 'https://landmarkafrica.com',
  },
]

export default function LandmarkOfferings() {
  const ref = useRevealOnScroll({ stagger: 0.08 })

  return (
    <section
      id="offerings"
      ref={ref}
      className="relative bg-sand text-ink py-24 md:py-32 px-6 md:px-10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-10 items-end mb-14 md:mb-20">
          <div className="md:col-span-7">
            <p className="reveal inline-flex items-center gap-4 text-orange-dark text-xs tracking-widest2 uppercase mb-6">
              <span className="font-display italic text-orange-dark/90 text-base tabular-nums">
                08
              </span>
              Across the Landmark Group
            </p>
            <h2
              className="reveal font-display font-light leading-[1.05] tracking-tight text-ink"
              style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4.5rem)' }}
            >
              More than one{' '}
              <span className="italic text-marine">destination.</span>
            </h2>
          </div>
          <p className="reveal md:col-span-5 text-ink/65 text-base md:text-right leading-relaxed">
            Landmark Port Harcourt is one of several properties under the
            Landmark Group. Explore the others, each with its own character
            and location.
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {OFFERINGS.map((o) => (
            <li key={o.name} className="reveal">
              <a
                href={o.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block relative aspect-[3/4] overflow-hidden rounded-[16px] shadow-[0_10px_30px_-15px_rgba(0,5,41,0.3)] bg-marine-dark"
              >
                <img
                  src={o.image}
                  alt={o.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-transparent" />

                {/* Location tag — top-left */}
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-sand/90 backdrop-blur-sm px-2.5 py-1 text-[10px] tracking-widest2 uppercase text-ink">
                  <MapPin size={11} strokeWidth={2} className="text-orange-dark" />
                  {o.location}
                </span>

                {/* Content — bottom */}
                <div className="absolute inset-x-0 bottom-0 p-5 text-sand">
                  <h3 className="font-display text-xl md:text-2xl leading-tight mb-2">
                    {o.name}
                  </h3>
                  <p className="text-sand/75 text-xs leading-relaxed">
                    {o.tagline}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
