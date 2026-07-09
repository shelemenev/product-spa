export interface Product {
  id: number
  title: string
  price: number
  image: string
  description: string
}

export type ProductForModal = Omit<Product, 'id'>

export interface ModalProps {
  product?: ProductForModal
  onClose: () => void
}

