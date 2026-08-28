import { useEffect, useRef, useState } from 'react'
import { useContent } from '../lib/content'

/**
 * Editorial curtain preloader. On first load a full-viewport sand panel
 * covers the site with the brand mark and a 0→100 counter running along the
 * bottom. Once assets finish loading (or the min hold time elapses,
 * whichever is later), the panel splits at the middle horizontal seam and
 * slides apart — top half up, bottom half down — revealing the hero.
 *
 * Design notes:
 * - Only shows once per session (sessionStorage) so return visitors don't
 *   sit through it again.
 * - Locks body scroll while active.
 * - Honors prefers-reduced-motion: fades out instantly without the split.
 */
const SESSION_KEY = 'landmark:seen-preloader'
const MIN_HOLD_MS = 1400 // baseline visible time even on fast connections

export default function CurtainPreloader() {
  const settings = useContent('siteSettings')
  const brand = settings.brand || 'Landmark'
  const brandSuffix = settings.brandSuffix || 'Port Harcourt'

  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return 'hidden'
    return sessionStorage.getItem(SESSION_KEY) ? 'hidden' : 'active'
  })
  const [progress, setProgress] = useState(0)
  const rafRef = useRef(0)

  useEffect(() => {
    if (state === 'hidden') return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Lock scroll behind the curtain.
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const start = performance.now()
    const done = () => {
      const elapsed = performance.now() - start
      const wait = Math.max(0, MIN_HOLD_MS - elapsed)
      window.setTimeout(() => {
        setProgress(100)
        // Trigger the exit — extra hold so the "100" reads for a beat before
        // the split fires.
        window.setTimeout(() => setState('exiting'), reduced ? 40 : 240)
        // Full removal after the CSS transition finishes.
        window.setTimeout(
          () => {
            setState('hidden')
            sessionStorage.setItem(SESSION_KEY, '1')
            document.body.style.overflow = prevOverflow
          },
          reduced ? 260 : 1360
        )
      }, wait)
    }

    // Smooth 0→95 counter (last 5 held for the completion beat).
    const tick = (now) => {
      const t = Math.min(1, (now - start) / MIN_HOLD_MS)
      // Ease-out so the counter feels weighted, not linear.
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(Math.floor(eased * 95))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    if (document.readyState === 'complete') {
      done()
    } else {
      window.addEventListener('load', done, { once: true })
    }

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('load', done)
      document.body.style.overflow = prevOverflow
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (state === 'hidden') return null

  const exiting = state === 'exiting'

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[120] pointer-events-none"
    >
      {/* Top half — slides up on exit */}
      <div
        className={`absolute top-0 inset-x-0 h-1/2 bg-sand overflow-hidden transition-transform duration-[1100ms] ease-[cubic-bezier(0.85,0,0.15,1)] ${
          exiting ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        {/* The brand sits centered relative to the *whole* viewport, so the
            wordmark straddles the seam and appears to tear apart as the two
            halves separate. */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 translate-y-[50vh] flex items-center justify-center">
          <BrandMark brand={brand} brandSuffix={brandSuffix} exiting={exiting} />
        </div>
      </div>

      {/* Bottom half — slides down on exit */}
      <div
        className={`absolute bottom-0 inset-x-0 h-1/2 bg-sand overflow-hidden transition-transform duration-[1100ms] ease-[cubic-bezier(0.85,0,0.15,1)] ${
          exiting ? 'translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="absolute inset-x-0 bottom-1/2 translate-y-1/2 -translate-y-[50vh] flex items-center justify-center">
          <BrandMark brand={brand} brandSuffix={brandSuffix} exiting={exiting} />
        </div>

        {/* Counter + hairline sit in the bottom quarter of the lower panel,
            so they read as loading chrome distinct from the brand. */}
        <div
          className={`absolute bottom-8 md:bottom-12 inset-x-0 flex items-center justify-between px-8 md:px-14 text-marine-dark transition-opacity duration-300 ${
            exiting ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <span className="text-[10px] tracking-widest2 uppercase">Loading</span>
          <div className="flex-1 mx-8 h-px bg-marine-dark/15 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-orange-dark transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-display italic text-marine-dark text-lg tabular-nums w-10 text-right">
            {String(progress).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  )
}

function BrandMark({ brand, brandSuffix, exiting }) {
  return (
    <div
      className={`text-center transition-opacity duration-500 ${
        exiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <p className="text-orange-dark text-[10px] tracking-widest2 uppercase mb-4">
        Est. Landmark Group
      </p>
      <h1
        className="font-display text-marine-dark leading-none tracking-tight"
        style={{ fontSize: 'clamp(3rem, 10vw, 8rem)' }}
      >
        {brand}
      </h1>
      <p className="mt-4 font-display italic text-marine-dark/70 text-lg md:text-xl">
        {brandSuffix}
      </p>
    </div>
  )
}
