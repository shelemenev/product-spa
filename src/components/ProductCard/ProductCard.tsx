import { useCallback, memo } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import { ProductCardProps } from '../../types/types'
import { useCart } from '../../context/CartContext'
import styles from './ProductCard.module.scss'

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const { addToCart } = useCart()

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

  const handleAddToCart = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      addToCart(product)
    },
    [addToCart, product]
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
      <button
        className={styles.AddToCartButton}
        type="button"
        onClick={handleAddToCart}
      >
        В корзину
      </button>
    </div>
  )
}

export default memo(ProductCard)