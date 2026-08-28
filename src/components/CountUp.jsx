import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Renders a formatted number that animates from 0 up to `value` once the
 * element scrolls into view. Non-numeric strings (e.g. "Confirmed") pass
 * through unchanged.
 *
 * Extracts an optional numeric prefix from strings like "480 sqm" or
 * "1,860 sqm" and animates just the number, preserving the suffix.
 */
export default function CountUp({ value, className = '' }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(() => renderInitial(value))

  useEffect(() => {
    if (!ref.current) return
    const parsed = parseNumeric(value)
    if (!parsed) {
      setDisplay(value)
      return
    }
    const { num, suffix } = parsed
    const state = { n: 0 }
    setDisplay(formatWithCommas(0) + suffix)

    const tween = gsap.to(state, {
      n: num,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: () => {
        setDisplay(formatWithCommas(Math.round(state.n)) + suffix)
      },
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        toggleActions: 'play none none reset',
      },
    })

    return () => {
      tween.scrollTrigger && tween.scrollTrigger.kill()
      tween.kill()
    }
  }, [value])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}

function renderInitial(value) {
  const parsed = parseNumeric(value)
  if (!parsed) return value
  return formatWithCommas(0) + parsed.suffix
}

function parseNumeric(value) {
  if (typeof value !== 'string') return null
  const match = value.match(/^\s*([\d,]+)(.*)$/)
  if (!match) return null
  const num = parseInt(match[1].replace(/,/g, ''), 10)
  if (Number.isNaN(num)) return null
  return { num, suffix: match[2] }
}

function formatWithCommas(n) {
  return n.toLocaleString('en-US')
}
