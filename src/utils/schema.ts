import { Product, Review } from '@/types';

const SITE_URL = process.env['NEXT_PUBLIC_SITE_URL'] || 
  (process.env['VERCEL_URL'] ? `https://${process.env['VERCEL_URL']}` : 'https://your-domain.com');
const SITE_NAME = process.env['NEXT_PUBLIC_SITE_NAME'] || 'Интернет-магазин';
const SITE_DESCRIPTION = process.env['NEXT_PUBLIC_SITE_DESCRIPTION'] || 'Современный интернет-магазин с отзывами клиентов, каталогом товаров и удобной корзиной покупок';
const CONTACT_PHONE = process.env['NEXT_PUBLIC_CONTACT_PHONE'] || '+7-888-888-8888';
const BUSINESS_ADDRESS = process.env['NEXT_PUBLIC_BUSINESS_ADDRESS'] || 'Москва';

// Organization Schema
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": SITE_NAME,
  "url": SITE_URL,
  "logo": `${SITE_URL}/logo.png`,
  "description": SITE_DESCRIPTION,
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "RU",
    "addressLocality": BUSINESS_ADDRESS
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": CONTACT_PHONE,
    "contactType": "customer service",
    "availableLanguage": "Russian"
  },
  "sameAs": []
};

// Website Schema
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": SITE_NAME,
  "url": SITE_URL,
  "description": SITE_DESCRIPTION,
  "inLanguage": "ru-RU",
  "publisher": {
    "@type": "Organization",
    "name": SITE_NAME
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${SITE_URL}/search?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
};

// E-commerce Store Schema
export const storeSchema = {
  "@context": "https://schema.org",
  "@type": "Store",
  "name": SITE_NAME,
  "url": SITE_URL,
  "description": SITE_DESCRIPTION,
  "image": `${SITE_URL}/og-image.png`,
  "priceRange": "₽₽",
  "currenciesAccepted": "RUB",
  "paymentAccepted": "Cash, Credit Card",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "RU",
    "addressLocality": BUSINESS_ADDRESS
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "55.7558",
    "longitude": "37.6176"
  },
  "openingHours": "Mo-Su 00:00-23:59",
  "telephone": CONTACT_PHONE
};

// Product Schema Generator
export function generateProductSchema(product: Product): object {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": product.image_url || `${SITE_URL}/placeholder-product.jpg`,
    "sku": `PROD-${product.id}`,
    "mpn": `MPN-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": SITE_NAME
    },
    "offers": {
      "@type": "Offer",
      "url": `${SITE_URL}/product/${product.id}`,
      "priceCurrency": "RUB",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": SITE_NAME
      },
      "itemCondition": "https://schema.org/NewCondition",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "RUB"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 2,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 3,
            "unitCode": "DAY"
          }
        }
      }
    },
    "category": "Товары",
    "manufacturer": {
      "@type": "Organization",
      "name": SITE_NAME
    }
  };
}

// Review Schema Generator
export function generateReviewSchema(review: Review): object {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    "reviewBody": review.text,
    "author": {
      "@type": "Person",
      "name": "Клиент"
    },
    "datePublished": new Date().toISOString(),
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": 5,
      "bestRating": 5,
      "worstRating": 1
    },
    "itemReviewed": {
      "@type": "Organization",
      "name": SITE_NAME
    }
  };
}

// Product List Schema Generator
export function generateProductListSchema(products: Product[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Каталог товаров",
    "description": `Полный каталог товаров ${SITE_NAME}`,
    "numberOfItems": products.length,
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.title,
        "description": product.description,
        "image": product.image_url || `${SITE_URL}/placeholder-product.jpg`,
        "url": `${SITE_URL}/product/${product.id}`,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "RUB",
          "price": product.price,
          "availability": "https://schema.org/InStock"
        }
      }
    }))
  };
}

// Breadcrumb Schema Generator
export function generateBreadcrumbSchema(items: Array<{ name: string; url?: string }>): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      ...(item.url && { "item": `${SITE_URL}${item.url}` })
    }))
  };
}

// FAQ Schema Generator (for common questions)
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Как оформить заказ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Добавьте товары в корзину, укажите номер телефона и нажмите 'Заказать'. Мы свяжемся с вами для подтверждения."
      }
    },
    {
      "@type": "Question",
      "name": "Какие способы оплаты доступны?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Мы принимаем наличные при получении и банковские карты."
      }
    },
    {
      "@type": "Question",
      "name": "Сколько стоит доставка?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Доставка бесплатная при заказе от 1000 рублей."
      }
    },
    {
      "@type": "Question",
      "name": "Как долго доставляется заказ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Обычно доставка занимает 1-3 рабочих дня в зависимости от вашего местоположения."
      }
    }
  ]
};

// Local Business Schema (if physical store)
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": SITE_NAME,
  "description": SITE_DESCRIPTION,
  "url": SITE_URL,
  "telephone": CONTACT_PHONE,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ул. Примерная, 123",
    "addressLocality": BUSINESS_ADDRESS,
    "addressRegion": "Московская область",
    "postalCode": "123456",
    "addressCountry": "RU"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "55.7558",
    "longitude": "37.6176"
  },
  "openingHours": [
    "Mo-Fr 09:00-18:00",
    "Sa 10:00-16:00"
  ],
  "priceRange": "₽₽",
  "image": `${SITE_URL}/store-photo.jpg`,
  "paymentAccepted": "Cash, Credit Card, Bank Transfer"
}; 