import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { CartProvider, useCart } from '../../context/CartContext'
import { CartModal } from './CartModal'
import type { Product } from '../../types/types'

const product1: Product = {
  id: 1,
  title: 'Наушники',
  price: 4990,
  image: '/headphones.jpg',
}
const product2: Product = {
  id: 2,
  title: 'Клавиатура',
  price: 7990,
  image: '/keyboard.jpg',
}

const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
  <CartProvider>{children}</CartProvider>
)

const FillCart = ({ products }: { products: Product[] }) => {
  const { addToCart } = useCart()
  return (
    <button
      data-testid="fill-cart"
      onClick={() => products.forEach(p => addToCart(p))}
    >
      Fill
    </button>
  )
}

beforeEach(() => {
  vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => undefined)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('CartModal', () => {
  test('показывает пустое состояние и заголовок без счётчика', () => {
    render(<CartModal onClose={vi.fn()} />, { wrapper: Wrapper })

    expect(screen.getByRole('heading', { level: 2, name: 'Корзина' })).toBeInTheDocument()
    expect(screen.getByText(/Корзина пуста/i)).toBeInTheDocument()
  })

  test('рендерит товары, считает total и показывает счётчик в заголовке', () => {
    render(
      <Wrapper>
        <FillCart products={[product1, product2]} />
        <CartModal onClose={vi.fn()} />
      </Wrapper>
    )

    fireEvent.click(screen.getByTestId('fill-cart'))

    expect(screen.getByText(product1.title)).toBeInTheDocument()
    expect(screen.getByText(product2.title)).toBeInTheDocument()

    const total = product1.price + product2.price
    expect(screen.getByText(`${total} ₽`)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Корзина (2)' })).toBeInTheDocument()
  })

  test('increment/decrement меняют количество и суммы', () => {
    render(
        <Wrapper>
        <FillCart products={[product1]} />
        <CartModal onClose={vi.fn()} />
        </Wrapper>
    )
    fireEvent.click(screen.getByTestId('fill-cart'))

    const itemLi = screen.getByText(product1.title).closest('li') as HTMLElement
    const incBtn = within(itemLi).getByRole('button', { name: 'Увеличить' })
    const decBtn = within(itemLi).getByRole('button', { name: 'Уменьшить' })

    expect(within(itemLi).getByText('1')).toBeInTheDocument()
    expect(screen.getAllByText(`${product1.price} ₽`)).toHaveLength(3)
    expect(screen.getByRole('heading', { level: 2, name: 'Корзина (1)' })).toBeInTheDocument()

    fireEvent.click(incBtn)
    expect(within(itemLi).getByText('2')).toBeInTheDocument()
    expect(within(itemLi).getByText(`${product1.price} ₽`)).toBeInTheDocument()
    expect(within(itemLi).getByText(`${product1.price * 2} ₽`)).toBeInTheDocument()
    expect(screen.getAllByText(`${product1.price * 2} ₽`)).toHaveLength(2)
    expect(screen.getByRole('heading', { level: 2, name: 'Корзина (2)' })).toBeInTheDocument()

    fireEvent.click(decBtn)
    expect(within(itemLi).getByText('1')).toBeInTheDocument()
    expect(screen.getAllByText(`${product1.price} ₽`)).toHaveLength(3)
    expect(screen.getByRole('heading', { level: 2, name: 'Корзина (1)' })).toBeInTheDocument()
  })

  test('remove удаляет товар и пересчитывает total/счётчик', () => {
    render(
        <Wrapper>
        <FillCart products={[product1, product2]} />
        <CartModal onClose={vi.fn()} />
        </Wrapper>
    )
    fireEvent.click(screen.getByTestId('fill-cart'))

    const itemLi = screen.getByText(product1.title).closest('li') as HTMLElement
    const removeBtn = within(itemLi).getByRole('button', { name: 'Удалить' })

    fireEvent.click(removeBtn)

    expect(screen.queryByText(product1.title)).not.toBeInTheDocument()
    expect(screen.getByText(product2.title)).toBeInTheDocument()
    expect(screen.getAllByText(`${product2.price} ₽`)).toHaveLength(3)
    expect(screen.getByRole('heading', { level: 2, name: 'Корзина (1)' })).toBeInTheDocument()
  })

  test('кнопка "Очистить" удаляет все товары и показывает пустое состояние', () => {
    render(
      <Wrapper>
        <FillCart products={[product1, product2]} />
        <CartModal onClose={vi.fn()} />
      </Wrapper>
    )
    fireEvent.click(screen.getByTestId('fill-cart'))

    fireEvent.click(screen.getByRole('button', { name: 'Очистить' }))

    expect(screen.getByText(/Корзина пуста/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Корзина' })).toBeInTheDocument()
  })

  test('закрывается по клику на оверлей и не закрывается по клику по контенту', () => {
    const onClose = vi.fn()
    const { container } = render(<CartModal onClose={onClose} />, { wrapper: Wrapper })

    const overlay = container.firstChild as HTMLElement
    const content = overlay.firstChild as HTMLElement

    fireEvent.click(content)
    expect(onClose).not.toHaveBeenCalled()

    fireEvent.click(overlay)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('кнопка "Закрыть" вызывает onClose', () => {
    const onClose = vi.fn()
    render(<CartModal onClose={onClose} />, { wrapper: Wrapper })

    fireEvent.click(screen.getByRole('button', { name: 'Закрыть' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})