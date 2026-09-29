import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import { cartReducer, getCartCount, getCartTotal } from './cartReducer'
import type { CartContextValue, CartItem, Product } from '../types/types'

const STORAGE_KEY = 'product-spa-cart'

export const CartContext = createContext<CartContextValue | null>(null)

const loadFromStorage = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(
    cartReducer,
    undefined,
    () => ({ items: loadFromStorage() })
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  }, [state.items])

  const value: CartContextValue = {
    items: state.items,
    count: getCartCount(state.items),
    total: getCartTotal(state.items),
    addToCart: (product: Product) => dispatch({ type: 'ADD', product }),
    removeFromCart: (id: number) => dispatch({ type: 'REMOVE', id }),
    increment: (id: number) => dispatch({ type: 'INCREMENT', id }),
    decrement: (id: number) => dispatch({ type: 'DECREMENT', id }),
    clearCart: () => dispatch({ type: 'CLEAR' }),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}