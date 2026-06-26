import { useEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealOptions {
  stagger?: number
  duration?: number
  y?: number
}

/**
 * Stagger-reveals direct children of containerRef as they scroll into view.
 * - Fires ONCE per child on first viewport entry (once: true).
 * - Uses opacity + y transform only (GPU-composited, no layout reflow).
 * - Skipped when prefers-reduced-motion is set (elements shown immediately).
 * - Cleans up ScrollTrigger instances on unmount via ctx.revert().
 */
export default function useScrollReveal(
  containerRef: RefObject<HTMLElement | null>,
  options: ScrollRevealOptions = {}
) {
  const { stagger = 0.08, duration = 0.6, y = 24 } = options

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Skip animations — show elements at full opacity/position immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.from(Array.from(el.children), {
        opacity: 0,
        y,
        duration,
        stagger,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true, // fires once per element, never replays on scroll-back
        },
      })
    }, el)

    return () => ctx.revert() // kills all ScrollTrigger instances on unmount
  }, [containerRef, stagger, duration, y])
}
