import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders store title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Магазин товаров/i);
  expect(titleElement).toBeInTheDocument();
});
