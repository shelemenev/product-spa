import React, { useState, useEffect, useCallback } from 'react'
import ProductModal from './components/ProductModal'
import ProductCard from './components/ProductCard'
import { Product } from './types/types'
import styles from './App.module.scss'

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(async () => {
      try {
        const res = await fetch('/db.json')
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data = await res.json()
        if (Array.isArray(data.products)) {
          setProducts(data.products)
          setFilteredProducts(data.products)
        } else {
          setError('Некорректный формат данных')
        }
        setLoading(false)
      } catch (err) {
        console.error('Ошибка загрузки данных:', err)
        setError('Не удалось загрузить данные товаров')
        setLoading(false)
      }
    }, 1000)
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredProducts(filtered)
  }, [searchTerm, products])

  const openModal = useCallback((product: Product) => {
    setSelectedProduct(product)
  }, []);

  const closeModal = useCallback(() => {
    setSelectedProduct(null)
  }, []);

  return (
    <div className={styles.App}>
      <header className={styles.AppHeader}>
        <h1>Магазин товаров</h1>
        <input
          type="text"
          placeholder="Поиск товаров..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.SearchInput}
          aria-label="Поиск по названию товара"
        />
      </header>

      <main className={styles.ProductsGrid}>
        {loading && <p>Загрузка товаров...</p>}

        {error && (
          <p className={styles.ErrorMessage} role="alert">
            {error}
          </p>
        )}

        {!loading && filteredProducts.length === 0 && (
          <p className={styles.ErrorMessage}>Попробуйте ввести другое наименование</p>
        )}

        {filteredProducts.length > 0 &&
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={openModal}
            />
          ))}
      </main>

      <ProductModal
        product={selectedProduct ?? undefined}
        onClose={closeModal}
      />
    </div>
  )
}

export default App
