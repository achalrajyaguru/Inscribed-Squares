import React, { useState, useCallback } from 'react';
import { ToastMessage } from '../geometry/types';
import { generateId } from '../utils/format';

interface ToastProps {
  message: ToastMessage | null;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  if (!message) return null;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className={`toast toast-${message.type}`}>
      {message.message}
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback((message: string, type: 'error' | 'success' | 'info' = 'info') => {
    setToast({
      id: generateId(),
      message,
      type
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    toast,
    showToast,
    hideToast
  };
}
