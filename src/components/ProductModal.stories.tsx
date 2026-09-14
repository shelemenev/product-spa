import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import ProductModal from './ProductModal';
import { Product } from '../types/types'

const mockProduct: Product = {
  id: 123,
  title: 'Супер-товар',
  price: 4990,
  image: '/images/x100.jpg',
  description: 'Краткое описание товара для примера',
}

const meta: Meta<typeof ProductModal> = {
  title: 'Components/ProductModal',
  component: ProductModal,
};

export default meta;

type Story = StoryObj<typeof ProductModal>;

export const Opened: Story = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(true);

    const handleClose = () => {
      setIsOpen(false);
    };

    return isOpen ? (
      <ProductModal product={mockProduct} onClose={handleClose} />
    ) : (
      <button onClick={() => setIsOpen(true)}>Открыть модальное окно</button>
    );
  },
};
