import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Ticket, BedDouble, UtensilsCrossed, Users, Cake, Waves } from 'lucide-react'
import PageNav from '../components/PageNav'
import Footer from '../components/Footer'
import CircleButton from '../components/CircleButton'
import { openBookingModal } from '../components/BookingModal'
import { useContent } from '../lib/content'

const BOOKING_TYPES = [
  {
    key: 'walkthrough',
    icon: Ticket,
    n: '01',
    tag: 'The Flagship',
    title: 'Upside-Down Walkthrough',
    body: 'Timed entry into the flagship attraction — 45 minutes through every inverted room, corridor and fixture.',
    lead: 'From ₦8,000 / person',
    accent: 'orange',
    image: '/flagship-upside-down.png',
  },
  {
    key: 'table',
    icon: UtensilsCrossed,
    n: '02',
    tag: 'At the Table',
    title: 'Table Booking',
    body: 'Reserve a table at the seafood house at the centre of the ring, or the jetty restaurant along the waterfront.',
    lead: 'No deposit · confirmed by email',
    accent: 'marine',
    image: '/d32f5702063e63708d194795bd491e05.jpg',
  },
  {
    key: 'rooms',
    icon: BedDouble,
    n: '03',
    tag: 'Where you stay',
    title: 'Rooms & Stays',
    body: 'A limited number of shore-facing suites, green-side lofts and central studios — each within a short walk of the ring.',
    lead: 'From ₦120k / night',
    accent: 'orange',
    image: '/pexels-petra-nesti-1766376-12161888.jpg',
  },
  {
    key: 'daypass',
    icon: Waves,
    n: '04',
    tag: 'The Waterfront',
    title: 'Beach Club Day Pass',
    body: 'Full-day access to the beach club, both lounges and the adult pool — with sun-lounger and towel service.',
    lead: 'From ₦15,000 / person',
    accent: 'marine',
    image: '/photo-1500815845799-7748ca339f27.avif',
  },
  {
    key: 'group',
    icon: Users,
    n: '05',
    tag: 'For teams',
    title: 'Group & Corporate',
    body: 'Grounds entry, two activities per guest and set lunch at the seafood house. Twenty guests and up, per head.',
    lead: 'From ₦8,500 / guest',
    accent: 'orange',
    image: '/concert live 2.jpg',
  },
  {
    key: 'birthday',
    icon: Cake,
    n: '06',
    tag: 'Celebrations',
    title: 'Birthday & Private Events',
    body: 'Full day out — entry, three attractions per guest, the kids club party room for three hours, and cake.',
    lead: 'From ₦120,000 / package',
    accent: 'marine',
    image: '/Splash-Park-image-1.webp',
  },
]

