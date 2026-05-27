export interface Product {
  title: string
  id: number
  name: string
  price: number
  image: string
  description: string
}

export interface ModalProps {
  product: Product | null
  onClose: () => void
}
