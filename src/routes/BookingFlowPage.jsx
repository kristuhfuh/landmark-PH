import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  Ticket,
  BedDouble,
  UtensilsCrossed,
  Users,
  Cake,
  Waves,
  Check,
  ArrowLeft,
  Lock,
} from 'lucide-react'
import PageNav from '../components/PageNav'
import Footer from '../components/Footer'
import { useContent } from '../lib/content'

/**
 * Booking-type registry — one entry per URL segment.
 * `basePrice` × guests drives the running total shown in the summary rail.
 * `options` are the checkable add-ons or format choices for step 1.
 */
const TYPES = {
  walkthrough: {
    icon: Ticket,
    tag: 'The Flagship',
    title: 'Upside-Down Walkthrough',
    lead: '45-minute guided walk-through of the inverted flagship — every room, corridor and fixture turned on its head.',
    image: '/flagship-upside-down.png',
    accent: 'orange',
    basePrice: 8000,
    unit: 'person',
    guestNoun: 'guests',
    minGuests: 1,
    maxGuests: 12,
    timeSlots: ['10:30', '12:00', '14:30', '16:00', '17:30'],
    options: [
      { key: 'photo', label: 'Photo point pass', price: 1500 },
      { key: 'priority', label: 'Priority entry', price: 2500 },
      { key: 'guide', label: 'Private guide', price: 6000 },
    ],
  },
  table: {
    icon: UtensilsCrossed,
    tag: 'At the Table',
    title: 'Table Booking',
    lead: 'Reserve a table at The Jetty in the Ring or on the waterfront deck. Kitchens run through the day.',
    image: '/d32f5702063e63708d194795bd491e05.jpg',
    accent: 'marine',
    basePrice: 0,
    unit: '',
    guestNoun: 'diners',
    minGuests: 1,
    maxGuests: 20,
    timeSlots: ['12:30', '13:30', '18:30', '19:30', '20:30', '21:30'],
    options: [
      { key: 'window', label: 'Window seating request', price: 0 },
      { key: 'birthday', label: 'Birthday setup + candle', price: 3500 },
      { key: 'wine', label: 'Sommelier pairing (per head)', price: 8000 },
    ],
    holdOnly: true,
  },
  rooms: {
    icon: BedDouble,
    tag: 'Where you stay',
    title: 'Rooms & Stays',
    lead: 'A limited number of shore-facing suites, green-side lofts and central studios — each a short walk from the ring.',
    image: '/pexels-petra-nesti-1766376-12161888.jpg',
    accent: 'orange',
    basePrice: 120000,
    unit: 'night',
    guestNoun: 'guests',
    minGuests: 1,
    maxGuests: 4,
    stay: true,
    options: [
      { key: 'breakfast', label: 'Breakfast at The Jetty', price: 12000 },
      { key: 'beach', label: 'Beach club access', price: 15000 },
      { key: 'transfer', label: 'Airport transfer', price: 25000 },
    ],
  },
  daypass: {
    icon: Waves,
    tag: 'The Waterfront',
    title: 'Beach Club Day Pass',
    lead: 'Full-day access to the beach club, both lounges and the adult pool — sun-lounger and towel service included.',
    image: '/photo-1500815845799-7748ca339f27.avif',
    accent: 'marine',
    basePrice: 15000,
    unit: 'person',
    guestNoun: 'guests',
    minGuests: 1,
    maxGuests: 8,
    timeSlots: ['10:00', '12:00', '14:00'],
    options: [
      { key: 'cabana', label: 'Reserved cabana · half-day', price: 40000 },
      { key: 'welcome', label: 'Welcome drink round', price: 6000 },
      { key: 'lunch', label: 'Set lunch on the deck (per head)', price: 9500 },
    ],
  },
  group: {
    icon: Users,
    tag: 'For teams',
    title: 'Group & Corporate',
    lead: 'Grounds entry, two activities per guest and set lunch at The Jetty. Twenty guests and up, priced per head.',
    image: '/concert live 2.jpg',
    accent: 'orange',
    basePrice: 8500,
    unit: 'guest',
    guestNoun: 'guests',
    minGuests: 20,
    maxGuests: 200,
    step: 5,
    timeSlots: ['09:30', '11:00', '14:00'],
    options: [
      { key: 'host', label: 'Dedicated host on the day', price: 25000 },
      { key: 'branding', label: 'On-site branding (roll-up + signage)', price: 45000 },
      { key: 'transport', label: 'Coach transfer round-trip', price: 90000 },
    ],
  },
  birthday: {
    icon: Cake,
    tag: 'Celebrations',
    title: 'Birthday & Private Events',
    lead: 'Full day out — grounds entry, three attractions per guest, the kids club party room for three hours, and cake.',
    image: '/Splash-Park-image-1.webp',
    accent: 'marine',
    basePrice: 120000,
    unit: 'package',
    guestNoun: 'guests',
    minGuests: 8,
    maxGuests: 40,
    packageFor: 10,
    timeSlots: ['11:00', '13:30', '16:00'],
    options: [
      { key: 'photographer', label: 'On-site photographer · 2 hrs', price: 60000 },
      { key: 'decor', label: 'Themed room decor', price: 35000 },
      { key: 'catering', label: 'Extended catering (per head above 10)', price: 4500 },
    ],
  },
  other: {
    icon: Users,
    tag: 'Custom',
    title: 'Custom enquiry',
    lead: 'Weddings, private takeovers, film shoots, brand activations. Tell us what you have in mind and a host will build the day around you.',
    image: '/hero.jpg',
    accent: 'orange',
    basePrice: 0,
    unit: '',
    guestNoun: 'guests',
    minGuests: 2,
    maxGuests: 500,
    step: 5,
    holdOnly: true,
    options: [
      { key: 'takeover', label: 'Full-grounds takeover', price: 0 },
      { key: 'catering', label: 'Custom catering brief', price: 0 },
      { key: 'production', label: 'Production / AV support', price: 0 },
    ],
  },
}

