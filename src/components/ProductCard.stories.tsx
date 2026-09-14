import { Meta, StoryObj } from '@storybook/react'
import ProductCard from './ProductCard'
import { Product, ProductCardProps } from '../types/types'

const mockProduct: Product = {
  id: 123,
  title: 'Супер-товар',
  price: 4990,
  image: '/images/x100.jpg',
  description: 'Краткое описание товара для примера',
}

const handleClick = () => undefined

const meta: Meta<ProductCardProps> = {
  title: 'Components/ProductCard',
  component: ProductCard,
  argTypes: {
    onClick: {
      action: 'onClick',
      control: { disable: true },
    },
  },
}

export default meta

type Story = StoryObj<ProductCardProps>

const ProductCardTemplate = (product: Product) => {
  return <div style={{width: 350}}>
    <ProductCard product={product} onClick={handleClick}></ProductCard>
  </div>
}

export const Default: Story = {
  render: () => ProductCardTemplate(mockProduct)
}

export const WithLongTitle: Story = {
  render: () => ProductCardTemplate({
      ...mockProduct,
      title:
        'Очень длинный заголовок товара, который должен переноситься и не ломать вёрстку карточки при разных размерах экрана',
    })
}

export const WithoutImage: Story = {
  render: () => ProductCardTemplate({ ...mockProduct, image: '' })
}

export const WithoutDescription: Story = {
  render: () => ProductCardTemplate({ ...mockProduct, description: undefined })
}
