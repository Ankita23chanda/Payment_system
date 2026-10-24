import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle2 size={18} color="#2E7D32" />,
    error: <AlertCircle size={18} color="#D32F2F" />,
    info: <Info size={18} color="#0288D1" />,
  };

  const bgColors = {
    success: 'var(--color-success-bg)',
    error: 'var(--color-error-bg)',
    info: 'var(--color-info-bg)',
  };

  const borderColors = {
    success: '#A5D6A7',
    error: '#EF9A9A',
    info: '#81D4FA',
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: bgColors[toastMessage.type] || bgColors.success,
        border: `1.5px solid ${borderColors[toastMessage.type] || borderColors.success}`,
        color: 'var(--color-text-main)',
        padding: '14px 20px',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        fontWeight: '600',
        fontSize: '0.92rem',
        animation: 'fadeIn 0.25s ease-out',
      }}
    >
      {icons[toastMessage.type] || icons.success}
      <span>{toastMessage.message}</span>
    </div>
  );
};
