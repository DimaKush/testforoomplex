import { Review, ProductsResponse, OrderRequest, OrderResponse } from '@/types';
import { logger } from '@/utils/logger';

// Determine API base URL based on environment
function getApiBase(): string {
  // Server-side (SSR): use direct external API
  if (typeof window === 'undefined') {
    return process.env['NEXT_PUBLIC_API_BASE_URL'] || 'http://o-complex.com:1337';
  }
  
  // Client-side: always use Next.js API routes for CORS handling
  return '/api';
}

const REQUEST_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Cache for API responses
const cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Utility functions
function getCacheKey(endpoint: string, params?: Record<string, unknown>): string {
  const paramString = params ? JSON.stringify(params) : '';
  return `${endpoint}${paramString}`;
}

function isValidCache(cacheItem: { timestamp: number; ttl: number }): boolean {
  return Date.now() - cacheItem.timestamp < cacheItem.ttl;
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithTimeout(
  url: string, 
  options: RequestInit = {}, 
  timeout = REQUEST_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = MAX_RETRIES
): Promise<Response> {
  let lastError: Error;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      logger.debug(`API request attempt ${attempt + 1}:`, url);
      const response = await fetchWithTimeout(url, options);
      
      if (!response.ok) {
        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          url
        );
      }
      
      return response;
    } catch (error) {
      lastError = error as Error;
      logger.warn(`API request failed (attempt ${attempt + 1}):`, error);
      
      if (attempt < retries) {
        await delay(RETRY_DELAY * (attempt + 1)); // Exponential backoff
      }
    }
  }

  throw lastError!;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  cacheTTL = 5 * 60 * 1000 // 5 minutes default
): Promise<T> {
  const API_BASE = getApiBase();
  const url = `${API_BASE}${endpoint}`;
  const cacheKey = getCacheKey(endpoint);

  // Check cache for GET requests
  if (options.method !== 'POST' && cache.has(cacheKey)) {
    const cacheItem = cache.get(cacheKey)!;
    if (isValidCache(cacheItem)) {
      logger.debug('Returning cached response for:', endpoint);
      return cacheItem.data as T;
    }
    cache.delete(cacheKey);
  }

  try {
    const response = await fetchWithRetry(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new ApiError(
        `Expected JSON response, got ${contentType}`,
        response.status,
        endpoint
      );
    }

    let data: T;
    try {
      const text = await response.text();
      if (!text.trim()) {
        throw new ApiError('Empty response body', response.status, endpoint);
      }
      data = JSON.parse(text);
    } catch (parseError) {
      throw new ApiError(
        `Invalid JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
        response.status,
        endpoint
      );
    }

    // Basic validation for expected structure
    if (data === null || data === undefined) {
      throw new ApiError('Null or undefined response data', response.status, endpoint);
    }

    // Cache successful GET requests
    if (options.method !== 'POST') {
      cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        ttl: cacheTTL,
      });
      
      // Clean old cache entries to prevent memory leaks
      cleanCache();
    }

    logger.debug('API request successful:', endpoint);
    return data;
  } catch (error) {
    logger.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Add cache cleanup function
function cleanCache(): void {
  for (const [key, item] of cache.entries()) {
    if (!isValidCache(item)) {
      cache.delete(key);
    }
  }
  
  // If cache is still too large, remove oldest entries
  if (cache.size > 50) {
    const entries = Array.from(cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    entries.slice(0, cache.size - 50).forEach(([key]) => cache.delete(key));
  }
}

export const api = {
  async getReviews(): Promise<Review[]> {
    return apiRequest<Review[]>('/reviews');
  },

  async getProducts(page: number = 1, pageSize: number = 20): Promise<ProductsResponse> {
    return apiRequest<ProductsResponse>(`/products?page=${page}&page_size=${pageSize}`);
  },

  async createOrder(order: OrderRequest): Promise<OrderResponse> {
    return apiRequest<OrderResponse>('/order', {
      method: 'POST',
      body: JSON.stringify(order),
    }, 0); // No caching for POST requests
  },

  // Cache management
  clearCache(): void {
    cache.clear();
    logger.debug('API cache cleared');
  },

  getCacheSize(): number {
    return cache.size;
  },

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await apiRequest('/health', {}, 0);
      return true;
    } catch {
      return false;
    }
  },
}; 