import { useEffect } from 'react'
import { useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'

/**
 * The hero (panel 0) and "why" (panel 1) are CSS scroll-snap panels, so the
 * browser hard-cuts between them (never resting half-way). Once the reader
 * scrolls past panel 1 into the long evidence section, mandatory snapping is
 * turned off so that content scrolls freely. Reduced-motion disables snapping
 * entirely (instant, no scroll-jacking feel).
 */
export default function SnapToggle() {
  const { scrollY } = useScroll()
  const reduce = useReducedMotion()

  const sync = (y: number) => {
    const el = document.documentElement
    if (reduce) {
      el.style.scrollSnapType = 'none'
      return
    }
    const pastPanels = y > window.innerHeight * 1.5
    el.style.scrollSnapType = pastPanels ? 'none' : 'y mandatory'
  }

  // initial + reduced-motion changes
  useEffect(() => {
    sync(scrollY.get())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce])

  useMotionValueEvent(scrollY, 'change', sync)

  return null
}
