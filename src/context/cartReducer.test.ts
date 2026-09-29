import { describe, it, expect } from 'vitest'
import { cartReducer, getCartTotal, getCartCount } from './cartReducer'
import type { CartAction, CartState, Product } from '../types/types'

const mockProduct: Product = {
  id: 1,
  title: 'Товар 1',
  price: 1000,
  image: '/img.jpg',
  description: 'Описание',
}

const mockProduct2: Product = {
  id: 2,
  title: 'Товар 2',
  price: 500,
  image: '/img2.jpg',
  description: 'Описание 2',
}

const initialState: CartState = { items: [] }

describe('cartReducer', () => {
  describe('ADD', () => {
    it('добавляет новый товар в пустую корзину', () => {
      const action: CartAction = { type: 'ADD', product: mockProduct }
      const result = cartReducer(initialState, action)
      expect(result.items).toHaveLength(1)
      expect(result.items[0]).toEqual({ product: mockProduct, quantity: 1 })
    })

    it('увеличивает количество если товар уже в корзине', () => {
      const state: CartState = {
        items: [{ product: mockProduct, quantity: 1 }],
      }
      const action: CartAction = { type: 'ADD', product: mockProduct }
      const result = cartReducer(state, action)
      expect(result.items).toHaveLength(1)
      expect(result.items[0].quantity).toBe(2)
    })

    it('не превышает MAX_QUANTITY (99)', () => {
      const state: CartState = {
        items: [{ product: mockProduct, quantity: 99 }],
      }
      const action: CartAction = { type: 'ADD', product: mockProduct }
      const result = cartReducer(state, action)
      expect(result.items[0].quantity).toBe(99)
    })

    it('добавляет разные товары отдельно', () => {
      const state: CartState = {
        items: [{ product: mockProduct, quantity: 1 }],
      }
      const action: CartAction = { type: 'ADD', product: mockProduct2 }
      const result = cartReducer(state, action)
      expect(result.items).toHaveLength(2)
    })
  })

  describe('REMOVE', () => {
    it('удаляет товар по id', () => {
      const state: CartState = {
        items: [
          { product: mockProduct, quantity: 2 },
          { product: mockProduct2, quantity: 1 },
        ],
      }
      const action: CartAction = { type: 'REMOVE', id: 1 }
      const result = cartReducer(state, action)
      expect(result.items).toHaveLength(1)
      expect(result.items[0].product.id).toBe(2)
    })

    it('не падает если товара нет', () => {
      const action: CartAction = { type: 'REMOVE', id: 999 }
      const result = cartReducer(initialState, action)
      expect(result.items).toHaveLength(0)
    })
  })

  describe('INCREMENT', () => {
    it('увеличивает количество', () => {
      const state: CartState = {
        items: [{ product: mockProduct, quantity: 1 }],
      }
      const action: CartAction = { type: 'INCREMENT', id: 1 }
      const result = cartReducer(state, action)
      expect(result.items[0].quantity).toBe(2)
    })

    it('не превышает MAX_QUANTITY', () => {
      const state: CartState = {
        items: [{ product: mockProduct, quantity: 99 }],
      }
      const action: CartAction = { type: 'INCREMENT', id: 1 }
      const result = cartReducer(state, action)
      expect(result.items[0].quantity).toBe(99)
    })

    it('не падает если товара нет', () => {
      const action: CartAction = { type: 'INCREMENT', id: 999 }
      const result = cartReducer(initialState, action)
      expect(result.items).toHaveLength(0)
    })
  })

  describe('DECREMENT', () => {
    it('уменьшает количество', () => {
      const state: CartState = {
        items: [{ product: mockProduct, quantity: 3 }],
      }
      const action: CartAction = { type: 'DECREMENT', id: 1 }
      const result = cartReducer(state, action)
      expect(result.items[0].quantity).toBe(2)
    })

    it('удаляет товар при количестве 1', () => {
      const state: CartState = {
        items: [{ product: mockProduct, quantity: 1 }],
      }
      const action: CartAction = { type: 'DECREMENT', id: 1 }
      const result = cartReducer(state, action)
      expect(result.items).toHaveLength(0)
    })

    it('не падает если товара нет', () => {
      const action: CartAction = { type: 'DECREMENT', id: 999 }
      const result = cartReducer(initialState, action)
      expect(result.items).toHaveLength(0)
    })
  })

  describe('CLEAR', () => {
    it('очищает корзину', () => {
      const state: CartState = {
        items: [
          { product: mockProduct, quantity: 2 },
          { product: mockProduct2, quantity: 1 },
        ],
      }
      const action: CartAction = { type: 'CLEAR' }
      const result = cartReducer(state, action)
      expect(result.items).toHaveLength(0)
    })
  })

  describe('LOAD', () => {
    it('загружает товары', () => {
      const items = [
        { product: mockProduct, quantity: 5 },
        { product: mockProduct2, quantity: 3 },
      ]
      const action: CartAction = { type: 'LOAD', items }
      const result = cartReducer(initialState, action)
      expect(result.items).toEqual(items)
    })
  })

  describe('неизвестный action', () => {
    it('возвращает state без изменений', () => {
      const action = { type: 'UNKNOWN' } as unknown as CartAction
      const result = cartReducer(initialState, action)
      expect(result).toBe(initialState)
    })
  })
})

describe('getCartTotal', () => {
  it('считает сумму пустой корзины', () => {
    expect(getCartTotal([])).toBe(0)
  })

  it('считает сумму с учётом количества', () => {
    const items = [
      { product: mockProduct, quantity: 2 },
      { product: mockProduct2, quantity: 3 },
    ]
    expect(getCartTotal(items)).toBe(3500)
  })
})

describe('getCartCount', () => {
  it('считает количество в пустой корзине', () => {
    expect(getCartCount([])).toBe(0)
  })

  it('считает общее количество товаров', () => {
    const items = [
      { product: mockProduct, quantity: 2 },
      { product: mockProduct2, quantity: 3 },
    ]
    expect(getCartCount(items)).toBe(5)
  })
})