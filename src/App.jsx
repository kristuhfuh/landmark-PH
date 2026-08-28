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
import FnBMarketplace from './components/FnBMarketplace'
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
import HorizontalPanorama from './components/HorizontalPanorama'
import RoomsShowcase from './components/RoomsShowcase'
import OverlapHeading from './components/OverlapHeading'
import { useContent } from './lib/content'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useLenis()
  const heroBgRef = useRef(null)
  const imgRef = useRef(null)
  const hero = useContent('hero')
  const reveal = useContent('reveal')
  const panorama = useContent('panorama')
  const rooms = useContent('rooms')
  const overlap = useContent('overlap')
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
    <div className="relative">
      <PaletteInjector />
      <CurtainPreloader />
      <CustomCursor />
      <BookingModal />
      <Navbar />
      <StickyZoneLabel />

      {/* Hero + Intro share one continuous photo background. */}
      <div ref={heroBgRef} className="relative">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="sticky top-0 h-screen overflow-hidden">
            {/* Image container is oversized so parallax translation has
                room to move without exposing empty space. */}
            <div ref={imgRef} className="absolute -top-[10%] h-[130%] w-full">
              <img
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

      <FlagshipAttraction />
      <AnchorMarquee phrase="A place to return to." separator="—" />
      <ZoneRing />
      <ZoneGreen />
      <AnchorMarquee phrase="Grounds, not a park." separator="·" duration={70} />
      <ZoneWaterfront />
      <OverlapHeading
        eyebrow={overlap.eyebrow || 'From the shore'}
        topLine={overlap.topLine || 'Along the'}
        bottomLine={overlap.bottomLine || 'coast.'}
        imageUrl={overlap.imageUrl || '/DSC05456.jpg'}
        imageAlt={overlap.imageAlt || 'The waterfront edge of Landmark Port Harcourt'}
        caption={overlap.caption}
        align={overlap.align || 'left'}
      />
      <HorizontalPanorama
        imageUrl={panorama.imageUrl || '/DSC05456.jpg'}
        imageAlt={panorama.imageAlt || 'The grounds seen from above'}
        eyebrow={panorama.eyebrow || 'The Grounds · From Above'}
        heading={panorama.heading || 'A single loop, from ring to shore.'}
        chapters={panorama.chapters || [
          { title: 'The Ring', body: 'Attractions floor at the centre of the grounds.' },
          { title: 'The Green', body: 'Concert lawn, courts, and adventure quarter.' },
          { title: 'The Waterfront', body: 'Beach club, jetty dining, and open water.' },
        ]}
      />
      <FnBMarketplace />
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
  )
}
