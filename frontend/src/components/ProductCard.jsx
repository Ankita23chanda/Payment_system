import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Check, ShieldCheck } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { addToCart, loading } = useCart();
  const [added, setAdded] = React.useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.in_stock || loading) return;

    try {
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const discountPercent = product.discount_percentage || 0;

  return (
    <div
      className="agri-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 2,
            backgroundColor: '#E63946',
            color: '#FFFFFF',
            padding: '4px 9px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.75rem',
            fontWeight: '800',
            boxShadow: '0 2px 6px rgba(230, 57, 70, 0.3)',
          }}
        >
          {discountPercent}% OFF
        </div>
      )}

      {/* Product Image Link */}
      <Link
        to={`/products/${product.slug || product.id}`}
        style={{
          display: 'block',
          width: '100%',
          height: '190px',
          backgroundColor: '#F3F7F4',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <img
          src={product.image || 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=800&auto=format&fit=crop&q=80'}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.35s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=800&auto=format&fit=crop&q=80';
          }}
        />
      </Link>

      {/* Card Body */}
      <div
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        {/* Brand & Category row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              color: 'var(--color-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {product.brand}
          </span>
          <span
            style={{
              fontSize: '0.72rem',
              backgroundColor: 'var(--color-cream)',
              color: '#60583A',
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--color-beige-dark)',
            }}
          >
            {product.category_name}
          </span>
        </div>

        {/* Title */}
        <Link
          to={`/products/${product.slug || product.id}`}
          style={{
            fontSize: '1rem',
            fontWeight: '700',
            color: 'var(--color-primary-dark)',
            lineHeight: 1.35,
            marginBottom: '8px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {product.name}
        </Link>

        {/* Stock / Safety indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
          <ShieldCheck size={14} color="#52B788" />
          <span style={{ fontSize: '0.75rem', color: product.in_stock ? 'var(--color-success)' : 'var(--color-error)', fontWeight: '600' }}>
            {product.in_stock ? `In Stock (${product.stock} units)` : 'Out of Stock'}
          </span>
        </div>

        {/* Pricing & CTA */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '12px',
            borderTop: '1px solid var(--color-surface-hover)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-primary-dark)' }}>
                ₹{Number(product.effective_price).toLocaleString('en-IN')}
              </span>
              {product.discount_price && Number(product.discount_price) < Number(product.price) && (
                <span
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-light)',
                    textDecoration: 'line-through',
                  }}
                >
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Incl. Agronomic GST</span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.in_stock || loading}
            className={`btn ${added ? 'btn-secondary' : 'btn-primary'} btn-sm`}
            style={{
              padding: '8px 14px',
              fontSize: '0.85rem',
            }}
            title={product.in_stock ? 'Add to cart' : 'Item is out of stock'}
          >
            {added ? (
              <>
                <Check size={16} /> Added
              </>
            ) : (
              <>
                <ShoppingCart size={15} /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
