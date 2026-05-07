import React, { useEffect } from 'react'
import { ModalProps } from '../types'
import './ProductModal.module.scss'

const ProductModal: React.FC<ModalProps> = ({ product, isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset'
    };
  }, [isOpen, onClose])

  if (!isOpen || !product) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <img src={product.image} alt={product.name} className="modal-image" />
        <h2 className="modal-title">{product.name}</h2>
        <p className="modal-description">{product.description}</p>
        <p className="modal-price">{product.price.toLocaleString()} руб.</p>
        <button className="buy-button">Купить</button>
      </div>
    </div>
  );
};

export default ProductModal
