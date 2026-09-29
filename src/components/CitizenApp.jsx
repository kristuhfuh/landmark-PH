import { Apple, Play, Sparkles, ShieldCheck } from 'lucide-react'
import useRevealOnScroll from '../hooks/useRevealOnScroll'
import Media from './Media'
import PatternOverlay from './PatternOverlay'
import { useContent } from '../lib/content'

/**
 * Landmark Citizen — centered "Get the app" section inspired by the Soonix
 * reference. Compact stack:
 *   pill badge → big centered heading → tagline → App Store / Play Store
 *   pair → social-proof avatars → stat strip → big phone mockup below.
 *
 * The phone shows /citizen-app.mp4 (real app footage already in /public)
 * so the section isn't dependent on external images.
 */

const AVATAR_STOCK = [
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&h=120&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&q=80',
]

const STATS = [
  { value: '12k+', label: 'Citizens on the app' },
  { value: '10%', label: 'Off every ticket' },
  { value: '4.9★', label: 'App Store rating' },
  { value: '1-tap', label: 'Gate entry' },
]

export default function CitizenApp() {
  const ref = useRevealOnScroll({ stagger: 0.08 })
  const app = useContent('citizenApp')

  const eyebrow = app.eyebrow || 'Landmark Citizen'
  const heading = app.heading || 'Get the Landmark app.'
  const italic = app.italic || 'The grounds, in your pocket.'
  const body =
    app.body ||
    "We're a tap away. Sign up for Landmark Citizen to save 10% on every ticket, hold your day pass and skip the gate queue."
  const appStoreLink = app.appStoreLink || '#'
  const playStoreLink = app.playStoreLink || '#'
  const mockupImage = app.mockupImage || '/citizen-app.mp4'

  return (
    <section
      id="citizen-app"
      ref={ref}
      className="relative isolate bg-marine-dark text-sand py-24 md:py-32 px-6 md:px-10 overflow-hidden"
    >
      <PatternOverlay opacity={0.05} />

      {/* Ambient watermark */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-24 left-1/2 -translate-x-1/2 font-display italic text-sand/[0.04] leading-none whitespace-nowrap"
        style={{ fontSize: 'clamp(10rem, 30vw, 28rem)' }}
      >
        Citizen
      </span>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* App icon badge */}
        <div className="reveal flex justify-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange to-orange-dark shadow-lg shadow-orange-dark/40 flex items-center justify-center">
            <span className="font-display italic text-sand text-2xl leading-none translate-y-0.5">
              L
            </span>
          </div>
        </div>

        {/* Pill eyebrow */}
        <div className="reveal flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-sand/20 bg-sand/5 px-3.5 py-1.5 text-[11px] tracking-widest2 uppercase text-sand/75">
            <Sparkles size={12} className="text-orange-light" />
            {eyebrow}
          </span>
        </div>

        <h2
          className="reveal font-display font-light leading-[1.02] tracking-tight text-sand mb-6"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.75rem)' }}
        >
          {heading}
          <br />
          <span className="italic text-orange-light">{italic}</span>
        </h2>

        <p className="reveal text-sand/70 leading-relaxed max-w-xl mx-auto mb-10">
          {body}
        </p>

        {/* Download row — compact card style */}
        <div className="reveal flex flex-wrap justify-center gap-3 mb-8">
          <a
            href={appStoreLink}
            className="group inline-flex items-center gap-3 bg-sand text-marine-dark px-5 py-3 rounded-xl hover:bg-orange-light transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-light"
          >
            <Apple size={22} strokeWidth={1.5} />
            <span className="flex flex-col leading-tight text-left">
              <span className="text-[9px] tracking-widest2 uppercase text-marine-dark/70">
                Download on the
              </span>
              <span className="font-display text-base leading-none">
                App Store
              </span>
            </span>
          </a>
          <a
            href={playStoreLink}
            className="group inline-flex items-center gap-3 bg-sand text-marine-dark px-5 py-3 rounded-xl hover:bg-orange-light transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-light"
          >
            <Play size={22} strokeWidth={1.5} className="fill-current" />
            <span className="flex flex-col leading-tight text-left">
              <span className="text-[9px] tracking-widest2 uppercase text-marine-dark/70">
                Get it on
              </span>
              <span className="font-display text-base leading-none">
                Google Play
              </span>
            </span>
          </a>
        </div>

        {/* Social proof — avatar stack + line */}
        <div className="reveal inline-flex items-center gap-4">
          <div className="flex -space-x-2">
            {AVATAR_STOCK.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="h-8 w-8 rounded-full border-2 border-marine-dark object-cover"
                loading="lazy"
              />
            ))}
          </div>
          <p className="text-sand/70 text-sm">
            Join <span className="text-sand font-medium">12,000+</span> Citizens
            already inside
          </p>
        </div>
      </div>

      {/* Stats strip */}
      <div className="reveal relative z-10 max-w-5xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6 border-y border-sand/12 py-10">
        {STATS.map((s, i) => (
          <div key={s.label} className="text-center">
            <p
              className="font-display italic text-sand leading-none mb-2"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)' }}
            >
              {s.value}
            </p>
            <p className="text-[11px] tracking-widest2 uppercase text-sand/55">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Phone mockup — big, centered, sitting on the stats strip */}
      <div className="reveal relative z-10 mt-16 md:mt-24 flex justify-center">
        <PhoneMockup mockupImage={mockupImage} />
      </div>

      {/* Trust footnote */}
      <div className="relative z-10 mt-12 flex items-center justify-center gap-2 text-sand/55 text-xs">
        <ShieldCheck size={14} className="text-orange-light" />
        Card details handled by Paystack · never stored by Landmark
      </div>
    </section>
  )
}

function PhoneMockup({ mockupImage }) {
  return (
    <div className="relative">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute -inset-24 rounded-full bg-orange/10 blur-3xl -z-10"
      />

      <div className="relative w-[280px] md:w-[320px] aspect-[9/19] rounded-[46px] bg-ink border-[12px] border-ink shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
        {/* Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-6 w-28 bg-ink rounded-full z-20" />

        {/* Screen */}
        <div className="absolute inset-0 rounded-[34px] overflow-hidden bg-sand">
          <Media
            src={mockupImage}
            alt="Citizen app running on iPhone"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Floating notification card — top-left */}
      <div className="hidden md:flex absolute -top-8 -left-16 items-center gap-3 rounded-xl bg-sand text-marine-dark px-3.5 py-2.5 shadow-xl shadow-marine-dark/40 rotate-[-4deg]">
        <span className="h-8 w-8 rounded-lg bg-orange/15 flex items-center justify-center">
          <Sparkles size={14} className="text-orange-dark" />
        </span>
        <div className="leading-tight">
          <p className="text-[10px] tracking-widest2 uppercase text-orange-dark">
            Today · saved
          </p>
          <p className="font-display italic text-base">₦2,150 in-app</p>
        </div>
      </div>

      {/* Floating pass card — bottom-right */}
      <div className="hidden md:flex absolute -bottom-6 -right-14 items-center gap-3 rounded-xl bg-orange-dark text-sand px-4 py-3 shadow-xl shadow-marine-dark/40 rotate-[4deg]">
        <div className="leading-tight text-left">
          <p className="text-[9px] tracking-widest2 uppercase text-sand/70">
            Gate pass · live
          </p>
          <p className="font-display italic text-lg leading-none mt-0.5">
            LMK-A7Q9
          </p>
        </div>
      </div>
    </div>
  )
}
