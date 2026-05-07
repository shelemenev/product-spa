import React, { useState, useEffect } from 'react'
import ProductModal from './components/ProductModal'
import { Product } from './types'
import './App.module.scss'

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Загрузка данных
  useEffect(() => {
    fetch('/db.json')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
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
      })
  }, []);

  // Фильтр товаров
  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredProducts(filtered)
  }, [searchTerm, products])

  const openModal = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  };

  const closeModal = () => {
    setSelectedProduct(null)
    setIsModalOpen(false)
  };

  if (loading) {
    return (
      <div className="App">
        <header className="app-header">
          <h1>Магазин товаров</h1>
        </header>
        <main className="products-grid">
          <p>Загрузка товаров...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <header className="app-header">
          <h1>Магазин товаров</h1>
        </header>
        <main className="products-grid">
          <p className="error-message">{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Магазин товаров</h1>
        <input
          type="text"
          placeholder="Поиск товаров..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </header>

      <main className="products-grid">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => openModal(product)}
          >
            <img src={product.image} alt={product.name} className="product-image" />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">{product.price.toLocaleString()} руб.</p>
          </div>
        ))}
      </main>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}

export default App
