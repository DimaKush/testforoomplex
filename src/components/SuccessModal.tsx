'use client';

import { useEffect, memo } from 'react';
import { HiXMark, HiCheck } from 'react-icons/hi2';
import { MESSAGES } from '@/constants';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuccessModal = memo<SuccessModalProps>(function SuccessModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative transform animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <HiXMark className="h-6 w-6" />
        </button>

        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6 animate-in zoom-in duration-500 delay-200">
            <HiCheck className="h-10 w-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {MESSAGES.ORDER_SUCCESS}
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Спасибо за ваш заказ! Мы свяжемся с вами в ближайшее время для подтверждения деталей доставки.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all transform hover:scale-105 active:scale-95"
            >
              Продолжить покупки
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}); 