import { POST } from '@/app/api/order/route'
import { createMockRequest } from '../utils/test-helpers'

describe('/api/order', () => {
  describe('Happy Path', () => {
    it('should create order successfully with full data', async () => {
      const orderData = {
        phone: '79000000001',
        cart: [
          { id: 1, quantity: 2 },
          { id: 2, quantity: 1 }
        ]
      }

      const request = createMockRequest('http://localhost:3000/api/order', {
        method: 'POST',
        body: orderData
      })

      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data).toEqual({
        success: 1
      })
    })

    it('should create minimal order', async () => {
      const orderData = {
        phone: '79000000001',
        cart: [{ id: 1, quantity: 1 }]
      }

      const request = createMockRequest('http://localhost:3000/api/order', {
        method: 'POST',
        body: orderData
      })

      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data).toEqual({
        success: 1
      })
    })
  })

  describe('Input Validation', () => {
    it('should handle missing phone', async () => {
      const orderData = {
        cart: [{ id: 1, quantity: 1 }]
      }

      const request = createMockRequest('http://localhost:3000/api/order', {
        method: 'POST',
        body: orderData
      })

      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data).toEqual({
        success: 0,
        error: 'отсутствуют товары'
      })
    })

    it('should handle empty cart', async () => {
      const orderData = {
        phone: '79000000001',
        cart: []
      }

      const request = createMockRequest('http://localhost:3000/api/order', {
        method: 'POST',
        body: orderData
      })

      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data).toEqual({
        success: 0,
        error: 'отсутствуют товары'
      })
    })

    it('should handle missing cart', async () => {
      const orderData = {
        phone: '79000000001'
      }

      const request = createMockRequest('http://localhost:3000/api/order', {
        method: 'POST',
        body: orderData
      })

      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data).toEqual({
        success: 0,
        error: 'отсутствуют товары'
      })
    })

    it('should handle large order quantities', async () => {
      const orderData = {
        phone: '79000000001',
        cart: [
          { id: 1, quantity: 999999 }
        ]
      }

      const request = createMockRequest('http://localhost:3000/api/order', {
        method: 'POST',
        body: orderData
      })

      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(1)
    })

    it('should handle negative quantities', async () => {
      const orderData = {
        phone: '79000000001',
        cart: [
          { id: 1, quantity: -5 }
        ]
      }

      const request = createMockRequest('http://localhost:3000/api/order', {
        method: 'POST',
        body: orderData
      })

      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(1)
    })

    it('should handle malformed JSON', async () => {
      const request = createMockRequest('http://localhost:3000/api/order', {
        method: 'POST',
        body: 'invalid json{'
      })

      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to create order' })
    })
  })

  describe('Phone Number Validation', () => {
    it('should handle different phone formats', async () => {
      const testCases = [
        '79000000001',
        '+79000000001',
        '89000000001',
        '9163452487'
      ]

      for (const phone of testCases) {
        const orderData = {
          phone,
          cart: [{ id: 1, quantity: 1 }]
        }

        const request = createMockRequest('http://localhost:3000/api/order', {
          method: 'POST',
          body: orderData
        })

        const response = await POST(request)
        const data = await response.json()
        
        expect(response.status).toBe(200)
        expect(data.success).toBe(1)
      }
    })

    it('should handle invalid phone numbers', async () => {
      const orderData = {
        phone: '',
        cart: [{ id: 1, quantity: 1 }]
      }

      const request = createMockRequest('http://localhost:3000/api/order', {
        method: 'POST',
        body: orderData
      })

      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(0)
    })
  })

  describe('Security & Edge Cases', () => {
    it('should handle SQL injection attempt in phone', async () => {
      const orderData = {
        phone: "'; DROP TABLE orders; --",
        cart: [{ id: 1, quantity: 1 }]
      }

      const request = createMockRequest('http://localhost:3000/api/order', {
        method: 'POST',
        body: orderData
      })

      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(1)
    })

    it('should handle extremely large cart', async () => {
      const largeCart = Array(1000).fill(null).map((_, i) => ({
        id: i + 1,
        quantity: 1
      }))

      const orderData = {
        phone: '79000000001',
        cart: largeCart
      }

      const request = createMockRequest('http://localhost:3000/api/order', {
        method: 'POST',
        body: orderData
      })

      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(1)
    })
  })

  describe('API Call Verification', () => {
    it('should call external API with correct method and headers', async () => {
      const { server } = await import('../setup')
      const { http, HttpResponse } = await import('msw')
      
      let capturedMethod = ''
      let capturedHeaders: Record<string, string> = {}
      let capturedBody: unknown = null

      server.use(
        http.post('http://o-complex.com:1337/order', async ({ request }) => {
          capturedMethod = request.method
          capturedHeaders = Object.fromEntries(request.headers.entries())
          capturedBody = await request.json()
          return HttpResponse.json({ success: 1 })
        })
      )

      const orderData = { phone: '79000000001', cart: [{ id: 1, quantity: 1 }] }
      const request = createMockRequest('http://localhost:3000/api/order', {
        method: 'POST',
        body: orderData
      })

      await POST(request)
      
      expect(capturedMethod).toBe('POST')
      expect(capturedHeaders['content-type']).toBe('application/json')
      expect(capturedBody).toEqual(orderData)
    })
  })

  describe('Error Handling', () => {
    it('should handle 400 bad request', async () => {
      const { server } = await import('../setup')
      const { http, HttpResponse } = await import('msw')
      
      server.use(
        http.post('http://o-complex.com:1337/order', () => {
          return new HttpResponse(null, { status: 400 })
        })
      )

      const request = createMockRequest('http://localhost:3000/api/order', {
        method: 'POST',
        body: { phone: '79000000001', cart: [{ id: 1, quantity: 1 }] }
      })

      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to create order' })
    })

    it('should handle 500 internal server error', async () => {
      const { server } = await import('../setup')
      const { http, HttpResponse } = await import('msw')
      
      server.use(
        http.post('http://o-complex.com:1337/order', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      const request = createMockRequest('http://localhost:3000/api/order', {
        method: 'POST',
        body: { phone: '79000000001', cart: [{ id: 1, quantity: 1 }] }
      })

      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to create order' })
    })

    it('should handle network timeout', async () => {
      const { server } = await import('../setup')
      const { http } = await import('msw')
      
      server.use(
        http.post('http://o-complex.com:1337/order', async () => {
          await new Promise(resolve => setTimeout(resolve, 100))
          throw new Error('Network timeout')
        })
      )

      const request = createMockRequest('http://localhost:3000/api/order', {
        method: 'POST',
        body: { phone: '79000000001', cart: [{ id: 1, quantity: 1 }] }
      })

      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to create order' })
    })

    it('should handle malformed API response', async () => {
      const { server } = await import('../setup')
      const { http, HttpResponse } = await import('msw')
      
      server.use(
        http.post('http://o-complex.com:1337/order', () => {
          return new HttpResponse('invalid json{', {
            headers: { 'Content-Type': 'application/json' }
          })
        })
      )

      const request = createMockRequest('http://localhost:3000/api/order', {
        method: 'POST',
        body: { phone: '79000000001', cart: [{ id: 1, quantity: 1 }] }
      })

      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to create order' })
    })
  })
}) 