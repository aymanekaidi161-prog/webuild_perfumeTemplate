import { useState } from 'react'
import { motion } from 'motion/react'
import type { Product } from '../../data/types'
import useReducedMotion from '../../hooks/useReducedMotion'
import {
  cardHover,
  cardHoverReduced,
  heartBounce,
  heartBounceReduced,
} from '../../data/motion'

interface ProductCardProps {
  product: Product
  onCardClick?: () => void
}

// SVG perfume bottle silhouette used as image placeholder
function BottlePlaceholder() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <svg
        viewBox="0 0 80 120"
        className="h-24 w-16 opacity-20"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Bottle neck */}
        <rect x="32" y="0" width="16" height="8" rx="2" className="text-gold" fill="#C9A96E" />
        {/* Collar */}
        <rect x="28" y="8" width="24" height="6" rx="1" fill="#C9A96E" />
        {/* Shoulder curve */}
        <path d="M28 14 Q14 28 14 38 L14 105 Q14 114 24 114 L56 114 Q66 114 66 105 L66 38 Q66 28 52 14 Z" fill="#C9A96E" opacity="0.15" />
        <path d="M28 14 Q14 28 14 38 L14 105 Q14 114 24 114 L56 114 Q66 114 66 105 L66 38 Q66 28 52 14 Z" fill="none" stroke="#C9A96E" strokeWidth="1.5" opacity="0.4" />
        {/* Label area */}
        <rect x="22" y="52" width="36" height="36" rx="1" fill="#C9A96E" opacity="0.08" />
      </svg>
      <span className="font-sans text-xs uppercase tracking-widest text-cream-muted opacity-40">
        Image coming soon
      </span>
    </div>
  )
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  )
}

export default function ProductCard({ product, onCardClick }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false)
  const reduced = useReducedMotion()

  return (
    <motion.article
      id={`product-card-${product.slug}`}
      className="group flex cursor-pointer flex-col border border-charcoal-border bg-charcoal-card"
      whileHover={reduced ? cardHoverReduced : cardHover}
      onClick={onCardClick}
    >
      {/* Image area */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-charcoal">
        <BottlePlaceholder />

        {/* Gender tag badge */}
        <span className="absolute left-3 top-3 border border-gold/30 bg-charcoal/60 px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.15em] text-gold backdrop-blur-sm">
          {product.genderTag}
        </span>

        {/* Wishlist button */}
        <motion.button
          id={`wishlist-btn-${product.slug}`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={(e) => {
            e.stopPropagation()
            setWishlisted((w) => !w)
          }}
          animate={wishlisted ? (reduced ? heartBounceReduced : heartBounce) : {}}
          className={`absolute right-3 top-3 transition-colors ${
            wishlisted ? 'text-gold' : 'text-cream-muted hover:text-gold'
          }`}
        >
          <HeartIcon filled={wishlisted} />
        </motion.button>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Name */}
        <h3 className="font-display mb-1 text-base font-normal leading-snug text-cream">
          {product.name}
        </h3>

        {/* Short description */}
        <p className="mb-4 flex-1 font-sans text-xs leading-relaxed text-cream-muted line-clamp-2">
          {product.shortDescription}
        </p>

        {/* Price row */}
        <div className="mb-4 flex items-center justify-between">
          <span className="font-sans text-sm font-medium text-cream">
            {product.currency === 'USD' ? '$' : product.currency}{product.price}
          </span>
        </div>

        {/* CTA */}
        <button
          id={`add-to-cart-btn-${product.slug}`}
          className="btn-gold w-full justify-center text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          Add to Cart
        </button>
      </div>
    </motion.article>
  )
}