const STEPS = ['Details', 'Guest info', 'Payment', 'Confirmed']

const NAIRA = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
})

export default function BookingFlowPage() {
  const { type = 'walkthrough' } = useParams()
  const navigate = useNavigate()
  const config = TYPES[type]
  const settings = useContent('siteSettings')
  const brand = settings.brand || 'Landmark'

  const [step, setStep] = useState(0)
  const [date, setDate] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(() => (config ? config.minGuests : 2))
  const [time, setTime] = useState('')
  const [addOns, setAddOns] = useState([])
  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  })
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' })
  const [reference, setReference] = useState(() =>
    `LMK-${Math.random().toString(36).slice(2, 7).toUpperCase()}${Date.now().toString().slice(-4)}`
  )

  useEffect(() => {
    if (!config) return
    document.title = `${config.title} · ${brand} Port Harcourt`
    window.scrollTo(0, 0)
  }, [config, brand, step])

  if (!config) {
    return (
      <div className="bg-sand text-ink min-h-screen">
        <PageNav />
        <section className="max-w-3xl mx-auto px-6 py-32 text-center">
          <p className="text-orange-dark text-[11px] tracking-widest2 uppercase mb-4">
            404
          </p>
          <h1 className="font-display text-5xl mb-6">
            No booking of that <span className="italic text-marine">shape.</span>
          </h1>
          <Link
            to="/bookings"
            className="inline-flex items-center gap-3 border border-ink/25 px-5 py-3 text-[11px] tracking-widest2 uppercase hover:border-orange-dark hover:text-orange-dark transition-colors"
          >
            <ArrowLeft size={14} /> Back to bookings
          </Link>
        </section>
        <Footer />
      </div>
    )
  }

  const Icon = config.icon
  const isMarine = config.accent === 'marine'
  const packageFor = config.packageFor

  const nights = useMemo(() => {
    if (!config.stay || !date || !checkOut) return 1
    const a = new Date(date)
    const b = new Date(checkOut)
    const diff = Math.round((b - a) / (1000 * 60 * 60 * 24))
    return Math.max(1, diff)
  }, [config.stay, date, checkOut])

  const total = useMemo(() => {
    if (config.holdOnly) return 0
    const multiplier = config.stay
      ? nights
      : packageFor
        ? Math.ceil(guests / packageFor)
        : guests
    const baseline = config.basePrice * multiplier
    const extras = addOns.reduce((sum, key) => {
      const opt = config.options.find((o) => o.key === key)
      if (!opt) return sum
      const perHead = /per head/i.test(opt.label)
      return sum + (perHead ? opt.price * guests : opt.price)
    }, 0)
    return baseline + extras
  }, [config, guests, addOns, nights, packageFor])

  const guestStep = config.step || 1

  function toggleAddOn(key) {
    setAddOns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  async function next() {
    // Submitting from the payment step — persist to the API best-effort
    // before advancing to the confirmation screen.
    if (step === 2) {
      try {
        const api = (import.meta.env?.VITE_API_URL ?? (import.meta.env?.DEV ? 'http://localhost:4000' : '')).replace(/\/+$/, '')
        const res = await fetch(`${api}/api/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingType: type,
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
            phone: contact.phone,
            dateFrom: date || undefined,
            dateTo: checkOut || undefined,
            timeSlot: time || undefined,
            guests,
            addOns,
            totalNGN: total,
            notes: contact.notes,
            status: config.holdOnly ? 'hold' : 'confirmed',
          }),
        })
        if (res.ok) {
          const body = await res.json()
          if (body?.reference) setReference(body.reference)
        }
      } catch {
        // API might not be up in local dev — the client-side reference
        // still shows on the confirmation screen so the flow completes.
      }
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1))
  }
  function back() {
    setStep((s) => Math.max(0, s - 1))
  }

  const canAdvanceFromStep = (() => {
    if (step === 0) {
      if (config.stay) return Boolean(date && checkOut)
      if (config.timeSlots) return Boolean(date && time)
      return Boolean(date)
    }
    if (step === 1) return contact.firstName && contact.lastName && contact.email
    if (step === 2) {
      if (config.holdOnly) return true
      return card.number.length >= 12 && card.expiry.length >= 4 && card.cvc.length >= 3
    }
    return true
  })()

  return (
    <div className="bg-sand text-ink min-h-screen">
      <PageNav />

      {/* Header strip */}
      <section className="border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-6 md:px-10 pt-14 md:pt-20 pb-10">
          <Link
            to="/bookings"
            className="inline-flex items-center gap-2 text-[11px] tracking-widest2 uppercase text-ink/60 hover:text-orange-dark transition-colors mb-8"
          >
            <ArrowLeft size={14} /> All booking types
          </Link>

          <div className="flex items-start gap-6 mb-10">
            <span
              className={`hidden md:flex h-16 w-16 shrink-0 border items-center justify-center ${
                isMarine
                  ? 'border-marine/30 text-marine'
                  : 'border-orange-dark/40 text-orange-dark'
              }`}
            >
              <Icon size={24} strokeWidth={1.5} />
            </span>
            <div className="flex-1">
              <p className="text-orange-dark text-[11px] tracking-widest2 uppercase mb-3">
                {config.tag}
              </p>
              <h1
                className={`font-display leading-[1.02] tracking-tight ${
                  isMarine ? 'text-marine' : 'text-ink'
                }`}
                style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4.5rem)' }}
              >
                {config.title}
              </h1>
              <p className="mt-5 max-w-2xl text-ink/70 leading-relaxed">
                {config.lead}
              </p>
            </div>
          </div>

          {/* Stepper */}
          <ol className="flex flex-wrap items-center gap-3 md:gap-5 text-[10px] tracking-widest2 uppercase">
            {STEPS.map((label, i) => {
              const state = i < step ? 'done' : i === step ? 'active' : 'idle'
              return (
                <li key={label} className="flex items-center gap-3">
                  <span
                    className={`h-6 w-6 rounded-full border inline-flex items-center justify-center font-display italic text-xs ${
                      state === 'done'
                        ? 'bg-orange-dark border-orange-dark text-sand'
                        : state === 'active'
                          ? 'border-orange-dark text-orange-dark'
                          : 'border-ink/25 text-ink/40'
                    }`}
                  >
                    {state === 'done' ? <Check size={12} /> : String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={
                      state === 'idle' ? 'text-ink/40' : 'text-ink'
                    }
                  >
                    {label}
                  </span>
                  {i < STEPS.length - 1 && (
                    <span aria-hidden="true" className="hidden md:block h-px w-10 bg-ink/20" />
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      {/* Body */}
      <section className="border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-14 md:py-20 grid md:grid-cols-12 gap-10 md:gap-14">
          {/* Flow */}
          <div className="md:col-span-7">
            {step === 0 && (
              <StepDetails
                config={config}
                date={date}
                setDate={setDate}
                checkOut={checkOut}
                setCheckOut={setCheckOut}
                guests={guests}
                setGuests={setGuests}
                time={time}
                setTime={setTime}
                addOns={addOns}
                toggleAddOn={toggleAddOn}
                guestStep={guestStep}
                nights={nights}
              />
            )}
            {step === 1 && (
              <StepContact contact={contact} setContact={setContact} config={config} />
            )}
            {step === 2 && (
              <StepPayment
                config={config}
                total={total}
                card={card}
                setCard={setCard}
              />
            )}
            {step === 3 && (
              <StepConfirmed
                config={config}
                total={total}
                reference={reference}
                contact={contact}
                date={date}
                checkOut={checkOut}
                time={time}
                guests={guests}
                nights={nights}
              />
            )}

            {step < STEPS.length - 1 && (
              <div className="mt-10 pt-8 border-t border-ink/15 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={back}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 text-[11px] tracking-widest2 uppercase text-ink/60 hover:text-orange-dark transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={!canAdvanceFromStep}
                  className="inline-flex items-center gap-3 bg-orange-dark text-sand px-6 py-3.5 text-[11px] tracking-widest2 uppercase hover:bg-orange transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {step === 2
                    ? config.holdOnly
                      ? 'Hold this booking'
                      : `Pay ${NAIRA.format(total)}`
                    : 'Continue'}
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            )}
          </div>

          {/* Summary rail */}
          <aside className="md:col-span-5 md:pl-10 md:border-l md:border-ink/10">
            <div className="sticky top-24">
              <figure className="aspect-[4/5] w-full overflow-hidden bg-ink/5 mb-6">
                <img
                  src={config.image}
                  alt=""
                  loading="eager"
                  className="h-full w-full object-cover"
                />
              </figure>

              <p className="text-[10px] tracking-widest2 uppercase text-ink/55 mb-3">
                Your booking
              </p>
              <h2 className="font-display text-2xl md:text-3xl text-marine leading-tight mb-6">
                {config.title}
              </h2>

              <dl className="space-y-4 text-sm border-t border-ink/15 pt-6">
                <SummaryRow label="Date">
                  {date ? new Date(date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : '—'}
                  {config.stay && checkOut ? ` → ${new Date(checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` : ''}
                </SummaryRow>
                {config.timeSlots && (
                  <SummaryRow label="Time">{time || '—'}</SummaryRow>
                )}
                <SummaryRow label={config.guestNoun}>
                  {guests}
                </SummaryRow>
                {config.stay && (
                  <SummaryRow label="Nights">{nights}</SummaryRow>
                )}
                {addOns.length > 0 && (
                  <SummaryRow label="Add-ons">
                    <span className="text-right">
                      {addOns
                        .map((k) => config.options.find((o) => o.key === k)?.label)
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </SummaryRow>
                )}
              </dl>

              <div className="mt-8 border-t border-ink/15 pt-6 flex items-baseline justify-between">
                <p className="text-[10px] tracking-widest2 uppercase text-ink/55">
                  {config.holdOnly ? 'Estimate' : 'Total'}
                </p>
                <p className="font-display italic text-orange-dark text-3xl tabular-nums">
                  {config.holdOnly ? 'On enquiry' : NAIRA.format(total)}
                </p>
              </div>
              {!config.holdOnly && (
                <p className="text-[11px] text-ink/55 mt-3 leading-relaxed">
                  All prices inclusive of VAT. Card charged only after the
                  final step.
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function SummaryRow({ label, children }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-[10px] tracking-widest2 uppercase text-ink/55 shrink-0">
        {label}
      </dt>
      <dd className="font-display italic text-ink text-right">{children}</dd>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

function StepDetails({
  config,
  date,
  setDate,
  checkOut,
  setCheckOut,
  guests,
  setGuests,
  time,
  setTime,
  addOns,
  toggleAddOn,
  guestStep,
  nights,
}) {
  const today = new Date().toISOString().split('T')[0]

  return (
    <div>
      <p className="text-orange-dark text-[11px] tracking-widest2 uppercase mb-3">
        01 · Details
      </p>
      <h2 className="font-display text-3xl md:text-4xl leading-tight text-marine mb-8">
        When are you{' '}
        <span className="italic">coming?</span>
      </h2>

      {/* Dates */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <label className="block">
          <span className="block text-[10px] tracking-widest2 uppercase text-ink/60 mb-2">
            {config.stay ? 'Check-in' : 'Date'}
          </span>
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-3 text-sm transition-colors"
          />
        </label>
        {config.stay ? (
          <label className="block">
            <span className="block text-[10px] tracking-widest2 uppercase text-ink/60 mb-2">
              Check-out
            </span>
            <input
              type="date"
              min={date || today}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-3 text-sm transition-colors"
            />
          </label>
        ) : (
          <label className="block">
            <span className="block text-[10px] tracking-widest2 uppercase text-ink/60 mb-2">
              {config.guestNoun}
            </span>
            <div className="flex items-center gap-4 pt-1">
              <button
                type="button"
                onClick={() =>
                  setGuests((g) => Math.max(config.minGuests, g - guestStep))
                }
                className="h-9 w-9 border border-ink/25 hover:border-orange-dark hover:text-orange-dark transition-colors"
                aria-label="Fewer"
              >
                −
              </button>
              <span className="font-display italic text-2xl tabular-nums w-10 text-center">
                {guests}
              </span>
              <button
                type="button"
                onClick={() =>
                  setGuests((g) => Math.min(config.maxGuests, g + guestStep))
                }
                className="h-9 w-9 border border-ink/25 hover:border-orange-dark hover:text-orange-dark transition-colors"
                aria-label="More"
              >
                +
              </button>
              <span className="text-[11px] text-ink/50 ml-2">
                {config.minGuests}–{config.maxGuests}
              </span>
            </div>
          </label>
        )}
      </div>

      {/* Guests for stay type */}
      {config.stay && (
        <div className="mb-10">
          <span className="block text-[10px] tracking-widest2 uppercase text-ink/60 mb-2">
            {config.guestNoun} · {nights} {nights === 1 ? 'night' : 'nights'}
          </span>
          <div className="flex items-center gap-4 pt-1">
            <button
              type="button"
              onClick={() => setGuests((g) => Math.max(config.minGuests, g - 1))}
              className="h-9 w-9 border border-ink/25 hover:border-orange-dark hover:text-orange-dark transition-colors"
              aria-label="Fewer"
            >
              −
            </button>
            <span className="font-display italic text-2xl tabular-nums w-10 text-center">
              {guests}
            </span>
            <button
              type="button"
              onClick={() => setGuests((g) => Math.min(config.maxGuests, g + 1))}
              className="h-9 w-9 border border-ink/25 hover:border-orange-dark hover:text-orange-dark transition-colors"
              aria-label="More"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Time slots */}
      {config.timeSlots && (
        <fieldset className="mb-10">
          <legend className="text-[10px] tracking-widest2 uppercase text-ink/60 mb-3">
            Preferred time
          </legend>
          <div className="flex flex-wrap gap-2">
            {config.timeSlots.map((slot) => {
              const active = time === slot
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  aria-pressed={active}
                  className={`px-4 py-2 text-sm tabular-nums border transition-colors ${
                    active
                      ? 'bg-orange-dark text-sand border-orange-dark'
                      : 'text-ink/70 border-ink/25 hover:border-orange-dark hover:text-orange-dark'
                  }`}
                >
                  {slot}
                </button>
              )
            })}
          </div>
        </fieldset>
      )}

      {/* Add-ons */}
      {config.options && config.options.length > 0 && (
        <fieldset>
          <legend className="text-[10px] tracking-widest2 uppercase text-ink/60 mb-4">
            Add-ons
          </legend>
          <ul className="border-t border-ink/15">
            {config.options.map((opt) => {
              const active = addOns.includes(opt.key)
              return (
                <li key={opt.key} className="border-b border-ink/15">
                  <label className="flex items-center gap-4 py-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleAddOn(opt.key)}
                      className="h-4 w-4 accent-orange-dark shrink-0"
                    />
                    <span className="flex-1 text-sm text-ink/80">
                      {opt.label}
                    </span>
                    <span className="font-display italic text-orange-dark text-sm tabular-nums">
                      {opt.price
                        ? `+ ${NAIRA.format(opt.price)}`
                        : 'included'}
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        </fieldset>
      )}
    </div>
  )
}

function StepContact({ contact, setContact, config }) {
  return (
    <div>
      <p className="text-orange-dark text-[11px] tracking-widest2 uppercase mb-3">
        02 · Guest info
      </p>
      <h2 className="font-display text-3xl md:text-4xl leading-tight text-marine mb-8">
        Who's on the{' '}
        <span className="italic">booking?</span>
      </h2>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <input
          required
          type="text"
          placeholder="First name"
          value={contact.firstName}
          onChange={(e) => setContact({ ...contact, firstName: e.target.value })}
          className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-3 text-sm placeholder:text-ink/50 transition-colors"
        />
        <input
          required
          type="text"
          placeholder="Last name"
          value={contact.lastName}
          onChange={(e) => setContact({ ...contact, lastName: e.target.value })}
          className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-3 text-sm placeholder:text-ink/50 transition-colors"
        />
      </div>

      <input
        required
        type="email"
        placeholder="Email — your booking goes here"
        value={contact.email}
        onChange={(e) => setContact({ ...contact, email: e.target.value })}
        className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-3 text-sm placeholder:text-ink/50 transition-colors mb-6"
      />
      <input
        type="tel"
        placeholder="Phone (WhatsApp welcome)"
        value={contact.phone}
        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
        className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-3 text-sm placeholder:text-ink/50 transition-colors mb-6"
      />
      <textarea
        rows={4}
        placeholder={
          config.holdOnly
            ? 'Tell us the shape of what you have in mind'
            : 'Anything the host should know? (optional)'
        }
        value={contact.notes}
        onChange={(e) => setContact({ ...contact, notes: e.target.value })}
        className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-3 text-sm placeholder:text-ink/50 resize-none transition-colors"
      />
    </div>
  )
}

function StepPayment({ config, total, card, setCard }) {
  if (config.holdOnly) {
    return (
      <div>
        <p className="text-orange-dark text-[11px] tracking-widest2 uppercase mb-3">
          03 · Hold this booking
        </p>
        <h2 className="font-display text-3xl md:text-4xl leading-tight text-marine mb-6">
          No card{' '}
          <span className="italic">needed today.</span>
        </h2>
        <p className="text-ink/70 max-w-md leading-relaxed">
          We'll email you a firm quote and hold the slot for 48 hours while
          you decide. Payment happens once the details are agreed.
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-orange-dark text-[11px] tracking-widest2 uppercase mb-3">
        03 · Payment
      </p>
      <h2 className="font-display text-3xl md:text-4xl leading-tight text-marine mb-3">
        Pay{' '}
        <span className="italic text-orange-dark">
          {NAIRA.format(total)}
        </span>
      </h2>
      <p className="text-ink/60 text-sm inline-flex items-center gap-2 mb-8">
        <Lock size={12} />
        Secured by Paystack · your card is never stored on our servers.
      </p>

      <input
        required
        type="text"
        placeholder="Cardholder name"
        value={card.name}
        onChange={(e) => setCard({ ...card, name: e.target.value })}
        className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-3 text-sm placeholder:text-ink/50 transition-colors mb-6"
      />
      <input
        required
        inputMode="numeric"
        placeholder="Card number"
        value={card.number}
        onChange={(e) =>
          setCard({ ...card, number: e.target.value.replace(/\D/g, '').slice(0, 19) })
        }
        className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-3 text-sm placeholder:text-ink/50 tabular-nums transition-colors mb-6"
      />
      <div className="grid grid-cols-2 gap-6">
        <input
          required
          inputMode="numeric"
          placeholder="MM / YY"
          value={card.expiry}
          onChange={(e) =>
            setCard({ ...card, expiry: e.target.value.replace(/[^\d/]/g, '').slice(0, 7) })
          }
          className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-3 text-sm placeholder:text-ink/50 tabular-nums transition-colors"
        />
        <input
          required
          inputMode="numeric"
          placeholder="CVC"
          value={card.cvc}
          onChange={(e) =>
            setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })
          }
          className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-3 text-sm placeholder:text-ink/50 tabular-nums transition-colors"
        />
      </div>
    </div>
  )
}

function StepConfirmed({
  config,
  total,
  reference,
  contact,
  date,
  checkOut,
  time,
  guests,
  nights,
}) {
  return (
    <div className="pt-2">
      <div className="w-14 h-14 rounded-full border border-orange-dark/40 flex items-center justify-center mb-6">
        <Check size={22} className="text-orange-dark" />
      </div>
      <p className="text-orange-dark text-[11px] tracking-widest2 uppercase mb-3">
        {config.holdOnly ? 'Held for 48 hours' : 'Confirmed'}
      </p>
      <h2 className="font-display text-4xl md:text-5xl leading-tight text-ink mb-6">
        {config.holdOnly ? "We've got your enquiry." : "You're on the list."}
      </h2>
      <p className="text-ink/70 max-w-md leading-relaxed mb-10">
        {config.holdOnly
          ? `A host is preparing your quote and will write to ${contact.email || 'you'} within the hour.`
          : `A confirmation has been sent to ${contact.email || 'your email'}. Show the reference below at the gate — or the QR that lands in your inbox.`}
      </p>

      <dl className="border-t border-ink/15 divide-y divide-ink/10">
        <ConfirmRow label="Reference">
          <span className="font-mono tabular-nums text-sm">{reference}</span>
        </ConfirmRow>
        <ConfirmRow label="Booking">
          {config.title}
        </ConfirmRow>
        <ConfirmRow label="Date">
          {date
            ? new Date(date).toLocaleDateString('en-GB', {
                weekday: 'short',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : '—'}
          {config.stay && checkOut ? ` → ${new Date(checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}` : ''}
        </ConfirmRow>
        {time && <ConfirmRow label="Time">{time}</ConfirmRow>}
        <ConfirmRow label={config.guestNoun}>{guests}</ConfirmRow>
        {config.stay && <ConfirmRow label="Nights">{nights}</ConfirmRow>}
        {!config.holdOnly && (
          <ConfirmRow label="Paid">
            <span className="font-display italic text-orange-dark">
              {NAIRA.format(total)}
            </span>
          </ConfirmRow>
        )}
      </dl>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          to="/things-to-do"
          className="inline-flex items-center gap-3 border border-ink/25 px-5 py-3 text-[11px] tracking-widest2 uppercase text-ink hover:border-orange-dark hover:text-orange-dark transition-colors"
        >
          Explore the grounds
        </Link>
        <Link
          to="/bookings"
          className="inline-flex items-center gap-3 text-[11px] tracking-widest2 uppercase text-orange-dark hover:text-ink transition-colors"
        >
          Book something else →
        </Link>
      </div>
    </div>
  )
}

function ConfirmRow({ label, children }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-4">
      <dt className="text-[10px] tracking-widest2 uppercase text-ink/55">
        {label}
      </dt>
      <dd className="text-ink text-right font-display text-lg">{children}</dd>
    </div>
  )
}
