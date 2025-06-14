'use client';

import { useState, useCallback } from 'react';
import { Review, Product, CartState } from '@/types';
import { api } from '@/services/api';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { ReviewCard } from '@/components/ReviewCard';
import { Cart } from '@/components/Cart';
import { ProductCard } from '@/components/ProductCard';
import { SuccessModal } from '@/components/SuccessModal';
import { generateProductListSchema, generateBreadcrumbSchema } from '@/utils/schema';
import { logger } from '@/utils/logger';
import { 
  ANIMATION_DELAYS, 
  PAGINATION, 
  STYLES, 
  MESSAGES 
} from '@/constants';

interface ClientHomePageProps {
  initialReviews: Review[];
  initialProducts: Product[];
  initialTotal: number;
}

export function ClientHomePage({ 
  initialReviews, 
  initialProducts, 
  initialTotal 
}: ClientHomePageProps) {
  const [reviews] = useState<Review[]>(initialReviews);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useLocalStorage<CartState>('cart', {});
  const [phone, setPhone] = useLocalStorage<string>('phone', '');
  
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length < initialTotal);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Generate schema for current products
  const productListSchema = generateProductListSchema(products);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Главная', url: '/' },
    { name: 'Каталог товаров' }
  ]);

  // Load more products
  const loadMoreProducts = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const productsData = await api.getProducts(nextPage, PAGINATION.PRODUCTS_PER_PAGE);
      
      setProducts(prev => [...prev, ...productsData.items]);
      setCurrentPage(nextPage);
      setHasMore(products.length + productsData.items.length < productsData.total);
    } catch (error) {
      logger.error('Error loading more products:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage, loadingMore, hasMore, products]);

  // Infinite scroll
  const { loadingRef } = useInfiniteScroll({
    hasMore,
    isLoading: loadingMore,
    onLoadMore: loadMoreProducts,
  });

  const handleQuantityChange = useCallback((productId: number, quantity: number) => {
    setCart({
      ...cart,
      [productId]: quantity
    });
  }, [cart, setCart]);

  const handleOrderSuccess = useCallback(() => {
    setShowSuccessModal(true);
    setCart({});
    setPhone('');
  }, [setCart, setPhone]);

  const handleCloseModal = useCallback(() => {
    setShowSuccessModal(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productListSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Hero Section */}
      <div className="pb-16 pt-8">
        <div className="container mx-auto px-6 py-16 max-w-7xl">
          {/* Reviews Section */}
          <section className="mb-16">
            <h1 className={`font-heading text-6xl lg:text-8xl xl:text-9xl font-bold text-white mb-16 text-center animate-fade-in-up ${STYLES.GRADIENT_TEXT}`}>
              тестовое задание
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 justify-items-center max-w-6xl mx-auto">
              {reviews.map((review, index) => (
                <div 
                  key={review.id} 
                  className={`animate-fade-in-up ${STYLES.CARD_BASE} ${STYLES.CARD_HOVER} ${STYLES.BORDER_LIGHT} p-10 w-full max-w-[500px]`}
                  style={{ animationDelay: `${index * ANIMATION_DELAYS.REVIEW_CARD}s` }}
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Cart Section */}
        <section className="mb-24 flex justify-center">
          <div className={`animate-fade-in-up w-full max-w-4xl ${STYLES.CARD_BASE} ${STYLES.BORDER_LIGHT} p-6 lg:p-12`}>
            <Cart 
              cart={cart} 
              products={products}
              phone={phone}
              onPhoneChange={setPhone}
              onOrderSuccess={handleOrderSuccess}
            />
          </div>
        </section>

        {/* Products Section */}
        <section className="pb-24" itemScope itemType="https://schema.org/ItemList">
          <div className="text-center mb-16">
            <h2 className={`text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 ${STYLES.GRADIENT_TEXT}`} itemProp="name">
              Наши товары
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 justify-items-center">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="animate-fade-in-up" 
                style={{ animationDelay: `${(index % PAGINATION.PRODUCTS_PER_PAGE) * ANIMATION_DELAYS.PRODUCT_CARD}s` }}
                itemScope 
                itemType="https://schema.org/Product"
                itemProp="itemListElement"
              >
                <div className={`${STYLES.CARD_BASE} ${STYLES.CARD_HOVER} ${STYLES.BORDER_LIGHT} overflow-hidden w-full max-w-[380px] group`}>
                  <ProductCard
                    product={product}
                    quantity={cart[product.id] || 0}
                    onQuantityChange={handleQuantityChange}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Loading trigger for infinite scroll */}
          {hasMore && (
            <div ref={loadingRef} className="mt-16">
              {loadingMore && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 justify-items-center">
                  {Array.from({ length: PAGINATION.PRODUCTS_PER_PAGE }).map((_, index) => (
                    <div key={`loading-${index}`} className={`${STYLES.SKELETON} overflow-hidden w-full max-w-[380px] h-[480px]`} />
                  ))}
                </div>
              )}
            </div>
          )}

          {!hasMore && products.length > 0 && (
            <div className="text-center mt-20">
              <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-sm rounded-full border border-white/20 shadow-2xl">
                <span className="text-white font-semibold text-xl">{MESSAGES.ALL_PRODUCTS_LOADED}</span>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
      />
    </div>
  );
} 