export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
  // сюда можно добавлять любые новые поля — модалка их не «подтянет» автоматически
}

// Явно описываем, что нужно модалке: это и есть правильное применение Omit
export type ProductForModal = Omit<Product, 'id' >

export interface ModalProps {
  product?: ProductForModal          // опциональность вместо Product | null 
  onClose: () => void                // держим onClose стабильным снаружи
}
