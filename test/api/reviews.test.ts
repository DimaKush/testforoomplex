import { GET } from '@/app/api/reviews/route'

describe('/api/reviews', () => {
  describe('Happy Path', () => {
    it('should fetch reviews successfully', async () => {
      const response = await GET()
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            text: expect.any(String)
          })
        ])
      )
      expect(data[0].text).toContain('<p>')
    })
  })

  describe('API Call Verification', () => {
    it('should call external API with correct headers', async () => {
      const { server } = await import('../setup')
      const { http, HttpResponse } = await import('msw')
      
      let capturedHeaders: Record<string, string> = {}
      server.use(
        http.get('http://o-complex.com:1337/reviews', ({ request }) => {
          capturedHeaders = Object.fromEntries(request.headers.entries())
          return HttpResponse.json([])
        })
      )

      await GET()
      
      expect(capturedHeaders['content-type']).toBe('application/json')
    })

    it('should call correct endpoint', async () => {
      const { server } = await import('../setup')
      const { http, HttpResponse } = await import('msw')
      
      let wasCalled = false
      server.use(
        http.get('http://o-complex.com:1337/reviews', () => {
          wasCalled = true
          return HttpResponse.json([])
        })
      )

      await GET()
      
      expect(wasCalled).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should handle 500 server errors', async () => {
      const { server } = await import('../setup')
      const { http, HttpResponse } = await import('msw')
      
      server.use(
        http.get('http://o-complex.com:1337/reviews', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      const response = await GET()
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch reviews' })
    })

    it('should handle 404 not found', async () => {
      const { server } = await import('../setup')
      const { http, HttpResponse } = await import('msw')
      
      server.use(
        http.get('http://o-complex.com:1337/reviews', () => {
          return new HttpResponse(null, { status: 404 })
        })
      )

      const response = await GET()
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch reviews' })
    })

    it('should handle malformed JSON response', async () => {
      const { server } = await import('../setup')
      const { http, HttpResponse } = await import('msw')
      
      server.use(
        http.get('http://o-complex.com:1337/reviews', () => {
          return new HttpResponse('invalid json{', {
            headers: { 'Content-Type': 'application/json' }
          })
        })
      )

      const response = await GET()
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch reviews' })
    })

    it('should handle network errors', async () => {
      const { server } = await import('../setup')
      const { http } = await import('msw')
      
      server.use(
        http.get('http://o-complex.com:1337/reviews', () => {
          throw new Error('Network error')
        })
      )

      const response = await GET()
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch reviews' })
    })
  })

  describe('Response Validation', () => {
    it('should handle empty reviews array', async () => {
      const { server } = await import('../setup')
      const { http, HttpResponse } = await import('msw')
      
      server.use(
        http.get('http://o-complex.com:1337/reviews', () => {
          return HttpResponse.json([])
        })
      )

      const response = await GET()
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data).toEqual([])
    })

    it('should handle reviews with HTML content', async () => {
      const { server } = await import('../setup')
      const { http, HttpResponse } = await import('msw')
      
      server.use(
        http.get('http://o-complex.com:1337/reviews', () => {
          return HttpResponse.json([
            { id: 1, text: '<h1>Title</h1><p>Review content</p>' },
            { id: 2, text: '<script>alert("xss")</script><p>Bad content</p>' },
            { id: 3, text: '<p>Simple text</p>' }
          ])
        })
      )

      const response = await GET()
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data).toHaveLength(3)
      expect(data[0].text).toContain('<h1>')
      expect(data[1].text).toContain('<script>')
      expect(data[2].text).toContain('<p>')
    })

    it('should handle missing fields', async () => {
      const { server } = await import('../setup')
      const { http, HttpResponse } = await import('msw')
      
      server.use(
        http.get('http://o-complex.com:1337/reviews', () => {
          return HttpResponse.json([
            { id: 1, text: 'Review without other fields' },
            { text: 'Review without id' }
          ])
        })
      )

      const response = await GET()
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data).toHaveLength(2)
      expect(data[1]).not.toHaveProperty('id')
    })

    it('should handle very long HTML content', async () => {
      const { server } = await import('../setup')
      const { http, HttpResponse } = await import('msw')
      
      const longHtml = '<div>' + 'A'.repeat(10000) + '</div>'
      server.use(
        http.get('http://o-complex.com:1337/reviews', () => {
          return HttpResponse.json([
            { id: 1, text: longHtml }
          ])
        })
      )

      const response = await GET()
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data[0].text).toHaveLength(longHtml.length)
    })
  })
}) 