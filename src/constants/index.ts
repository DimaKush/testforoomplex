// Animation delays and durations
export const ANIMATION_DELAYS = {
  REVIEW_CARD: 0.2,
  PRODUCT_CARD: 0.1,
  LOADING_SIMULATION: 300,
} as const;

// Pagination
export const PAGINATION = {
  PRODUCTS_PER_PAGE: 6,
  INTERSECTION_THRESHOLD: 0.1,
} as const;

// Breakpoints and sizes
export const SIZES = {
  PRODUCT_CARD: {
    MAX_WIDTH: 380,
    HEIGHT: 480,
    IMAGE_HEIGHT: 192,
    IMAGE_WIDTH: 301,
  },
  REVIEW_CARD: {
    MAX_WIDTH: 500,
    HEIGHT: 40,
  },
  CART: {
    MAX_WIDTH: 708,
  },
} as const;

// Common CSS classes
export const STYLES = {
  CARD_BASE: 'bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300',
  CARD_HOVER: 'hover:scale-105',
  BORDER_LIGHT: 'border border-white/30',
  GRADIENT_TEXT: 'bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent',
  PRICE_GRADIENT: 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent',
  BUTTON_PRIMARY: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
  BUTTON_SUCCESS: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
  SKELETON: 'bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 skeleton shadow-2xl',
} as const;

// Error messages
export const ERRORS = {
  PHONE_INVALID: 'Введите корректный номер телефона',
  CART_EMPTY: 'Добавьте товары в корзину',
  ORDER_FAILED: 'Ошибка при оформлении заказа',
  NETWORK_ERROR: 'Ошибка сети. Попробуйте позже.',
} as const;

// Success messages
export const MESSAGES = {
  ORDER_SUCCESS: 'Заказ успешно оформлен!',
  ALL_PRODUCTS_LOADED: '✨ Все товары загружены',
  CART_EMPTY: 'Корзина пуста',
  CART_EMPTY_DESCRIPTION: 'Добавьте товары, чтобы оформить заказ',
} as const;

// Fallback data
export const FALLBACK_REVIEWS = [
  { id: 1, text: '<p>Отличный магазин! Быстрая доставка и качественные товары.</p>' },
  { id: 2, text: '<p>Рекомендую всем! Приятные цены и хорошее обслуживание.</p>' }
] as const;

export const FALLBACK_PRODUCTS = [
  {
    id: 1,
    title: 'Товар 1',
    description: 'Описание товара 1',
    price: 12150,
    image_url: 'https://picsum.photos/301/192?random=1'
  },
  {
    id: 2,
    title: 'Товар 2', 
    description: 'Описание товара 2',
    price: 25300,
    image_url: 'https://picsum.photos/301/192?random=2'
  },
  {
    id: 3,
    title: 'Товар 3',
    description: 'Описание товара 3', 
    price: 18900,
    image_url: 'https://picsum.photos/301/192?random=3'
  },
  {
    id: 4,
    title: 'Товар 4',
    description: 'Описание товара 4',
    price: 33500,
    image_url: 'https://picsum.photos/301/192?random=4'
  },
  {
    id: 5,
    title: 'Товар 5',
    description: 'Описание товара 5',
    price: 41200,
    image_url: 'https://picsum.photos/301/192?random=5'
  },
  {
    id: 6,
    title: 'Товар 6',
    description: 'Описание товара 6',
    price: 28750,
    image_url: 'https://picsum.photos/301/192?random=6'
  }
] as const; 