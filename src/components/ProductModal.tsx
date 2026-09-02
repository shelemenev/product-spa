import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { ModalProps, ProductModalHandle } from '../types/types'
import styles from './ProductModal.module.scss'

const ProductModal = forwardRef<ProductModalHandle, ModalProps>(
  ({ product, onClose }, ref) => {
    const closeButtonRef = useRef<HTMLButtonElement | null>(null)
    const previousActiveElementRef = useRef<HTMLElement | null>(null)
    
    const scrollClassName = styles.bodyNoScroll

    useEffect(() => {
      if (!product) return

      previousActiveElementRef.current = document.activeElement as HTMLElement | null

      const button = closeButtonRef.current
      if (button) {
        button.focus()
      }

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }

      document.addEventListener('keydown', handleEscape)
      document.body.classList.add(scrollClassName)

      return () => {
        const prev = previousActiveElementRef.current
        if (prev && typeof prev.focus === 'function') {
          prev.focus()
        }
        
        document.removeEventListener('keydown', handleEscape)
        document.body.classList.remove(scrollClassName)
      };
    }, [product, onClose, scrollClassName])

    useImperativeHandle(
      ref,
      () => ({
        close: onClose,
      }),
      [onClose]
    );

    if (!product) {
      return null
    }

    return (
      <div
        data-testid="modal-overlay"
        className={styles.ModalOverlay}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className={styles.ModalContent} onClick={(e) => e.stopPropagation()}>
          <button
            ref={closeButtonRef}
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

          <h2 id="modal-title" className={styles.ModalTitle}>
            {product.title}
          </h2>

          {product.description && (
            <p className={styles.ModalDescription}>{product.description}</p>
          )}

          <p className={styles.ModalPrice}>
            {product.price.toLocaleString('ru-RU')} руб.
          </p>

          <button className={styles.BuyButton} type="button">
            Купить
          </button>
        </div>
      </div>
    )
  }
)

export default ProductModal
