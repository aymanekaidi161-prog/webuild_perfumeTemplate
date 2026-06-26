import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ProductCard from '../components/ui/ProductCard'
import ProductModal from '../components/ui/ProductModal'
import useScrollReveal from '../hooks/useScrollReveal'
import rawProducts from '../data/products.json'
import type { Product } from '../data/types'

gsap.registerPlugin(ScrollTrigger)

const products = rawProducts as Product[]
const featuredProducts = products.filter((p) => p.featured)

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  const heroRef   = useRef<HTMLElement>(null)
  const bgGlowRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      // Radial glow drifts down (lags behind scroll → appears slower, adds depth)
      gsap.fromTo(
        bgGlowRef.current,
        { y: 0 },
        {
          y: 60,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        }
      )
      // Content rises slightly faster than scroll (pops forward)
      gsap.fromTo(
        contentRef.current,
        { y: 0 },
        {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        }
      )
    })

    return () => ctx.revert() // kill ScrollTrigger instances on unmount
  }, [])

  return (
    <section
      ref={heroRef}
      id="hero-section"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden text-center"
      style={{ background: 'linear-gradient(180deg,#1A1A1A 0%,#222020 30%,#242424 50%,#222020 70%,#1A1A1A 100%)' }}
    >
      {/* Background glow layer — parallaxes slower than content */}
      <div
        ref={bgGlowRef}
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 45%,rgba(201,169,110,0.06) 0%,transparent 100%)' }}
      />

      {/* Foreground content — parallaxes slightly faster */}
      <div ref={contentRef} className="relative z-10 mx-auto max-w-3xl px-6">
        <div className="mb-10 flex items-center justify-center gap-4">
          <span className="h-px w-16 bg-gold opacity-40" />
          <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-gold opacity-70">Established 2018</span>
          <span className="h-px w-16 bg-gold opacity-40" />
        </div>
        <h1 className="font-display mb-6 text-5xl font-normal leading-[1.1] text-cream md:text-6xl lg:text-7xl">
          Crafted for the <em className="italic text-gold">Discerning</em>
        </h1>
        <p className="mx-auto mb-10 max-w-md font-sans text-base font-light leading-relaxed text-cream-muted md:text-lg">
          A curated house of rare fragrances — where every note tells a story and every bottle holds a memory.
        </p>
        <Link to="/shop" className="btn-gold-filled" id="hero-cta-btn">Explore the Collection</Link>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-cream-muted opacity-50">Scroll</span>
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

function FeaturedSection({ onCardClick }: { onCardClick: (p: Product) => void }) {
  const gridRef = useRef<HTMLDivElement>(null)
  useScrollReveal(gridRef as React.RefObject<HTMLElement | null>, { stagger: 0.1, y: 28 })

  return (
    <section id="featured-section" className="bg-charcoal section-padding">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="mb-14 text-center">
          <div className="mb-4 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-gold opacity-30" />
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold opacity-60">Signature Scents</span>
            <span className="h-px w-12 bg-gold opacity-30" />
          </div>
          <h2 className="font-display text-3xl font-normal text-cream md:text-4xl">Featured Collection</h2>
          <p className="mt-3 font-sans text-sm text-cream-muted">Four fragrances that define the essence of Maison Aurel.</p>
        </div>

        {/* Featured grid — children stagger-revealed by useScrollReveal */}
        <div ref={gridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onCardClick={() => onCardClick(product)} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link to="/shop" className="btn-gold" id="featured-view-all-btn">View All Fragrances</Link>
        </div>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedSection onCardClick={setSelectedProduct} />
      </main>
      <Footer />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  )
}
