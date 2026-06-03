export interface Product {
  title: string
  id: number
  price: number
  image: string
  description: string
}

export interface ModalProps {
  product: Product | null
  onClose: () => void
}
