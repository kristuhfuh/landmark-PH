import { useState } from 'react'
import { Users, Tag } from 'lucide-react'
import useRevealOnScroll from '../hooks/useRevealOnScroll'
import Media from './Media'
import { useContent } from '../lib/content'

/**
 * Landmark Citizen — early-access section modelled directly on the Soonix
 * reference:
 *   rounded-square logo → sans-serif heading → subtitle → email pill with
 *   inline dark 'Join waitlist' button → avatar stack proof line →
 *   countdown row (DAYS / HOURS / MINUTES / SECONDS) → iPhone mockup with
 *   floating cards over it, set on a soft sand-to-marine-tint gradient.
 */

export default function CitizenApp() {
  const ref = useRevealOnScroll({ stagger: 0.06 })
  const app = useContent('citizenApp')
  const [logoFailed, setLogoFailed] = useState(false)

  const heading = app.heading || 'Get Exclusive Rewards with Landmark Citizen'
  const body =
    app.body ||
    "Download the Landmark Citizen app to unlock special perks, early access, and a personalized experience. Join our community and be the first to know about upcoming events and offers."
  const mockupImage = app.mockupImage || '/Mockup main.png'
  const appStoreLink = app.appStoreLink || '#'
  const playStoreLink = app.playStoreLink || '#'

  return (
    <section
      id="citizen-app"
      ref={ref}
      className="relative bg-sand text-ink pt-24 md:pt-32 pb-0 px-6 md:px-10 overflow-visible"
    >
      {/* Soft gradient wash that leads into the Rooms section's light blue
          — ramps sand -> sky so the colour swap feels like one surface. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgb(var(--c-sky) / 0.4) 55%, rgb(var(--c-sky) / 0.85) 100%)',
        }}
      />

      <div className="relative max-w-2xl mx-auto text-center">
        {/* Rounded-square app logo — three orange silhouettes on marine-dark.
            Tries /public/lca-logo.png first; falls back to an inline SVG
            that evokes the uploaded reference so the badge always renders. */}
        <div className="reveal flex justify-center mb-8">
          <div className="relative h-20 w-20 rounded-[18px] overflow-hidden shadow-[0_8px_24px_-6px_rgba(0,0,0,0.45)] bg-marine-dark">
            {logoFailed ? (
              <LcaLogo />
            ) : (
              <img
                src="/LCA Logo.png"
                alt="Landmark Citizen"
                className="absolute inset-0 h-full w-full object-cover"
                onError={() => setLogoFailed(true)}
              />
            )}
          </div>
        </div>

        {/* Big sans-serif heading */}
        <h2
          className="reveal font-body font-semibold tracking-tight text-ink leading-[1.05] mb-5"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
        >
          {heading}
        </h2>

        <p className="reveal text-ink/60 text-[15px] leading-relaxed max-w-md mx-auto mb-9">
          {body}
        </p>

        {/* Download buttons — iOS + Android */}
        <div className="reveal flex flex-wrap justify-center gap-3">
          <a
            href={appStoreLink}
            className="min-h-11 inline-flex items-center gap-3 bg-ink text-sand rounded-full px-5 py-3 hover:bg-marine-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-light"
          >
            <AppleGlyph />
            <span className="flex flex-col leading-tight text-left">
              <span className="text-[9px] tracking-widest uppercase text-sand/70">
                Download on the
              </span>
              <span className="font-body font-semibold text-base leading-none">
                App Store
              </span>
            </span>
          </a>
          <a
            href={playStoreLink}
            className="min-h-11 inline-flex items-center gap-3 bg-ink text-sand rounded-full px-5 py-3 hover:bg-marine-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-light"
          >
            <PlayGlyph />
            <span className="flex flex-col leading-tight text-left">
              <span className="text-[9px] tracking-widest uppercase text-sand/70">
                Get it on
              </span>
              <span className="font-body font-semibold text-base leading-none">
                Google Play
              </span>
            </span>
          </a>
        </div>
      </div>

      {/* Phone mockup — the bottom quarter is deliberately pulled down into
          the next (dark) section so the image reads as "sticking up from
          behind" it. overflow-visible on the section lets it escape. */}
      <div className="relative z-10 w-full mt-12 md:mt-24 flex justify-center mb-[-10vh] md:mb-[-22vh]">
        <PhoneMockup mockupImage={mockupImage} />
      </div>
    </section>
  )
}

