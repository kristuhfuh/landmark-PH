import { useMemo, useState } from 'react'
import { Check, Plus, Sparkles } from 'lucide-react'
import useRevealOnScroll from '../hooks/useRevealOnScroll'
import SplitHeading from './SplitHeading'
import { useContent } from '../lib/content'
import { useCart, formatNaira } from '../lib/cart'

/**
 * Tickets & Packages section — category-filtered product grid. Each item
 * card has a quantity stepper and an "Add" button that pushes the item
 * into the cart context (opens the cart drawer as a side-effect).
 */
export default function TicketsShop() {
  const ref = useRevealOnScroll({ stagger: 0.06 })
  const tickets = useContent('tickets')
  const { addItem } = useCart()

  const eyebrow = tickets.eyebrow || 'Tickets & Packages'
  const heading = tickets.heading || 'Visit us,'
  const italic = tickets.italic || 'your way.'
  const body =
    tickets.body ||
    'Buy in advance or add at the gate. Family packages held aside for weekends; day-passes to the beach club open daily.'
  const categories = tickets.categories || [
    { key: 'entry', label: 'Grounds entry' },
    { key: 'activity', label: 'Activity tickets' },
    { key: 'package', label: 'Packages' },
    { key: 'daypass', label: 'Beach club' },
  ]
  const items = tickets.items || []

  const [activeCategory, setActiveCategory] = useState(categories[0]?.key || 'entry')
  const filtered = useMemo(
    () => items.filter((i) => i.category === activeCategory),
    [items, activeCategory]
  )

  return (
    <section
      id="tickets"
      ref={ref}
      className="relative bg-sand text-ink py-24 md:py-32 px-6 md:px-10 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mb-14 md:mb-20">
          <p className="reveal inline-flex items-center gap-4 text-orange-dark text-xs tracking-widest2 uppercase mb-6">
            <span className="font-display italic text-orange-dark/90 text-base tabular-nums">07</span>
            <span aria-hidden="true" className="h-px w-8 bg-orange-dark/50" />
            {eyebrow}
          </p>
          <SplitHeading className="font-display text-4xl md:text-6xl mb-6 leading-[1.02]">
            {heading} <span className="italic text-marine">{italic}</span>
          </SplitHeading>
          <p className="reveal text-ink/70 leading-relaxed max-w-xl">{body}</p>
        </div>

        {/* Category tabs */}
        <div
          className="reveal flex flex-wrap gap-2 mb-10 border-b border-ink/15 pb-4"
          role="tablist"
          aria-label="Ticket categories"
        >
          {categories.map((c) => {
            const active = c.key === activeCategory
            const count = items.filter((i) => i.category === c.key).length
            return (
              <button
                key={c.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveCategory(c.key)}
                className={`inline-flex items-baseline gap-2 px-4 py-2 text-xs tracking-widest2 uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark ${
                  active
                    ? 'bg-marine-dark text-sand'
                    : 'text-ink/70 hover:text-orange-dark'
                }`}
              >
                {c.label}
                <span
                  className={`font-display italic tabular-nums text-sm ${
                    active ? 'text-orange-light' : 'text-ink/40'
                  }`}
                >
                  {String(count).padStart(2, '0')}
                </span>
              </button>
            )
          })}
        </div>

        {/* Product grid. `key` on the grid forces a remount whenever the
            active category changes, so each new card animates in via the
            fadeIn keyframe instead of inheriting a stuck opacity: 0 from
            a scroll-reveal trigger that already fired. */}
        <div
          key={activeCategory}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {filtered.length === 0 ? (
            <p className="col-span-full text-ink/55 text-sm italic">
              Nothing here yet — check another category.
            </p>
          ) : (
            filtered.map((item, i) => (
              <TicketCard
                key={item.id}
                item={item}
                index={i}
                onAdd={(qty) => addItem(item.id, qty)}
              />
            ))
          )}
        </div>

        <p className="reveal mt-12 text-ink/55 text-xs max-w-lg">
          Prices in Naira. Bookings confirmed by email — payment link sent after
          availability check. Children under 4 free with a paying adult.
        </p>
      </div>
    </section>
  )
}

