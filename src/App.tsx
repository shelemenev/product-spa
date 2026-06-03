import { useState, useEffect } from 'react'
import ProductModal from './components/ProductModal'
import { Product } from './types'
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
        const data = await res.json()
        if (data) {
          setProducts(data.products)
          setFilteredProducts(data.products)
          setLoading(false)
        }
      } catch (err) {
        console.error('Ошибка загрузки данных:', err)
        setError('Не удалось загрузить данные товаров')
        setLoading(false)
      }
    }, 1000)
  }, [])

  useEffect(() => {
    const filtered = products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredProducts(filtered)
  }, [searchTerm, products])

  const openModal = (product: Product) => {
    setSelectedProduct(product)
  }

  const closeModal = () => {
    setSelectedProduct(null)
  }

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
        />
      </header>

      <main className={styles.ProductsGrid}>
        {!!loading && <p>Загрузка товаров...</p>}
        {!!error && <p className={styles.ErrorMessage}>{error}</p>}
        {!loading && filteredProducts.length === 0 && <p className={styles.ErrorMessage}>Попробуйте ввести другое наименование</p>}
        {filteredProducts.length > 0 && filteredProducts.map(product => (
          <div
            key={product.id}
            className={styles.ProductCard}
            onClick={() => openModal(product)}
          >
            <img src={product.image} alt={product.title} className={styles.ProductImage} />
            <h3 className={styles.ProductName}>{product.title}</h3>
            <p className={styles.ProductPrice}>{product.price.toLocaleString()} руб.</p>
          </div>
        ))}
      </main>

      <ProductModal
        product={selectedProduct}
        onClose={closeModal}
      />
    </div>
  )
}

export default App
