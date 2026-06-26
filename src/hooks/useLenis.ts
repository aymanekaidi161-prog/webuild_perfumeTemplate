import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Initialize Lenis smooth scroll, synced with GSAP's ticker.
 * - No autoRaf: we drive Lenis manually via gsap.ticker for a unified loop.
 * - lenis.on('scroll', ScrollTrigger.update) keeps ScrollTrigger in sync.
 * - Skipped entirely when prefers-reduced-motion is set.
 * - Cleans up on unmount (ticker removed, lenis destroyed).
 */
export default function useLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis()

    // Keep ScrollTrigger position in sync with Lenis
    lenis.on('scroll', ScrollTrigger.update)

    // Drive Lenis via GSAP ticker — single animation heartbeat, no conflicts
    const rafCallback = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(rafCallback)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(rafCallback)
      lenis.destroy()
    }
  }, [])
}
