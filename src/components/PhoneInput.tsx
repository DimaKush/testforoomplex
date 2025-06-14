'use client';

import { useRef, KeyboardEvent, ChangeEvent, memo, useCallback } from 'react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  error?: boolean;
}

export const PhoneInput = memo<PhoneInputProps>(function PhoneInput({ 
  value, 
  onChange, 
  className = '', 
  placeholder = '+7 (___) ___-__-__', 
  error = false 
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const formatPhone = useCallback((phone: string): string => {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    
    // Start with +7
    let formatted = '+7';
    
    if (digits.length > 1) {
      // Add area code in parentheses
      const areaCode = digits.slice(1, 4);
      formatted += ` (${areaCode}`;
      
      if (digits.length >= 4) {
        formatted += ')';
        
        // Add first part
        if (digits.length > 4) {
          const firstPart = digits.slice(4, 7);
          formatted += ` ${firstPart}`;
          
          // Add second part
          if (digits.length > 7) {
            const secondPart = digits.slice(7, 9);
            formatted += `-${secondPart}`;
            
            // Add third part
            if (digits.length > 9) {
              const thirdPart = digits.slice(9, 11);
              formatted += `-${thirdPart}`;
            }
          }
        }
      }
    }
    
    return formatted;
  }, []);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow deletion
    if (inputValue.length < value.length) {
      const digits = inputValue.replace(/\D/g, '');
      if (digits.length === 0) {
        onChange('');
        return;
      }
      // If we have at least one digit, ensure it starts with 7
      const formatted = formatPhone('7' + digits.slice(1));
      onChange(formatted);
      return;
    }
    
    // Only allow digits and formatting characters
    const digits = inputValue.replace(/\D/g, '');
    
    // Limit to 11 digits and ensure it starts with 7
    if (digits.length === 0) {
      onChange('');
      return;
    }
    
    let phoneDigits = digits;
    if (!phoneDigits.startsWith('7')) {
      phoneDigits = '7' + digits;
    }
    
    if (phoneDigits.length > 11) {
      phoneDigits = phoneDigits.slice(0, 11);
    }
    
    const formatted = formatPhone(phoneDigits);
    onChange(formatted);
  }, [value, onChange, formatPhone]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    // Allow backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].includes(e.keyCode)) {
      return;
    }
    
    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode)) {
      return;
    }
    
    // Allow arrow keys
    if (e.keyCode >= 35 && e.keyCode <= 40) {
      return;
    }
    
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  }, []);

  const handleFocus = useCallback(() => {
    if (!value) {
      onChange('+7 (');
    }
  }, [value, onChange]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      placeholder={placeholder}
      className={`${className} ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
    />
  );
}); 