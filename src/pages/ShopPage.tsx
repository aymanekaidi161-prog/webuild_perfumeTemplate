import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FilterBar from '../components/shop/FilterBar'
import ProductGrid from '../components/shop/ProductGrid'
import ProductModal from '../components/ui/ProductModal'
import rawProducts from '../data/products.json'
import type { Product } from '../data/types'

const products = rawProducts as Product[]

type FilterValue = 'all' | 'men' | 'women' | 'unisex'

export default function ShopPage() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

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
            {/* Ornament */}
            <div className="mb-4 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-gold opacity-30" />
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold opacity-60">
                The House
              </span>
              <span className="h-px w-12 bg-gold opacity-30" />
            </div>

            <h1 className="font-display text-4xl font-normal text-cream md:text-5xl">
              The Collection
            </h1>
            <p className="mt-3 font-sans text-sm text-cream-muted">
              Twelve hand-composed fragrances. Each with a story of its own.
            </p>
          </div>
        </section>

        {/* Filter + Grid */}
        <section className="container mx-auto px-6 pb-20">
          <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <FilterBar active={activeFilter} onChange={setActiveFilter} />
            <span className="font-sans text-xs text-cream-muted">
              {filtered.length} fragrance{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
          <ProductGrid products={filtered} onCardClick={setSelectedProduct} />
        </section>
      </main>
      <Footer />

      {/* Product detail modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  )
}
