import { useState } from 'react'
import { Instagram, Facebook, Youtube, Linkedin, ArrowRight, Check, Phone, Mail } from 'lucide-react'
import { useContent } from '../lib/content'

const EXPLORE_LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'About Us', href: '#the-concept' },
  { label: 'Rooms', href: '#rooms' },
  { label: 'Blog', href: '#' },
  { label: 'Gallery', href: '#the-green' },
]

const EXPERIENCES_LINKS = [
  { label: 'Things to Do', href: '/things-to-do' },
  { label: 'Entry tickets', href: '/bookings/entry' },
  { label: 'Packages', href: '/bookings/packages' },
  { label: 'Group booking', href: '/bookings/group' },
  { label: 'Reserve Room', href: '/bookings/rooms' },
  { label: 'Book Day Pass', href: '/bookings/daypass' },
  { label: 'Book Walkthrough', href: '/bookings/walkthrough' },
  { label: 'Contact', href: '/contact' },
]

const LANDMARK_LINKS = [
  { label: 'Landmark Nike Lake Resort', href: '#' },
  { label: 'Landmark Upside Down House', href: '#the-flagship' },
  { label: 'Landmark Hotel', href: '#' },
  { label: 'Landmark Africa', href: '#' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms and Conditions', href: '#' },
  { label: 'Cookie Policy', href: '#' },
]

const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#', Icon: Instagram },
  { label: 'Facebook', href: '#', Icon: Facebook },
  { label: 'YouTube', href: '#', Icon: Youtube },
  { label: 'LinkedIn', href: '#', Icon: Linkedin },
]

