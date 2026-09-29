import { useCart } from '../../context/CartContext'
import type { CartModalProps } from '../../types/types'
import styles from './CartModal.module.scss'

export const CartModal = ({ onClose }: CartModalProps) => {
  const { items, total, count, increment, decrement, removeFromCart, clearCart } = useCart()

  return (
    <div className={styles.CartOverlay} onClick={onClose}>
      <div className={styles.CartContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.CartHeader}>
          <h2 className={styles.CartTitle}>
            Корзина{count > 0 && ` (${count})`}
          </h2>
          <button className={styles.CartClose} onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.CartEmpty}>
            <p className={styles.CartEmptyText}>Корзина пуста</p>
          </div>
        ) : (
          <>
            <ul className={styles.CartList}>
              {items.map(({ product, quantity }) => (
                <li key={product.id} className={styles.CartItem}>
                  <img
                    className={styles.CartImage}
                    src={product.image}
                    alt={product.title}
                  />
                  <div className={styles.CartInfo}>
                    <h3 className={styles.CartProductTitle}>{product.title}</h3>
                    <p className={styles.CartPrice}>{product.price} ₽</p>
                  </div>
                  <div className={styles.CartControls}>
                    <button
                      className={styles.CartQuantityButton}
                      onClick={() => decrement(product.id)}
                      aria-label="Уменьшить"
                    >
                      −
                    </button>
                    <span className={styles.CartQuantity}>{quantity}</span>
                    <button
                      className={styles.CartQuantityButton}
                      onClick={() => increment(product.id)}
                      aria-label="Увеличить"
                    >
                      +
                    </button>
                  </div>
                  <p className={styles.CartItemTotal}>
                    {product.price * quantity} ₽
                  </p>
                  <button
                    className={styles.CartRemoveButton}
                    onClick={() => removeFromCart(product.id)}
                    aria-label="Удалить"
                  >
                    🗑
                  </button>
                </li>
              ))}
            </ul>

            <div className={styles.CartFooter}>
              <div className={styles.CartTotal}>
                <span>Итого:</span>
                <span className={styles.CartTotalValue}>{total} ₽</span>
              </div>
              <div className={styles.CartActions}>
                <button className={styles.CartClearButton} onClick={clearCart}>
                  Очистить
                </button>
                <button className={styles.CartCheckoutButton}>Оформить</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}