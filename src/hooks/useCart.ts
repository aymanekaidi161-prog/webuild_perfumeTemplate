import { useContext } from 'react'
import { CartContext } from '../context/CartContext'
import type { CartContextValue } from '../context/CartContext'

/**
 * Access the global cart/wishlist state and actions.
 * Must be used inside <CartProvider>.
 */
export default function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}

export { useCart }
