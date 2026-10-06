import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, Send, CheckCircle2 } from 'lucide-react'
import PageNav from '../components/PageNav'
import Footer from '../components/Footer'
import PatternOverlay from '../components/PatternOverlay'
import { useContent } from '../lib/content'
import { bookingTypes, resolveBooking, NAIRA } from '../lib/bookingTypes'

const BOOKING_ORDER = ['entry', 'packages', 'group', 'walkthrough', 'table', 'rooms', 'daypass', 'birthday']
const HOW_IT_WORKS = [
  { icon: CalendarDays, title: 'Plan your visit', body: 'Choose your ticket, package or experience, then add your preferred date and party size.' },
  { icon: Send, title: 'Send your request', body: 'Review your visit and contact details. Your booking reference appears once your request is received.' },
  { icon: CheckCircle2, title: 'We confirm the details', body: 'Our team will confirm availability and share payment details before your visit.' },
]

function priceLabel(type, config, tickets, rooms) {
  if (config.holdOnly) return 'Reservation on enquiry'
  if (config.catalogCategory) {
    const prices = (tickets.items || []).filter(item => item.category === config.catalogCategory && Number.isFinite(Number(item.priceNGN))).sort((a, b) => Number(a.priceNGN) - Number(b.priceNGN))
    const lowest = prices[0]
    return lowest ? `From ${NAIRA.format(lowest.priceNGN)} / ${lowest.priceUnit || config.unit}` : 'Contact us for availability'
  }
  if (type === 'rooms') {
    const stays = (rooms.items || []).map(room => resolveBooking(config, null, room)).filter(room => room.stay)
    const lowest = stays.length ? Math.min(...stays.map(room => room.basePrice)) : config.basePrice
    return `From ${NAIRA.format(lowest)} / night`
  }
  return `From ${NAIRA.format(config.basePrice)} / ${config.unit}`
}

export default function BookingsPage() {
  const settings = useContent('siteSettings')
  const tickets = useContent('tickets')
  const rooms = useContent('rooms')
  const brand = settings.brand || 'Landmark'

  useEffect(() => {
    document.title = `Bookings · ${brand} Port Harcourt`
    window.scrollTo(0, 0)
  }, [brand])

  return (
    <div className="bg-sand text-ink min-h-screen">
      <PageNav />
      <main>
        <section className="border-b border-marine-dark/10">
          <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-16 md:pb-20">
            <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-center">
              <div className="md:col-span-7">
                <p className="text-orange-dark text-xs tracking-widest2 uppercase mb-6">Plan your visit</p>
                <h1 className="font-display font-light leading-[1.02] tracking-tight text-marine-dark" style={{ fontSize: 'clamp(2.75rem, 7vw, 6rem)' }}>
                  A day away.<br />A stay to <span className="text-marine">remember.</span>
                </h1>
                <p className="mt-7 max-w-xl text-ink/70 text-base md:text-lg leading-relaxed">
                  Entry tickets, thoughtful packages and visits made for your whole group. Choose how you would like to experience {brand}, and we will help with the details.
                </p>
                <a href="#booking-options" className="mt-8 inline-flex min-h-11 items-center gap-3 rounded-full bg-marine-dark px-6 py-3 text-sm text-sand hover:bg-marine transition-colors">Explore bookings <ArrowRight size={16} /></a>
              </div>
              <figure className="md:col-span-5">
                <div className="aspect-[4/3] md:aspect-[4/5] overflow-hidden rounded-3xl bg-marine-dark/5">
                  <img src="/photo-1540541338287-41700207dee6.avif" alt="Palm-lined pool and cabanas at the waterfront" loading="eager" className="h-full w-full object-cover" />
                </div>
                <figcaption className="mt-4 text-sm text-marine-dark/65">A little time by the waterfront.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section id="booking-options" aria-labelledby="booking-options-title" className="scroll-mt-24 border-b border-marine-dark/10">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
            <div className="mb-10 md:mb-14">
              <p className="text-orange-dark text-xs tracking-widest2 uppercase mb-3">Your visit, your way</p>
              <h2 id="booking-options-title" className="font-display text-3xl md:text-4xl leading-tight text-marine-dark">Find your next experience.</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-x-10 lg:gap-x-14 gap-y-12 md:gap-y-16">
              {BOOKING_ORDER.map(key => {
                const booking = bookingTypes[key]
                const Icon = booking.icon
                return (
                  <article key={key} className="group flex flex-col min-w-0">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-marine-dark/5 mb-6">
                      <img src={booking.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.03]" />
                      <span className="absolute top-4 left-4 h-11 w-11 rounded-full flex items-center justify-center bg-sand text-marine-dark"><Icon size={19} strokeWidth={1.5} aria-hidden="true" /></span>
                    </div>
                    <p className="text-xs tracking-widest2 uppercase text-marine-dark/65 mb-3">{booking.tag}</p>
                    <h3 className="font-display text-3xl leading-tight text-marine-dark mb-3">{booking.title}</h3>
                    <p className="text-ink/70 leading-relaxed max-w-lg mb-5">{booking.lead}</p>
                    <div className="mt-auto">
                      <p className="font-medium text-orange-dark mb-5">{priceLabel(key, booking, tickets, rooms)}</p>
                      <Link to={`/bookings/${key}`} className="min-h-11 rounded-full inline-flex items-center gap-3 border border-marine-dark/25 px-6 py-3 text-sm text-marine-dark hover:bg-marine-dark hover:text-sand hover:border-marine-dark transition-colors">
                        {booking.cta}<ArrowRight size={16} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="relative isolate bg-marine-dark text-sand overflow-hidden">
          <PatternOverlay />
          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
            <p className="text-orange-light text-xs tracking-widest2 uppercase mb-4">How bookings work</p>
            <h2 className="font-display text-3xl md:text-4xl leading-tight mb-10 md:mb-14">A few details. Then leave it with us.</h2>
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {HOW_IT_WORKS.map(({ icon: Icon, title, body }) => (
                <div key={title} className="border-t border-sand/20 pt-6">
                  <Icon size={23} strokeWidth={1.5} className="text-orange-light mb-5" aria-hidden="true" />
                  <h3 className="font-display text-2xl leading-tight mb-3">{title}</h3>
                  <p className="text-sand/75 text-sm leading-relaxed max-w-sm">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-14">
            <div className="flex-1">
              <p className="text-orange-dark text-xs tracking-widest2 uppercase mb-4">Something special in mind?</p>
              <h2 className="font-display text-3xl md:text-5xl leading-tight text-marine-dark max-w-2xl">We will build the day around you.</h2>
              <p className="mt-5 text-ink/70 max-w-xl leading-relaxed">Weddings, private takeovers, film shoots and brand activations. Tell us what you are planning, and our team will help bring it together.</p>
              <Link to="/contact" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm text-marine hover:text-orange-dark transition-colors">Talk to our team <ArrowRight size={16} /></Link>
            </div>
            <Link to="/bookings/other" className="min-h-11 rounded-full inline-flex items-center gap-3 bg-orange-dark text-sand px-7 py-3 text-sm hover:bg-orange transition-colors">Plan a visit <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
