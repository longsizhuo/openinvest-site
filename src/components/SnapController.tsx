import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * Hard-cut navigation for the first two full-screen panels only.
 *
 * The hero (panel 0) and "approach" (panel 1) are each one viewport tall. A
 * scroll/swipe intent while inside that boundary is intercepted and turned into
 * a single animated jump to the other panel — so the reader never rests in an
 * intermediate half-state. Below panel 1 (the long evidence section) nothing is
 * intercepted: native scrolling takes over completely.
 *
 * Implemented with a wheel/touch hijack rather than CSS scroll-snap because
 * `scroll-snap-type: mandatory` with sparse snap points traps the reader at
 * panel 1 (the long section has no snap point to advance to). Reduced-motion
 * disables the hijack entirely — plain native scrolling.
 */
export default function SnapController() {
  const reduce = useReducedMotion()
  const locked = useRef(false)

  useEffect(() => {
    if (reduce) return

    const lock = (ms = 750) => {
      locked.current = true
      window.setTimeout(() => (locked.current = false), ms)
    }
    const jump = (top: number) => {
      lock()
      window.scrollTo({ top, behavior: 'smooth' })
    }

    // Returns true if the intent was handled (caller should preventDefault).
    const handle = (down: boolean): boolean => {
      const h = window.innerHeight
      const y = window.scrollY
      if (down && y < h * 0.5) {
        jump(h) // hero -> approach
        return true
      }
      if (!down && y > h * 0.5 && y < h * 1.5) {
        jump(0) // approach (or just-entered evidence) -> hero
        return true
      }
      return false
    }

    const onWheel = (e: WheelEvent) => {
      if (locked.current) {
        e.preventDefault()
        return
      }
      if (Math.abs(e.deltaY) < 4) return
      if (handle(e.deltaY > 0)) e.preventDefault()
    }

    let touchY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (e: TouchEvent) => {
      if (locked.current) {
        e.preventDefault()
        return
      }
      const dy = touchY - (e.touches[0]?.clientY ?? 0)
      if (Math.abs(dy) < 10) return
      if (handle(dy > 0)) e.preventDefault()
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [reduce])

  return null
}
