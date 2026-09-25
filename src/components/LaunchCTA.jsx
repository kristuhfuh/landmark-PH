import { useState } from 'react'
import { Phone, Mail, MessageCircle, Clock, Check } from 'lucide-react'
import useRevealOnScroll from '../hooks/useRevealOnScroll'
import SplitHeading from './SplitHeading'
import FloralDecoration from './FloralDecoration'
import { openBookingModal } from './BookingModal'
import { useContent } from '../lib/content'

export default function LaunchCTA() {
  const ref = useRevealOnScroll({ stagger: 0.1 })
  const [submitted, setSubmitted] = useState(false)
  const visit = useContent('visit')
  const settings = useContent('siteSettings')

  const eyebrow = visit.eyebrow || 'Plan Your Visit'
  const heading = visit.heading || 'Come see us.'
  const body =
    visit.body ||
    'Walk-ins are welcome across the grounds. For table bookings, group visits or membership enquiries, get in touch.'
  const submitLabel = visit.formSubmitLabel || 'Send Enquiry'
  const successTitle = visit.formSuccessTitle || 'Thank you.'
  const successBody =
    visit.formSuccessBody ||
    "We've received your enquiry and will get back to you shortly."
  const responseTime = visit.responseTime || 'We reply within 24 hours.'

  const contact = settings.contact || {}
  const phone = contact.phone || '+234 000 000 0000'
  const email = contact.email || 'hello@landmark-portharcourt.ng'
  const address = contact.addressLines?.length
    ? contact.addressLines
    : ['Landmark Village', 'Port Harcourt', 'Rivers State, Nigeria']
  const hours = contact.hoursLines?.length
    ? contact.hoursLines
    : ['Sun – Thu · 10am – 11pm', 'Fri – Sat · 10am – 1am']

  // Best-effort WhatsApp deep-link — strips non-digits so numbers with
  // spaces/hyphens still work. Falls back to no-op if there's no phone.
  const whatsappHref = phone
    ? `https://wa.me/${phone.replace(/\D/g, '')}`
    : undefined

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section
      id="visit"
      ref={ref}
      className="relative bg-sand text-ink py-24 md:py-32 px-6 md:px-10 overflow-hidden"
    >
      {/* Tropical corner flourishes framing the enquiry section. */}
      <FloralDecoration position="top-right" size="sm" />
      <FloralDecoration position="bottom-left" size="sm" />

      {/* Editorial watermark that echoes the hero's opening line. */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute -bottom-6 md:-bottom-10 -right-4 md:right-8 font-display italic text-marine-dark/10 leading-none"
        style={{ fontSize: 'clamp(6rem, 18vw, 18rem)' }}
      >
        return to.
      </span>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start relative z-10">
        <div>
          <p className="reveal inline-flex items-center gap-4 text-orange-dark text-xs tracking-widest2 uppercase mb-6">
            <span className="font-display italic text-orange-dark/90 text-base tabular-nums">09</span>
            <span aria-hidden="true" className="h-px w-8 bg-orange-dark/50" />
            {eyebrow}
          </p>
          <SplitHeading className="font-display text-4xl md:text-6xl leading-[1.02] mb-6">
            {heading}
          </SplitHeading>
          <p className="reveal text-ink/70 leading-relaxed max-w-sm mb-8">
            {body}
          </p>

          {/* Quick-action rail — bypass the form for guests who'd rather
              WhatsApp, call, or open the full booking panel. */}
          <div className="reveal flex flex-wrap gap-3 mb-10">
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-marine-dark text-sand text-xs tracking-widest2 uppercase hover:bg-marine transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
              >
                <MessageCircle size={14} strokeWidth={1.75} />
                WhatsApp
              </a>
            )}
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-marine-dark/25 text-marine-dark text-xs tracking-widest2 uppercase hover:border-orange-dark hover:text-orange-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
            >
              <Phone size={14} strokeWidth={1.75} />
              Call
            </a>
            <button
              type="button"
              onClick={() => openBookingModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-marine-dark/25 text-marine-dark text-xs tracking-widest2 uppercase hover:border-orange-dark hover:text-orange-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
            >
              Full booking form
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <dl className="reveal grid grid-cols-2 gap-x-8 gap-y-8 border-t border-ink/15 pt-8">
            <div>
              <dt className="text-orange-dark text-[11px] tracking-widest2 uppercase mb-2">
                Address
              </dt>
              <dd className="text-ink/80 text-sm leading-relaxed space-y-0.5">
                {address.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-orange-dark text-[11px] tracking-widest2 uppercase mb-2">
                Hours
              </dt>
              <dd className="text-ink/80 text-sm leading-relaxed space-y-0.5">
                {hours.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-orange-dark text-[11px] tracking-widest2 uppercase mb-2">
                Direct
              </dt>
              <dd className="text-ink/80 text-sm leading-relaxed flex flex-col gap-1.5">
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-2 hover:text-orange-dark transition-colors"
                >
                  <Phone size={12} strokeWidth={1.75} />
                  {phone}
                </a>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 hover:text-orange-dark transition-colors"
                >
                  <Mail size={12} strokeWidth={1.75} />
                  {email}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="reveal">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-5 bg-white/40 p-6 md:p-8 border border-ink/10"
          >
            {submitted ? (
              <div className="text-center py-6">
                <div className="mx-auto w-14 h-14 rounded-full border border-orange-dark/40 flex items-center justify-center mb-5">
                  <Check size={22} className="text-orange-dark" />
                </div>
                <p className="font-display text-2xl md:text-3xl mb-2">
                  {successTitle}
                </p>
                <p className="text-ink/60 text-sm max-w-xs mx-auto">
                  {successBody}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-xs tracking-widest2 uppercase text-orange-dark hover:text-orange transition-colors"
                >
                  Send another
                </button>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-[11px] tracking-widest2 uppercase text-ink/60 mb-1">
                    Quick enquiry
                  </p>
                  <p className="font-display italic text-marine text-lg leading-tight">
                    Prefer a form? Leave a few details.
                  </p>
                </div>
                <input
                  required
                  type="text"
                  placeholder="Name"
                  className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-3 text-sm placeholder:text-ink/50 transition-colors"
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-3 text-sm placeholder:text-ink/50 transition-colors"
                />
                <input
                  type="tel"
                  placeholder="Phone (WhatsApp welcome)"
                  className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-3 text-sm placeholder:text-ink/50 transition-colors"
                />
                <textarea
                  rows={3}
                  placeholder="Booking or enquiry (optional)"
                  className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-3 text-sm placeholder:text-ink/50 resize-none transition-colors"
                />
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-orange-dark text-sand text-xs tracking-widest2 uppercase hover:bg-orange transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
                >
                  {submitLabel}
                  <span aria-hidden="true">→</span>
                </button>
                <p className="text-ink/55 text-[11px] tracking-wide inline-flex items-center gap-2 justify-center pt-1">
                  <Clock size={12} strokeWidth={1.75} />
                  {responseTime}
                </p>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
