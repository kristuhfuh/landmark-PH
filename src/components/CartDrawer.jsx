import { useEffect, useMemo, useRef, useState } from 'react'
import { X, Trash2, Check, ArrowRight, ShoppingBag } from 'lucide-react'
import { useCart, formatNaira } from '../lib/cart'
import { useContent } from '../lib/content'

/**
 * Right-sliding cart drawer with three states:
 *   1. cart    — line items + qty steppers + subtotal + "Continue to checkout"
 *   2. checkout — contact + preferred date + notes
 *   3. done    — confirmation with reference number
 *
 * Reads item details from tickets.items in content.json so cards always
 * render the current name/price rather than a stale snapshot from when the
 * item was added.
 */
export default function CartDrawer() {
  const { items, setQuantity, removeItem, clear, open, setOpen } = useCart()
  const [step, setStep] = useState('cart') // 'cart' | 'checkout' | 'done'
  const [reference, setReference] = useState(null)
  const closeBtnRef = useRef(null)
  const tickets = useContent('tickets')

  // Build a lookup so we don't scan the catalog per line-item render.
  const catalog = useMemo(() => {
    const map = {}
    for (const t of tickets.items || []) map[t.id] = t
    return map
  }, [tickets.items])

  const lines = useMemo(
    () =>
      items
        .map((i) => {
          const t = catalog[i.id]
          if (!t) return null
          const unit = Number(t.priceNGN) || 0
          return {
            id: i.id,
            name: t.name,
            tag: t.tag,
            unit,
            quantity: i.quantity,
            subtotal: unit * i.quantity,
          }
        })
        .filter(Boolean),
    [items, catalog]
  )

  const subtotal = lines.reduce((s, l) => s + l.subtotal, 0)
  const totalCount = lines.reduce((s, l) => s + l.quantity, 0)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeBtnRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, setOpen])

  // When the cart empties while the drawer is on the checkout step, snap
  // back to cart view so the user isn't stuck on a form with no items.
  useEffect(() => {
    if (lines.length === 0 && step === 'checkout') setStep('cart')
  }, [lines.length, step])

  const handleCheckoutSubmit = (e) => {
    e.preventDefault()
    // Generate a short readable reference for the confirmation card.
    setReference(
      'LMK-' +
        Math.random().toString(36).slice(2, 6).toUpperCase() +
        '-' +
        Date.now().toString(36).slice(-4).toUpperCase()
    )
    setStep('done')
    clear()
  }

  return (
    <>
      {/* Scrim */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[92] bg-ink/60 backdrop-blur-sm transition-opacity duration-500 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        aria-hidden={!open}
        className={`fixed top-0 right-0 h-full w-full max-w-md md:max-w-lg z-[96] bg-sand text-ink shadow-2xl shadow-ink/40 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <header className="flex items-center justify-between px-6 md:px-10 pt-8 pb-6 border-b border-ink/10">
            <div>
              <p className="text-orange-dark text-[11px] tracking-widest2 uppercase">
                {step === 'done' ? 'Thank you' : step === 'checkout' ? 'Checkout' : 'Your cart'}
              </p>
              <p className="font-display italic text-ink/60 text-sm mt-1">
                {step === 'done'
                  ? 'Enquiry received'
                  : totalCount === 0
                  ? 'Empty'
                  : `${totalCount} ${totalCount === 1 ? 'item' : 'items'}`}
              </p>
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close cart"
              className="text-ink/70 hover:text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark rounded-full"
            >
              <X size={22} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-6 md:px-10 py-6">
            {step === 'cart' && (
              <CartView
                lines={lines}
                subtotal={subtotal}
                setQuantity={setQuantity}
                removeItem={removeItem}
                onContinue={() => setStep('checkout')}
              />
            )}
            {step === 'checkout' && (
              <CheckoutView
                lines={lines}
                subtotal={subtotal}
                onBack={() => setStep('cart')}
                onSubmit={handleCheckoutSubmit}
              />
            )}
            {step === 'done' && (
              <DoneView
                reference={reference}
                onClose={() => {
                  setOpen(false)
                  setTimeout(() => setStep('cart'), 500)
                }}
              />
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

function CartView({ lines, subtotal, setQuantity, removeItem, onContinue }) {
  if (lines.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center py-20">
        <ShoppingBag size={36} className="text-ink/30 mb-4" strokeWidth={1.5} />
        <p className="font-display italic text-2xl text-ink/70 mb-2">
          Cart's empty.
        </p>
        <p className="text-ink/50 text-sm max-w-xs">
          Browse tickets and packages on the page — hit "Add" and they'll land
          here.
        </p>
      </div>
    )
  }

  return (
    <>
      <ul className="divide-y divide-ink/10">
        {lines.map((l) => (
          <li key={l.id} className="py-5 first:pt-0">
            {l.tag && (
              <p className="text-[10px] tracking-widest2 uppercase text-orange-dark mb-1">
                {l.tag}
              </p>
            )}
            <div className="flex items-baseline justify-between gap-3 mb-2">
              <h3 className="font-display text-lg md:text-xl leading-tight pr-2">
                {l.name}
              </h3>
              <button
                type="button"
                onClick={() => removeItem(l.id)}
                aria-label={`Remove ${l.name}`}
                className="text-ink/40 hover:text-orange-dark transition-colors"
              >
                <Trash2 size={14} strokeWidth={1.75} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="inline-flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Decrease"
                  onClick={() => setQuantity(l.id, Math.max(1, l.quantity - 1))}
                  className="h-8 w-8 border border-ink/25 text-ink hover:border-orange-dark hover:text-orange-dark transition-colors inline-flex items-center justify-center"
                >
                  −
                </button>
                <span className="font-display italic tabular-nums text-lg w-6 text-center">
                  {l.quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase"
                  onClick={() => setQuantity(l.id, Math.min(20, l.quantity + 1))}
                  className="h-8 w-8 border border-ink/25 text-ink hover:border-orange-dark hover:text-orange-dark transition-colors inline-flex items-center justify-center"
                >
                  +
                </button>
              </div>
              <div className="text-right">
                <p className="text-ink/55 text-[11px] tracking-wide">
                  {formatNaira(l.unit)} each
                </p>
                <p className="font-display italic text-marine text-xl leading-none">
                  {formatNaira(l.subtotal)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t border-ink/10 mt-4 pt-6">
        <div className="flex items-baseline justify-between mb-6">
          <span className="text-[11px] tracking-widest2 uppercase text-ink/60">
            Subtotal
          </span>
          <span className="font-display italic text-marine text-3xl md:text-4xl leading-none">
            {formatNaira(subtotal)}
          </span>
        </div>
        <button
          type="button"
          onClick={onContinue}
          className="w-full inline-flex items-center justify-center gap-3 py-4 bg-orange-dark text-sand text-xs tracking-widest2 uppercase hover:bg-orange transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
        >
          Continue to checkout
          <ArrowRight size={16} />
        </button>
        <p className="mt-3 text-center text-ink/50 text-[11px]">
          Availability confirmed by email · Payment link sent after
        </p>
      </div>
    </>
  )
}

function CheckoutView({ lines, subtotal, onBack, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs tracking-widest2 uppercase text-ink/60 hover:text-orange-dark transition-colors"
        >
          ← Back to cart
        </button>
      </div>

      <input
        required
        type="text"
        placeholder="Full name"
        className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-3 text-sm placeholder:text-ink/50 transition-colors"
      />
      <input
        required
        type="email"
        placeholder="Email"
        className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-3 text-sm placeholder:text-ink/50 transition-colors"
      />
      <input
        required
        type="tel"
        placeholder="Phone (WhatsApp welcome)"
        className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-3 text-sm placeholder:text-ink/50 transition-colors"
      />
      <label className="block">
        <span className="block text-[10px] tracking-widest2 uppercase text-ink/60 mb-2">
          Preferred date
        </span>
        <input
          required
          type="date"
          className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-2 text-sm transition-colors"
        />
      </label>
      <textarea
        rows={3}
        placeholder="Notes for our team (optional)"
        className="w-full bg-transparent border-b border-ink/30 focus:border-orange-dark outline-none py-3 text-sm placeholder:text-ink/50 resize-none transition-colors"
      />

      {/* Order summary — compact reminder of what's being purchased. */}
      <div className="border border-ink/10 bg-white/50 p-5">
        <p className="text-[10px] tracking-widest2 uppercase text-ink/60 mb-3">
          Order summary
        </p>
        <ul className="space-y-2 mb-4">
          {lines.map((l) => (
            <li
              key={l.id}
              className="flex items-baseline justify-between text-sm"
            >
              <span className="text-ink/80">
                <span className="text-ink/50 tabular-nums mr-2">{l.quantity}×</span>
                {l.name}
              </span>
              <span className="font-display italic text-marine">
                {formatNaira(l.subtotal)}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex items-baseline justify-between border-t border-ink/10 pt-3">
          <span className="text-[11px] tracking-widest2 uppercase text-ink/60">
            Subtotal
          </span>
          <span className="font-display italic text-marine text-2xl leading-none">
            {formatNaira(subtotal)}
          </span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-3 py-4 bg-orange-dark text-sand text-xs tracking-widest2 uppercase hover:bg-orange transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
      >
        Send booking request
        <ArrowRight size={16} />
      </button>
      <p className="text-center text-ink/50 text-[11px] leading-relaxed">
        We'll confirm availability within a few hours and send a secure payment
        link. No card charged until you confirm.
      </p>
    </form>
  )
}

function DoneView({ reference, onClose }) {
  return (
    <div className="h-full flex flex-col justify-center text-center py-10">
      <div className="mx-auto w-16 h-16 rounded-full border border-orange-dark/40 flex items-center justify-center mb-6">
        <Check size={26} className="text-orange-dark" />
      </div>
      <p className="font-display text-3xl md:text-4xl mb-3">Thank you.</p>
      <p className="text-ink/70 text-sm max-w-xs mx-auto mb-6">
        Your booking request is with our concierge team. You'll get an email
        within a few hours with a payment link and availability confirmation.
      </p>
      {reference && (
        <div className="inline-block mx-auto border border-ink/15 px-4 py-3">
          <p className="text-[10px] tracking-widest2 uppercase text-ink/55 mb-1">
            Reference
          </p>
          <p className="font-display italic text-marine text-xl tabular-nums">
            {reference}
          </p>
        </div>
      )}
      <button
        type="button"
        onClick={onClose}
        className="mt-8 text-xs tracking-widest2 uppercase text-orange-dark hover:text-orange transition-colors"
      >
        Close
      </button>
    </div>
  )
}