export default function Footer() {
  const settings = useContent('siteSettings')
  const brand = settings.brand || 'Landmark'
  const brandSuffix = settings.brandSuffix || 'Port Harcourt'
  const contact = settings.contact || {}
  const phone = contact.phone || '+234 000 000 0000'
  const contactEmail = contact.email || 'hello@landmark-portharcourt.ng'
  const address = contact.addressLines?.length ? contact.addressLines : ['Landmark Village', 'Port Harcourt', 'Rivers State, Nigeria']
  const hours = contact.hoursLines?.length ? contact.hoursLines : ['Sun – Thu · 10am – 11pm', 'Fri – Sat · 10am – 1am']
  const [email, setEmail] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(e) {
    e.preventDefault()
    // Wire up to a real endpoint later.
    setSubscribed(true)
    setEmail('')
    setAccepted(false)
    // Auto-reset the success state after a moment so the form is usable again.
    setTimeout(() => setSubscribed(false), 6000)
  }

  return (
    <footer className="bg-sand text-marine-dark">
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-10">
        <div className="grid md:grid-cols-12 gap-10 md:gap-14">
          {/* Brand + description + subscribe */}
          <div className="md:col-span-5">
            <div className="inline-block mb-6">
              <div className="font-display text-3xl font-medium tracking-wide leading-none">
                {brand.toUpperCase()}
              </div>
              <div className="mt-2 pt-2 border-t border-marine-dark/30 text-[10px] tracking-widest2 uppercase">
                {brandSuffix}
              </div>
            </div>

            <p className="text-sm leading-relaxed text-marine-dark/85 mb-8 max-w-xs">
              Discover premium hospitality, comfortable stays, exciting
              experiences, and memorable moments at {brand} {brandSuffix}.
            </p>

            {subscribed ? (
              <div className="max-w-md rounded-2xl border border-marine-dark/15 bg-white/60 px-5 py-4 flex items-start gap-3 text-sm text-marine-dark">
                <span className="mt-0.5 h-6 w-6 rounded-full border border-marine-dark/20 flex items-center justify-center shrink-0">
                  <Check size={14} className="text-orange-dark" />
                </span>
                <div>
                  <p className="font-display text-base leading-tight mb-1">
                    You're on the list.
                  </p>
                  <p className="text-marine-dark/70 text-xs leading-relaxed">
                    A short monthly note — new dinners at The Jetty, concert
                    line-ups, and members-only weekends. Nothing in between.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <label className="flex items-center gap-2 text-sm text-marine-dark/85 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="h-4 w-4 accent-orange border border-marine-dark/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
                  />
                  <span>
                    I accept the{' '}
                    <a href="#" className="underline underline-offset-2">
                      Privacy Policy
                    </a>
                  </span>
                </label>

                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-2 max-w-md rounded-2xl sm:rounded-full border border-marine-dark/20 bg-sand p-2"
                >
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Email address"
                    autoComplete="email"
                    className="min-w-0 flex-1 rounded-full px-4 py-3 bg-transparent text-sm text-marine-dark placeholder:text-marine-dark/40 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!accepted}
                    className="min-h-11 rounded-full px-5 py-3 bg-marine-dark text-sand text-sm font-medium hover:bg-marine transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
                  >
                    Subscribe
                    <ArrowRight size={14} />
                  </button>
                </form>
              </>
            )}

            {/* Socials — small, discreet, sits under the subscribe block. */}
            <ul className="mt-8 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="h-11 w-11 rounded-full border border-marine-dark/25 flex items-center justify-center text-marine-dark hover:border-orange-dark hover:text-orange-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
                  >
                    <Icon size={16} strokeWidth={1.5} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          <FooterColumn title="Explore" links={EXPLORE_LINKS} className="md:col-span-2 md:col-start-7" />
          <FooterColumn title="Experiences" links={EXPERIENCES_LINKS} className="md:col-span-2" />
          <FooterColumn title="Landmark" links={LANDMARK_LINKS} className="md:col-span-2" />
        </div>

        <dl aria-label="Contact information" className="mt-12 md:mt-16 grid gap-8 md:grid-cols-[1fr_1.4fr_1fr] md:gap-12 border-t border-marine-dark/15 pt-8 md:pt-10">
          <div className="min-w-0">
            <dt className="text-xs tracking-widest2 uppercase text-orange-dark mb-3">Address</dt>
            <dd className="text-sm leading-relaxed"><address className="not-italic">{address.map(line => <div key={line}>{line}</div>)}</address></dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs tracking-widest2 uppercase text-orange-dark mb-3">Direct</dt>
            <dd className="flex flex-col items-start gap-2 text-sm">
              <a href={`tel:${phone.replace(/\s+/g, '')}`} className="inline-flex min-h-11 items-center gap-3 hover:text-orange-dark transition-colors"><Phone size={16} strokeWidth={1.5} aria-hidden="true" className="shrink-0" /><span>{phone}</span></a>
              <a href={`mailto:${contactEmail}`} className="inline-flex min-h-11 max-w-full items-center gap-3 hover:text-orange-dark transition-colors"><Mail size={16} strokeWidth={1.5} aria-hidden="true" className="shrink-0" /><span className="min-w-0 break-words">{contactEmail}</span></a>
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs tracking-widest2 uppercase text-orange-dark mb-3">Hours</dt>
            <dd className="text-sm leading-relaxed space-y-1">{hours.map(line => <div key={line}>{line}</div>)}</dd>
          </div>
        </dl>
      </div>

      <div className="border-t border-marine-dark/15">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-marine-dark/85">
          <p>
            &copy;{new Date().getFullYear()} — Landmark Group. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6 md:gap-8">
            {LEGAL_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="underline underline-offset-2 hover:text-orange-dark transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Watermark: only the top 3/4 of the wordmark is visible; the bottom
          quarter clips at the footer's edge. Low-opacity marine so it reads
          as ambient background typography, not a heading. */}
      <div
        className="relative overflow-hidden"
        style={{ height: 'clamp(3.75rem, 16.5vw, 16.5rem)' }}
      >
        <h2
          aria-hidden="true"
          className="absolute top-0 inset-x-0 font-display font-light text-marine-dark/20 leading-none tracking-tight text-center select-none px-2"
          style={{ fontSize: 'clamp(5rem, 22vw, 22rem)' }}
        >
          {brand}
        </h2>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links, className = '' }) {
  return (
    <div className={className}>
      <h3 className="text-[13px] tracking-widest2 uppercase font-normal text-marine-dark/70 mb-5">
        {title}
      </h3>
      <ul className="space-y-3.5 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="text-marine-dark font-medium hover:text-orange-dark transition-colors"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
