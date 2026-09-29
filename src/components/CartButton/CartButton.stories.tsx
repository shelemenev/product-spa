import type { Meta, StoryObj } from '@storybook/react'
import { CartProvider } from '../../context/CartContext'
import { CartButton } from './CartButton'
import type { CartItem } from '../../types/types'

const mockProduct1: CartItem['product'] = {
  id: 1,
  title: 'Товар 1',
  price: 1990,
  image: '/images/a.jpg',
  description: 'Описание первого товара',
}

const mockProduct2: CartItem['product'] = {
  id: 2,
  title: 'Товар 2',
  price: 3490,
  image: '/images/b.jpg',
  description: 'Описание второго товара',
}

const mockItems: CartItem[] = [
  { product: mockProduct1, quantity: 2 },
  { product: mockProduct2, quantity: 1 },
]

const meta: Meta<typeof CartButton> = {
  title: 'Components/CartButton',
  component: CartButton,
  tags: ['autodocs'],
  argTypes: {
    onClick: {
      description: 'Колбэк клика по кнопке корзины',
      table: {
        category: 'Колбэки',
        type: { summary: '() => void' },
      },
      action: 'onClick',
      control: { disable: true },
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

type Story = StoryObj<typeof CartButton>

export const EmptyCart: Story = {
  name: 'Пустая корзина',
  render: () => <CartButton onClick={() => console.log('click')} />,
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
  render: () => <CartButton onClick={() => console.log('click')} />,
}