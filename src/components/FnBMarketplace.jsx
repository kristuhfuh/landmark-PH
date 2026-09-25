import useRevealOnScroll from '../hooks/useRevealOnScroll'
import SplitHeading from './SplitHeading'
import RevealImage from './RevealImage'
import Media from './Media'
import { useContent } from '../lib/content'

/**
 * "At the Table" — the F&B lineup. Each vendor slot is a numbered editorial
 * card with a status pill (Confirmed / In talks / Slot open). This keeps the
 * unfinished slots honest while still reading as an intentional curation.
 */

const STATUS_STYLES = {
  Confirmed: 'bg-orange-dark text-sand',
  'In talks': 'border border-orange-dark/50 text-orange-dark',
  'Slot open': 'border border-ink/25 text-ink/60',
}

function inferStatus(v) {
  if (v.status) return v.status
  if (v.kind === 'Anchor' || /confirm(ed)?$/i.test(v.kind || '')) return 'Confirmed'
  if (/talks|discussion|shortlist/i.test((v.body || '') + (v.kind || ''))) return 'In talks'
  if (/to confirm|reserved|open|tba|tbd/i.test(v.name || '') || !v.name) return 'Slot open'
  return 'In talks'
}

export default function FnBMarketplace() {
  const ref = useRevealOnScroll({ stagger: 0.08 })
  const fnb = useContent('fnbMarketplace')

  const eyebrow = fnb.eyebrow || 'At the Table'
  const heading = fnb.heading || 'A curated line-up,'
  const headingItalic = fnb.headingItalic || 'not a food court.'
  const body =
    fnb.body ||
    'One seafood house is confirmed. The remaining vendor slots are held open — each will carry a single, distinct kitchen rather than a repeated format.'
  const vendors = fnb.vendors || []

  return (
    <section id="table" ref={ref} className="bg-sand text-ink py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-14 items-start">
        <div className="md:col-span-5 md:sticky md:top-24">
          <RevealImage direction="left" className="reveal h-80 md:h-[35rem] mb-8">
            <Media
              src={fnb.imageUrl || 'https://images.unsplash.com/photo-1531419925964-8c2e4bc58e63?auto=format&fit=crop&w=1400&q=80'}
              alt="White dining tables set outdoors"
              className="h-full w-full object-cover"
            />
          </RevealImage>
          <p className="reveal text-orange-dark text-xs tracking-widest2 uppercase mb-4">
            {eyebrow}
          </p>
          <SplitHeading className="font-display text-3xl md:text-5xl mb-6">
            {heading} <span className="italic text-marine">{headingItalic}</span>
          </SplitHeading>
          <p className="reveal text-ink/70 leading-relaxed max-w-md whitespace-pre-line">
            {body}
          </p>
        </div>

        <ol className="md:col-span-7 space-y-6">
          {vendors.map((v, i) => {
            const status = inferStatus(v)
            const isOpen = status === 'Slot open'
            const name = isOpen ? 'Slot held open' : v.name
            return (
              <li
                key={i}
                className="reveal group relative border-t border-ink/15 pt-6 md:pt-8"
              >
                <div className="flex items-start gap-6 md:gap-10">
                  <span className="font-display italic text-orange-dark text-sm tabular-nums pt-1 w-8 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
                      <h3
                        className={`font-display text-2xl md:text-3xl leading-tight ${
                          isOpen ? 'italic text-ink/50' : 'text-ink'
                        }`}
                      >
                        {name}
                      </h3>
                      <span
                        className={`text-[10px] tracking-widest2 uppercase px-3 py-1 shrink-0 ${
                          STATUS_STYLES[status] || STATUS_STYLES['In talks']
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                    {v.kind && !isOpen && (
                      <p className="text-orange-dark text-xs tracking-widest2 uppercase mb-2">
                        {v.kind}
                      </p>
                    )}
                    <p className="text-ink/70 text-sm md:text-base leading-relaxed max-w-md">
                      {v.body ||
                        (isOpen
                          ? 'A single, distinct kitchen — partner not named yet.'
                          : '')}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
