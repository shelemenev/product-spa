export interface Product {
  id: number
  title: string
  price: number
  image: string
  description?: string
}

export interface ProductCardProps {
  product: Product
  onClick?: (product: Product) => void
}

export interface ProductModalProps {
  product: Product
  onClose: () => void
  scrollClassName?: string
}

export interface ProductModalHandle {
  close: () => void
}

export interface CartItem {
  product: Product
  quantity: number
}

export type CartAction =
  | { type: 'ADD'; product: Product }
  | { type: 'REMOVE'; id: number }
  | { type: 'INCREMENT'; id: number }
  | { type: 'DECREMENT'; id: number }
  | { type: 'CLEAR' }
  | { type: 'LOAD'; items: CartItem[] }

export interface CartState {
  items: CartItem[]
}

export interface CartContextValue {
  items: CartItem[]
  count: number
  total: number
  addToCart: (product: Product) => void
  removeFromCart: (id: number) => void
  increment: (id: number) => void
  decrement: (id: number) => void
  clearCart: () => void
}

export interface CartButtonProps {
  onClick: () => void
}

export interface CartModalProps {
  onClose: () => void
}