export default function BookingsPage() {
  const settings = useContent('siteSettings')
  const brand = settings.brand || 'Landmark'

  useEffect(() => {
    document.title = `Bookings · ${brand} Port Harcourt`
    window.scrollTo(0, 0)
  }, [brand])

  return (
    <div className="bg-sand text-ink min-h-screen">
      <PageNav />

      {/* Hero */}
      <section className="border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-16 md:pb-20">
          <p className="inline-flex items-center gap-4 text-orange-dark text-xs tracking-widest2 uppercase mb-10">
            <span className="font-display italic text-orange-dark/90 text-base tabular-nums">
              00
            </span>
            <span aria-hidden="true" className="h-px w-10 bg-orange-dark/50" />
            Bookings
          </p>
          <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-end">
            <div className="md:col-span-7">
              <h1
                className="font-display font-light leading-[0.95] tracking-tight text-ink"
                style={{ fontSize: 'clamp(2.75rem, 8vw, 6.5rem)' }}
              >
                Reserve the visit that suits{' '}
                <span className="italic text-marine">you.</span>
              </h1>
              <p className="mt-10 max-w-xl text-ink/70 text-base md:text-lg leading-relaxed">
                Every booking is confirmed by email before your card is
                charged. Pick a type below — a host will follow up within 24
                hours.
              </p>
            </div>
            <figure className="md:col-span-5">
              <div className="aspect-[4/5] w-full overflow-hidden bg-ink/5">
                <img
                  src="/photo-1540541338287-41700207dee6.avif"
                  alt="Cabana along the beach club approach"
                  loading="eager"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-3 text-[10px] tracking-widest2 uppercase text-ink/55">
                Fig. 01 · Along the waterfront
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Booking types grid */}
      <section className="border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-16">
            {BOOKING_TYPES.map((b) => {
              const Icon = b.icon
              const isMarine = b.accent === 'marine'
              return (
                <article
                  key={b.key}
                  className="group relative border-t border-ink/15 pt-8"
                >
                  <div className="flex items-baseline gap-4 mb-6">
                    <span className="font-display italic text-orange-dark text-sm tabular-nums">
                      {b.n}
                    </span>
                    <span className="h-px flex-1 bg-ink/15" />
                    <span className="text-[10px] tracking-widest2 uppercase text-ink/55">
                      {b.tag}
                    </span>
                  </div>

                  <figure className="relative aspect-[16/10] w-full overflow-hidden bg-ink/5 mb-6">
                    <img
                      src={b.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                    />
                    <span
                      className={`absolute top-4 left-4 h-11 w-11 border flex items-center justify-center backdrop-blur-sm ${
                        isMarine
                          ? 'border-sand/60 text-sand bg-marine-dark/40'
                          : 'border-sand/70 text-sand bg-orange-dark/50'
                      }`}
                    >
                      <Icon size={18} strokeWidth={1.5} />
                    </span>
                  </figure>

                  <h2
                    className={`font-display text-3xl md:text-4xl leading-tight mb-3 ${
                      isMarine ? 'text-marine' : 'text-ink'
                    }`}
                  >
                    {b.title}
                  </h2>
                  <p className="text-ink/70 leading-relaxed max-w-md mb-5">
                    {b.body}
                  </p>
                  <p className="font-display italic text-orange-dark text-lg mb-6">
                    {b.lead}
                  </p>
                  <button
                    type="button"
                    onClick={() => openBookingModal(b.key)}
                    className="inline-flex items-center gap-3 border border-ink/25 px-5 py-3 text-[11px] tracking-widest2 uppercase text-ink hover:bg-orange-dark hover:text-sand hover:border-orange-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
                  >
                    Start this booking
                    <span aria-hidden="true">→</span>
                  </button>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-marine-dark text-sand border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28">
          <div className="grid md:grid-cols-12 gap-10 md:gap-14">
            <div className="md:col-span-4">
              <p className="text-orange-light text-[11px] tracking-widest2 uppercase mb-6">
                How bookings work
              </p>
              <h2 className="font-display text-4xl md:text-5xl leading-tight text-sand">
                Three quiet{' '}
                <span className="italic text-orange-light">steps.</span>
              </h2>
            </div>
            <div className="md:col-span-8 grid md:grid-cols-3 gap-10">
              {[
                {
                  n: '01',
                  title: 'Tell us what you want',
                  body: 'Pick a booking type, share your date and headcount. Under a minute.',
                },
                {
                  n: '02',
                  title: 'We match a host',
                  body: 'A concierge writes back within 24 hours to confirm slot, price and any add-ons.',
                },
                {
                  n: '03',
                  title: 'Pay on confirmation',
                  body: 'Your card is only charged once the details are locked in and you say yes.',
                },
              ].map((s) => (
                <div key={s.n}>
                  <p className="font-display italic text-orange-light text-lg tabular-nums mb-3">
                    {s.n}
                  </p>
                  <h3 className="font-display text-2xl leading-tight text-sand mb-3">
                    {s.title}
                  </h3>
                  <p className="text-sand/70 text-sm leading-relaxed">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32 flex flex-col md:flex-row items-start md:items-center gap-12 md:gap-16">
          <div className="flex-1">
            <p className="text-orange-dark text-[11px] tracking-widest2 uppercase mb-6">
              Something not on the list?
            </p>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.05] text-ink max-w-2xl">
              We'll build the day{' '}
              <span className="italic text-marine">around you.</span>
            </h2>
            <p className="mt-6 text-ink/70 max-w-xl leading-relaxed">
              Weddings, private takeovers, film shoots, brand activations. Tell
              us what you're planning — we'll come back with a shape.
            </p>
            <div className="mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 text-[11px] tracking-widest2 uppercase text-orange-dark hover:text-ink transition-colors"
              >
                Or reach out directly →
              </Link>
            </div>
          </div>
          <CircleButton
            as="button"
            size="md"
            tone="ink"
            onClick={() => openBookingModal('other')}
          >
            Custom enquiry
          </CircleButton>
        </div>
      </section>

      <Footer />
    </div>
  )
}
