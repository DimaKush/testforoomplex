import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// Mock handlers for API endpoints
export const handlers = [
  http.get('http://o-complex.com:1337/reviews', () => {
    return HttpResponse.json([
      { id: 1, text: '<p>Great product!</p>' },
      { id: 2, text: '<h3>Could be better</h3><p>Some feedback</p>' }
    ])
  }),

  http.get('http://o-complex.com:1337/products', ({ request }) => {
    const url = new URL(request.url)
    const page = url.searchParams.get('page') || '1'
    
    return HttpResponse.json({
      page: parseInt(page),
      amount: 2,
      total: 50,
      items: [
        { 
          id: 1, 
          title: 'Product 1', 
          description: 'Description for product 1',
          price: 100,
          image_url: 'http://example.com/image1.webp'
        },
        { 
          id: 2, 
          title: 'Product 2', 
          description: 'Description for product 2',
          price: 200,
          image_url: 'http://example.com/image2.webp'
        }
      ]
    })
  }),

  http.post('http://o-complex.com:1337/order', async ({ request }) => {
    const body = await request.json() as { phone?: string; cart?: Array<{ id: number; quantity: number }> }
    
    if (!body.phone || !body.cart || body.cart.length === 0) {
      return HttpResponse.json({
        success: 0,
        error: 'отсутствуют товары'
      })
    }
    
    return HttpResponse.json({
      success: 1
    })
  }),
]

export const server = setupServer(...handlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Reset handlers after each test
afterEach(() => server.resetHandlers())

// Clean up after all tests
afterAll(() => server.close()) 