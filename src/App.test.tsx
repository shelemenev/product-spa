import { render, screen, within, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, expect, describe, it, beforeEach, afterEach } from 'vitest'
import App from './App'
import { Product } from './types/types'

const mockFetch = vi.spyOn(global, 'fetch')

describe('App Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const createMockResponse = <T,>(data: T, status = 200): Response => {
    const ok = status >= 200 && status < 300
    return {
      ok,
      status,
      statusText: ok ? 'OK' : 'Error',
      type: 'basic',
      url: 'http://example.com',
      redirected: false,
      headers: new Headers(),
      json: vi.fn().mockResolvedValue(data),
      clone: () => ({} as Response),
      body: null,
      bodyUsed: false,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
      text: () => Promise.resolve(''),
    } as unknown as Response
  }

  it('отображает индикатор загрузки при старте', async () => {
    const mockData: { products: Product[] } = {
      products: [{ id: 1, title: 'Test', price: 100, image: '/img.jpg' }],
    }
    mockFetch.mockResolvedValueOnce(createMockResponse(mockData))

    render(<App />)

    expect(screen.getByText('Загрузка товаров...')).toBeInTheDocument()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(screen.queryByText('Загрузка товаров...')).not.toBeInTheDocument()
  })

  it('рендерит карточки товаров после успешной загрузки данных', async () => {
    const mockProducts: Product[] = [
      { id: 1, title: 'Наушники', price: 5000, image: '/img.jpg', description: 'Описание' },
      { id: 2, title: 'Клавиатура', price: 3000, image: '/img2.jpg', description: 'Описание' },
    ]

    mockFetch.mockResolvedValueOnce(createMockResponse({ products: mockProducts }))

    render(<App />)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(screen.getByText('Наушники')).toBeInTheDocument()
    expect(screen.getByText('Клавиатура')).toBeInTheDocument()
  })

  it('отображает сообщение об ошибке при неудачной загрузке', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    render(<App />)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(screen.getByRole('alert')).toHaveTextContent('Не удалось загрузить данные товаров')
  })

  it('фильтрует товары при вводе текста в поле поиска', async () => {
    const mockProducts: Product[] = [
      { id: 1, title: 'Беспроводные наушники', price: 5000, image: '/img.jpg', description: 'Описание' },
      { id: 2, title: 'Проводная клавиатура', price: 3000, image: '/img2.jpg', description: 'Описание' },
    ]

    mockFetch.mockResolvedValueOnce(createMockResponse({ products: mockProducts }))

    render(<App />)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    vi.useRealTimers()

    const searchInput = screen.getByLabelText('Поиск по названию товара')
    await userEvent.type(searchInput, 'клавиатура')

    expect(screen.queryByText('Беспроводные наушники')).not.toBeInTheDocument()
    expect(screen.getByText('Проводная клавиатура')).toBeInTheDocument()

    await userEvent.clear(searchInput)
    expect(screen.getByText('Беспроводные наушники')).toBeInTheDocument()
  })

  it('открывает модалку при клике на карточку товара', async () => {
    const mockProducts: Product[] = [
      { id: 1, title: 'Наушники', price: 5000, image: '/img.jpg', description: 'Описание' },
      { id: 2, title: 'Клавиатура', price: 3000, image: '/img2.jpg', description: 'Описание' },
    ]

    mockFetch.mockResolvedValueOnce(createMockResponse({ products: mockProducts }))

    render(<App />)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    vi.useRealTimers()

    const card = screen.getByText('Наушники')
    await userEvent.click(card)

    expect(screen.getByTestId('modal-overlay')).toBeInTheDocument()

    const modalOverlay = screen.getByTestId('modal-overlay')
    const modalContent = within(modalOverlay)

    expect(
      modalContent.getByRole('heading', { name: /наушники/i })
    ).toBeInTheDocument()

    expect(
      modalContent.getByLabelText('Закрыть модальное окно')
    ).toBeInTheDocument()
  })

  it('закрывает модалку при ручном клике на кнопку закрытия', async () => {
    const mockProducts: Product[] = [
      { id: 1, title: 'Еще один товар', price: 200, image: '/img.jpg', description: 'Описание' },
    ]

    mockFetch.mockResolvedValueOnce(createMockResponse({ products: mockProducts }))

    render(<App />)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    vi.useRealTimers()

    const card = screen.getByText('Еще один товар')
    await userEvent.click(card)

    const modalOverlay = screen.getByTestId('modal-overlay')
    const modalContent = within(modalOverlay)

    expect(
      modalContent.getByRole('heading', { name: /еще один товар/i })
    ).toBeInTheDocument()

    const closeBtn = modalContent.getByLabelText('Закрыть модальное окно')
    await userEvent.click(closeBtn)

    expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument()
  })

  it('обрабатывает некорректный формат данных от сервера', async () => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse({ products: 'not-an-array' })
    )

    render(<App />)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(screen.getByText('Некорректный формат данных')).toBeInTheDocument()
  })
})