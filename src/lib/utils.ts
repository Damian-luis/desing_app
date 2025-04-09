import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import DOMPurify from 'dompurify'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function sanitizeString(value: string): string {
  if (typeof window === 'undefined') {
    return value.replace(/[<>]/g, '');
  }
  return DOMPurify.sanitize(value, { ALLOWED_TAGS: [] }).trim();
}


export function sanitizeFormData<T extends Record<string, any>>(data: T): T {
  const sanitized = { ...data };
  
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeString(sanitized[key]) as unknown as T[Extract<keyof T, string>];
    }
  }
  
  return sanitized;
}


export function sanitizeEmail(email: string): string {
  if (!email) return '';
  
  let sanitized = sanitizeString(email);
  
  sanitized = sanitized
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.@_\-+]/g, '');
  
  return sanitized;
}


export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}
