import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Loader2 } from 'lucide-react'
import PageNav from '../components/PageNav'
import Footer from '../components/Footer'
import { useContent } from '../lib/content'
import { bookingTypes, bookingAliases, bookingTotal, resolveBooking, productCapacity, slugify, NAIRA, todayInLagos, followingDay } from '../lib/bookingTypes'

const STEPS = ['Visit details', 'Guest information', 'Review', 'Request received']
const INPUT = 'w-full min-w-0 rounded-xl border border-marine-dark/20 bg-sand px-4 py-3 text-base text-ink placeholder:text-ink/45 transition-colors focus:border-marine'

function formatDate(date, long = false) {
  if (!date) return 'Choose a date'
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: long ? 'long' : 'short', ...(long ? { year: 'numeric' } : {}) })
}

export default function BookingFlowPage() {
  const { type } = useParams()
  const canonicalType = bookingAliases[type] || type
  if (!bookingTypes[canonicalType]) {
    return (
      <div className="min-h-screen bg-sand text-ink">
        <PageNav />
        <main className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="font-display text-4xl text-marine mb-5">Booking not found</h1>
          <p className="text-ink/70 mb-8">Choose a booking from the options available for your visit.</p>
          <Link to="/bookings" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-marine-dark px-6 py-3 text-sand"><ArrowLeft size={16} /> All bookings</Link>
        </main>
        <Footer />
      </div>
    )
  }
  return <BookingFlow key={canonicalType} type={canonicalType} />
}

