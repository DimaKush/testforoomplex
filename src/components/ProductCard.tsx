import { useState, useCallback, memo } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { formatPrice } from '@/utils/sanitize';
import { ANIMATION_DELAYS, SIZES, STYLES } from '@/constants';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onQuantityChange: (id: number, quantity: number) => void;
  loading?: 'eager' | 'lazy';
  priority?: boolean;
}

export const ProductCard = memo<ProductCardProps>(function ProductCard({ 
  product, 
  quantity, 
  onQuantityChange,
  loading = 'lazy',
  priority = false
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleBuyClick = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      onQuantityChange(product.id, 1);
      setIsLoading(false);
    }, ANIMATION_DELAYS.LOADING_SIMULATION);
  }, [product.id, onQuantityChange]);

  const handleQuantityChange = useCallback((newQuantity: number) => {
    if (newQuantity < 0) return;
    onQuantityChange(product.id, newQuantity);
  }, [product.id, onQuantityChange]);

  // Debounced input handler for better performance
  const debouncedInputChange = useCallback((value: number) => {
    if (value < 0) return;
    onQuantityChange(product.id, value);
  }, [product.id, onQuantityChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    debouncedInputChange(value);
  }, [debouncedInputChange]);

  const handleIncrement = useCallback(() => {
    handleQuantityChange(quantity + 1);
  }, [quantity, handleQuantityChange]);

  const handleDecrement = useCallback(() => {
    handleQuantityChange(quantity - 1);
  }, [quantity, handleQuantityChange]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (quantity === 0) {
        handleBuyClick();
      }
    }
  }, [quantity, handleBuyClick]);

  return (
    <article
      className="bg-white rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden border border-gray-100 flex flex-col w-full max-w-[301px] mx-auto group hover:border-blue-200 transition-all duration-300"
      role="article"
      aria-label={`Товар: ${product.title}`}
      itemScope
      itemType="https://schema.org/Product"
    >
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {product.image_url && !imageError ? (
          <Image
            src={product.image_url}
            alt={`Изображение товара: ${product.title}`}
            width={SIZES.PRODUCT_CARD.IMAGE_WIDTH}
            height={SIZES.PRODUCT_CARD.IMAGE_HEIGHT}
            className="object-cover group-hover:scale-105 transition-transform duration-300 w-full h-full rounded-t-3xl"
            onError={handleImageError}
            loading={loading}
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            itemProp="image"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100"
            role="img"
            aria-label="Изображение не доступно"
          >
            <span className="text-sm">Нет изображения</span>
          </div>
        )}
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 
          className="font-poppins text-xl xl:text-2xl font-semibold mb-3 line-clamp-2 min-h-[3.5rem] text-gray-800 group-hover:text-blue-600 transition-colors" 
          title={product.title}
          itemProp="name"
        >
          {product.title}
        </h3>
        
        <p 
          className="text-gray-600 text-base xl:text-lg mb-4 flex-1 line-clamp-3 min-h-[3.75rem] leading-relaxed" 
          title={product.description}
          itemProp="description"
        >
          {product.description}
        </p>
        
        <div className="mt-auto">
          <div 
            className={`text-3xl xl:text-4xl font-bold ${STYLES.PRICE_GRADIENT} mb-4 font-poppins px-4 py-2 rounded-2xl`}
            role="text"
            aria-label={`Цена: ${formatPrice(product.price)}`}
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <span itemProp="price" content={product.price.toString()}>{formatPrice(product.price)}</span>
            <meta itemProp="priceCurrency" content="RUB" />
            <meta itemProp="availability" content="https://schema.org/InStock" />
          </div>
          
          {quantity === 0 ? (
            <button
              onClick={handleBuyClick}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className={`w-full ${STYLES.BUTTON_PRIMARY} text-white font-medium py-4 px-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-poppins shadow-lg hover:shadow-xl text-lg xl:text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              aria-label={`Купить ${product.title}`}
              type="button"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div 
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                    role="status"
                    aria-label="Загрузка"
                  ></div>
                  <span>Добавляем...</span>
                </div>
              ) : (
                'Купить'
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2" role="group" aria-label="Управление количеством">
              <button
                onClick={handleDecrement}
                className="w-12 h-12 flex-shrink-0 bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded-xl flex items-center justify-center font-bold text-xl transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label="Уменьшить количество"
                type="button"
              >
                −
              </button>
              
              <input
                type="number"
                min="0"
                max="999"
                value={quantity}
                onChange={handleInputChange}
                className="flex-1 min-w-0 text-center border border-gray-200 rounded-xl py-3 px-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium text-lg focus:outline-none"
                aria-label="Количество товара"
              />
              
              <button
                onClick={handleIncrement}
                className="w-12 h-12 flex-shrink-0 bg-gray-100 hover:bg-green-100 hover:text-green-600 rounded-xl flex items-center justify-center font-bold text-xl transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label="Увеличить количество"
                type="button"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hidden schema.org data */}
      <meta itemProp="sku" content={`PROD-${product.id}`} />
      <meta itemProp="category" content="Товары" />
      <div itemProp="brand" itemScope itemType="https://schema.org/Brand" style={{ display: 'none' }}>
        <meta itemProp="name" content={process.env['NEXT_PUBLIC_SITE_NAME'] || 'Интернет-магазин'} />
      </div>
    </article>
  );
}); 