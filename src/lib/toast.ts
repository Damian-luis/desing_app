"use client";

import { toast } from "sonner";

interface ToastOptions {
  description?: string;
  duration?: number;
  icon?: React.ReactNode;
  id?: string | number;
  important?: boolean;
  action?: {
    label: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  };
  cancel?: {
    label: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  };
  onDismiss?: (toast: { id: string | number }) => void;
  onAutoClose?: (toast: { id: string | number }) => void;
  closeButton?: boolean;
  className?: string;
  style?: React.CSSProperties;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}

type ToastProps = {
  title?: string;
  message: string;
  options?: any; 
};

export const showToast = ({ title, message, options = {} }: ToastProps) => {
  toast(title || message, {
    description: title ? message : undefined,
    ...options,
  });
};

export const showSuccessToast = ({ title, message, options = {} }: ToastProps) => {
  toast.success(title || message, {
    description: title ? message : undefined,
    ...options,
  });
};

export const showErrorToast = ({ title, message, options = {} }: ToastProps) => {
  toast.error(title || message, {
    description: title ? message : undefined,
    ...options,
  });
};

export const showWarningToast = ({ title, message, options = {} }: ToastProps) => {
  toast.warning(title || message, {
    description: title ? message : undefined,
    ...options,
  });
};

export const showInfoToast = ({ title, message, options = {} }: ToastProps) => {
  toast.info(title || message, {
    description: title ? message : undefined,
    ...options,
  });
};

export const showPromiseToast = <T>(
  promise: Promise<T>, 
  { 
    loading = "Loading...", 
    success = "Operation completed successfully", 
    error = "Something went wrong" 
  } = {},
  options: any = {}
) => {
  return toast.promise(promise, {
    loading,
    success,
    error,
    ...options
  });
}; 