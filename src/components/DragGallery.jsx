import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import Media from './Media'

gsap.registerPlugin(ScrollTrigger)

const AUTOPLAY_INTERVAL_MS = 4200
const CARD_STEP_PX = 380

export default function DragGallery({ items }) {
  const trackRef = useRef(null)
  const [isDown, setIsDown] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const dragState = useRef({ startX: 0, scrollLeft: 0 })
  const hoverRef = useRef(false)

  useEffect(() => {
    const imgs = trackRef.current.querySelectorAll('.gallery-img')
    imgs.forEach((img) => {
      gsap.fromTo(
        img,
        { scale: 1.15 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: img,
            start: 'left 100%',
            end: 'left 20%',
            scrub: true,
            horizontal: false,
          },
        }
      )
    })
  }, [])

  // Track active index off scroll position so the pagination dots stay in sync
  // with manual drags too.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onScroll = () => {
      const cards = track.querySelectorAll('[data-gallery-card]')
      if (!cards.length) return
      const trackRect = track.getBoundingClientRect()
      const centerX = trackRect.left + trackRect.width / 2
      let closest = 0
      let closestDist = Infinity
      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect()
        const dist = Math.abs(rect.left + rect.width / 2 - centerX)
        if (dist < closestDist) {
          closestDist = dist
          closest = i
        }
      })
      setActiveIndex(closest)
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [items.length])

  // Auto-slideshow: advance every AUTOPLAY_INTERVAL_MS. Pauses on user
  // interaction (drag, hover, or explicit pause button).
  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      if (isDown || hoverRef.current) return
      const nextIndex = (activeIndex + 1) % items.length
      goToIndex(nextIndex)
    }, AUTOPLAY_INTERVAL_MS)
    return () => clearInterval(id)
  }, [playing, isDown, activeIndex, items.length])

  function goToIndex(i) {
    const cards = trackRef.current.querySelectorAll('[data-gallery-card]')
    if (!cards[i]) return
    const card = cards[i]
    const targetLeft = card.offsetLeft - (trackRef.current.clientWidth - card.clientWidth) / 2
    trackRef.current.scrollTo({ left: Math.max(targetLeft, 0), behavior: 'smooth' })
  }

  function scrollByAmount(dir) {
    const next = Math.max(0, Math.min(items.length - 1, activeIndex + dir))
    goToIndex(next)
  }

  function onPointerDown(e) {
    setIsDown(true)
    dragState.current.startX = e.clientX
    dragState.current.scrollLeft = trackRef.current.scrollLeft
  }
  function onPointerMove(e) {
    if (!isDown) return
    const dx = e.clientX - dragState.current.startX
    trackRef.current.scrollLeft = dragState.current.scrollLeft - dx
  }
  function onPointerUp() {
    setIsDown(false)
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
    >
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className={`flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-none ${
          isDown ? 'cursor-grabbing select-none' : 'cursor-grab'
        }`}
        style={{ scrollbarWidth: 'none' }}
      >
        {items.map((it, i) => {
          const shapes = [
            'sm:w-[340px] h-[26rem]',
            'sm:w-[520px] h-[22rem]',
            'sm:w-[380px] h-[28rem]',
            'sm:w-[460px] h-[24rem]',
          ]
          return (
            <div
              key={it.title}
              data-gallery-card
              className={`snap-start shrink-0 w-[80vw] ${shapes[i % shapes.length]} relative overflow-hidden`}
            >
              <Media
                src={it.imageUrl || it.img}
                alt={it.title}
                draggable={false}
                className="gallery-img absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
              <div className="absolute bottom-0 p-6">
                <h4 className="font-display text-lg text-sand">{it.title}</h4>
                <p className="text-sand/60 text-xs mt-1">{it.tag}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination + controls row */}
      <div className="flex items-center justify-between mt-2 gap-4">
        {/* Dot pagination */}
        <div className="flex items-center gap-2" role="tablist" aria-label="Gallery pagination">
          {items.map((it, i) => (
            <button
              key={it.title}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Show ${it.title}`}
              onClick={() => goToIndex(i)}
              className={`h-1 transition-all duration-500 rounded-full ${
                i === activeIndex ? 'w-8 bg-orange-dark' : 'w-3 bg-ink/25 hover:bg-ink/50'
              }`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
            className="h-10 w-10 flex items-center justify-center border border-ink/30 text-ink/70 hover:border-orange-dark hover:text-orange-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark transition-colors"
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={() => scrollByAmount(-1)}
            aria-label="Previous"
            className="h-10 w-10 flex items-center justify-center border border-ink/30 text-ink/70 hover:border-orange-dark hover:text-orange-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollByAmount(1)}
            aria-label="Next"
            className="h-10 w-10 flex items-center justify-center border border-ink/30 text-ink/70 hover:border-orange-dark hover:text-orange-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
