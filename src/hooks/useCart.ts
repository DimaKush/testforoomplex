import { useMemo, useCallback } from 'react';
import { CartState, Product } from '@/types';

export function useCart(cart: CartState, products: Product[]) {
  const cartItems = useMemo(
    () => Object.entries(cart).filter(([, quantity]) => quantity > 0),
    [cart]
  );

  const totalPrice = useMemo(
    () => cartItems.reduce((total, [productId, quantity]) => {
      const product = products.find(p => p.id === parseInt(productId));
      return total + (product ? product.price * quantity : 0);
    }, 0),
    [cartItems, products]
  );

  const totalItems = useMemo(
    () => cartItems.reduce((total, [, quantity]) => total + quantity, 0),
    [cartItems]
  );

  const isEmpty = cartItems.length === 0;

  const getProductQuantity = useCallback(
    (productId: number) => cart[productId] || 0,
    [cart]
  );

  const getCartItemsForOrder = useCallback(
    () => cartItems.map(([productId, quantity]) => ({
      id: parseInt(productId),
      quantity
    })),
    [cartItems]
  );

  return {
    cartItems,
    totalPrice,
    totalItems,
    isEmpty,
    getProductQuantity,
    getCartItemsForOrder,
  };
} 