import { createContext, useReducer, useMemo, type ReactNode } from 'react'
import type { Product } from '../data/types'

// ─── Types ───────────────────────────────────────────────

export interface CartItem {
  productId: string
  quantity: number
}

export type BuyMode =
  | null
  | { type: 'single'; product: Product }
  | { type: 'cart' }

interface CartState {
  cartItems: CartItem[]
  wishlist: string[]
  openDrawer: 'cart' | 'wishlist' | null
  buyMode: BuyMode
}

type CartAction =
  | { type: 'ADD_TO_CART'; productId: string }
  | { type: 'REMOVE_FROM_CART'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; qty: number }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_WISHLIST'; productId: string }
  | { type: 'OPEN_DRAWER'; drawer: 'cart' | 'wishlist' }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'OPEN_BUY_NOW'; product: Product }
  | { type: 'OPEN_CART_BUY' }
  | { type: 'CLOSE_BUY' }

export interface CartContextValue extends CartState {
  addToCart:          (productId: string) => void
  removeFromCart:     (productId: string) => void
  updateQuantity:     (productId: string, qty: number) => void
  clearCart:          () => void
  toggleWishlist:     (productId: string) => void
  openCartDrawer:     () => void
  openWishlistDrawer: () => void
  closeDrawer:        () => void
  openBuyNow:         (product: Product) => void
  openCartBuy:        () => void
  closeBuy:           () => void
  totalItems:         number
  totalWishlist:      number
}

// ─── Reducer ─────────────────────────────────────────────

const initialState: CartState = {
  cartItems: [],
  wishlist: [],
  openDrawer: null,
  buyMode: null,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.cartItems.find((i) => i.productId === action.productId)
      if (existing) {
        return {
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.productId === action.productId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }
      }
      return { ...state, cartItems: [...state.cartItems, { productId: action.productId, quantity: 1 }] }
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cartItems: state.cartItems.filter((i) => i.productId !== action.productId) }
    case 'UPDATE_QUANTITY':
      if (action.qty <= 0) {
        return { ...state, cartItems: state.cartItems.filter((i) => i.productId !== action.productId) }
      }
      return {
        ...state,
        cartItems: state.cartItems.map((i) =>
          i.productId === action.productId ? { ...i, quantity: action.qty } : i
        ),
      }
    case 'CLEAR_CART':
      return { ...state, cartItems: [] }
    case 'TOGGLE_WISHLIST': {
      const has = state.wishlist.includes(action.productId)
      return {
        ...state,
        wishlist: has
          ? state.wishlist.filter((id) => id !== action.productId)
          : [...state.wishlist, action.productId],
      }
    }
    case 'OPEN_DRAWER':
      return { ...state, openDrawer: action.drawer }
    case 'CLOSE_DRAWER':
      return { ...state, openDrawer: null }
    case 'OPEN_BUY_NOW':
      return { ...state, buyMode: { type: 'single', product: action.product }, openDrawer: null }
    case 'OPEN_CART_BUY':
      return { ...state, buyMode: { type: 'cart' }, openDrawer: null }
    case 'CLOSE_BUY':
      return { ...state, buyMode: null }
    default:
      return state
  }
}

// ─── Context ─────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const value = useMemo<CartContextValue>(
    () => ({
      ...state,
      addToCart:          (productId) => dispatch({ type: 'ADD_TO_CART', productId }),
      removeFromCart:     (productId) => dispatch({ type: 'REMOVE_FROM_CART', productId }),
      updateQuantity:     (productId, qty) => dispatch({ type: 'UPDATE_QUANTITY', productId, qty }),
      clearCart:          () => dispatch({ type: 'CLEAR_CART' }),
      toggleWishlist:     (productId) => dispatch({ type: 'TOGGLE_WISHLIST', productId }),
      openCartDrawer:     () => dispatch({ type: 'OPEN_DRAWER', drawer: 'cart' }),
      openWishlistDrawer: () => dispatch({ type: 'OPEN_DRAWER', drawer: 'wishlist' }),
      closeDrawer:        () => dispatch({ type: 'CLOSE_DRAWER' }),
      openBuyNow:         (product) => dispatch({ type: 'OPEN_BUY_NOW', product }),
      openCartBuy:        () => dispatch({ type: 'OPEN_CART_BUY' }),
      closeBuy:           () => dispatch({ type: 'CLOSE_BUY' }),
      totalItems:         state.cartItems.reduce((s, i) => s + i.quantity, 0),
      totalWishlist:      state.wishlist.length,
    }),
    [state]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Note: useCart hook lives in src/hooks/useCart.ts to satisfy react-refresh rules
export { CartContext }
