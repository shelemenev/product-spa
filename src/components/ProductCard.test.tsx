import { test, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ProductCard from './ProductCard'

const mockProduct = {
  id: 1,
  title: 'Беспроводные наушники',
  price: 4990,
  image: '/images/headphones.jpg',
}

test('отображает заголовок, цену и картинку', () => {
  render(<ProductCard product={mockProduct} />)

  expect(screen.getByAltText(mockProduct.title)).toBeInTheDocument()
  expect(screen.getByText(mockProduct.title)).toBeInTheDocument()
  expect(screen.getByText(mockProduct.price.toLocaleString() + ' руб.')).toBeInTheDocument()
})

test('вызывает onClick при клике на карточку', () => {
  const onCardClick = vi.fn()

  render(<ProductCard product={mockProduct} onClick={onCardClick} />)

  const cardElement = screen.getByRole('article')
  expect(cardElement).toBeInTheDocument()

  fireEvent.click(cardElement)

  expect(onCardClick).toHaveBeenCalledTimes(1)
  expect(onCardClick).toHaveBeenCalledWith(mockProduct)
})
