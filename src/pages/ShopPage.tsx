import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FilterBar from '../components/shop/FilterBar'
import ProductGrid from '../components/shop/ProductGrid'
import useScrollReveal from '../hooks/useScrollReveal'
import rawProducts from '../data/products.json'
import type { Product } from '../data/types'

const products = rawProducts as Product[]
type FilterValue = 'all' | 'men' | 'women' | 'unisex'

export default function ShopPage() {
  const [searchParams] = useSearchParams()
  const initialFilter = (['men', 'women', 'unisex'].includes(searchParams.get('filter') ?? '') ? searchParams.get('filter') : 'all') as FilterValue
  const [activeFilter, setActiveFilter] = useState<FilterValue>(initialFilter)
  const { t } = useTranslation()

  // Sync filter if user navigates to /shop?filter=X directly
  useEffect(() => {
    const f = searchParams.get('filter')
    if (f && ['men', 'women', 'unisex'].includes(f)) {
      setActiveFilter(f as FilterValue)
    } else {
      setActiveFilter('all')
    }
  }, [searchParams])

  const gridRef = useRef<HTMLDivElement>(null)
  useScrollReveal(gridRef as React.RefObject<HTMLElement | null>, { stagger: 0.06, y: 20 })

  const filtered =
    activeFilter === 'all'
      ? products
      : products.filter((p) => p.genderTag === activeFilter)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-charcoal pt-20 md:pt-24">
        {/* Page header */}
        <section className="section-padding pb-10">
          <div className="container mx-auto px-6 text-center">
            <div className="mb-4 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-gold opacity-30" />
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] rtl:tracking-normal rtl:text-[11px] rtl:font-medium text-gold opacity-60">{t('shop.eyebrow')}</span>
              <span className="h-px w-12 bg-gold opacity-30" />
            </div>
            <h1 className="font-display text-4xl font-normal text-cream md:text-5xl">{t('shop.heading')}</h1>
            <p className="mt-3 font-sans text-sm text-cream-muted">{t('shop.subheading')}</p>
          </div>
        </section>

        {/* Filter + Grid */}
        <section className="container mx-auto px-6 pb-20">
          <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <FilterBar active={activeFilter} onChange={setActiveFilter} />
            <span className="font-sans text-xs text-cream-muted">
              {t('shop.count', { count: filtered.length })}
            </span>
          </div>
          <ProductGrid
            products={filtered}
            containerRef={gridRef}
          />
        </section>
      </main>
      <Footer />
    </>
  )
}
