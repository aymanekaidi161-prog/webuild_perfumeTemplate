import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useCart } from '../../hooks/useCart'
import useReducedMotion from '../../hooks/useReducedMotion'
import { modalOverlay, drawerPanel, drawerPanelReduced } from '../../data/motion'
import rawProducts from '../../data/products.json'
import type { Product } from '../../data/types'

const productMap = Object.fromEntries((rawProducts as Product[]).map((p) => [p.id, p]))

function MiniBottle() {
  return (
    <svg viewBox="0 0 80 120" className="h-12 w-8 opacity-20" xmlns="http://www.w3.org/2000/svg">
      <rect x="32" y="0" width="16" height="8" rx="2" fill="#C9A96E" />
      <rect x="28" y="8" width="24" height="6" rx="1" fill="#C9A96E" />
      <path d="M28 14 Q14 28 14 38 L14 105 Q14 114 24 114 L56 114 Q66 114 66 105 L66 38 Q66 28 52 14 Z" fill="#C9A96E" opacity="0.15" />
      <path d="M28 14 Q14 28 14 38 L14 105 Q14 114 24 114 L56 114 Q66 114 66 105 L66 38 Q66 28 52 14 Z" fill="none" stroke="#C9A96E" strokeWidth="1.5" opacity="0.4" />
    </svg>
  )
}

function HeartFilledIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  )
}

export default function WishlistDrawer() {
  const reduced = useReducedMotion()
  const { openDrawer, wishlist, toggleWishlist, addToCart, closeDrawer } = useCart()
  const isOpen = openDrawer === 'wishlist'

  // Track "Added ✓" per product
  const [justAdded, setJustAdded] = useState<Set<string>>(new Set())

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') closeDrawer()
  }, [closeDrawer])

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  const handleAddToCart = (productId: string) => {
    addToCart(productId)
    setJustAdded((prev) => new Set(prev).add(productId))
    setTimeout(() => {
      setJustAdded((prev) => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    }, 1000)
  }

  const panelVars = reduced ? drawerPanelReduced : drawerPanel

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="wishlist-drawer-overlay"
          className="fixed inset-0 z-[120] flex justify-end"
          variants={modalOverlay}
          initial="hidden" animate="visible" exit="exit"
          transition={{ duration: 0.25 }}
          onClick={closeDrawer}
        >
          <div className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm" />

          <motion.div
            id="wishlist-drawer-panel"
            className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-charcoal-border bg-charcoal-card"
            variants={panelVars}
            initial="hidden" animate="visible" exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-charcoal-border px-6 py-5">
              <div>
                <h2 className="font-display text-lg font-normal text-cream">Wishlist</h2>
                {wishlist.length > 0 && (
                  <p className="mt-0.5 font-sans text-xs text-cream-muted">
                    {wishlist.length} saved fragrance{wishlist.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <button id="wishlist-drawer-close" onClick={closeDrawer} aria-label="Close wishlist"
                className="text-cream-muted transition-colors hover:text-gold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4" data-lenis-prevent>
              {wishlist.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <span className="text-cream-muted opacity-20">
                    <HeartFilledIcon />
                  </span>
                  <p className="font-sans text-sm text-cream-muted">No saved fragrances yet.</p>
                  <Link to="/shop" onClick={closeDrawer} className="btn-gold text-xs" id="wishlist-empty-browse">
                    Browse the Collection
                  </Link>
                </div>
              ) : (
                <ul className="space-y-5">
                  {wishlist.map((productId) => {
                    const product = productMap[productId]
                    if (!product) return null
                    const added = justAdded.has(productId)
                    return (
                      <li key={productId} className="flex items-start gap-4 border-b border-charcoal-border pb-5">
                        <div className="flex h-16 w-12 shrink-0 items-center justify-center bg-charcoal">
                          <MiniBottle />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-display text-sm font-normal leading-snug text-cream">{product.name}</p>
                            {/* Remove from wishlist */}
                            <button aria-label={`Remove ${product.name} from wishlist`}
                              onClick={() => toggleWishlist(productId)}
                              className="shrink-0 text-gold transition-colors hover:text-cream-muted">
                              <HeartFilledIcon />
                            </button>
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <span className="font-sans text-sm text-gold">
                              ${product.price}
                            </span>
                            <button
                              onClick={() => handleAddToCart(productId)}
                              className={`font-sans text-xs uppercase tracking-[0.1em] transition-colors ${
                                added ? 'text-gold' : 'text-cream-muted hover:text-gold'
                              }`}
                            >
                              {added ? 'Added ✓' : '+ Add to Cart'}
                            </button>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
