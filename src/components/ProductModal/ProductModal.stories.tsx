import type { Meta, StoryObj } from '@storybook/react'
import ProductModal from './ProductModal'
import { CartProvider } from '../../context/CartContext'
import type { ProductModalProps, Product } from '../../types/types'

const mockProduct: Product = {
  id: 1,
  title: 'Товар 1',
  price: 1990,
  image: '/images/a.jpg',
  description: 'Описание первого товара',
}

const meta: Meta<ProductModalProps> = {
  title: 'Components/ProductModal',
  component: ProductModal,
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
    onClose: {
      description: 'Колбэк закрытия модалки',
      table: { category: 'Колбэки', type: { summary: '() => void' } },
      action: 'onClose',
    },
    scrollClassName: {
      description: 'CSS-класс для скролл-контейнера',
      table: { category: 'Стили', type: { summary: 'string' } },
      control: 'text',
    },
  },
  args: {
    product: mockProduct,
  },
}

export default meta

type Story = StoryObj<ProductModalProps>

export const Default: Story = {
  name: 'По умолчанию',
}

export const WithoutDescription: Story = {
  name: 'Без описания',
  args: {
    product: { ...mockProduct, description: undefined },
  },
}