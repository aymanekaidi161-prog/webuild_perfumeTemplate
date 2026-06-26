import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Product } from '../../data/types'
import useReducedMotion from '../../hooks/useReducedMotion'
import {
  modalOverlay,
  modalPanel,
  modalPanelReduced,
  heartBounce,
  heartBounceReduced,
} from '../../data/motion'

interface ProductModalProps {
  product: Product | null
  onClose: () => void
}

// Reused bottle placeholder for image gallery
function BottlePlaceholder() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <svg
        viewBox="0 0 80 120"
        className="h-32 w-20 opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="32" y="0" width="16" height="8" rx="2" fill="#C9A96E" />
        <rect x="28" y="8" width="24" height="6" rx="1" fill="#C9A96E" />
        <path
          d="M28 14 Q14 28 14 38 L14 105 Q14 114 24 114 L56 114 Q66 114 66 105 L66 38 Q66 28 52 14 Z"
          fill="#C9A96E"
          opacity="0.15"
        />
        <path
          d="M28 14 Q14 28 14 38 L14 105 Q14 114 24 114 L56 114 Q66 114 66 105 L66 38 Q66 28 52 14 Z"
          fill="none"
          stroke="#C9A96E"
          strokeWidth="1.5"
          opacity="0.4"
        />
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
      className="h-5 w-5"
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

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const reduced = useReducedMotion()
  const [wishlisted, setWishlisted] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (!product) return
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [product, handleKeyDown])

  // Reset state when product changes
  useEffect(() => {
    setWishlisted(false)
    setActiveImageIndex(0)
  }, [product?.id])

  const panelVariants = reduced ? modalPanelReduced : modalPanel

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          id="product-modal-overlay"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          variants={modalOverlay}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-charcoal/85 backdrop-blur-sm" />

          {/* Modal panel */}
          <motion.div
            id="product-modal-panel"
            className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden border border-charcoal-border bg-charcoal-card md:flex-row"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              id="modal-close-btn"
              onClick={onClose}
              aria-label="Close modal"
              className="absolute right-4 top-4 z-20 text-cream-muted transition-colors hover:text-gold"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left — Image gallery */}
            <div className="relative flex aspect-[3/4] w-full shrink-0 items-center justify-center bg-charcoal md:w-2/5">
              <BottlePlaceholder />

              {/* Gender badge */}
              <span className="absolute left-4 top-4 border border-gold/30 bg-charcoal/60 px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.15em] text-gold backdrop-blur-sm">
                {product.genderTag}
              </span>

              {/* Gallery dots (for when multiple images exist) */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      aria-label={`View image ${i + 1}`}
                      className={`h-1.5 w-1.5 rounded-full transition-colors ${
                        i === activeImageIndex ? 'bg-gold' : 'bg-cream-muted/30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right — Product details */}
            <div className="flex flex-1 flex-col overflow-y-auto p-6 md:p-8">
              {/* Name */}
              <h2 className="font-display text-2xl font-normal text-cream md:text-3xl">
                {product.name}
              </h2>

              {/* Price */}
              <p className="mt-2 font-sans text-lg font-medium text-gold">
                {product.currency === 'USD' ? '$' : product.currency}
                {product.price}
              </p>

              {/* Divider */}
              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-charcoal-border" />
                <span className="h-1 w-1 rotate-45 bg-gold opacity-30" />
                <span className="h-px flex-1 bg-charcoal-border" />
              </div>

              {/* Long description */}
              <p className="flex-1 font-sans text-sm leading-relaxed text-cream-muted">
                {product.longDescription}
              </p>

              {/* Tags */}
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-charcoal-border px-3 py-1 font-sans text-[10px] uppercase tracking-[0.1em] text-cream-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-8 flex items-center gap-3">
                {/* Heart toggle */}
                <motion.button
                  id={`modal-wishlist-btn-${product.slug}`}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  onClick={() => setWishlisted((w) => !w)}
                  animate={wishlisted ? (reduced ? heartBounceReduced : heartBounce) : {}}
                  className={`flex h-12 w-12 shrink-0 items-center justify-center border transition-colors ${
                    wishlisted
                      ? 'border-gold text-gold'
                      : 'border-charcoal-border text-cream-muted hover:border-gold hover:text-gold'
                  }`}
                >
                  <HeartIcon filled={wishlisted} />
                </motion.button>

                {/* Add to Cart */}
                <button
                  id={`modal-add-to-cart-${product.slug}`}
                  className="btn-gold flex-1 justify-center"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
