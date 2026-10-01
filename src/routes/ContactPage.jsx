import { useEffect, useState } from 'react'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Check,
  MessageCircle,
  ChevronDown,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
} from 'lucide-react'
import PageNav from '../components/PageNav'
import Footer from '../components/Footer'
import PatternOverlay from '../components/PatternOverlay'
import { useContent } from '../lib/content'

const SOCIALS = [
  { label: 'Instagram', href: '#', Icon: Instagram },
  { label: 'Facebook', href: '#', Icon: Facebook },
  { label: 'YouTube', href: '#', Icon: Youtube },
  { label: 'LinkedIn', href: '#', Icon: Linkedin },
]

const REASONS = [
  { key: 'general', label: 'General enquiry' },
  { key: 'booking', label: 'Booking help' },
  { key: 'press', label: 'Press & media' },
  { key: 'careers', label: 'Careers' },
  { key: 'partners', label: 'Partnerships' },
  { key: 'membership', label: 'Membership' },
]

// 12px-radius inputs — white on the sand card, ink text, orange-dark focus.
const INPUT =
  'w-full bg-white border border-ink/12 rounded-[16px] px-5 py-3.5 text-sm text-ink placeholder:text-ink/40 outline-none focus:border-orange-dark focus:ring-2 focus:ring-orange-dark/15 transition-all'

