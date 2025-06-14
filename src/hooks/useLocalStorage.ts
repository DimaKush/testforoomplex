import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Initialize with initialValue to avoid hydration mismatch
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Get from local storage on client hydration
  useEffect(() => {
    try {
      // Only run on client side
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        if (item) {
          const parsedValue = JSON.parse(item);
          setStoredValue(parsedValue);
        }
      }
    } catch (error) {
      logger.error('Error reading from localStorage:', error);
    }
  }, [key]);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = (value: T) => {
    try {
      // Save state
      setStoredValue(value);
      
      // Save to local storage only on client side
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      logger.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue];
} 