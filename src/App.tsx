import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import ProductModal from './components/ProductModal/ProductModal'
import ProductCard from './components/ProductCard/ProductCard'
import { CartButton } from './components/CartButton/CartButton'
import { CartModal } from './components/CartModal/CartModal'
import { CartProvider } from './context/CartContext'
import { Product, ProductModalHandle } from './types/types'
import styles from './App.module.scss'

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const modalRef = useRef<ProductModalHandle | null>(null)

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/db.json')
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        const data = await res.json()

        if (Array.isArray(data.products)) {
          setProducts(data.products)
        } else {
          setProducts([])
          setError('Некорректный формат данных')
        }
      } catch (err) {
        console.error('Ошибка загрузки данных:', err)
        setError('Не удалось загрузить данные товаров')
      } finally {
        setLoading(false)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const title = product.title ?? ''
        return title.toLowerCase().includes(searchTerm.toLowerCase())
      }),
    [searchTerm, products],
  )

  const openModal = useCallback((product: Product) => {
    setSelectedProduct(product)
  }, [])

  const closeModal = useCallback(() => {
    setSelectedProduct(null)
  }, [])

  const openCart = useCallback(() => {
    setIsCartOpen(true)
  }, [])

  const closeCart = useCallback(() => {
    setIsCartOpen(false)
  }, [])

  useEffect(() => {
    if (selectedProduct && modalRef.current?.close) {
      const timer = setTimeout(() => {
        modalRef.current?.close()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [selectedProduct])

  return (
    <CartProvider>
      <div className={styles.App}>
        <header className={styles.AppHeader}>
          <h1>Магазин товаров</h1>
          <div className={styles.HeaderActions}>
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.SearchInput}
              aria-label="Поиск по названию товара"
            />
            <CartButton onClick={openCart} />
          </div>
        </header>

        <main className={styles.ProductsGrid}>
          {loading && <p>Загрузка товаров...</p>}
          {error && (
            <p className={styles.ErrorMessage} role="alert">
              {error}
            </p>
          )}
          {!loading && filtered.length === 0 && (
            <p className={styles.ErrorMessage}>Попробуйте ввести другое наименование</p>
          )}
          {filtered.length > 0 &&
            filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={openModal}
              />
            ))}
        </main>

        {selectedProduct && (
          <ProductModal
            ref={modalRef}
            product={selectedProduct}
            onClose={closeModal}
          />
        )}

        {isCartOpen && <CartModal onClose={closeCart} />}
      </div>
    </CartProvider>
  )
}

export default App