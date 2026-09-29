import { useEffect, useState } from 'react'
import { ArrowRight, Bell, Users } from 'lucide-react'
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

const AVATAR_STOCK = [
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&h=120&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80',
]

// Target date the countdown chases — first weekend of the new season.
const LAUNCH_TARGET = new Date('2027-01-01T10:00:00+01:00').getTime()

function diffParts(target) {
  const now = Date.now()
  const ms = Math.max(0, target - now)
  const days = Math.floor(ms / (1000 * 60 * 60 * 24))
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const seconds = Math.floor((ms / 1000) % 60)
  return { days, hours, minutes, seconds }
}

export default function CitizenApp() {
  const ref = useRevealOnScroll({ stagger: 0.06 })
  const app = useContent('citizenApp')
  const [remaining, setRemaining] = useState(() => diffParts(LAUNCH_TARGET))
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setRemaining(diffParts(LAUNCH_TARGET)), 1000)
    return () => clearInterval(t)
  }, [])

  const heading = app.heading || 'Get early access'
  const body =
    app.body ||
    "We're getting close. Sign up for early access to Landmark Citizen — save 10% on every ticket, hold your day pass, and skip the gate queue."
  const mockupImage = app.mockupImage || '/citizen-app.mp4'

  function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setJoined(true)
    setEmail('')
    setTimeout(() => setJoined(false), 4000)
  }

  return (
    <section
      id="citizen-app"
      ref={ref}
      className="relative bg-sand text-ink py-24 md:py-32 px-6 md:px-10 overflow-hidden"
    >
      {/* Soft gradient wash that mimics the reference's sky-tint at the bottom */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-b from-transparent via-marine/[0.06] to-marine/[0.12] pointer-events-none"
      />

      <div className="relative max-w-2xl mx-auto text-center">
        {/* Rounded-square app logo */}
        <div className="reveal flex justify-center mb-8">
          <div className="h-14 w-14 rounded-[14px] bg-ink flex items-center justify-center shadow-[0_4px_16px_-2px_rgba(0,0,0,0.35)]">
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7 text-sand"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M6 4 h3 v13 h9 v3 H6 z" />
            </svg>
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

        {/* Email + inline pill button */}
        <form
          onSubmit={handleSubmit}
          className="reveal mx-auto flex items-center gap-2 bg-white border border-ink/10 rounded-full pl-5 pr-1.5 py-1.5 max-w-md shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        >
          <input
            type="email"
            required
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink/40 outline-none py-2.5"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-ink text-sand text-sm font-medium rounded-full px-4 py-2.5 hover:bg-orange-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
          >
            {joined ? 'On the list ✓' : 'Join waitlist'}
          </button>
        </form>

        {/* Social proof — avatar stack + line */}
        <div className="reveal mt-6 inline-flex items-center gap-3 text-ink/60 text-sm">
          <div className="flex -space-x-2">
            {AVATAR_STOCK.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="h-7 w-7 rounded-full border-2 border-sand object-cover"
                loading="lazy"
              />
            ))}
          </div>
          <span>
            Join <span className="text-ink font-medium">+12,000 others</span>{' '}
            on the waitlist
          </span>
        </div>

        {/* Countdown row */}
        <div className="reveal mt-10 flex items-end justify-center gap-3 md:gap-4">
          <CountBox value={remaining.days} label="Days" />
          <Colon />
          <CountBox value={remaining.hours} label="Hours" />
          <Colon />
          <CountBox value={remaining.minutes} label="Minutes" />
          <Colon />
          <CountBox value={remaining.seconds} label="Seconds" />
        </div>
      </div>

      {/* Phone mockup with floating cards, sitting on the sky-tint */}
      <div className="relative z-10 mt-16 md:mt-24 flex justify-center">
        <PhoneMockup mockupImage={mockupImage} />
      </div>
    </section>
  )
}

function CountBox({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="min-w-[68px] md:min-w-[80px] rounded-[14px] bg-white border border-ink/10 px-3 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <p className="font-body font-semibold text-2xl md:text-3xl text-ink tabular-nums text-center leading-none">
          {String(value).padStart(2, '0')}
        </p>
      </div>
      <p className="text-[10px] tracking-widest uppercase text-ink/50 mt-2">
        {label}
      </p>
    </div>
  )
}

function Colon() {
  return (
    <span
      aria-hidden="true"
      className="pb-6 text-ink/25 font-light text-lg md:text-xl"
    >
      :
    </span>
  )
}

function PhoneMockup({ mockupImage }) {
  return (
    <div className="relative">
      {/* Phone frame */}
      <div className="relative w-[280px] md:w-[340px] aspect-[9/19] rounded-[46px] bg-ink border-[10px] border-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.4)]">
        {/* Dynamic-Island-style notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 h-6 w-28 bg-ink rounded-full z-20" />

        {/* Screen */}
        <div className="absolute inset-0 rounded-[36px] overflow-hidden bg-sand">
          <Media
            src={mockupImage}
            alt="Landmark Citizen app"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Floating card — top-left */}
      <div className="hidden md:flex absolute top-16 -left-24 items-center gap-3 rounded-xl bg-white text-ink px-3.5 py-2.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)]">
        <span className="h-8 w-8 rounded-lg bg-ink text-sand flex items-center justify-center">
          <Bell size={14} strokeWidth={2} />
        </span>
        <div className="leading-tight text-left">
          <p className="text-[10px] text-ink/55">Next slot</p>
          <p className="text-sm font-medium tabular-nums">Sat · 2:30 PM</p>
        </div>
      </div>

      {/* Floating card — right, with avatars */}
      <div className="hidden md:flex absolute top-52 -right-16 items-center gap-2 rounded-full bg-white text-ink px-2.5 py-1.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)]">
        <div className="flex -space-x-2">
          {AVATAR_STOCK.slice(0, 3).map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="h-6 w-6 rounded-full border-2 border-white object-cover"
            />
          ))}
        </div>
        <span className="pl-1 pr-2 text-xs font-medium">
          <Users size={12} className="inline mr-1 -mt-0.5" />
          Live
        </span>
      </div>

      {/* Small orange arrow chip to hint the CTA rhythm */}
      <div className="hidden md:flex absolute bottom-14 -left-10 items-center gap-2 rounded-full bg-orange-dark text-sand px-3 py-2 shadow-[0_10px_30px_-10px_rgba(140,68,8,0.5)]">
        <ArrowRight size={14} strokeWidth={2.5} />
        <span className="text-[11px] tracking-widest uppercase">Save 10%</span>
      </div>
    </div>
  )
}
