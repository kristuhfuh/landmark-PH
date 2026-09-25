import { Apple, Smartphone, QrCode, Sparkles, Ticket, Calendar } from 'lucide-react'
import useRevealOnScroll from '../hooks/useRevealOnScroll'
import SplitHeading from './SplitHeading'
import Media from './Media'
import { useContent } from '../lib/content'

/**
 * Landmark Citizen app promo — dark marine section that sells the mobile
 * app. Left column: eyebrow, heading, body, feature list, download row
 * (App Store + Google Play + QR). Right column: a phone-frame mockup
 * showing a stylised app screen (tickets + reward).
 *
 * The mockup content is decorative — swap with real screenshots by pointing
 * `mockupImage` in content.json to a real URL.
 */

const FEATURE_ICONS = { Ticket, Sparkles, Calendar }

export default function CitizenApp() {
  const ref = useRevealOnScroll({ stagger: 0.08 })
  const app = useContent('citizenApp')

  const eyebrow = app.eyebrow || 'Landmark Citizen'
  const heading = app.heading || 'The grounds,'
  const italic = app.italic || 'in your pocket.'
  const body =
    app.body ||
    'Buy tickets, hold your day pass, and check what\'s open — all from one app. Citizens save 10% on every ticket, room and package booked in-app.'
  const features = app.features || [
    { icon: 'Ticket', label: '10% off every ticket', body: 'Grounds entry, activities, packages and beach passes — always cheaper in-app.' },
    { icon: 'Sparkles', label: 'Priority slots', body: 'First look at weekend cabanas, concert dates and flagship walkthrough windows.' },
    { icon: 'Calendar', label: 'Your visit, held together', body: 'All your bookings, your host contact, and directions inside the grounds — one screen.' },
  ]
  const appStoreLink = app.appStoreLink || '#'
  const playStoreLink = app.playStoreLink || '#'
  const qrImage = app.qrImage
  const mockupImage = app.mockupImage
  const savingsPill = app.savingsPill || 'Save 10%'

  return (
    <section
      id="citizen-app"
      ref={ref}
      className="relative bg-marine-dark text-sand py-24 md:py-32 px-6 md:px-10 overflow-hidden"
    >
      {/* Ambient watermark — huge italic word behind the composition */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 font-display italic text-sand/[0.04] leading-none whitespace-nowrap"
        style={{ fontSize: 'clamp(10rem, 32vw, 32rem)' }}
      >
        Citizen
      </span>

      <div className="relative max-w-6xl mx-auto grid md:grid-cols-12 gap-14 items-center">
        {/* Left column — copy + downloads */}
        <div className="md:col-span-7">
          <p className="reveal inline-flex items-center gap-4 text-orange-light text-xs tracking-widest2 uppercase mb-6">
            <span className="font-display italic text-orange-light/90 text-base tabular-nums">08</span>
            <span aria-hidden="true" className="h-px w-8 bg-orange-light/50" />
            {eyebrow}
          </p>
          <SplitHeading className="font-display text-4xl md:text-6xl leading-[1.02] mb-6 max-w-xl">
            {heading} <span className="italic text-orange-light">{italic}</span>
          </SplitHeading>
          <p className="reveal text-sand/75 leading-relaxed max-w-md mb-10">
            {body}
          </p>

          {/* Feature list */}
          <ul className="reveal space-y-6 mb-12 max-w-lg">
            {features.map((f) => {
              const Icon = FEATURE_ICONS[f.icon] || Ticket
              return (
                <li key={f.label} className="flex items-start gap-4">
                  <span className="mt-0.5 h-10 w-10 rounded-full border border-orange-light/40 flex items-center justify-center text-orange-light shrink-0">
                    <Icon size={16} strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="font-display italic text-sand text-lg leading-tight mb-1">
                      {f.label}
                    </p>
                    <p className="text-sand/65 text-sm leading-relaxed">{f.body}</p>
                  </div>
                </li>
              )
            })}
          </ul>

          {/* Download row */}
          <div className="reveal flex flex-wrap items-center gap-4">
            <a
              href={appStoreLink}
              className="group inline-flex items-center gap-3 bg-sand text-marine-dark px-5 py-3 rounded-lg hover:bg-orange-light transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-light"
            >
              <Apple size={22} strokeWidth={1.5} />
              <span className="flex flex-col leading-tight text-left">
                <span className="text-[9px] tracking-widest2 uppercase text-marine-dark/70">
                  Download on the
                </span>
                <span className="font-display text-base leading-none">App Store</span>
              </span>
            </a>
            <a
              href={playStoreLink}
              className="group inline-flex items-center gap-3 bg-sand text-marine-dark px-5 py-3 rounded-lg hover:bg-orange-light transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-light"
            >
              <Smartphone size={22} strokeWidth={1.5} />
              <span className="flex flex-col leading-tight text-left">
                <span className="text-[9px] tracking-widest2 uppercase text-marine-dark/70">
                  Get it on
                </span>
                <span className="font-display text-base leading-none">Google Play</span>
              </span>
            </a>

            {/* QR — decorative placeholder unless a real image is supplied. */}
            <div className="ml-2 inline-flex items-center gap-3 pl-4 border-l border-sand/20">
              <div className="h-16 w-16 bg-sand p-1.5 flex items-center justify-center">
                {qrImage ? (
                  <img src={qrImage} alt="Scan to download" className="h-full w-full object-contain" />
                ) : (
                  <PlaceholderQR />
                )}
              </div>
              <p className="text-sand/60 text-[10px] tracking-widest2 uppercase leading-tight max-w-[7rem]">
                Scan to download
              </p>
            </div>
          </div>
        </div>

        {/* Right column — phone mockup */}
        <div className="md:col-span-5 flex justify-center md:justify-end">
          <PhoneMockup
            savingsPill={savingsPill}
            mockupImage={mockupImage}
          />
        </div>
      </div>
    </section>
  )
}

function PhoneMockup({ savingsPill, mockupImage }) {
  return (
    <div className="reveal relative w-[260px] md:w-[280px] aspect-[9/19] rounded-[42px] bg-ink border-[10px] border-ink shadow-2xl shadow-marine-dark/60">
      {/* Notch */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 h-6 w-24 bg-ink rounded-full z-20" />

      {/* Screen */}
      <div className="absolute inset-0 rounded-[32px] overflow-hidden bg-sand">
        {mockupImage ? (
          <Media
            src={mockupImage}
            alt="Citizen app on a phone"
            className="h-full w-full object-cover"
          />
        ) : (
          <MockScreen />
        )}

        {/* Floating savings pill — sits partly off the phone's right edge */}
        <span className="absolute -right-3 top-24 md:top-28 bg-orange-dark text-sand text-[10px] tracking-widest2 uppercase px-3 py-1.5 shadow-lg shadow-marine-dark/50 rotate-[6deg] z-30">
          {savingsPill}
        </span>
      </div>
    </div>
  )
}

function MockScreen() {
  return (
    <div className="h-full w-full flex flex-col p-4 pt-10">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-4 mt-2">
        <div>
          <p className="text-[9px] tracking-widest2 uppercase text-orange-dark">
            Landmark Citizen
          </p>
          <p className="font-display italic text-marine text-lg leading-tight">
            Kunle O.
          </p>
        </div>
        <div className="h-8 w-8 rounded-full bg-marine-dark/10 border border-marine-dark/15" />
      </div>

      {/* Balance card */}
      <div className="bg-marine-dark text-sand p-3 mb-3">
        <p className="text-[8px] tracking-widest2 uppercase text-orange-light mb-1">
          Wallet
        </p>
        <p className="font-display italic text-2xl leading-none">₦12,500</p>
        <p className="text-[9px] text-sand/60 mt-1">
          Top up · Use across grounds
        </p>
      </div>

      {/* Today's booking */}
      <div className="border border-marine-dark/15 p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[8px] tracking-widest2 uppercase text-orange-dark">
            Today · 2:30 pm
          </p>
          <span className="text-[8px] tracking-widest2 uppercase bg-orange-dark text-sand px-1.5 py-0.5">
            Live
          </span>
        </div>
        <p className="font-display text-marine text-sm leading-tight mb-1">
          Upside-Down Ship
        </p>
        <p className="text-[9px] text-marine-dark/60">
          Timed walkthrough · 2 guests
        </p>
      </div>

      {/* Upcoming */}
      <p className="text-[8px] tracking-widest2 uppercase text-marine-dark/50 mb-2">
        Upcoming
      </p>
      <div className="space-y-1.5">
        <MockRow title="Beach club day pass" tag="Sat 07 Sep" price="₦13,500" />
        <MockRow title="Padel court · 1 hr" tag="Sun 08 Sep" price="₦10,800" />
      </div>
    </div>
  )
}

function MockRow({ title, tag, price }) {
  return (
    <div className="flex items-center justify-between text-marine border-b border-marine-dark/10 pb-1.5">
      <div>
        <p className="text-[10px] font-medium leading-tight">{title}</p>
        <p className="text-[8px] text-marine-dark/50">{tag}</p>
      </div>
      <p className="font-display italic text-marine text-xs tabular-nums">
        {price}
      </p>
    </div>
  )
}

/**
 * Decorative QR-like pattern — a fixed grid of squares that reads visually
 * as a QR code without actually encoding anything. Replace with a real QR
 * image via `citizenApp.qrImage` in content.
 */
function PlaceholderQR() {
  // Fixed pattern so re-renders don't reshuffle. Values chosen so the three
  // finder squares in the corners are recognisably QR-like.
  const cells = [
    // Top-left finder
    '111111100000010',
    '100000100000010',
    '101110100000000',
    '101110101100010',
    '101110100010100',
    '100000100000010',
    '111111100010101',
    '000000000000000',
    '110100110111110',
    '001011000000001',
    '011010000000000',
    '000000100000001',
    '111111101110101',
    '100000100010001',
    '101110101010111',
  ]
  return (
    <div
      className="grid gap-0"
      style={{
        gridTemplateColumns: `repeat(${cells[0].length}, 1fr)`,
        gridTemplateRows: `repeat(${cells.length}, 1fr)`,
      }}
      aria-hidden="true"
    >
      {cells
        .join('')
        .split('')
        .map((c, i) => (
          <span
            key={i}
            className={c === '1' ? 'bg-ink' : 'bg-transparent'}
          />
        ))}
    </div>
  )
}
