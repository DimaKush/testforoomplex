import { GET as getReviews } from '@/app/api/reviews/route'
import { GET as getProducts } from '@/app/api/products/route'
import { POST as createOrder } from '@/app/api/order/route'
import { createMockRequest } from '../utils/test-helpers'

describe('API Integration Flow', () => {
  it('should handle complete purchase flow', async () => {
    const reviewsResponse = await getReviews()
    const reviewsData = await reviewsResponse.json()
    expect(reviewsResponse.status).toBe(200)
    expect(reviewsData).toBeInstanceOf(Array)

    const productsRequest = createMockRequest('http://localhost:3000/api/products?page=1&page_size=5')
    const productsResponse = await getProducts(productsRequest)
    const productsData = await productsResponse.json()
    expect(productsResponse.status).toBe(200)
    expect(productsData.items).toBeInstanceOf(Array)
    
    if (productsData.items.length > 0) {
      const selectedProduct = productsData.items[0]
      const orderData = {
        phone: '79000000001',
        cart: [
          { id: selectedProduct.id, quantity: 2 }
        ]
      }

      const orderRequest = createMockRequest('http://localhost:3000/api/order', {
        method: 'POST',
        body: orderData
      })

      const orderResponse = await createOrder(orderRequest)
      const orderResult = await orderResponse.json()
      
      expect(orderResponse.status).toBe(200)
      expect(orderResult.success).toBe(1)
    }
  })

  it('should handle error recovery in purchase flow', async () => {
    const { server } = await import('../setup')
    const { http, HttpResponse } = await import('msw')
    
    server.use(
      http.get('http://o-complex.com:1337/products', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )

    const productsRequest = createMockRequest('http://localhost:3000/api/products')
    const productsResponse = await getProducts(productsRequest)
    
    expect(productsResponse.status).toBe(500)
    
    server.use(
      http.get('http://o-complex.com:1337/products', () => {
        return HttpResponse.json({
          page: 1,
          amount: 1,
          total: 1,
          items: [{ id: 1, title: 'Recovery Product', description: 'Test', price: 100, image_url: 'http://example.com/recovery.webp' }]
        })
      })
    )

    const retryResponse = await getProducts(createMockRequest('http://localhost:3000/api/products'))
    const retryData = await retryResponse.json()
    
    expect(retryResponse.status).toBe(200)
    expect(retryData.items).toHaveLength(1)
    expect(retryData.items[0].title).toBe('Recovery Product')
  })

  it('should handle concurrent API calls', async () => {
    const promises = [
      getReviews(),
      getProducts(createMockRequest('http://localhost:3000/api/products?page=1&page_size=10')),
      getProducts(createMockRequest('http://localhost:3000/api/products?page=2&page_size=10')),
      createOrder(createMockRequest('http://localhost:3000/api/order', {
        method: 'POST',
        body: { phone: '79000000001', cart: [{ id: 1, quantity: 1 }] }
      }))
    ]

    const responses = await Promise.all(promises)
    
    responses.forEach(response => {
      expect(response.status).toBe(200)
    })

    const [reviewsData, products1Data, products2Data, orderData] = await Promise.all(
      responses.map(response => response.json())
    )

    expect(reviewsData).toBeInstanceOf(Array)
    expect(products1Data.items).toBeInstanceOf(Array)
    expect(products2Data.items).toBeInstanceOf(Array)
    expect(orderData.success).toBe(1)
  })

  it('should validate end-to-end response times', async () => {
    const startTime = Date.now()
    
    const promises = [
      getReviews(),
      getProducts(createMockRequest('http://localhost:3000/api/products')),
      createOrder(createMockRequest('http://localhost:3000/api/order', {
        method: 'POST',
        body: { phone: '79000000001', cart: [{ id: 1, quantity: 1 }] }
      }))
    ]

    const responses = await Promise.all(promises)
    const endTime = Date.now()
    
    const totalTime = endTime - startTime
    expect(totalTime).toBeLessThan(5000)
    
    responses.forEach(response => {
      expect(response.status).toBe(200)
    })
  })
}) 