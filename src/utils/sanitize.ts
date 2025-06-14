// Simple HTML sanitizer to prevent XSS attacks
export function sanitizeHtml(html: string): string {
  // Remove script tags
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove on* event handlers
  clean = clean.replace(/<[^>]*\son\w+\s*=\s*[^>]*>/gi, (match) => {
    return match.replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '');
  });
  
  // Remove javascript: links
  clean = clean.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '');
  
  return clean;
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString('ru-RU')}₽`;
}

export function formatPhone(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Format as +7 (xxx) xxx-xx-xx
  if (digits.length === 11 && digits.startsWith('7')) {
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  }
  
  return phone;
}

export function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 11 && digits.startsWith('7');
} 