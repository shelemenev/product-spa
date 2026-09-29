import type { Meta, StoryObj } from '@storybook/react'
import ProductCard from './ProductCard'
import { CartProvider } from '../../context/CartContext'
import type { ProductCardProps, Product } from '../../types/types'

const mockProduct: Product = {
  id: 1,
  title: 'Товар 1',
  price: 1990,
  image: '/images/a.jpg',
  description: 'Описание первого товара',
}

const meta: Meta<ProductCardProps> = {
  title: 'Components/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CartProvider>
        <Story />
      </CartProvider>
    ),
  ],
  argTypes: {
    product: {
      description: 'Объект товара',
      table: { category: 'Данные', type: { summary: 'Product' } },
      control: { disable: true },
    },
    onClick: {
      description: 'Колбэк клика по карточке',
      table: { category: 'Колбэки', type: { summary: '(product: Product) => void' } },
      action: 'onClick',
    },
  },
  args: {
    product: mockProduct,
  },
}

export default meta

type Story = StoryObj<ProductCardProps>

export const Default: Story = {
  name: 'По умолчанию',
}

export const WithoutDescription: Story = {
  name: 'Без описания',
  args: {
    product: { ...mockProduct, description: undefined },
  },
}