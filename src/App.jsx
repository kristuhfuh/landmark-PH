import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useLenis from './hooks/useLenis'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Intro from './components/Intro'
import FlagshipAttraction from './components/FlagshipAttraction'
import ZoneRing from './components/ZoneRing'
import ZoneGreen from './components/ZoneGreen'
import ZoneWaterfront from './components/ZoneWaterfront'
import PinnedTrio from './components/PinnedTrio'
import SiteMap from './components/SiteMap'
import LaunchCTA from './components/LaunchCTA'
import Footer from './components/Footer'
import PaletteInjector from './components/PaletteInjector'
import AnchorMarquee from './components/AnchorMarquee'
import StickyZoneLabel from './components/StickyZoneLabel'
import CustomCursor from './components/CustomCursor'
import BookingModal from './components/BookingModal'
import CurtainPreloader from './components/CurtainPreloader'
import SemicircleReveal from './components/SemicircleReveal'
import RoomsShowcase from './components/RoomsShowcase'
import TicketsShop from './components/TicketsShop'
import CartDrawer from './components/CartDrawer'
import CitizenApp from './components/CitizenApp'
import Media from './components/Media'
import { CartProvider } from './lib/cart'
import { useContent } from './lib/content'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useLenis()
  const heroBgRef = useRef(null)
  const imgRef = useRef(null)
  const hero = useContent('hero')
  const reveal = useContent('reveal')
  const rooms = useContent('rooms')
  const heroImageUrl =
    hero.backgroundImage || '/pexels-petra-nesti-1766376-12161888.jpg'

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax: image translates upward within its sticky frame as the
      // user scrolls, so the hero photo feels like it scrolls with the page
      // instead of sitting frozen in the viewport.
      gsap.to(imgRef.current, {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: heroBgRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })

      // Hero image scales up as the reader approaches the bottom of the hero
      // — the photo feels like it's blowing open just before the concept
      // worm rises into the space above the Ring section.
      gsap.to(imgRef.current, {
        scale: 1.3,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: '#top',
          start: 'bottom bottom',
          end: 'bottom top',
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      })
    }, heroBgRef)

    // Cursor-follow parallax: hero image drifts a few pixels toward the
    // mouse. Uses gsap.quickTo for a buttery, non-janky lerp. Disabled on
    // touch devices via matchMedia.
    if (window.matchMedia('(pointer: fine)').matches) {
      const moveX = gsap.quickTo(imgRef.current, 'x', { duration: 0.9, ease: 'power3.out' })
      const moveY = gsap.quickTo(imgRef.current, 'y', { duration: 0.9, ease: 'power3.out' })
      const onMove = (e) => {
        const rx = e.clientX / window.innerWidth - 0.5   // -0.5..0.5
        const ry = e.clientY / window.innerHeight - 0.5
        moveX(rx * -20)
        moveY(ry * -14)
      }
      window.addEventListener('mousemove', onMove, { passive: true })
      return () => {
        ctx.revert()
        window.removeEventListener('mousemove', onMove)
      }
    }

    return () => ctx.revert()
  }, [])

  return (
    <CartProvider>
    <div className="relative">
      <PaletteInjector />
      <CurtainPreloader />
      <CustomCursor />
      <BookingModal />
      <CartDrawer />
      <Navbar />
      <StickyZoneLabel />

      {/* Hero + Intro share one continuous photo background. */}
      <div ref={heroBgRef} className="relative">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="sticky top-0 h-screen overflow-hidden">
            {/* Image container is oversized so parallax translation has
                room to move without exposing empty space. */}
            <div ref={imgRef} className="absolute -top-[10%] h-[130%] w-full">
              <Media
                src={heroImageUrl}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-marine-dark/30 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/25 to-ink/70" />
          </div>
        </div>
        <Hero />
        <Intro />
      </div>

      <ZoneRing />
      <AnchorMarquee phrase="A place to return to." separator="—" />
      <FlagshipAttraction />
      <ZoneWaterfront />
      <AnchorMarquee phrase="Grounds, not a park." separator="·" duration={70} />
      <ZoneGreen />
      {/* Trio pinned as one horizontal-scroll experience:
          Along the coast → Grounds from above → At the table */}
      <PinnedTrio />
      <TicketsShop />
      <CitizenApp />
      <RoomsShowcase
        eyebrow={rooms.eyebrow || 'Where you stay'}
        heading={rooms.heading || 'Rooms held close to the'}
        italic={rooms.italic || 'water.'}
        body={rooms.body}
        rooms={rooms.items || []}
      />
      <SemicircleReveal
        imageUrl={reveal.imageUrl || '/DSC05456.jpg'}
        imageAlt={reveal.imageAlt || 'Aerial view of the grounds'}
        heading={reveal.heading || 'Return to the water.'}
        subheading={
          reveal.subheading ||
          'The waterfront is where the grounds open up — the beach club, the jetty, and the swim course all sit along a single approach from the shore.'
        }
        callouts={reveal.callouts || [
          'Beach club',
          'Open swim',
          'Jetty dining',
          'Cabanas',
        ]}
      />
      <SiteMap />
      <LaunchCTA />
      <Footer />
    </div>
    </CartProvider>
  )
}
