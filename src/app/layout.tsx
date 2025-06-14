import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { organizationSchema, websiteSchema, storeSchema, faqSchema } from '@/utils/schema';
import "./globals.css";

// Site configuration
const SITE_NAME = process.env['NEXT_PUBLIC_SITE_NAME'] || 'Интернет-магазин';
const SITE_DESCRIPTION = process.env['NEXT_PUBLIC_SITE_DESCRIPTION'] || 'Современный интернет-магазин с отзывами клиентов, каталогом товаров и удобной корзиной покупок';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: 'swap',
  preload: true,
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Тестовое задание`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'интернет-магазин',
    'товары',
    'отзывы',
    'корзина',
    'покупки',
    'каталог',
    'React',
    'Next.js',
  ],
  authors: [{ name: 'DimaKush' }],
  creator: 'DimaKush',
  publisher: SITE_NAME,
  category: "ecommerce",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env['NEXT_PUBLIC_SITE_URL'] || 
    (process.env['VERCEL_URL'] ? `https://${process.env['VERCEL_URL']}` : 'https://your-domain.com')),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Интернет-магазин | Тестовое задание",
    description: "Современный интернет-магазин с отзывами клиентов и каталогом товаров",
    url: '/',
    siteName: 'Интернет-магазин',
    locale: 'ru_RU',
    type: 'website',
    countryName: 'Russia',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Интернет-магазин',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Интернет-магазин | Тестовое задание",
    description: "Современный интернет-магазин с отзывами клиентов и каталогом товаров",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="preconnect" href="http://o-complex.com" />
        <link rel="dns-prefetch" href="//o-complex.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://picsum.photos" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(storeSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
