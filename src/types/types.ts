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

export interface ModalProps {
  product?: Omit<Product, 'id'>
  onClose: () => void
  scrollClassName?: string
}

export interface ProductModalHandle {
  close: () => void
}
