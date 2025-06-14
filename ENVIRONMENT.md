# Environment Variables

Создайте файл `.env.local` в корне проекта со следующими переменными:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-project-name.vercel.app
NEXT_PUBLIC_SITE_NAME="Интернет-магазин"
NEXT_PUBLIC_SITE_DESCRIPTION="Современный интернет-магазин с отзывами клиентов, каталогом товаров и удобной корзиной покупок"

# API Configuration  
NEXT_PUBLIC_API_BASE_URL=http://o-complex.com:1337

# Business Information (для Schema.org)
NEXT_PUBLIC_CONTACT_PHONE="+7-888-888-8888"
NEXT_PUBLIC_BUSINESS_ADDRESS="Москва"

# Environment
NODE_ENV=development

# Analytics (optional)
# NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
# NEXT_PUBLIC_YANDEX_METRICA_ID=XXXXXXXX
```

## Описание переменных

### Основные настройки
- `NEXT_PUBLIC_SITE_URL` - базовый URL сайта для SEO и OpenGraph
- `NEXT_PUBLIC_SITE_NAME` - название сайта (используется в Schema.org)
- `NEXT_PUBLIC_SITE_DESCRIPTION` - описание сайта для SEO и Schema.org
- `NEXT_PUBLIC_API_BASE_URL` - URL API сервера
- `NODE_ENV` - окружение (development/production)

### Бизнес информация (Schema.org)
- `NEXT_PUBLIC_CONTACT_PHONE` - телефон для связи (отображается в Schema.org)
- `NEXT_PUBLIC_BUSINESS_ADDRESS` - город/адрес бизнеса для локального SEO

### Аналитика (опционально)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics ID
- `NEXT_PUBLIC_YANDEX_METRICA_ID` - Яндекс.Метрика ID

## Vercel Deploy

Для Vercel автоматически используется `VERCEL_URL` если `NEXT_PUBLIC_SITE_URL` не установлен.

В настройках Vercel Environment Variables установите:
- `NEXT_PUBLIC_SITE_URL` - ваш домен (например: `https://testforoomplex.vercel.app`)
- `NEXT_PUBLIC_SITE_NAME` - реальное название компании
- `NEXT_PUBLIC_CONTACT_PHONE` - реальный телефон
- `NEXT_PUBLIC_BUSINESS_ADDRESS` - реальный адрес
- `NODE_ENV=production`

## Schema.org интеграция

Все Schema.org данные автоматически берутся из environment переменных:
- Organization, Store, LocalBusiness используют `SITE_NAME`, `CONTACT_PHONE`, `BUSINESS_ADDRESS`
- Product schemas используют `SITE_NAME` как бренд
- Website schema использует `SITE_DESCRIPTION` и `SITE_URL` 