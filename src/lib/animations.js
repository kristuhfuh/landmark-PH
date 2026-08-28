import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const unwrap = (s) => (s && typeof s === 'object' && 'current' in s ? s.current : s)

// Fade + rise reveal for text and cards, triggered once as the element enters view.
export function revealOnScroll(selector, scope, opts = {}) {
  const els = gsap.utils.toArray(selector, unwrap(scope))
  els.forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      delay: opts.stagger ? i * opts.stagger : 0,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    })
  })
}

// Scroll-linked drift, mirroring the yPercent + ease:none + scrub pattern
// measured on the reference site (decorative depth, not content-critical).
export function parallaxLayer(selector, scope, { yPercent = 12, scrub = 0.6 } = {}) {
  const els = gsap.utils.toArray(unwrap(selector), unwrap(scope))
  els.forEach((el) => {
    gsap.to(el, {
      yPercent,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub,
      },
    })
  })
}
