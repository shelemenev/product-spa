import { useCart } from '../../context/CartContext'
import type { CartButtonProps } from '../../types/types'
import styles from './CartButton.module.scss'

export const CartButton = ({ onClick }: CartButtonProps) => {
  const { count } = useCart()

  return (
    <button className={styles.CartButton} onClick={onClick} aria-label="Корзина">
      <span className={styles.CartIcon}>🛒</span>
      {count > 0 && <span className={styles.CartBadge}>{count}</span>}
    </button>
  )
}