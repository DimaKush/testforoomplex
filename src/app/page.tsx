import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ClientHomePage } from '@/components/ClientHomePage';
import { api } from '@/services/api';
import { Review, Product } from '@/types';
import { FALLBACK_REVIEWS, FALLBACK_PRODUCTS, PAGINATION } from '@/constants';
import { logger } from '@/utils/logger';

// Server Component - runs on server for SSR
export default async function Home() {
  let reviews: Review[] = [];
  let products: Product[] = [];
  let total = 0;

  try {
    // Load reviews on server
    logger.info('SSR: Loading reviews...');
    const reviewsData = await api.getReviews();
    reviews = reviewsData;
    logger.info('SSR: Reviews loaded:', reviews.length);
  } catch (error) {
    logger.error('SSR: Error loading reviews:', error);
    reviews = FALLBACK_REVIEWS.map(r => ({ ...r }));
  }

  try {
    // Load first page of products on server
    logger.info('SSR: Loading products...');
    const productsData = await api.getProducts(1, PAGINATION.PRODUCTS_PER_PAGE);
    products = productsData.items.map(p => ({ ...p }));
    total = productsData.total;
    logger.info('SSR: Products loaded:', products.length, 'of', total);
  } catch (error) {
    logger.error('SSR: Error loading products:', error);
    products = FALLBACK_PRODUCTS.map(p => ({ ...p }));
    total = FALLBACK_PRODUCTS.length;
  }

  return (
    <ErrorBoundary>
      <ClientHomePage 
        initialReviews={reviews}
        initialProducts={products}
        initialTotal={total}
      />
    </ErrorBoundary>
  );
}
