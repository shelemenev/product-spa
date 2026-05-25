export interface Product {
  title: any
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
