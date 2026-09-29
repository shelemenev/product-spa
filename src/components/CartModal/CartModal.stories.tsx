import type { Meta, StoryObj } from '@storybook/react'
import { CartProvider } from '../../context/CartContext'
import { CartModal } from './CartModal'

const meta: Meta<typeof CartModal> = {
  title: 'Components/CartModal',
  component: CartModal,
  tags: ['autodocs'],
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
  render: () => <CartModal onClose={() => console.log('close')} />,
}