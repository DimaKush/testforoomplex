import { GET } from '@/app/api/products/route'
import { createMockRequest } from '../utils/test-helpers'

describe('/api/products', () => {
  describe('Happy Path', () => {
    it('should fetch products with default pagination', async () => {
      const request = createMockRequest('http://localhost:3000/api/products')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data).toEqual({
        page: 1,
        amount: expect.any(Number),
        total: expect.any(Number),
        items: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            description: expect.any(String),
            price: expect.any(Number),
            image_url: expect.any(String)
          })
        ])
      })
    })

    it('should fetch products with custom pagination', async () => {
      const request = createMockRequest('http://localhost:3000/api/products?page=2&page_size=5')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.items).toBeInstanceOf(Array)
      expect(data.page).toBe(2)
      expect(data.total).toBeGreaterThan(0)
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero page size', async () => {
      const request = createMockRequest('http://localhost:3000/api/products?page=1&page_size=0')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.page).toBe(1)
    })

    it('should handle negative page', async () => {
      const request = createMockRequest('http://localhost:3000/api/products?page=-1&page_size=10')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.page).toBe(-1)
    })

    it('should handle non-numeric parameters gracefully', async () => {
      const request = createMockRequest('http://localhost:3000/api/products?page=abc&page_size=xyz')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect([null, NaN]).toContain(data.page)
    })

    it('should handle extremely large page numbers', async () => {
      const request = createMockRequest('http://localhost:3000/api/products?page=999999&page_size=1000')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.page).toBe(999999)
    })
  })

  describe('API Call Verification', () => {
    it('should call external API with correct parameters', async () => {
      const { server } = await import('../setup')
      const { http, HttpResponse } = await import('msw')
      
      let capturedUrl = ''
      server.use(
        http.get('http://o-complex.com:1337/products', ({ request }) => {
          capturedUrl = request.url
          return HttpResponse.json({
            page: 3,
            amount: 0,
            total: 0,
            items: []
          })
        })
      )

      const request = createMockRequest('http://localhost:3000/api/products?page=3&page_size=15')
      await GET(request)
      
      expect(capturedUrl).toBe('http://o-complex.com:1337/products?page=3&page_size=15')
    })

    it('should send correct headers to external API', async () => {
      const { server } = await import('../setup')
      const { http, HttpResponse } = await import('msw')
      
      let capturedHeaders: Record<string, string> = {}
      server.use(
        http.get('http://o-complex.com:1337/products', ({ request }) => {
          capturedHeaders = Object.fromEntries(request.headers.entries())
          return HttpResponse.json({ page: 1, amount: 0, total: 0, items: [] })
        })
      )

      const request = createMockRequest('http://localhost:3000/api/products')
      await GET(request)
      
      expect(capturedHeaders['content-type']).toBe('application/json')
    })
  })

  describe('Error Handling', () => {
    it('should handle 500 server errors', async () => {
      const { server } = await import('../setup')
      const { http, HttpResponse } = await import('msw')
      
      server.use(
        http.get('http://o-complex.com:1337/products', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      const request = createMockRequest('http://localhost:3000/api/products')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch products' })
    })

    it('should handle 404 not found', async () => {
      const { server } = await import('../setup')
      const { http, HttpResponse } = await import('msw')
      
      server.use(
        http.get('http://o-complex.com:1337/products', () => {
          return new HttpResponse(null, { status: 404 })
        })
      )

      const request = createMockRequest('http://localhost:3000/api/products')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch products' })
    })

    it('should handle malformed JSON response', async () => {
      const { server } = await import('../setup')
      const { http, HttpResponse } = await import('msw')
      
      server.use(
        http.get('http://o-complex.com:1337/products', () => {
          return new HttpResponse('invalid json{', {
            headers: { 'Content-Type': 'application/json' }
          })
        })
      )

      const request = createMockRequest('http://localhost:3000/api/products')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch products' })
    })

    it('should handle network timeout', async () => {
      const { server } = await import('../setup')
      const { http, HttpResponse } = await import('msw')
      
      server.use(
        http.get('http://o-complex.com:1337/products', async () => {
          await new Promise(resolve => setTimeout(resolve, 100))
          throw new Error('Network timeout')
        })
      )

      const request = createMockRequest('http://localhost:3000/api/products')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch products' })
    })
  })

  describe('Response Validation', () => {
    it('should handle empty product list', async () => {
      const { server } = await import('../setup')
      const { http, HttpResponse } = await import('msw')
      
      server.use(
        http.get('http://o-complex.com:1337/products', () => {
          return HttpResponse.json({
            page: 1,
            amount: 0,
            total: 0,
            items: []
          })
        })
      )

      const request = createMockRequest('http://localhost:3000/api/products')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.items).toEqual([])
      expect(data.total).toBe(0)
    })

    it('should handle products with long titles', async () => {
      const { server } = await import('../setup')
      const { http, HttpResponse } = await import('msw')
      
      const longTitle = 'A'.repeat(500)
      server.use(
        http.get('http://o-complex.com:1337/products', () => {
          return HttpResponse.json({
            page: 1,
            amount: 1,
            total: 1,
            items: [{ 
              id: 1, 
              title: longTitle,
              description: 'Description',
              price: 100,
              image_url: 'http://example.com/image.webp'
            }]
          })
        })
      )

      const request = createMockRequest('http://localhost:3000/api/products')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.items[0].title).toHaveLength(500)
    })
  })
}) 