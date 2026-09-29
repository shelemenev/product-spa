import type { CartAction, CartState, CartItem } from '../types/types'

const MAX_QUANTITY = 99

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((item) => item.product.id === action.product.id)

      if (existing) {
        if (existing.quantity >= MAX_QUANTITY) return state
        return {
          items: state.items.map((item) =>
            item.product.id === action.product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }

      return { items: [...state.items, { product: action.product, quantity: 1 }] }
    }

    case 'REMOVE':
      return { items: state.items.filter((item) => item.product.id !== action.id) }

    case 'INCREMENT': {
      const existing = state.items.find((item) => item.product.id === action.id)
      if (!existing || existing.quantity >= MAX_QUANTITY) return state
      return {
        items: state.items.map((item) =>
          item.product.id === action.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      }
    }

    case 'DECREMENT': {
      const existing = state.items.find((item) => item.product.id === action.id)
      if (!existing) return state
      if (existing.quantity <= 1) {
        return { items: state.items.filter((item) => item.product.id !== action.id) }
      }
      return {
        items: state.items.map((item) =>
          item.product.id === action.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      }
    }

    case 'CLEAR':
      return { items: [] }

    case 'LOAD':
      return { items: action.items }

    default:
      return state
  }
}

export const getCartTotal = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

export const getCartCount = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.quantity, 0)