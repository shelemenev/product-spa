import { describe, test, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from './CartContext'
import { Product } from '../types/types'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

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

const product3: Product = {
  id: 3,
  title: 'Мышь',
  price: 2990,
  image: '/mouse.jpg',
}

beforeEach(() => {
  vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => undefined)
})

describe('CartContext scenarios', () => {
  test('корзина пуста изначально', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    expect(result.current.items).toHaveLength(0)
    expect(result.current.total).toBe(0)
    expect(result.current.count).toBe(0)
  })

  test('добавить товар в пустую корзину', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(product1)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].product).toEqual(product1)
    expect(result.current.items[0].quantity).toBe(1)
    expect(result.current.total).toBe(4990)
    expect(result.current.count).toBe(1)
  })

  test('добавить тот же товар дважды — количество растёт, не дубликат', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(product1)
      result.current.addToCart(product1)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
    expect(result.current.total).toBe(9980)
    expect(result.current.count).toBe(2)
  })

  test('добавить три разных товара', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(product1)
      result.current.addToCart(product2)
      result.current.addToCart(product3)
    })

    expect(result.current.items).toHaveLength(3)
    expect(result.current.total).toBe(15970)
    expect(result.current.count).toBe(3)
  })

  test('increment увеличивает количество товара', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(product1)
    })

    act(() => {
      result.current.increment(product1.id)
    })

    expect(result.current.items[0].quantity).toBe(2)
    expect(result.current.total).toBe(9980)
    expect(result.current.count).toBe(2)
  })

  test('decrement уменьшает количество товара', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(product1)
      result.current.addToCart(product1)
    })

    act(() => {
      result.current.decrement(product1.id)
    })

    expect(result.current.items[0].quantity).toBe(1)
    expect(result.current.total).toBe(4990)
    expect(result.current.count).toBe(1)
  })

  test('decrement до нуля удаляет товар', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(product1)
    })

    act(() => {
      result.current.decrement(product1.id)
    })

    expect(result.current.items).toHaveLength(0)
    expect(result.current.total).toBe(0)
    expect(result.current.count).toBe(0)
  })

  test('удалить товар из корзины', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(product1)
      result.current.addToCart(product2)
    })

    act(() => {
      result.current.removeFromCart(product1.id)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].product.id).toBe(2)
    expect(result.current.total).toBe(7990)
  })

  test('удалить единственный товар — корзина пуста', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(product1)
    })

    act(() => {
      result.current.removeFromCart(product1.id)
    })

    expect(result.current.items).toHaveLength(0)
    expect(result.current.total).toBe(0)
  })

  test('удалить несуществующий товар — ничего не меняется', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(product1)
    })

    act(() => {
      result.current.removeFromCart(999)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.total).toBe(4990)
  })

  test('очистить корзину с несколькими товарами', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(product1)
      result.current.addToCart(product2)
      result.current.addToCart(product3)
    })

    act(() => {
      result.current.clearCart()
    })

    expect(result.current.items).toHaveLength(0)
    expect(result.current.total).toBe(0)
    expect(result.current.count).toBe(0)
  })

  test('очистить пустую корзину — без ошибок', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.clearCart()
    })

    expect(result.current.items).toHaveLength(0)
    expect(result.current.total).toBe(0)
  })

  test('итого пересчитывается после цепочки действий', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(product1)
      result.current.addToCart(product1)
    })
    expect(result.current.total).toBe(9980)

    act(() => {
      result.current.addToCart(product2)
    })
    expect(result.current.total).toBe(17970)

    act(() => {
      result.current.removeFromCart(product1.id)
    })
    expect(result.current.total).toBe(7990)

    act(() => {
      result.current.clearCart()
    })
    expect(result.current.total).toBe(0)
  })

  test('useCart бросает ошибку вне CartProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    expect(() => renderHook(() => useCart())).toThrow(
      'useCart must be used within CartProvider'
    )

    spy.mockRestore()
  })
})