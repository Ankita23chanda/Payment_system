import React from 'react';
import { Minus, Plus } from 'lucide-react';

export const QuantitySelector = ({ value = 1, min = 1, max = 99, onChange, disabled = false }) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-pill)',
        backgroundColor: 'var(--color-surface)',
        padding: '3px',
      }}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: value <= min ? 'transparent' : 'var(--color-mint)',
          color: value <= min ? 'var(--color-text-light)' : 'var(--color-primary-dark)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: value <= min || disabled ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.15s ease',
        }}
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>

      <span
        style={{
          minWidth: '36px',
          textAlign: 'center',
          fontWeight: '700',
          fontSize: '0.95rem',
          color: 'var(--color-text-main)',
        }}
      >
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: value >= max ? 'transparent' : 'var(--color-mint)',
          color: value >= max ? 'var(--color-text-light)' : 'var(--color-primary-dark)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: value >= max || disabled ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.15s ease',
        }}
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  );
};
