import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import type { Product } from '../../data/types'
import useReducedMotion from '../../hooks/useReducedMotion'
import { useCart } from '../../hooks/useCart'
import { cardHover, cardHoverReduced, heartBounce, heartBounceReduced } from '../../data/motion'

interface ProductCardProps {
  product: Product
}



function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  )
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate()
  const reduced = useReducedMotion()
  const { wishlist, toggleWishlist, addToCart } = useCart()
  const { t } = useTranslation()
  const wishlisted = wishlist.includes(product.id)
  const [justAdded, setJustAdded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart(product.id)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1000)
  }

  return (
    <motion.article
      id={`product-card-${product.slug}`}
      className="group flex cursor-pointer flex-col border border-charcoal-border bg-charcoal-card"
      whileHover={reduced ? cardHoverReduced : cardHover}
      onClick={() => navigate(`/product/${product.slug}`)}
    >
      {/* Image area */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-charcoal">
        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" loading="lazy" />
        {/* Gender tag — logical start (flips in RTL) */}
        <span className="absolute start-3 top-3 border border-gold/30 bg-charcoal/60 px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.15em] rtl:tracking-normal rtl:text-[11px] rtl:font-medium text-gold backdrop-blur-sm">
          {t(`filter.${product.genderTag}`)}
        </span>
        {/* Heart — logical end (flips in RTL) */}
        <motion.button
          id={`wishlist-btn-${product.slug}`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id) }}
          animate={wishlisted ? (reduced ? heartBounceReduced : heartBounce) : {}}
          className={`absolute end-3 top-3 transition-colors ${wishlisted ? 'text-gold' : 'text-cream-muted hover:text-gold'}`}
        >
          <HeartIcon filled={wishlisted} />
        </motion.button>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <h3 className="font-display mb-1 text-sm font-normal leading-snug text-cream sm:text-base">{t(`products.${product.id}.name`, { defaultValue: product.name })}</h3>
        <p className="mb-4 flex-1 font-sans text-xs leading-relaxed text-cream-muted line-clamp-2">{t(`products.${product.id}.shortDescription`, { defaultValue: product.shortDescription })}</p>
        <div className="mb-4">
          <span className="font-sans text-sm font-medium text-cream">
            {product.currency === 'USD' ? '$' : product.currency}{product.price}
          </span>
        </div>
        <button
          id={`add-to-cart-btn-${product.slug}`}
          className={`btn-gold w-full justify-center text-xs transition-colors ${justAdded ? 'text-gold' : ''}`}
          onClick={handleAddToCart}
        >
          {justAdded ? t('card.added') : t('card.addToCart')}
        </button>
      </div>
    </motion.article>
  )
}
