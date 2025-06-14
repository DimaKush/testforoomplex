export interface Review {
  readonly id: number;
  readonly text: string;
}

export interface Product {
  readonly id: number;
  readonly image_url: string;
  readonly title: string;
  readonly description: string;
  readonly price: number;
}

export interface ProductsResponse {
  readonly page: number;
  readonly amount: number;
  readonly total: number;
  readonly items: readonly Product[];
}

export interface CartItem {
  readonly id: number;
  readonly quantity: number;
}

export interface OrderRequest {
  readonly phone: string;
  readonly cart: readonly CartItem[];
}

export interface OrderResponse {
  readonly success: 0 | 1;
  readonly error?: string;
}

export interface CartState {
  readonly [productId: number]: number;
}

// API Response types
export interface ApiResponse<T = unknown> {
  readonly data?: T;
  readonly error?: string;
  readonly success: boolean;
}

// Environment variables
export interface Environment {
  readonly NODE_ENV: 'development' | 'production' | 'test';
  readonly API_BASE_URL?: string;
}

// Component prop types
export interface BaseComponentProps {
  readonly className?: string;
  readonly children?: React.ReactNode;
}

// Form validation types
export type ValidationResult = {
  readonly isValid: boolean;
  readonly errors: readonly string[];
};

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Phone validation
export type PhoneValidation = {
  readonly isValid: boolean;
  readonly formatted: string;
  readonly raw: string;
}; 