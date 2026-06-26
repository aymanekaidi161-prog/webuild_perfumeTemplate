import { useEffect, useCallback } from 'react'
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

export default function CartDrawer() {
  const reduced = useReducedMotion()
  const { openDrawer, cartItems, removeFromCart, updateQuantity, openCartBuy, closeDrawer } = useCart()
  const isOpen = openDrawer === 'cart'

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

  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0)
  const subtotal   = cartItems.reduce((s, i) => s + (productMap[i.productId]?.price ?? 0) * i.quantity, 0)
  const panelVars  = reduced ? drawerPanelReduced : drawerPanel

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="cart-drawer-overlay"
          className="fixed inset-0 z-[120] flex justify-end"
          variants={modalOverlay}
          initial="hidden" animate="visible" exit="exit"
          transition={{ duration: 0.25 }}
          onClick={closeDrawer}
        >
          <div className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm" />

          <motion.div
            id="cart-drawer-panel"
            className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-charcoal-border bg-charcoal-card"
            variants={panelVars}
            initial="hidden" animate="visible" exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-charcoal-border px-6 py-5">
              <div>
                <h2 className="font-display text-lg font-normal text-cream">Your Cart</h2>
                {totalItems > 0 && (
                  <p className="mt-0.5 font-sans text-xs text-cream-muted">
                    {totalItems} item{totalItems !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <button id="cart-drawer-close" onClick={closeDrawer} aria-label="Close cart"
                className="text-cream-muted transition-colors hover:text-gold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4" data-lenis-prevent>
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <MiniBottle />
                  <p className="font-sans text-sm text-cream-muted">Your cart is empty.</p>
                  <Link to="/shop" onClick={closeDrawer} className="btn-gold text-xs" id="cart-empty-browse">
                    Explore the Collection
                  </Link>
                </div>
              ) : (
                <ul className="space-y-5">
                  {cartItems.map((item) => {
                    const product = productMap[item.productId]
                    if (!product) return null
                    return (
                      <li key={item.productId} className="flex items-start gap-4 border-b border-charcoal-border pb-5">
                        <div className="flex h-16 w-12 shrink-0 items-center justify-center bg-charcoal">
                          <MiniBottle />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-display text-sm font-normal leading-snug text-cream">{product.name}</p>
                            <button aria-label={`Remove ${product.name}`}
                              onClick={() => removeFromCart(item.productId)}
                              className="shrink-0 text-cream-muted transition-colors hover:text-gold">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            {/* Quantity stepper */}
                            <div className="flex items-center border border-charcoal-border">
                              <button aria-label="Decrease quantity"
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="flex h-7 w-7 items-center justify-center text-cream-muted transition-colors hover:text-gold">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                </svg>
                              </button>
                              <span className="min-w-[2rem] text-center font-sans text-xs text-cream">{item.quantity}</span>
                              <button aria-label="Increase quantity"
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="flex h-7 w-7 items-center justify-center text-cream-muted transition-colors hover:text-gold">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                              </button>
                            </div>
                            <span className="font-sans text-sm text-cream">${product.price * item.quantity}</span>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-charcoal-border px-6 py-5">
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-sans text-xs uppercase tracking-[0.1em] text-cream-muted">Subtotal</span>
                  <span className="font-sans text-lg font-medium text-gold">${subtotal}</span>
                </div>
                <button id="cart-proceed-to-buy"
                  onClick={() => { openCartBuy(); closeDrawer() }}
                  className="btn-gold-filled mb-3 w-full justify-center">
                  Proceed to Buy
                </button>
                <button onClick={closeDrawer}
                  className="w-full py-2 text-center font-sans text-xs text-cream-muted transition-colors hover:text-cream">
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
