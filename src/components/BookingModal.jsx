import { useEffect, useRef, useState } from 'react'
import { X, Phone, Mail, MapPin, Check } from 'lucide-react'
import { useContent } from '../lib/content'

/**
 * Right-sliding overlay for quick booking / enquiries. Anyone can open it by
 * dispatching a `landmark:open-booking` window event (optionally with an
 * `intent` string in event.detail to pre-select the reason).
 *
 * Uses <dialog> semantics for keyboard/accessibility but implements the
 * slide-from-right behaviour manually so we control transitions.
 */
const INTENTS = [
  { key: 'table', label: 'Table booking' },
  { key: 'rooms', label: 'Rooms & stays' },
  { key: 'group', label: 'Group visit' },
  { key: 'membership', label: 'Membership' },
  { key: 'walkthrough', label: 'Flagship walkthrough' },
  { key: 'other', label: 'Something else' },
]

export default function BookingModal() {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [intent, setIntent] = useState('table')
  const [guests, setGuests] = useState(2)
  const closeBtnRef = useRef(null)
  const settings = useContent('siteSettings')
  const contact = settings.contact || {}

  useEffect(() => {
    const onOpen = (e) => {
      // Allow callers to pre-select an intent: openBookingModal('rooms')
      const requested = e?.detail?.intent
      if (requested && INTENTS.some((i) => i.key === requested)) {
        setIntent(requested)
      }
      setOpen(true)
    }
    window.addEventListener('landmark:open-booking', onOpen)
    return () => window.removeEventListener('landmark:open-booking', onOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    // Prevent background scroll when the modal is up.
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Focus the close button so keyboard users have a clear anchor.
    closeBtnRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const activeIntentLabel =
    INTENTS.find((i) => i.key === intent)?.label || 'Something else'

  return (
    <>
      {/* Scrim */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[90] bg-ink/60 backdrop-blur-sm transition-opacity duration-500 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Plan a visit"
        aria-hidden={!open}
        className={`fixed top-0 right-0 h-full w-full max-w-md md:max-w-lg z-[95] bg-sand text-ink shadow-2xl shadow-ink/40 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <header className="flex items-center justify-between px-6 md:px-10 pt-8 pb-6 border-b border-ink/10">
            <div>
              <p className="text-orange-dark text-[11px] tracking-widest2 uppercase">
                Plan a Visit
              </p>
              <p className="font-display italic text-ink/60 text-sm mt-1">
                {activeIntentLabel}
              </p>
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="text-ink/70 hover:text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark rounded-full"
            >
              <X size={22} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8">
            {submitted ? (
              <div className="h-full flex flex-col justify-center text-center">
                <div className="mx-auto w-16 h-16 rounded-full border border-orange-dark/40 flex items-center justify-center mb-6">
                  <Check size={26} className="text-orange-dark" />
                </div>
                <p className="font-display text-3xl md:text-4xl mb-3">Thank you.</p>
                <p className="text-ink/70 text-sm max-w-xs mx-auto mb-2">
                  We've logged your enquiry for <span className="italic">{activeIntentLabel.toLowerCase()}</span>.
                </p>
                <p className="text-ink/60 text-xs max-w-xs mx-auto">
                  Someone from the concierge team will reach out within 24 hours to confirm.
                </p>
                <div className="mt-8 flex flex-col gap-3 items-center">
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-xs tracking-widest2 uppercase text-orange-dark hover:text-orange transition-colors"
                  >
                    Send another enquiry
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false)
                      setTimeout(() => setSubmitted(false), 500)
                    }}
                    className="text-xs tracking-widest2 uppercase text-ink/50 hover:text-ink transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="font-display text-3xl md:text-4xl leading-[1.05] mb-3">
                  Come see us.
                </h2>
                <p className="text-ink/70 text-sm leading-relaxed mb-8 max-w-xs">
                  Walk-ins are welcome across the grounds. Tell us what you're
                  planning and we'll match you with the right host.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Intent chips — qualify the enquiry up front so the
                      concierge team can route it without a back-and-forth. */}
                  <fieldset>
                    <legend className="text-[10px] tracking-widest2 uppercase text-ink/60 mb-3">
                      I'm here for
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {INTENTS.map((i) => {
                        const active = intent === i.key
                        return (
                          <button
                            key={i.key}
                            type="button"
                            onClick={() => setIntent(i.key)}
                            aria-pressed={active}
                            className={`px-3 py-1.5 text-[11px] tracking-widest2 uppercase border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark ${
                              active
                                ? 'bg-orange-dark text-sand border-orange-dark'
                                : 'text-ink/70 border-ink/25 hover:border-orange-dark hover:text-orange-dark'
                            }`}
                          >
                            {i.label}
                          </button>
                        )
                      })}
                    </div>
                  </fieldset>

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

                  {/* Date + guests row */}
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="block text-[10px] tracking-widest2 uppercase text-ink/60 mb-2">
                        Preferred date
                      </span>
                      <input
                        type="date"
                        className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-2 text-sm transition-colors"
                      />
                    </label>
                    <label className="block">
                      <span className="block text-[10px] tracking-widest2 uppercase text-ink/60 mb-2">
                        Guests
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setGuests((g) => Math.max(1, g - 1))}
                          aria-label="Fewer guests"
                          className="h-8 w-8 border border-ink/25 hover:border-orange-dark hover:text-orange-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
                        >
                          −
                        </button>
                        <span className="font-display italic text-lg tabular-nums w-6 text-center">
                          {guests}
                        </span>
                        <button
                          type="button"
                          onClick={() => setGuests((g) => Math.min(20, g + 1))}
                          aria-label="More guests"
                          className="h-8 w-8 border border-ink/25 hover:border-orange-dark hover:text-orange-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
                        >
                          +
                        </button>
                      </div>
                    </label>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Anything we should know? (optional)"
                    className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-3 text-sm placeholder:text-ink/50 resize-none transition-colors"
                  />

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-orange-dark text-sand text-xs tracking-widest2 uppercase hover:bg-orange transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
                  >
                    Send Enquiry
                    <span aria-hidden="true">→</span>
                  </button>
                </form>

                {/* Direct-contact rail — for guests who'd rather call/mail. */}
                <div className="mt-10 pt-8 border-t border-ink/10">
                  <p className="text-[10px] tracking-widest2 uppercase text-ink/60 mb-4">
                    Or reach us directly
                  </p>
                  <ul className="space-y-3 text-sm text-ink/75">
                    {contact.phone && (
                      <li>
                        <a
                          href={`tel:${String(contact.phone).replace(/\s+/g, '')}`}
                          className="inline-flex items-center gap-3 hover:text-orange-dark transition-colors"
                        >
                          <Phone size={14} />
                          <span>{contact.phone}</span>
                        </a>
                      </li>
                    )}
                    {contact.email && (
                      <li>
                        <a
                          href={`mailto:${contact.email}`}
                          className="inline-flex items-center gap-3 hover:text-orange-dark transition-colors"
                        >
                          <Mail size={14} />
                          <span>{contact.email}</span>
                        </a>
                      </li>
                    )}
                    {contact.addressLines?.length > 0 && (
                      <li className="flex items-start gap-3">
                        <MapPin size={14} className="mt-0.5 shrink-0" />
                        <span>{contact.addressLines.join(', ')}</span>
                      </li>
                    )}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

/**
 * Trigger to open the booking modal from anywhere. Pass an optional intent
 * key ('table' | 'rooms' | 'group' | 'membership' | 'walkthrough' | 'other')
 * to pre-select the enquiry reason.
 *
 * Usage: import { openBookingModal } from './BookingModal'
 *        openBookingModal('rooms')
 */
export function openBookingModal(intent) {
  window.dispatchEvent(
    new CustomEvent('landmark:open-booking', { detail: { intent } })
  )
}
