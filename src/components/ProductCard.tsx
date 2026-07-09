import React from 'react'
import { Product } from '../types/types'
import styles from './ProductCard.module.scss'

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(product)
    }
  };

  return (
    <div
      key={product.id}
      className={styles.ProductCard}
      onClick={handleClick}
      role="article"
      aria-label={product.title}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      <img
        src={product.image}
        alt={product.title}
        className={styles.ProductImage}
        loading="lazy"
      />
      <h3 className={styles.ProductName}>{product.title}</h3>
      <p className={styles.ProductPrice}>
        {product.price.toLocaleString('ru-RU')} руб.
      </p>
    </div>
  )
}

export default ProductCard
