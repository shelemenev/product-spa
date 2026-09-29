import type { Meta, StoryObj } from '@storybook/react'
import { CartProvider } from '../../context/CartContext'
import { CartButton } from './CartButton'

const meta: Meta<typeof CartButton> = {
  title: 'Components/CartButton',
  component: CartButton,
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

type Story = StoryObj<typeof CartButton>

export const Default: Story = {
  render: () => <CartButton onClick={() => console.log('click')} />,
}