export default function ContactPage() {
  const settings = useContent('siteSettings')
  const brand = settings.brand || 'Landmark'
  const contact = settings.contact || {}
  const [reason, setReason] = useState('general')
  const [submitted, setSubmitted] = useState(false)
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    document.title = `Contact · ${brand} Port Harcourt`
    window.scrollTo(0, 0)
  }, [brand])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const activeLabel = REASONS.find((r) => r.key === reason)?.label

  return (
    <div className="bg-sand text-ink min-h-screen">
      <PageNav />

      {/* Hero */}
      <section className="border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-16 md:pb-20">
          <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-end">
            <div className="md:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/60 px-3.5 py-1.5 text-[11px] tracking-widest2 uppercase text-ink/70 mb-8">
                <MessageCircle size={14} className="text-orange-dark" strokeWidth={1.75} />
                Get in touch
              </span>
              <h1
                className="font-display font-light leading-[0.95] tracking-tight text-ink"
                style={{ fontSize: 'clamp(2.75rem, 8vw, 6.5rem)' }}
              >
                Write to us, or come{' '}
                <span className="italic text-marine">walk the grounds.</span>
              </h1>
              <p className="mt-10 max-w-xl text-ink/70 text-base md:text-lg leading-relaxed">
                Walk-ins are welcome. For anything longer than a quick
                question — group visits, press, partnerships, careers — send
                a note and a host replies within the hour during opening
                times.
              </p>
            </div>
            <figure className="md:col-span-5">
              <div className="aspect-[4/5] w-full overflow-hidden bg-ink/5">
                <img
                  src="/photo-1500815845799-7748ca339f27.avif"
                  alt="The waterfront approach"
                  loading="eager"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between text-[10px] tracking-widest2 uppercase text-ink/55">
                <span>Fig. 01</span>
                <span className="font-display italic normal-case tracking-normal text-ink/70">
                  Landmark Village
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Info rail + form card */}
      <section className="border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-24 grid md:grid-cols-12 gap-14">
          {/* Left: contact info */}
          <aside className="md:col-span-5">
            <h2 className="font-display text-3xl md:text-4xl leading-tight text-marine mb-4">
              Reach us any{' '}
              <span className="italic">time.</span>
            </h2>
            <p className="text-ink/65 leading-relaxed max-w-sm mb-12">
              Walk-ins welcome across the grounds. For groups, press or
              partnerships, drop a note and a host will come back within the
              hour.
            </p>

            <ul className="space-y-7 text-ink/85">
              {contact.addressLines?.length > 0 && (
                <InfoRow
                  Icon={MapPin}
                  label="Office Location"
                  value={contact.addressLines.join(', ')}
                />
              )}
              {contact.phone && (
                <InfoRow
                  Icon={Phone}
                  label="Phone"
                  value={contact.phone}
                  href={`tel:${String(contact.phone).replace(/\s+/g, '')}`}
                />
              )}
              {contact.email && (
                <InfoRow
                  Icon={Mail}
                  label="Email"
                  value={contact.email}
                  href={`mailto:${contact.email}`}
                />
              )}
              {contact.hoursLines?.length > 0 && (
                <li className="flex items-start gap-4">
                  <span className="h-11 w-11 shrink-0 rounded-full border border-ink/15 bg-white/60 flex items-center justify-center text-orange-dark">
                    <Clock size={18} strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="text-ink text-sm font-medium mb-1">Hours</p>
                    <ul className="text-ink/70 text-sm space-y-0.5">
                      {contact.hoursLines.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              )}
            </ul>

            <div className="mt-10 pt-8 border-t border-ink/12">
              <p className="text-[10px] tracking-widest2 uppercase text-ink/55 mb-4">
                Follow along
              </p>
              <ul className="flex items-center gap-3">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      aria-label={label}
                      className="h-10 w-10 rounded-full border border-ink/20 flex items-center justify-center text-ink hover:border-orange-dark hover:text-orange-dark transition-colors"
                    >
                      <Icon size={16} strokeWidth={1.5} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Right: form card */}
          <div className="md:col-span-7">
            {submitted ? (
              <div className="bg-white/70 border border-ink/10 rounded-[16px] p-8 md:p-10 shadow-sm">
                <div className="w-14 h-14 rounded-full border border-orange-dark/40 flex items-center justify-center mb-5">
                  <Check size={22} className="text-orange-dark" />
                </div>
                <p className="font-display text-3xl mb-3 text-ink">
                  Thank you.
                </p>
                <p className="text-ink/70 text-sm max-w-sm leading-relaxed">
                  We've logged your{' '}
                  <span className="italic">{activeLabel?.toLowerCase()}</span>{' '}
                  and a host will be in touch within the hour during opening
                  times.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false)
                    setAccepted(false)
                  }}
                  className="mt-6 text-[11px] tracking-widest2 uppercase text-orange-dark hover:text-ink transition-colors"
                >
                  Send another →
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white/70 border border-ink/10 rounded-[16px] p-8 md:p-10 shadow-sm space-y-6"
              >
                <FormField label="Full name">
                  <input
                    required
                    type="text"
                    placeholder="Your name"
                    className={INPUT}
                  />
                </FormField>

                <FormField label="Email address">
                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    className={INPUT}
                  />
                </FormField>

                <FormField label="Phone number">
                  <input
                    type="tel"
                    placeholder="+234 800 000 0000"
                    className={INPUT}
                  />
                </FormField>

                <FormField label="Enquiry type">
                  <div className="relative">
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className={INPUT + ' appearance-none pr-12 cursor-pointer'}
                    >
                      {REASONS.map((r) => (
                        <option key={r.key} value={r.key}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      strokeWidth={1.75}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/50"
                    />
                  </div>
                </FormField>

                <FormField label="Message (optional)">
                  <textarea
                    rows={5}
                    placeholder="Tell us more about your visit or enquiry."
                    className={
                      'w-full bg-white border border-ink/12 rounded-[16px] px-5 py-4 text-sm text-ink placeholder:text-ink/40 outline-none focus:border-orange-dark focus:ring-2 focus:ring-orange-dark/15 transition-all resize-none'
                    }
                  />
                </FormField>

                <button
                  type="submit"
                  disabled={!accepted}
                  className="w-full inline-flex items-center justify-center gap-3 bg-ink text-sand rounded-full py-4 text-sm tracking-wide hover:bg-orange-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-dark"
                >
                  Submit
                </button>

                <label className="flex items-start gap-3 text-sm text-ink/70 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-orange-dark shrink-0"
                  />
                  <span>
                    By submitting this form, I agree to the{' '}
                    <a
                      href="#"
                      className="text-ink underline underline-offset-2 hover:text-orange-dark"
                    >
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Find the grounds */}
      <section className="relative isolate bg-marine-dark text-sand overflow-hidden">
        <PatternOverlay />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-24">
          <div className="grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-6">
              <p className="text-orange-light text-[11px] tracking-widest2 uppercase mb-6">
                Find the grounds
              </p>
              <h2 className="font-display text-4xl md:text-5xl leading-tight">
                A short drive from central{' '}
                <span className="text-orange-light">Port Harcourt.</span>
              </h2>
              <p className="mt-6 text-sand/70 max-w-md leading-relaxed">
                Landmark Village, along the Rivers State shore. Signposted
                turn-in off the coastal road — parking on the ring side.
              </p>
            </div>
            <div className="md:col-span-6">
              <div className="aspect-[4/3] w-full border border-sand/15 relative overflow-hidden rounded-[16px]">
                <iframe
                  title="Landmark Port Harcourt map"
                  src="https://www.google.com/maps?q=Landmark+Village+Port+Harcourt&z=13&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full grayscale-[35%] contrast-95"
                />
                <div className="pointer-events-none absolute bottom-3 left-3 rounded-[8px] bg-marine-dark/85 backdrop-blur-sm px-3 py-1.5 text-[10px] tracking-widest2 uppercase text-sand/85">
                  Landmark Village · Port Harcourt
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-ink mb-2">
        {label}
      </span>
      {children}
    </label>
  )
}

function InfoRow({ Icon, label, value, href }) {
  const content = (
    <>
      <span className="h-11 w-11 shrink-0 rounded-full border border-ink/15 bg-white/60 flex items-center justify-center text-orange-dark">
        <Icon size={18} strokeWidth={1.5} />
      </span>
      <div>
        <p className="text-ink text-sm font-medium mb-1">{label}</p>
        <p className="text-ink/70 text-sm leading-relaxed break-all">{value}</p>
      </div>
    </>
  )
  if (href) {
    return (
      <li>
        <a
          href={href}
          className="flex items-start gap-4 group hover:text-orange-dark transition-colors"
        >
          {content}
        </a>
      </li>
    )
  }
  return <li className="flex items-start gap-4">{content}</li>
}
