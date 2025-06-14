'use client';

import React from 'react';
import { HiExclamationTriangle, HiArrowPath } from 'react-icons/hi2';
import { logger } from '@/utils/logger';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error | undefined;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error | undefined; reset: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      const handleReset = () => {
        this.setState({ hasError: false, error: undefined });
      };

      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} reset={handleReset} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
              <HiExclamationTriangle className="h-10 w-10 text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Что-то пошло не так
            </h2>
            
            <p className="text-gray-600 mb-8 leading-relaxed max-w-md">
              Произошла неожиданная ошибка. Пожалуйста, попробуйте перезагрузить страницу.
            </p>
            
            <button
              onClick={handleReset}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all transform hover:scale-105 active:scale-95 space-x-2"
            >
              <HiArrowPath className="h-5 w-5" />
              <span>Попробовать еще раз</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 