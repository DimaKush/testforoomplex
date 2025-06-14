import { MetadataRoute } from 'next'

const baseUrl = process.env['NEXT_PUBLIC_SITE_URL'] || 
  (process.env['VERCEL_URL'] ? `https://${process.env['VERCEL_URL']}` : 'https://your-domain.com')

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/#reviews`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]
} 