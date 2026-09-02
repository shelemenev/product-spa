import { useCallback, KeyboardEvent } from 'react'
import { ProductCardProps } from '../types/types'
import styles from './ProductCard.module.scss'
import React from 'react'

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const handleClick = useCallback(() => {
    onClick?.(product)
  }, [product, onClick])

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleClick()
      }
    },
    [handleClick]
  )

  return (
    <div
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
      <p className={styles.ProductPrice}>{product.price.toLocaleString()} руб.</p>
    </div>
  )
}

export default React.memo(ProductCard)
