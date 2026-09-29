import { test, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ProductCard from './ProductCard'
import { Product } from '../../types/types'
import { CartProvider } from '../../context/CartContext'

const mockProduct: Product = {
  id: 1,
  title: 'Беспроводные наушники',
  price: 4990,
  image: '/images/headphones.jpg',
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

test('отображает заголовок, цену и картинку', () => {
  render(<ProductCard product={mockProduct} />, { wrapper })

  expect(screen.getByAltText(mockProduct.title)).toBeInTheDocument()
  expect(screen.getByText(mockProduct.title)).toBeInTheDocument()
  expect(screen.getByText(`${mockProduct.price.toLocaleString()} руб.`)).toBeInTheDocument()
})

test('вызывает onClick при клике на карточку', () => {
  const onCardClick = vi.fn()

  render(<ProductCard product={mockProduct} onClick={onCardClick} />, { wrapper })

  const cardElement = screen.getByRole('article')
  expect(cardElement).toBeInTheDocument()

  fireEvent.click(cardElement)

  expect(onCardClick).toHaveBeenCalledTimes(1)
  expect(onCardClick).toHaveBeenCalledWith(mockProduct)
})

test('вызывает onClick при нажатии Enter на карточке', () => {
  const onCardClick = vi.fn()

  render(<ProductCard product={mockProduct} onClick={onCardClick} />, { wrapper })

  const cardElement = screen.getByRole('article')
  expect(cardElement).toBeInTheDocument()

  cardElement.focus()

  fireEvent.keyDown(cardElement, { key: 'Enter' })

  expect(onCardClick).toHaveBeenCalledTimes(1)
  expect(onCardClick).toHaveBeenCalledWith(mockProduct)
})

test('вызывает onClick при нажатии Space на карточке', () => {
  const onCardClick = vi.fn()

  render(<ProductCard product={mockProduct} onClick={onCardClick} />, { wrapper })

  const cardElement = screen.getByRole('article')
  expect(cardElement).toBeInTheDocument()

  cardElement.focus()

  fireEvent.keyDown(cardElement, { key: ' ' })

  expect(onCardClick).toHaveBeenCalledTimes(1)
  expect(onCardClick).toHaveBeenCalledWith(mockProduct)
})

test('не вызывает onClick при нажатии других клавиш', () => {
  const onCardClick = vi.fn()

  render(<ProductCard product={mockProduct} onClick={onCardClick} />, { wrapper })

  const cardElement = screen.getByRole('article')
  cardElement.focus()

  fireEvent.keyDown(cardElement, { key: 'ArrowUp' })

  expect(onCardClick).not.toHaveBeenCalled()
})