import { NextRequest } from 'next/server'

export const createMockRequest = (
  url: string,
  options: {
    method?: string
    body?: unknown
    headers?: Record<string, string>
  } = {}
) => {
  const { method = 'GET', body, headers = {} } = options
  
  const requestOptions: ConstructorParameters<typeof NextRequest>[1] = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  }
  
  if (body && method !== 'GET') {
    requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body)
  }
  
  return new NextRequest(url, requestOptions)
}

export const generateMockOrder = (overrides: Record<string, unknown> = {}) => ({
  items: [
    { id: 1, quantity: 2, price: 100 },
    { id: 2, quantity: 1, price: 200 }
  ],
  customer: {
    name: 'Test Customer',
    email: 'test@example.com'
  },
  ...overrides
})

export const generateMockProduct = (overrides: Record<string, unknown> = {}) => ({
  id: Math.floor(Math.random() * 1000),
  name: `Product ${Math.floor(Math.random() * 100)}`,
  price: Math.floor(Math.random() * 1000),
  ...overrides
})

export const generateMockReview = (overrides: Record<string, unknown> = {}) => ({
  id: Math.floor(Math.random() * 1000),
  text: `Review text ${Math.floor(Math.random() * 100)}`,
  rating: Math.floor(Math.random() * 5) + 1,
  ...overrides
}) 