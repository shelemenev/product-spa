import React, { useCallback } from 'react'
import { Product } from '../types/types'
import styles from './ProductCard.module.scss'

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const handleClick = useCallback<VoidFunction>(() => {
    if (onClick) {
      onClick(product)
    }
  },[product, onClick])

const onKeyDown = useCallback<(e: React.KeyboardEvent<HTMLDivElement>) => void>(
  (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    } 
  },
  [handleClick]
)

const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  },
  []
)

  return (
    <div
      key={product.id}
      className={styles.ProductCard}
      onClick={handleClick}
      role="article"
      aria-label={product.title}
      tabIndex={0}
      onKeyDown={onKeyDown}
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
      <input onChange={onChange} />
    </div>
  )
}

export default ProductCard
