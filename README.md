# Product SPA

Магазин товаров — одностраничное приложение на React + TypeScript. Каталог с поиском, корзина с модальным окном, карточки товаров.

## Структура
src/
├── types/ # Типы и интерфейсы
├── context/ # React-контексты (CartContext)
├── components/
│ ├── CartModal/ # Модальное окно корзины
│ ├── CartButton/ # Кнопка корзины в хедере
│ ├── ProductCard/ # Карточка товара в каталоге
│ └── ProductModal/ # Модалка товара


## Стек

- **React 19** + **TypeScript**
- **Vitest** + **Testing Library** — тесты
- **Storybook 10** — разработка и документация компонентов
- **SASS** — стили
- **CRA** — сборка (react-scripts)

## Скрипты

| Команда | Описание |
|---|---|
| `npm start` | Дев-сервер (localhost:3000) |
| `npm run build` | Продакшн-билд в `build/` |
| `npm test` | Запуск тестов (vitest) |
| `npm run test:watch` | Тесты в watch-режиме |
| `npm run lint` | ESLint с автофиксом |
| `npm run lint:check` | ESLint без фикса |
| `npm run storybook` | Storybook (localhost:6006) |
| `npm run build-storybook` | Сборка Storybook |
| `npm run serve` | Раздача билда (localhost:3001) |

## Архитектура

- **CartContext** + **useReducer** — управление состоянием корзины
- **localStorage** — персистенция корзины между сессиями
- Компоненты изолированы: каждый в своей папке с логикой, стилями и тестами

## Фичи

- Каталог товаров с изображением, названием, ценой
- Поиск по каталогу
- Добавление в корзину из каталога
- Модальное окно корзины с управлением содержимым