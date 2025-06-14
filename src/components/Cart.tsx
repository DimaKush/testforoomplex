'use client';

import { useState, useCallback, memo } from 'react';
import { PhoneInput } from './PhoneInput';
import { Product, CartState, OrderRequest } from '@/types';
import { formatPrice, validatePhone } from '@/utils/sanitize';
import { api } from '@/services/api';
import { useCart } from '@/hooks/useCart';
import { HiShoppingCart, HiLockClosed, HiCheck, HiExclamationTriangle } from 'react-icons/hi2';
import { ERRORS, MESSAGES, STYLES } from '@/constants';

interface CartProps {
  cart: CartState;
  products: Product[];
  phone: string;
  onPhoneChange: (phone: string) => void;
  onOrderSuccess: () => void;
}

export const Cart = memo<CartProps>(function Cart({ 
  cart, 
  products, 
  phone, 
  onPhoneChange, 
  onOrderSuccess 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [phoneError, setPhoneError] = useState(false);

  const { cartItems, totalPrice, isEmpty, getCartItemsForOrder } = useCart(cart, products);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPhoneError(false);

    if (!validatePhone(phone)) {
      setPhoneError(true);
      setError(ERRORS.PHONE_INVALID);
      return;
    }

    if (isEmpty) {
      setError(ERRORS.CART_EMPTY);
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData: OrderRequest = {
        phone: phone.replace(/\D/g, ''),
        cart: getCartItemsForOrder()
      };

      const result = await api.createOrder(orderData);
      
      if (result.success) {
        onOrderSuccess();
      } else {
        setError(result.error || ERRORS.ORDER_FAILED);
      }
    } catch {
      setError(ERRORS.NETWORK_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  }, [phone, isEmpty, getCartItemsForOrder, onOrderSuccess]);

  const handlePhoneChange = useCallback((newPhone: string) => {
    onPhoneChange(newPhone);
    setPhoneError(false);
    setError('');
  }, [onPhoneChange]);

  return (
    <>
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <HiShoppingCart className="w-5 h-5 text-white" />
        </div>
        <h2 className="font-poppins text-3xl xl:text-4xl font-semibold text-gray-800">Добавленные товары</h2>
      </div>
      
      {isEmpty ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiLockClosed className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 text-xl">{MESSAGES.CART_EMPTY}</p>
          <p className="text-base text-gray-400 mt-1">{MESSAGES.CART_EMPTY_DESCRIPTION}</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {cartItems.map(([productId, quantity]) => {
              const product = products.find(p => p.id === parseInt(productId));
              if (!product) return null;
              
              return (
                <div key={productId} className="flex justify-between items-center py-4 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <span className="font-medium text-gray-800 text-lg xl:text-xl">{product.title}</span>
                    <span className="text-blue-600 ml-3 font-semibold text-lg xl:text-xl">×{quantity}</span>
                  </div>
                  <div className={`font-bold text-xl xl:text-2xl ${STYLES.PRICE_GRADIENT} font-poppins`}>
                    {formatPrice(product.price * quantity)}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="border-t border-gray-200 pt-6 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-2xl xl:text-3xl font-poppins font-semibold text-gray-800">Итого:</span>
              <span className={`text-3xl xl:text-4xl font-bold ${STYLES.PRICE_GRADIENT} font-poppins`}>
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Order Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <label htmlFor="phone" className="block text-base xl:text-lg font-medium text-gray-700 mb-2">
          Номер телефона
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">            
            <PhoneInput
              value={phone}
              onChange={handlePhoneChange}
              error={phoneError}
              className="w-full px-4 py-4 border rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg xl:text-xl"
            />
            {phoneError && (
              <p className="text-red-500 text-base mt-2">{ERRORS.PHONE_INVALID}</p>
            )}
          </div>

          <div className="">
            <button
              type="submit"
              disabled={isSubmitting || isEmpty}
              className={`w-full sm:w-auto ${STYLES.BUTTON_SUCCESS} disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform disabled:cursor-not-allowed font-poppins text-xl xl:text-2xl shadow-lg hover:shadow-xl whitespace-nowrap`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Оформляем заказ...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <HiCheck className="w-5 h-5" />
                  <span>Заказать</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex flex-row justify-between ">
              <HiExclamationTriangle className="w-5 h-5 text-red-500" />
              <p className="text-red-600 text-base">{error}</p>
            </div>
          </div>
        )}
      </form>
    </>
  );
}); 