import React, { useEffect } from 'react'
import { ModalProps } from '../types'
import styles from './ProductModal.module.scss'

const ProductModal: React.FC<ModalProps> = ({ product, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (product) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [product, onClose])

  if (!product) return null

  return (
    <div className={styles.ModalOverlay} onClick={onClose}>
      <div className={styles.ModalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.ModalClose} onClick={onClose}>✕</button>
        <img src={product.image} alt={product.title} className={styles.ModalImage} />
        <h2 className={styles.ModalTitle}>{product.title}</h2>
        <p className={styles.ModalDescription}>{product.description}</p>
        <p className={styles.ModalPrice}>{product.price.toLocaleString()} руб.</p>
        <button className={styles.BuyButton}>Купить</button>
      </div>
    </div>
  )
}

export default ProductModal