function PhoneMockup({ mockupImage }) {
  return (
    <div className="relative">
      {/* The mockup PNG already includes the phone frame — render it at its
          natural aspect ratio so nothing is clipped or letterboxed. */}
      <div className="relative inline-block">
        <Media
          src={mockupImage}
          alt="Landmark Citizen app"
          className="block w-auto max-w-full h-[55vh] md:h-[70vh] object-contain select-none"
        />
        {/* Cloudy fade on the bottom half — stronger blur + heavier haze so
            the image reads as being behind a soft fog that intensifies
            downward into the next section. */}
        {/* <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
          style={{
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 45%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 45%, black 100%)',
          }}
        /> */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(239,231,214,0.55) 35%, rgb(var(--c-sky) / 0.9) 85%, rgb(var(--c-sky)) 100%)',
          }}
        />
      </div>

      {/* Floating card — top-left: user count social proof */}
      <div className="hidden md:flex absolute top-16 -left-20 items-center gap-3 rounded-[16px] bg-white text-ink px-4 py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)] max-w-[200px]">
        <span className="h-9 w-9 shrink-0 rounded-[12px] bg-marine-dark text-sand flex items-center justify-center">
          <Users size={16} strokeWidth={2} />
        </span>
        <div className="leading-tight text-left min-w-0">
          <p className="text-[10px] tracking-widest uppercase text-ink/55 truncate">
            Already inside
          </p>
          <p className="text-sm font-medium leading-snug">Over 5,000 users</p>
        </div>
      </div>

      {/* Floating card — right: savings callout */}
      <div className="hidden md:flex absolute top-52 -right-24 items-center gap-3 rounded-[16px] bg-white text-ink px-4 py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)] max-w-[220px]">
        <span className="h-9 w-9 shrink-0 rounded-[12px] bg-orange-dark text-sand flex items-center justify-center">
          <Tag size={16} strokeWidth={2} />
        </span>
        <div className="leading-tight text-left min-w-0">
          <p className="text-[10px] tracking-widest uppercase text-ink/55 truncate">
            Citizen perk
          </p>
          <p className="text-sm font-medium leading-snug">
            Enjoy 10% off on all bookings
          </p>
        </div>
      </div>
    </div>
  )
}

/* Three abstract orange silhouettes on marine — a lightweight stand-in
   for /lca-logo.png when that file isn't on disk yet. */
function LcaLogo() {
  return (
    <svg
      viewBox="0 0 120 120"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <rect width="120" height="120" fill="rgb(var(--c-marine-dark))" />
      <g fill="rgb(var(--c-orange))">
        <path d="M35 30 c6 -4 14 -4 20 0 l6 8 c-2 4 -4 10 -4 16 l0 36 l-24 0 l0 -36 c0 -6 -2 -12 -4 -16 Z" />
        <path d="M60 32 c5 -3 11 -3 16 0 l5 7 c-2 4 -3 9 -3 14 l0 37 l-20 0 l0 -37 c0 -5 -1 -10 -3 -14 Z" />
        <path d="M82 34 c4 -2 10 -2 14 0 l4 6 c-2 3 -3 7 -3 11 l0 39 l-16 0 l0 -39 c0 -4 -1 -8 -3 -11 Z" />
      </g>
    </svg>
  )
}

/* Apple + Google Play glyphs — inline SVG, no extra dependencies. */
function AppleGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 fill-current"
      aria-hidden="true"
    >
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}

function PlayGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M3 2.5 L13.5 12 L3 21.5 Z" fill="#4FD2F9" />
      <path d="M3 2.5 L13.5 12 L17.8 7.7 Z" fill="#00F076" />
      <path d="M3 21.5 L13.5 12 L17.8 16.3 Z" fill="#FF4B4B" />
      <path d="M13.5 12 L17.8 7.7 L21.5 10 C22.5 10.7 22.5 13.3 21.5 14 L17.8 16.3 Z" fill="#FFCC00" />
    </svg>
  )
}