function TicketCard({ item, index = 0, onAdd }) {
  const [qty, setQty] = useState(1)
  const featured = item.featured

  return (
    <article
      className={`group relative flex flex-col transition-all duration-500 hover:-translate-y-1 ${
        featured
          ? 'bg-marine-dark text-sand shadow-xl shadow-marine-dark/30 hover:shadow-2xl hover:shadow-marine-dark/40'
          : 'bg-sand text-ink shadow-md shadow-ink/10 hover:shadow-xl hover:shadow-ink/15'
      }`}
      style={{
        animation: `fadeIn 0.5s ${index * 60}ms ease-out backwards`,
      }}
    >
      {featured && (
        <span className="absolute -top-2.5 left-6 text-[10px] tracking-widest2 uppercase bg-orange text-marine-dark px-3 py-1.5 shadow-md shadow-marine-dark/40 z-10">
          Popular
        </span>
      )}

      {/* App-discount pill sits at the very top edge as a coloured band —
          reads as a promotional strap across the card, replacing the
          previous number + tag row. */}
      <div
        className={`px-6 md:px-7 py-2.5 border-b ${
          featured
            ? 'bg-orange/15 border-orange/25 text-orange-light'
            : 'bg-orange/10 border-orange/20 text-orange-dark'
        }`}
      >
        <p className="inline-flex items-center gap-2 text-[10px] tracking-widest2 uppercase">
          <Sparkles size={11} strokeWidth={2} />
          10% cheaper on the Citizen app
        </p>
      </div>

      <div className="p-6 md:p-8 flex-1 flex flex-col">
        {/* Price — the visual hero of the card. Big italic serif, vibrant
            main orange, with the unit as a small kicker on the right. */}
        <div className="flex items-baseline gap-2 mb-5">
          <span
            className={`font-display italic text-5xl md:text-6xl leading-[0.9] ${
              featured ? 'text-orange-light' : 'text-orange'
            }`}
          >
            {item.priceLabel || formatNaira(item.priceNGN)}
          </span>
          {item.priceUnit && (
            <span
              className={`text-xs tracking-wide ${
                featured ? 'text-sand/60' : 'text-ink/55'
              }`}
            >
              / {item.priceUnit}
            </span>
          )}
        </div>

        {/* Hairline separator to hand the eye off from price to name */}
        <span
          aria-hidden="true"
          className={`block h-px w-16 mb-5 ${
            featured ? 'bg-sand/30' : 'bg-ink/25'
          }`}
        />

        <h3
          className={`font-display leading-tight mb-4 ${
            featured ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
          }`}
        >
          {item.name}
        </h3>

        {item.body && (
          <p
            className={`text-sm leading-relaxed mb-6 ${
              featured ? 'text-sand/80' : 'text-ink/65'
            }`}
          >
            {item.body}
          </p>
        )}

        {item.includes?.length > 0 && (
          <div
            className={`mt-auto pt-5 border-t ${
              featured ? 'border-sand/15' : 'border-ink/10'
            }`}
          >
            <p
              className={`text-[10px] tracking-widest2 uppercase mb-3 ${
                featured ? 'text-orange-light' : 'text-orange-dark'
              }`}
            >
              What's included
            </p>
            <ul className="space-y-2">
              {item.includes.map((inc) => (
                <li
                  key={inc}
                  className={`flex items-start gap-2.5 text-xs md:text-sm ${
                    featured ? 'text-sand/85' : 'text-ink/75'
                  }`}
                >
                  <Check
                    size={13}
                    strokeWidth={2.5}
                    className={`mt-1 shrink-0 ${
                      featured ? 'text-orange-light' : 'text-orange'
                    }`}
                  />
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Add-to-cart bar */}
      <div
        className={`border-t p-4 flex items-center gap-3 ${
          featured ? 'border-sand/15 bg-ink/25' : 'border-ink/10 bg-white/70'
        }`}
      >
        <QtyStepper
          value={qty}
          onChange={setQty}
          tone={featured ? 'dark' : 'light'}
        />
        <button
          type="button"
          onClick={() => {
            onAdd(qty)
            setQty(1)
          }}
          className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-xs tracking-widest2 uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark ${
            featured
              ? 'bg-orange text-marine-dark hover:bg-orange-light'
              : 'bg-marine-dark text-sand hover:bg-orange hover:text-marine-dark'
          }`}
        >
          <Plus size={14} strokeWidth={2.5} />
          Add
        </button>
      </div>
    </article>
  )
}

function QtyStepper({ value, onChange, tone = 'light' }) {
  const btn =
    tone === 'dark'
      ? 'border-sand/25 text-sand hover:border-orange-light hover:text-orange-light'
      : 'border-ink/25 text-ink hover:border-orange-dark hover:text-orange-dark'
  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, value - 1))}
        className={`h-8 w-8 border inline-flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark ${btn}`}
      >
        −
      </button>
      <span
        className={`font-display italic w-6 text-center tabular-nums text-lg ${
          tone === 'dark' ? 'text-sand' : 'text-marine'
        }`}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(20, value + 1))}
        className={`h-8 w-8 border inline-flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark ${btn}`}
      >
        +
      </button>
    </div>
  )
}
