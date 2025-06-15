# Тестовое задание React Developer (Next.js)

Интернет-магазин с отзывами, каталогом товаров и корзиной покупок по дизайну [Figma](https://www.figma.com/file/XIYVl8ICFkdl3HJZcc8o8B/тестовое?type=design&node-id=0%3A1&mode=design&t=6xUI2e3VtlUzDocD-1).

## 🎯 Что реализовано

### Основные требования ТЗ

- ✅ **Адаптивность** - мобильные, планшеты, десктоп до 1920px
- ✅ **API интеграция** - отзывы, товары с пагинацией, заказы
- ✅ **Бесконечная прокрутка** - автоподгрузка товаров
- ✅ **Корзина** - добавление/удаление товаров, сохранение в localStorage
- ✅ **Кнопка "Купить"** → поля +/- с вводом количества
- ✅ **Маска телефона** - собственная реализация для React 19
- ✅ **Валидация** - проверка телефона, подсветка ошибок
- ✅ **Модальное окно** - уведомление об успешном заказе

### Дополнительные улучшения
- 🚀 **SSR** - предзагрузка данных на сервере для быстрого отображения
- 🛡️ **XSS защита** - санитизация HTML в отзывах
- ⚡ **Производительность** - skeleton loading, кеширование API, retry логика
- 🎨 **UX** - анимации, индикаторы загрузки, accessibility
- 🔒 **Безопасность** - Error Boundary, валидация входных данных
- 📱 **SEO/PWA** - метаданные, sitemap, manifest, structured data
- 🏷️ **Schema.org** - полная разметка для поисковых систем (JSON-LD + microdata)

## 🛠 Технологии

- **Next.js 15** + App Router
- **React 19** + TypeScript
- **Tailwind CSS v4** 
- **React Icons**

## 🚀 Запуск

```bash
# Установка
npm install

# Настройка (опционально)
cp ENVIRONMENT.md .env.local

# Разработка
npm run dev

# Продакшен
npm run build && npm start
```

**Доступно:** http://localhost:3000

## 🧪 Тестирование

Проект включает комплексное покрытие API endpoints тестами.

### Команды запуска

```bash
# Все тесты (watch mode)
npm test

# Разовый запуск всех тестов
npm run test:run

# Запуск с UI интерфейсом
npm run test:ui
```

### Структура тестов

```
test/
├── api/                   # Unit тесты API endpoints
│   ├── reviews.test.ts    # GET /api/reviews
│   ├── products.test.ts   # GET /api/products
│   └── order.test.ts      # POST /api/order
├── integration/           # Интеграционные тесты
│   └── api-flow.test.ts   # E2E сценарии покупки
├── utils/                 # Тестовые утилиты
│   └── test-helpers.ts    # Mock helpers и factories
└── setup.ts              # Конфигурация MSW моков
```

### Покрытие тестов

**🎯 Happy Path**
- Успешные запросы с валидными данными
- Правильная структура ответов

**🛡️ Error Handling**
- HTTP ошибки (404, 500, 400)
- Network timeouts
- Malformed JSON responses

**🧪 Edge Cases**
- Невалидные параметры (отрицательные, NaN)
- Экстремальные значения
- Пустые результаты

**🔒 Security Testing**
- SQL injection attempts
- XSS payloads
- Большие payloads

**⚡ Performance & Integration**
- Concurrent API calls
- End-to-end purchase flow
- Error recovery scenarios

### Используемые технологии

- **Vitest** - тестовый фреймворк
- **MSW** - мокирование API запросов
- **@testing-library** - утилиты для тестирования

## 🏗 Архитектура

```
src/
├── app/
│   ├── page.tsx           # Серверный компонент (SSR)
│   ├── layout.tsx         # Layout с SEO метаданными
│   ├── sitemap.ts         # Динамический sitemap
│   └── manifest.ts        # PWA манифест
├── components/
│   ├── ClientHomePage.tsx # Клиентский компонент с состоянием
│   ├── Cart.tsx           # Корзина с формой заказа
│   ├── PhoneInput.tsx     # Маска телефона (собственная)
│   └── ...                # Остальные компоненты
├── hooks/                 # Кастомные хуки
├── services/api.ts        # API с кешем и retry
├── utils/                 # Утилиты и валидация
│   └── schema.ts          # Schema.org генераторы
├── types/                 # TypeScript типы
└── constants/             # Константы и fallback данные
```

## 🔌 API

- **Отзывы:** `GET /reviews`
- **Товары:** `GET /products?page=1&page_size=20`
- **Заказ:** `POST /order` + телефон и корзина

**CORS решение:** Next.js proxy для разработки + настроенные headers

## 🎨 Особенности реализации

**SSR + CSR гибрид:** Серверный page.tsx предзагружает данные, клиентский ClientHomePage управляет интерактивностью

**Маска телефона:** Собственная реализация без библиотек (React 19 совместимость)

**API обработка:** Кеширование (5 мин), retry с exponential backoff, timeout защита

**Производительность:** React.memo, useCallback, useMemo, бандл оптимизация

**SEO полный:** Open Graph, Twitter Cards, JSON-LD structured data, robots.txt

**Schema.org разметка:** Полная поддержка для Google Rich Results - Organization, Store, Product, Review, ItemList, FAQ, Breadcrumbs

**Environment конфигурация:** Все настройки через .env переменные - URL сайта, API endpoints, контактные данные

## ⚙️ Конфигурация

Проект использует environment переменные для гибкой настройки:

- **SEO данные** - название сайта, описание, URL из `NEXT_PUBLIC_SITE_*`
- **API endpoints** - базовые URL из `NEXT_PUBLIC_API_BASE_URL`
- **Schema.org** - контактные данные, адреса автоматически из env
- **Метаданные** - OpenGraph, Twitter Cards динамически

См. `ENVIRONMENT.md` для полного списка переменных.
