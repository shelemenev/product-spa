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
    setTimeout( () => 
      fetch('/db.json')
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
          return res.json()
        })
        .then(data => {
          setProducts(data.products)
          setFilteredProducts(data.products)
          setLoading(false)
        })
        .catch(err => {
          console.error('Ошибка загрузки данных:', err)
          setError('Не удалось загрузить данные товаров')
          setLoading(false)
        }
      ), 1000)
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

  if (loading) {
    return (
      <div className={styles.App}>
        <header className={styles.AppHeader}>
          <h1>Магазин товаров</h1>
        </header>
        <main className={styles.ProductsGrid}>
          <p>Загрузка товаров...</p>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.App}>
        <header className={styles.AppHeader}>
          <h1>Магазин товаров</h1>
        </header>
        <main className={styles.ProductsGrid}>
          <p className={styles.ErrorMessage}>{error}</p>
        </main>
      </div>
    )
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
        {filteredProducts.map(product => (
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
