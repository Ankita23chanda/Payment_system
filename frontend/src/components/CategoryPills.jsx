import React from 'react';
import {
  ShieldAlert,
  Bug,
  Scissors,
  CloudRain,
  Sparkles,
  Sprout,
  TrendingUp,
  Wrench,
  Cpu,
  Leaf,
  Layers,
} from 'lucide-react';

const iconMap = {
  'shield-alert': ShieldAlert,
  'bug': Bug,
  'scissors': Scissors,
  'cloud-rain': CloudRain,
  'sparkles': Sparkles,
  'seedling': Sprout,
  'trending-up': TrendingUp,
  'wrench': Wrench,
  'cpu': Cpu,
  'leaf': Leaf,
};

export const CategoryPills = ({ categories = [], selectedCategory = '', onSelectCategory }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        overflowX: 'auto',
        padding: '6px 2px 14px 2px',
        scrollbarWidth: 'thin',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* "All Products" pill */}
      <button
        type="button"
        onClick={() => onSelectCategory('')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: 'var(--radius-pill)',
          border: selectedCategory === '' ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
          backgroundColor: selectedCategory === '' ? 'var(--color-primary)' : 'var(--color-surface)',
          color: selectedCategory === '' ? '#FFFFFF' : 'var(--color-text-main)',
          fontWeight: '700',
          fontSize: '0.85rem',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'all 0.2s ease',
          boxShadow: selectedCategory === '' ? '0 3px 10px rgba(45, 106, 79, 0.25)' : 'none',
        }}
      >
        <Layers size={16} />
        <span>All Categories</span>
      </button>

      {/* Dynamic categories from backend */}
      {categories.map((cat) => {
        const IconComponent = iconMap[cat.icon] || Leaf;
        const isSelected = selectedCategory === cat.slug;

        return (
          <button
            key={cat.id || cat.slug}
            type="button"
            onClick={() => onSelectCategory(cat.slug)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              border: isSelected ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
              backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-surface)',
              color: isSelected ? '#FFFFFF' : 'var(--color-text-main)',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              boxShadow: isSelected ? '0 3px 10px rgba(45, 106, 79, 0.25)' : 'none',
            }}
          >
            <IconComponent size={16} />
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};
