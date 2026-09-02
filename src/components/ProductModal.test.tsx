import { test, vi, describe, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ProductModal from './ProductModal'
import { ProductModalHandle } from './../types/types'
import { useRef } from 'react'

const mockProduct = {
  title: 'Беспроводные наушники',
  price: 4990,
  image: '/images/headphones.jpg',
  description: 'Отличные наушники с шумоподавлением',
}

describe('ProductModal', () => {
  beforeEach(() => {
    Array.from(document.body.classList).forEach(cls => {
      if (cls.includes('bodyNoScroll')) {
        document.body.classList.remove(cls)
      }
    })
  })

  test('не рендерит контент, если product не передан', () => {
    render(<ProductModal product={undefined} onClose={vi.fn()} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByText(mockProduct.title)).not.toBeInTheDocument()
  })

  test('рендерит модалку с данными продукта при наличии product', () => {
    const mockProduct = {
        title: 'Беспроводные наушники',
        price: 4990,
        image: '/images/headphones.jpg',
        description: 'Отличные наушники с шумоподавлением',
    }

    render(<ProductModal product={mockProduct} onClose={vi.fn()} />)

    expect(screen.getByText(mockProduct.title)).toBeInTheDocument()

    const priceDigits = String(mockProduct.price)
    
    expect(screen.getByText((content) => {
        if (!content) return false
        const cleanContent = String(content).replace(/\s+/g, '')
        return cleanContent.includes(priceDigits)
    })).toBeInTheDocument()
  })

  test('закрывается при клике на оверлей (фон)', () => {
    const onClose = vi.fn()
    render(<ProductModal product={mockProduct} onClose={onClose} />)
    const overlay = screen.getByTestId('modal-overlay')
    fireEvent.click(overlay)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('закрывается при клике на кнопку "крестик"', () => {
    const onClose = vi.fn()
    render(<ProductModal product={mockProduct} onClose={onClose} />)
    const closeButton = screen.getByLabelText('Закрыть модальное окно')
    fireEvent.click(closeButton)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('закрывается при нажатии клавиши Escape', () => {
    const onClose = vi.fn()
    render(<ProductModal product={mockProduct} onClose={onClose} />)
    expect(onClose).not.toHaveBeenCalled()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('возвращает фокус элементу, который был активен до открытия модалки (или оставляет его там)', () => {
    const onClose = vi.fn()
    const FocusWrapper = () => {
        const inputRef = useRef<HTMLInputElement | null>(null)
        return (
        <div>
            <input ref={inputRef} data-testid="previous-focus-input" />
            <ProductModal product={mockProduct} onClose={onClose} />
        </div>
        )
    }

    render(<FocusWrapper />)
    
    const input = screen.getByTestId('previous-focus-input')
    input.focus()
    expect(input).toHaveFocus()

    const closeBtn = screen.getByLabelText('Закрыть модальное окно')
    fireEvent.click(closeBtn)
    
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(input).toHaveFocus()
  })

  test('позволяет программно закрыть модалку через ref (useImperativeHandle)', () => {
    const onCloseSpy = vi.fn()
    const TestWithRef = () => {
      const modalRef = useRef<ProductModalHandle | null>(null)
      return (
        <div>
          <button
            data-testid="close-via-ref"
            onClick={() => modalRef.current?.close()}
          >
            Close via Ref
          </button>
          <ProductModal ref={modalRef} product={mockProduct} onClose={onCloseSpy} />
        </div>
      )
    }

    render(<TestWithRef />)
    const closeViaRefBtn = screen.getByTestId('close-via-ref')
    fireEvent.click(closeViaRefBtn)
    expect(onCloseSpy).toHaveBeenCalledTimes(1)
  })
})
