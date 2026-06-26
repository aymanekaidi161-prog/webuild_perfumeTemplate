import ProductCard from '../ui/ProductCard'
import type { Product } from '../../data/types'

interface ProductGridProps {
  products: Product[]
  onCardClick?: (product: Product) => void
}

export default function ProductGrid({ products, onCardClick }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <div className="h-px w-12 bg-gold opacity-30" />
        <p className="font-sans text-sm text-cream-muted">No fragrances found in this category.</p>
      </div>
    )
  }

  return (
    <div
      id="product-grid"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onCardClick={onCardClick ? () => onCardClick(product) : undefined}
        />
      ))}
    </div>
  )
}
