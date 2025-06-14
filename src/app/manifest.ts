import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Интернет-магазин | Тестовое задание',
    short_name: 'Интернет-магазин',
    description: 'Современный интернет-магазин с отзывами клиентов, каталогом товаров и удобной корзиной покупок',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#6366f1',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      },
    ],
    categories: ['shopping', 'ecommerce', 'business'],
    lang: 'ru',
    dir: 'ltr',
  }
} 