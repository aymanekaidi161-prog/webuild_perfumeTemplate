import { Link } from 'react-router-dom'
import ProductCard from '../ui/ProductCard'
import type { Product } from '../../data/types'
import type { RefObject } from 'react'

interface ProductGridProps {
  products: Product[]
  containerRef?: RefObject<HTMLDivElement>
}

export default function ProductGrid({ products, containerRef }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-5 py-16 text-center">
        {/* Decorative diamond */}
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-gold opacity-20" />
          <span className="h-1.5 w-1.5 rotate-45 border border-gold opacity-30" />
          <span className="h-px w-10 bg-gold opacity-20" />
        </div>
        <p className="font-display text-xl font-normal text-cream-muted">
          No fragrances found
        </p>
        <p className="max-w-xs font-sans text-xs text-cream-muted/60">
          Nothing matches this filter. Try a different category.
        </p>
        <Link to="/shop" className="btn-gold text-xs">
          View All
        </Link>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      id="product-grid"
      className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  )
}
