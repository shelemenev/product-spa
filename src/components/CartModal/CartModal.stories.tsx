import type { Meta, StoryObj } from '@storybook/react'
import { CartProvider } from '../../context/CartContext'
import { CartModal } from './CartModal'
import type { CartItem } from '../../types/types'

const mockItems: CartItem[] = [
  { product: { id: 1, title: 'Товар 1', price: 1990, image: '/images/a.jpg', description: 'Описание 1' }, quantity: 2 },
  { product: { id: 2, title: 'Товар 2', price: 3490, image: '/images/b.jpg', description: 'Описание 2' }, quantity: 1 },
]

const singleItem: CartItem[] = [
  { product: { id: 1, title: 'Единственный товар', price: 5990, image: '/images/c.jpg', description: 'Описание' }, quantity: 1 },
]

const meta: Meta<typeof CartModal> = {
  title: 'Components/CartModal',
  component: CartModal,
  tags: ['autodocs'],
  argTypes: {
    onClose: {
      description: 'Колбэк закрытия модального окна корзины',
      table: {
        category: 'Колбэки',
        type: { summary: '() => void' },
      },
      action: 'onClose',
    },
  },
  decorators: [
    (Story) => (
      <CartProvider>
        <Story />
      </CartProvider>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof CartModal>

export const Empty: Story = {
  name: 'Пустая корзина',
  render: () => <CartModal onClose={() => console.log('close')} />,
}

export const WithItems: Story = {
  name: 'С товарами',
  decorators: [
    (Story) => (
      <CartProvider initialItems={mockItems}>
        <Story />
      </CartProvider>
    ),
  ],
  render: () => <CartModal onClose={() => console.log('close')} />,
}

export const SingleItem: Story = {
  name: 'Один товар',
  decorators: [
    (Story) => (
      <CartProvider initialItems={singleItem}>
        <Story />
      </CartProvider>
    ),
  ],
  render: () => <CartModal onClose={() => console.log('close')} />,
}