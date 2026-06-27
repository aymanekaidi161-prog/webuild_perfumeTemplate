import { useRef, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ProductGrid from '../components/shop/ProductGrid'
import useReducedMotion from '../hooks/useReducedMotion'
import useScrollReveal from '../hooks/useScrollReveal'
import rawProducts from '../data/products.json'
import type { Product } from '../data/types'

const products = rawProducts as Product[]
const featuredProducts = products.slice(0, 4)

gsap.registerPlugin(ScrollTrigger)

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  const { t } = useTranslation()
  const heroRef = useRef<HTMLElement>(null)
  const bgGlowRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      // Background layer moves up slower than scroll
      gsap.fromTo(
        bgGlowRef.current,
        { y: 0 },
        {
          y: -150,
          ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
        }
      )
      // Content rises slightly faster than scroll
      gsap.fromTo(
        contentRef.current,
        { y: 0 },
        {
          y: -40,
          ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
        }
      )
    })
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={heroRef}
      id="hero-section"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden text-center"
      style={{ background: 'linear-gradient(180deg,#1A1A1A 0%,#222020 30%,#242424 50%,#222020 70%,#1A1A1A 100%)' }}
    >
      <div
        ref={bgGlowRef}
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 45%,rgba(201,169,110,0.06) 0%,transparent 100%)' }}
      />

      <div ref={contentRef} className="relative z-10 mx-auto max-w-3xl px-6">
        <div className="mb-10 flex items-center justify-center gap-4">
          <span className="h-px w-16 bg-gold opacity-40" />
          <span className="font-sans text-[10px] uppercase tracking-[0.35em] rtl:tracking-normal rtl:text-[11px] rtl:font-medium text-gold opacity-70">{t('hero.established')}</span>
          <span className="h-px w-16 bg-gold opacity-40" />
        </div>
        <h1 className="font-display mb-6 text-5xl font-normal leading-[1.1] text-cream md:text-6xl lg:text-7xl">
          {t('hero.headline')} <em className="italic text-gold">{t('hero.headlineEm')}</em>
        </h1>
        <p className="mx-auto mb-10 max-w-md font-sans text-base font-light leading-relaxed text-cream-muted md:text-lg">
          {t('hero.subheading')}
        </p>
        <Link to="/shop" className="btn-gold-filled" id="hero-cta-btn">{t('hero.cta')}</Link>
      </div>

      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="font-sans text-[9px] uppercase tracking-[0.2em] rtl:tracking-normal rtl:text-[11px] rtl:font-medium text-cream-muted opacity-50">{t('hero.scroll')}</span>
        <div className="animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gold opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>
    </section>
  )
}

// ─── Featured Section ─────────────────────────────────────────────────────────

function FeaturedSection() {
  const { t } = useTranslation()
  const gridRef = useRef<HTMLDivElement>(null)
  useScrollReveal(gridRef as React.RefObject<HTMLElement | null>, { stagger: 0.1, y: 28 })

  return (
    <section id="featured-section" className="bg-charcoal pt-20 md:pt-28">
      <div className="container mx-auto px-6 mb-14 text-center">
        <div className="mb-4 flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-gold opacity-30" />
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] rtl:tracking-normal rtl:text-[11px] rtl:font-medium text-gold opacity-60">{t('featured.eyebrow')}</span>
          <span className="h-px w-12 bg-gold opacity-30" />
        </div>
        <h2 className="font-display text-3xl font-normal text-cream md:text-4xl">{t('featured.heading')}</h2>
        <p className="mt-3 font-sans text-sm text-cream-muted">{t('featured.subheading')}</p>
      </div>

      <div className="container mx-auto px-6 pb-20">
        <ProductGrid products={featuredProducts} containerRef={gridRef} />

        <div className="mt-14 text-center">
          <Link to="/shop" className="btn-gold" id="featured-view-all-btn">{t('featured.viewAll')}</Link>
        </div>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedSection />
      </main>
      <Footer />
    </>
  )
}