function BookingFlow({ type }) {
  const base = bookingTypes[type]
  const settings = useContent('siteSettings')
  const tickets = useContent('tickets')
  const rooms = useContent('rooms')
  const [searchParams] = useSearchParams()
  const products = useMemo(() => (tickets.items || []).filter(item => item.category === base.catalogCategory && Number.isFinite(Number(item.priceNGN))), [tickets.items, base.catalogCategory])
  const [productId, setProductId] = useState(() => searchParams.get('product') || products[0]?.id || '')
  const [roomId, setRoomId] = useState(() => searchParams.get('room') || slugify(rooms.items?.[0]?.name))
  const product = base.catalogCategory ? products.find(item => item.id === productId) || products[0] : null
  const room = type === 'rooms' ? rooms.items?.find(item => slugify(item.name) === roomId) || rooms.items?.[0] : null
  const config = useMemo(() => resolveBooking(base, product, room), [base, product, room])
  const [step, setStep] = useState(0)
  const [date, setDate] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(() => type === 'packages' ? Math.max(config.minGuests, productCapacity(product)) : config.minGuests)
  const [time, setTime] = useState('')
  const [addOns, setAddOns] = useState([])
  const [contact, setContact] = useState({ firstName: '', lastName: '', email: '', phone: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [reference, setReference] = useState('')
  const today = todayInLagos()
  const nights = config.stay && date && checkOut ? Math.max(1, Math.round((new Date(checkOut) - new Date(date)) / 86400000)) : 1
  const total = bookingTotal(config, { guests, nights, addOns })
  const units = config.packageFor ? Math.ceil(guests / config.packageFor) : guests
  const partySize = type === 'entry' ? guests * productCapacity(product) : guests
  const bookingName = product?.name || room?.name || config.title
  const selectionReady = (!base.catalogCategory || Boolean(product)) && (type !== 'rooms' || Boolean(room))
  const detailsReady = selectionReady && Boolean(date && date >= today) && (!config.stay || Boolean(checkOut && checkOut > date)) && (!config.timeSlots || Boolean(time))

  useEffect(() => {
    document.title = `${config.title} · ${settings.brand || 'Landmark'} Port Harcourt`
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [config.title, settings.brand, step])

  useEffect(() => {
    setGuests(value => Math.max(config.minGuests, Math.min(config.maxGuests, value)))
  }, [config.minGuests, config.maxGuests])

  function selectProduct(id) {
    const selected = products.find(item => item.id === id)
    setProductId(id)
    if (type === 'packages') setGuests(selected?.priceUnit === 'guest' ? 20 : productCapacity(selected))
    setError('')
  }

  function toggleAddOn(key) {
    setAddOns(previous => previous.includes(key) ? previous.filter(item => item !== key) : [...previous, key])
  }

  async function next(event) {
    event.preventDefault()
    if (submitting || !event.currentTarget.reportValidity()) return
    setError('')
    if (step < 2) {
      if (step === 0 && !detailsReady) return
      setStep(value => value + 1)
      return
    }
    setSubmitting(true)
    try {
      const api = (import.meta.env?.VITE_API_URL ?? (import.meta.env?.DEV ? 'http://localhost:4000' : '')).replace(/\/+$/, '')
      const selectedDetails = [product ? `${config.title}: ${product.name}; ${type === 'entry' ? guests : units} ${type === 'entry' ? 'tickets' : product.priceUnit === 'guest' ? 'guests' : 'packages'}.` : '', room ? `Room: ${room.name}.` : '', contact.notes.trim()].filter(Boolean).join('\n')
      const response = await fetch(`${api}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(20000),
        body: JSON.stringify({
          bookingType: type,
          firstName: contact.firstName.trim(),
          lastName: contact.lastName.trim(),
          email: contact.email.trim(),
          phone: contact.phone.trim(),
          dateFrom: date,
          dateTo: config.stay ? checkOut : undefined,
          timeSlot: time || undefined,
          guests: partySize,
          addOns: [...addOns, ...(product ? [`product:${product.id}`] : []), ...(room ? [`room:${slugify(room.name)}`] : [])],
          totalNGN: total,
          notes: selectedDetails,
          status: 'pending',
        }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok || typeof result.reference !== 'string' || !result.reference) throw new Error('Booking request failed')
      setReference(result.reference)
      setStep(3)
    } catch {
      setError('We couldn’t send your booking request. Please try again, or contact our team for help.')
    } finally {
      setSubmitting(false)
    }
  }

  const summary = { type, config, product, room, bookingName, date, checkOut, time, guests, partySize, units, nights, addOns, total }

  return (
    <div className="min-h-screen bg-sand text-ink">
      <PageNav />
      <main>
        <header className="border-b border-marine-dark/10">
          <div className="max-w-6xl mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-10 md:pb-12">
            <Link to="/bookings" className="inline-flex items-center gap-2 text-sm text-marine-dark/70 hover:text-marine mb-8"><ArrowLeft size={16} /> All bookings</Link>
            <p className="text-xs tracking-widest2 uppercase text-marine-dark/65 mb-3">{config.tag}</p>
            <h1 className="font-display text-marine-dark leading-tight tracking-tight" style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)' }}>{config.title}</h1>
            <p className="mt-4 max-w-2xl text-ink/70 leading-relaxed">{config.lead}</p>
            <ol aria-label="Booking progress" className="mt-9 grid grid-cols-2 md:grid-cols-4 gap-3">
              {STEPS.map((label, index) => (
                <li key={label} aria-current={index === step ? 'step' : undefined} className={`flex items-center gap-2 rounded-full border px-4 py-3 text-xs md:text-sm ${index === step ? 'bg-marine-dark border-marine-dark text-sand' : index < step ? 'border-marine-dark/20 text-marine-dark' : 'border-marine-dark/10 text-ink/50'}`}>
                  {index < step && <Check size={14} aria-hidden="true" className="shrink-0" />}
                  <span>{label}</span>
                </li>
              ))}
            </ol>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 md:py-16 grid lg:grid-cols-[minmax(0,1fr)_340px] gap-10 lg:gap-14 items-start">
          <div className="min-w-0">
            {step < 3 ? (
              <form onSubmit={next} aria-label="Booking details">
                {step === 0 && (
                  <StepDetails type={type} config={config} products={products} product={product} selectProduct={selectProduct} rooms={rooms.items || []} room={room} selectRoom={setRoomId} date={date} setDate={value => { setDate(value); if (checkOut && checkOut <= value) setCheckOut('') }} checkOut={checkOut} setCheckOut={setCheckOut} today={today} guests={guests} setGuests={setGuests} time={time} setTime={setTime} addOns={addOns} toggleAddOn={toggleAddOn} units={units} />
                )}
                {step === 1 && <StepContact contact={contact} setContact={setContact} />}
                {step === 2 && <StepReview summary={summary} contact={contact} />}

                {error && <p role="alert" className="mt-6 rounded-xl border border-orange-dark/40 bg-orange-light/10 p-4 text-sm leading-relaxed text-marine-dark">{error} <Link to="/contact" className="underline underline-offset-2">Contact us</Link></p>}
                <div className="mt-10 pt-6 border-t border-marine-dark/15 flex flex-wrap items-center justify-between gap-4">
                  <button type="button" onClick={() => { setStep(value => Math.max(0, value - 1)); setError('') }} disabled={step === 0 || submitting} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-marine-dark/20 px-5 py-3 text-sm text-marine-dark hover:bg-marine-dark/5 disabled:opacity-35 disabled:cursor-not-allowed"><ArrowLeft size={16} /> Back</button>
                  <button type="submit" disabled={submitting || (step === 0 && !detailsReady)} className="inline-flex min-h-11 items-center justify-center gap-3 rounded-full bg-marine-dark px-6 py-3 text-sm font-medium text-sand hover:bg-marine disabled:opacity-40 disabled:cursor-not-allowed">
                    {submitting ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" /> Sending request</> : <>{step === 2 ? 'Send booking request' : step === 1 ? 'Review booking' : 'Continue'}<ArrowRight size={16} aria-hidden="true" /></>}
                  </button>
                </div>
                {step === 0 && !detailsReady && <p className="mt-3 text-sm text-ink/60">{!selectionReady ? 'Choose an available booking option to continue.' : config.stay ? 'Choose your check-in and check-out dates to continue.' : config.timeSlots ? 'Choose a date and time to continue.' : 'Choose a date to continue.'}</p>}
              </form>
            ) : <StepReceived reference={reference} contact={contact} summary={summary} />}
          </div>

          <aside aria-label="Booking summary" className="min-w-0 rounded-3xl bg-sky p-6 lg:sticky lg:top-28">
            <img src={room?.imageUrl || config.image} alt={bookingName} className="w-full aspect-[16/10] rounded-2xl object-cover mb-6" />
            <p className="text-xs uppercase tracking-widest2 text-marine-dark/65 mb-2">Your visit</p>
            <h2 className="font-display text-2xl leading-tight text-marine-dark mb-5">{bookingName}</h2>
            <BookingSummary summary={summary} />
            <div className="mt-6 pt-5 border-t border-marine-dark/15">
              <p className="text-sm text-marine-dark/70 mb-1">{config.holdOnly ? 'Pricing' : 'Estimated total'}</p>
              <p className="font-display text-3xl text-marine-dark tabular-nums">{config.holdOnly ? 'On enquiry' : NAIRA.format(total)}</p>
              <p className="mt-3 text-xs leading-relaxed text-marine-dark/65">Availability and payment details are confirmed by our team. No payment is taken with this request.</p>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function Field({ label, children, required = false }) {
  return <label className="block min-w-0"><span className="block text-sm font-medium text-marine-dark mb-2">{label}{required && <span aria-hidden="true" className="text-orange-dark"> *</span>}</span>{children}</label>
}

function GuestCounter({ config, guests, setGuests }) {
  const increment = config.step || 1
  const [draft, setDraft] = useState(String(guests))
  useEffect(() => { setDraft(String(guests)) }, [guests])
  function updateCount(value) {
    setDraft(value)
    const count = Number(value)
    if (Number.isInteger(count) && count >= config.minGuests && count <= config.maxGuests) setGuests(count)
  }
  return (
    <div>
      <p id="guest-count-label" className="text-sm font-medium text-marine-dark mb-2">{config.guestNoun === 'tickets' ? 'Number of tickets' : config.guestNoun === 'diners' ? 'Diners' : 'Guests'}</p>
      <div aria-labelledby="guest-count-label" className="inline-flex items-center gap-3">
        <button type="button" aria-label="Fewer" disabled={guests <= config.minGuests} onClick={() => setGuests(value => Math.max(config.minGuests, value - increment))} className="h-11 w-11 rounded-full border border-marine-dark/20 text-marine-dark hover:bg-marine-dark/5 disabled:opacity-35 disabled:cursor-not-allowed">−</button>
        <input type="number" aria-labelledby="guest-count-label" required min={config.minGuests} max={config.maxGuests} step={1} value={draft} onChange={event => updateCount(event.target.value)} onBlur={() => { const count = Math.max(config.minGuests, Math.min(config.maxGuests, Math.round(Number(draft) || config.minGuests))); setGuests(count); setDraft(String(count)) }} className="h-11 w-20 rounded-xl border border-marine-dark/20 bg-sand text-center text-xl font-medium text-marine-dark tabular-nums" />
        <button type="button" aria-label="More" disabled={guests >= config.maxGuests} onClick={() => setGuests(value => Math.min(config.maxGuests, value + increment))} className="h-11 w-11 rounded-full border border-marine-dark/20 text-marine-dark hover:bg-marine-dark/5 disabled:opacity-35 disabled:cursor-not-allowed">+</button>
      </div>
      <p className="mt-2 text-xs text-ink/60">{config.minGuests}–{config.maxGuests} {config.guestNoun}</p>
    </div>
  )
}

function StepDetails({ type, config, products, product, selectProduct, rooms, room, selectRoom, date, setDate, checkOut, setCheckOut, today, guests, setGuests, time, setTime, addOns, toggleAddOn, units }) {
  return (
    <div>
      <h2 className="font-display text-3xl text-marine-dark leading-tight mb-3">Plan your visit</h2>
      <p className="text-sm text-ink/65 mb-8">Choose what works for your party. You can review everything before sending your request.</p>

      {config.catalogCategory && (
        <div className="mb-8">
          {products.length ? (
            <>
              <Field label={type === 'entry' ? 'Entry ticket' : 'Package'} required><select required value={product?.id || ''} onChange={event => selectProduct(event.target.value)} className={INPUT}>{products.map(item => <option key={item.id} value={item.id}>{item.name} · {NAIRA.format(item.priceNGN)} / {item.priceUnit || 'package'}</option>)}</select></Field>
              <p className="mt-4 text-sm text-ink/70 leading-relaxed">{product?.body}</p>
              {product?.includes?.length > 0 && <ul aria-label="Included in your booking" className="mt-4 grid sm:grid-cols-2 gap-x-5 gap-y-2">{product.includes.map(item => <li key={item} className="flex items-start gap-2 text-sm text-marine-dark/80"><Check size={15} aria-hidden="true" className="shrink-0 mt-1 text-marine" />{item}</li>)}</ul>}
            </>
          ) : <p className="rounded-xl border border-marine-dark/20 p-4 text-sm">These bookings are not available yet. <Link to="/contact" className="underline">Contact our team</Link> to plan a visit.</p>}
        </div>
      )}

      {type === 'rooms' && rooms.length > 0 && <div className="mb-8"><Field label="Room or cabana" required><select required value={slugify(room?.name)} onChange={event => selectRoom(event.target.value)} className={INPUT}>{rooms.map(item => <option key={item.name} value={slugify(item.name)}>{item.name} · {item.priceFrom}</option>)}</select></Field>{room?.body && <p className="mt-4 text-sm text-ink/70 leading-relaxed">{room.body}</p>}</div>}

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <Field label={config.stay ? 'Check-in date' : 'Visit date'} required><input required type="date" min={today} value={date} onChange={event => setDate(event.target.value)} className={INPUT} /></Field>
        {config.stay ? <Field label="Check-out date" required><input required type="date" min={date ? followingDay(date) : followingDay(today)} value={checkOut} onChange={event => setCheckOut(event.target.value)} className={INPUT} /></Field> : <GuestCounter config={config} guests={guests} setGuests={setGuests} />}
      </div>
      {config.stay && <div className="mb-8"><GuestCounter config={config} guests={guests} setGuests={setGuests} /></div>}
      {config.packageFor && <p className="mb-8 rounded-xl bg-sky p-4 text-sm text-marine-dark">Each package includes up to {config.packageFor} guests. Your party needs {units} {units === 1 ? 'package' : 'packages'}.</p>}
      {type === 'entry' && productCapacity(product) > 1 && <p className="mb-8 text-sm text-marine-dark/75">Each ticket includes {productCapacity(product)} guests. {guests} {guests === 1 ? 'ticket covers' : 'tickets cover'} up to {guests * productCapacity(product)} guests.</p>}

      {config.timeSlots && <fieldset className="mb-8"><legend className="text-sm font-medium text-marine-dark mb-3">Preferred time <span aria-hidden="true" className="text-orange-dark">*</span></legend><div className="flex flex-wrap gap-2">{config.timeSlots.map(slot => <button key={slot} type="button" aria-pressed={time === slot} onClick={() => setTime(slot)} className={`rounded-full border px-5 py-3 text-sm tabular-nums transition-colors ${time === slot ? 'bg-marine-dark border-marine-dark text-sand' : 'border-marine-dark/20 text-marine-dark hover:bg-marine-dark/5'}`}>{slot}</button>)}</div></fieldset>}

      {config.options?.length > 0 && <fieldset><legend className="text-sm font-medium text-marine-dark mb-3">Optional extras</legend><ul className="divide-y divide-marine-dark/10 border-y border-marine-dark/10">{config.options.map(option => <li key={option.key}><label className="flex items-start gap-3 py-4 cursor-pointer"><input type="checkbox" checked={addOns.includes(option.key)} onChange={() => toggleAddOn(option.key)} className="mt-1 h-5 w-5 shrink-0 accent-marine" /><span className="min-w-0 flex-1 text-sm text-ink/80">{option.label}</span><span className="shrink-0 text-sm text-marine-dark tabular-nums">{option.price ? `+ ${NAIRA.format(option.price)}` : 'No extra charge'}</span></label></li>)}</ul></fieldset>}
    </div>
  )
}

function StepContact({ contact, setContact }) {
  function change(key, value) { setContact(previous => ({ ...previous, [key]: value })) }
  return (
    <div>
      <h2 className="font-display text-3xl text-marine-dark leading-tight mb-3">Your contact details</h2>
      <p className="text-sm text-ink/65 mb-8">Our team will use these details to confirm your visit.</p>
      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <Field label="First name" required><input required name="firstName" autoComplete="given-name" maxLength={120} value={contact.firstName} onChange={event => change('firstName', event.target.value)} pattern=".*\S.*" className={INPUT} /></Field>
        <Field label="Last name" required><input required name="lastName" autoComplete="family-name" maxLength={120} value={contact.lastName} onChange={event => change('lastName', event.target.value)} pattern=".*\S.*" className={INPUT} /></Field>
      </div>
      <div className="space-y-5">
        <Field label="Email address" required><input required name="email" type="email" autoComplete="email" value={contact.email} onChange={event => change('email', event.target.value)} className={INPUT} /></Field>
        <Field label="Phone number (optional)"><input name="phone" type="tel" autoComplete="tel" maxLength={60} value={contact.phone} onChange={event => change('phone', event.target.value)} className={INPUT} /></Field>
        <Field label="Notes for our team (optional)"><textarea name="notes" rows={4} placeholder="Special requests, access needs or anything else we should know" value={contact.notes} onChange={event => change('notes', event.target.value)} className={`${INPUT} resize-y`} /></Field>
      </div>
    </div>
  )
}

function BookingSummary({ summary }) {
  const { type, config, date, checkOut, time, guests, partySize, units, nights, addOns } = summary
  return (
    <dl className="space-y-3 text-sm">
      <SummaryRow label={config.stay ? 'Stay' : 'Date'}>{formatDate(date)}{config.stay && checkOut ? ` – ${formatDate(checkOut)}` : ''}</SummaryRow>
      {config.timeSlots && <SummaryRow label="Time">{time || 'Choose a time'}</SummaryRow>}
      <SummaryRow label={type === 'entry' ? 'Tickets' : config.guestNoun === 'diners' ? 'Diners' : 'Guests'}>{guests}</SummaryRow>
      {type === 'entry' && partySize !== guests && <SummaryRow label="Guests included">{partySize}</SummaryRow>}
      {config.packageFor && <SummaryRow label="Packages">{units}</SummaryRow>}
      {config.stay && <SummaryRow label="Nights">{nights}</SummaryRow>}
      {addOns.length > 0 && <SummaryRow label="Extras"><ul className="space-y-1">{addOns.map(key => <li key={key}>{config.options.find(option => option.key === key)?.label}</li>)}</ul></SummaryRow>}
    </dl>
  )
}

function SummaryRow({ label, children }) {
  return <div className="flex items-start justify-between gap-5"><dt className="shrink-0 text-marine-dark/65">{label}</dt><dd className="min-w-0 text-right font-medium text-marine-dark break-words">{children}</dd></div>
}

function StepReview({ summary, contact }) {
  return (
    <div>
      <h2 className="font-display text-3xl text-marine-dark leading-tight mb-3">Review your booking</h2>
      <p className="text-sm text-ink/65 mb-8">Check your visit and contact details before sending your request.</p>
      <h3 className="font-display text-xl text-marine-dark mb-4">{summary.bookingName}</h3>
      <BookingSummary summary={summary} />
      <div className="mt-6 pt-6 border-t border-marine-dark/15 space-y-2 text-sm text-ink/75">
        <p className="font-medium text-marine-dark">{contact.firstName} {contact.lastName}</p>
        <p className="break-words">{contact.email}</p>
        {contact.phone && <p>{contact.phone}</p>}
        {contact.notes && <p className="pt-2 whitespace-pre-line break-words">{contact.notes}</p>}
      </div>
      <div className="mt-6 rounded-2xl border border-marine-dark/15 p-5">
        <p className="text-sm font-medium text-marine-dark mb-2">{summary.config.holdOnly ? 'Request a quote' : `Estimated total · ${NAIRA.format(summary.total)}`}</p>
        <p className="text-sm text-ink/65 leading-relaxed">Our team will confirm availability and payment details. Sending this request does not take a payment.</p>
      </div>
    </div>
  )
}

function StepReceived({ reference, contact, summary }) {
  return (
    <div role="status">
      <CheckCircle2 size={44} strokeWidth={1.5} className="text-marine mb-6" aria-hidden="true" />
      <h2 className="font-display text-3xl md:text-4xl leading-tight text-marine-dark mb-4">Your request is received.</h2>
      <p className="text-ink/70 leading-relaxed mb-8">Our team will confirm availability and payment details using <span className="font-medium text-marine-dark break-words">{contact.email}</span>. Keep your reference for any follow-up.</p>
      <div className="rounded-2xl border border-marine-dark/20 p-5 mb-8"><p className="text-sm text-ink/65 mb-1">Booking reference</p><p className="font-display text-xl text-marine-dark break-all">{reference}</p></div>
      <h3 className="font-display text-xl text-marine-dark mb-4">{summary.bookingName}</h3>
      <BookingSummary summary={summary} />
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/bookings" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-marine-dark px-6 py-3 text-sm text-sand hover:bg-marine">Make another booking <ArrowRight size={16} /></Link>
        <Link to="/things-to-do" className="inline-flex min-h-11 items-center rounded-full border border-marine-dark/20 px-6 py-3 text-sm text-marine-dark hover:bg-marine-dark/5">Explore the grounds</Link>
      </div>
    </div>
  )
}
