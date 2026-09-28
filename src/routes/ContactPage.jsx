import { useEffect, useState } from 'react'
import { Phone, Mail, MapPin, Check, Instagram, Facebook, Youtube, Linkedin } from 'lucide-react'
import PageNav from '../components/PageNav'
import Footer from '../components/Footer'
import { useContent } from '../lib/content'

const SOCIALS = [
  { label: 'Instagram', href: '#', Icon: Instagram },
  { label: 'Facebook', href: '#', Icon: Facebook },
  { label: 'YouTube', href: '#', Icon: Youtube },
  { label: 'LinkedIn', href: '#', Icon: Linkedin },
]

const REASONS = [
  { key: 'general', label: 'General enquiry' },
  { key: 'press', label: 'Press & media' },
  { key: 'careers', label: 'Careers' },
  { key: 'partners', label: 'Partnerships' },
  { key: 'membership', label: 'Membership' },
]

export default function ContactPage() {
  const settings = useContent('siteSettings')
  const brand = settings.brand || 'Landmark'
  const contact = settings.contact || {}
  const [reason, setReason] = useState('general')
  const [submitted, setSubmitted] = useState(false)

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
          <p className="inline-flex items-center gap-4 text-orange-dark text-xs tracking-widest2 uppercase mb-10">
            <span className="font-display italic text-orange-dark/90 text-base tabular-nums">
              00
            </span>
            <span aria-hidden="true" className="h-px w-10 bg-orange-dark/50" />
            Contact
          </p>

          <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-end">
            <div className="md:col-span-7">
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
                a note and we'll come back within 24 hours.
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

      {/* Form + info */}
      <section className="border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-24 grid md:grid-cols-12 gap-14">
          {/* Form */}
          <div className="md:col-span-7">
            <p className="text-orange-dark text-[11px] tracking-widest2 uppercase mb-4">
              01 · Send us a note
            </p>
            <h2 className="font-display text-3xl md:text-4xl leading-tight text-marine mb-10">
              Tell us what you're{' '}
              <span className="italic">planning.</span>
            </h2>

            {submitted ? (
              <div className="border border-orange-dark/30 bg-white/60 px-6 py-8">
                <div className="w-14 h-14 rounded-full border border-orange-dark/40 flex items-center justify-center mb-5">
                  <Check size={22} className="text-orange-dark" />
                </div>
                <p className="font-display text-3xl mb-3 text-ink">
                  Thank you.
                </p>
                <p className="text-ink/70 text-sm max-w-sm leading-relaxed">
                  We've logged your{' '}
                  <span className="italic">{activeLabel?.toLowerCase()}</span>{' '}
                  and someone from the team will reach out within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-[11px] tracking-widest2 uppercase text-orange-dark hover:text-ink transition-colors"
                >
                  Send another →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 max-w-xl">
                <fieldset>
                  <legend className="text-[10px] tracking-widest2 uppercase text-ink/60 mb-3">
                    Reason for contact
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {REASONS.map((r) => {
                      const active = reason === r.key
                      return (
                        <button
                          key={r.key}
                          type="button"
                          onClick={() => setReason(r.key)}
                          aria-pressed={active}
                          className={`px-3 py-1.5 text-[11px] tracking-widest2 uppercase border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark ${
                            active
                              ? 'bg-orange-dark text-sand border-orange-dark'
                              : 'text-ink/70 border-ink/25 hover:border-orange-dark hover:text-orange-dark'
                          }`}
                        >
                          {r.label}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>

                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    required
                    type="text"
                    placeholder="First name"
                    className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-3 text-sm placeholder:text-ink/50 transition-colors"
                  />
                  <input
                    required
                    type="text"
                    placeholder="Last name"
                    className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-3 text-sm placeholder:text-ink/50 transition-colors"
                  />
                </div>

                <input
                  required
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-3 text-sm placeholder:text-ink/50 transition-colors"
                />

                <input
                  type="tel"
                  placeholder="Phone (WhatsApp welcome)"
                  className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-3 text-sm placeholder:text-ink/50 transition-colors"
                />

                <textarea
                  required
                  rows={5}
                  placeholder="Your message"
                  className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-3 text-sm placeholder:text-ink/50 resize-none transition-colors"
                />

                <button
                  type="submit"
                  className="inline-flex items-center gap-3 bg-orange-dark text-sand px-8 py-4 text-xs tracking-widest2 uppercase hover:bg-orange transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
                >
                  Send message
                  <span aria-hidden="true">→</span>
                </button>

                <p className="text-ink/55 text-xs">
                  We reply within 24 hours.
                </p>
              </form>
            )}
          </div>

          {/* Info rail */}
          <aside className="md:col-span-5 md:pl-10 md:border-l md:border-ink/10">
            <p className="text-orange-dark text-[11px] tracking-widest2 uppercase mb-4">
              02 · Direct
            </p>
            <h2 className="font-display text-3xl md:text-4xl leading-tight text-marine mb-10">
              Reach us any{' '}
              <span className="italic">time.</span>
            </h2>

            <ul className="space-y-8 text-ink/85">
              {contact.phone && (
                <li>
                  <p className="text-[10px] tracking-widest2 uppercase text-ink/55 mb-2">
                    Phone
                  </p>
                  <a
                    href={`tel:${String(contact.phone).replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-3 font-display text-2xl md:text-3xl text-marine hover:text-orange-dark transition-colors"
                  >
                    <Phone size={18} strokeWidth={1.5} />
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact.email && (
                <li>
                  <p className="text-[10px] tracking-widest2 uppercase text-ink/55 mb-2">
                    Email
                  </p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center gap-3 font-display italic text-xl md:text-2xl text-marine hover:text-orange-dark transition-colors break-all"
                  >
                    <Mail size={18} strokeWidth={1.5} />
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.addressLines?.length > 0 && (
                <li>
                  <p className="text-[10px] tracking-widest2 uppercase text-ink/55 mb-2">
                    Address
                  </p>
                  <p className="flex items-start gap-3 font-display text-xl md:text-2xl text-marine leading-tight">
                    <MapPin size={18} strokeWidth={1.5} className="mt-1 shrink-0" />
                    <span>
                      {contact.addressLines.map((line, i) => (
                        <span key={i} className="block">
                          {line}
                        </span>
                      ))}
                    </span>
                  </p>
                </li>
              )}
              {contact.hoursLines?.length > 0 && (
                <li>
                  <p className="text-[10px] tracking-widest2 uppercase text-ink/55 mb-2">
                    Hours
                  </p>
                  <ul className="space-y-1 font-display text-lg text-ink/80">
                    {contact.hoursLines.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </li>
              )}
            </ul>

            <div className="mt-10 pt-8 border-t border-ink/15">
              <p className="text-[10px] tracking-widest2 uppercase text-ink/55 mb-4">
                Follow along
              </p>
              <ul className="flex items-center gap-3">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      aria-label={label}
                      className="h-10 w-10 rounded-full border border-ink/25 flex items-center justify-center text-ink hover:border-orange-dark hover:text-orange-dark transition-colors"
                    >
                      <Icon size={16} strokeWidth={1.5} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="bg-marine-dark text-sand">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-24">
          <div className="grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-6">
              <p className="text-orange-light text-[11px] tracking-widest2 uppercase mb-6">
                03 · Find the grounds
              </p>
              <h2 className="font-display text-4xl md:text-5xl leading-tight">
                A short drive from central{' '}
                <span className="italic text-orange-light">Port Harcourt.</span>
              </h2>
              <p className="mt-6 text-sand/70 max-w-md leading-relaxed">
                Landmark Village, along the Rivers State shore. Signposted
                turn-in off the coastal road — parking on the ring side.
              </p>
              <p className="mt-6 font-display italic text-sand/80 text-lg">
                04.75° N · 07.00° E
              </p>
            </div>
            <div className="md:col-span-6">
              <div className="aspect-[4/3] w-full border border-sand/15 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_55%,rgba(244,124,11,0.25),transparent_60%)]" />
                <div className="absolute inset-0 [background:repeating-linear-gradient(45deg,transparent_0_18px,rgba(239,231,214,0.05)_18px_19px)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="relative flex h-4 w-4">
                    <span className="absolute inset-0 rounded-full bg-orange animate-ping opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-orange border-2 border-sand" />
                  </span>
                </div>
                <p className="absolute bottom-4 left-4 text-[10px] tracking-widest2 uppercase text-sand/70">
                  Landmark Village · Port Harcourt
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
