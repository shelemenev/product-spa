export interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
}

export interface ModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}
