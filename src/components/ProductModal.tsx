import React, { useEffect } from 'react'
import { ModalProps } from '../types'
import styles from './ProductModal.module.scss'

const ProductModal: React.FC<ModalProps> = ({ product, onClose }) => {
  useEffect(() => {
    if (!product) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.classList.add(styles.bodyNoScroll)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.classList.remove(styles.bodyNoScroll)
    };
  }, [product, onClose])

  if (!product) {
    return null
  }

  return (
    <div className={styles.ModalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.ModalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.ModalClose}
          onClick={onClose}
          type="button"
          aria-label="Закрыть модальное окно"
        >
          ✕
        </button>

        <img
          src={product.image}
          alt={product.title}
          className={styles.ModalImage}
          loading="lazy"
        />

        <h2 className={styles.ModalTitle}>{product.title}</h2>
        <p className={styles.ModalDescription}>{product.description}</p>
        <p className={styles.ModalPrice}>
          {product.price.toLocaleString('ru-RU')} руб.
        </p>

        <button className={styles.BuyButton} type="button">
          Купить
        </button>
      </div>
    </div>
  );
};

export default ProductModal
