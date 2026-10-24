import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';
import { ProductCard } from '../components/ProductCard';
import { QuantitySelector } from '../components/QuantitySelector';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const CartPage = () => {
  const { cart, addToCart, updateQuantity, removeItem, clearCart, loading } = useCart();
  const navigate = useNavigate();
  const [popularProducts, setPopularProducts] = useState([]);
  const [addingSample, setAddingSample] = useState(false);

  const items = cart?.items || [];
  const summary = cart?.summary || {
    subtotal: '0.00',
    discount_amount: '0.00',
    effective_subtotal: '0.00',
    shipping_fee: '0.00',
    tax_amount: '0.00',
    total_amount: '0.00',
    free_shipping_threshold: '999.00',
    free_shipping_applied: false,
  };

  useEffect(() => {
    if (items.length === 0) {
      productService
        .getProducts({ sort: 'discount' })
        .then((data) => setPopularProducts((data || []).slice(0, 4)))
        .catch(console.error);
    }
  }, [items.length]);

  const handleQuickAddSamples = async () => {
    if (popularProducts.length === 0 || addingSample) return;
    setAddingSample(true);
    try {
      for (const prod of popularProducts.slice(0, 2)) {
        await addToCart(prod.id, 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingSample(false);
    }
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container section-spacing" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-mint)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
          }}
        >
          <ShoppingBag size={40} />
        </div>
        <h2 style={{ fontSize: '2rem', color: 'var(--color-primary-dark)', marginBottom: '12px' }}>
          Your Farm Cart is Empty
        </h2>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '480px', margin: '0 auto 28px auto', fontSize: '1rem' }}>
          Your order was placed or your cart is currently empty. You can browse all 34 verified agricultural products below or reload demo products.
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
          <Link to="/products" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Browse All Products Catalog <ArrowRight size={18} />
          </Link>
          {popularProducts.length > 0 && (
            <button
              type="button"
              onClick={handleQuickAddSamples}
              disabled={addingSample}
              className="btn btn-outline btn-lg"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Sparkles size={18} color="var(--color-primary)" />
              {addingSample ? 'Adding Products...' : 'Quick Add Demo Products to Cart'}
            </button>
          )}
        </div>

        {popularProducts.length > 0 && (
          <div style={{ textAlign: 'left', marginTop: '20px' }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-primary-dark)', marginBottom: '16px' }}>
              Popular Agricultural Products to Add:
            </h3>
            <div className="grid-products">
              {popularProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container section-spacing">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--color-primary-dark)', marginBottom: '6px' }}>
          Shopping Cart
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Review your selected products and proceed to secure order checkout.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '36px',
          alignItems: 'start',
        }}
        className="cart-layout"
      >
        {/* Left Column: Cart Items Table */}
        <div className="agri-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '1.5px solid var(--color-mint)',
            }}
          >
            <span style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--color-primary-dark)' }}>
              Selected Products ({cart.total_items_count} items)
            </span>
            <button
              type="button"
              onClick={clearCart}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-error)',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <RotateCcw size={14} /> Clear Cart
            </button>
          </div>

          {/* Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {items.map((item) => {
              const product = item.product;
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr auto auto',
                    gap: '18px',
                    alignItems: 'center',
                    paddingBottom: '20px',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                  className="cart-item-row"
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/products/${product.slug || product.id}`}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      backgroundColor: 'var(--color-offwhite)',
                      display: 'block',
                    }}
                  >
                    <img
                      src={product.image || 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=800&auto=format&fit=crop&q=80'}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Link>

                  {/* Title & Brand */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                      {product.brand}
                    </div>
                    <Link
                      to={`/products/${product.slug || product.id}`}
                      style={{
                        fontWeight: '700',
                        fontSize: '0.98rem',
                        color: 'var(--color-primary-dark)',
                        lineHeight: 1.3,
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      {product.name}
                    </Link>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      ₹{Number(product.effective_price).toLocaleString('en-IN')} per unit
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div>
                    <QuantitySelector
                      value={item.quantity}
                      min={1}
                      max={product.stock || 10}
                      onChange={(newQty) => updateQuantity(item.id, newQty)}
                    />
                  </div>

                  {/* Line Total & Remove */}
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--color-primary-dark)' }}>
                      ₹{Number(item.line_total).toLocaleString('en-IN')}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-error)',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                      title="Remove product from cart"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '20px' }}>
            <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', fontWeight: '700', fontSize: '0.9rem' }}>
              ← Add More Agricultural Products
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div
          className="agri-card"
          style={{
            padding: '24px',
            backgroundColor: '#FFFFFF',
            position: 'sticky',
            top: '90px',
          }}
        >
          <h3
            style={{
              fontSize: '1.25rem',
              color: 'var(--color-primary-dark)',
              marginBottom: '18px',
              paddingBottom: '12px',
              borderBottom: '1.5px solid var(--color-mint)',
            }}
          >
            Order Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Catalog Subtotal</span>
              <span style={{ fontWeight: '600' }}>₹{Number(summary.subtotal).toLocaleString('en-IN')}</span>
            </div>

            {Number(summary.discount_amount) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: 'var(--color-success)' }}>
                <span>Agricultural Discount</span>
                <span style={{ fontWeight: '700' }}>- ₹{Number(summary.discount_amount).toLocaleString('en-IN')}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Farm Shipping Fee</span>
              <span>
                {Number(summary.shipping_fee) === 0 ? (
                  <strong style={{ color: 'var(--color-success)' }}>FREE</strong>
                ) : (
                  `₹${Number(summary.shipping_fee).toLocaleString('en-IN')}`
                )}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Estimated Tax (5% GST)</span>
              <span style={{ fontWeight: '600' }}>₹{Number(summary.tax_amount).toLocaleString('en-IN')}</span>
            </div>

            <div
              style={{
                borderTop: '1.5px solid var(--color-mint)',
                paddingTop: '14px',
                marginTop: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-primary-dark)' }}>
                Final Total
              </span>
              <span style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                ₹{Number(summary.total_amount).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Shipping notice */}
          {summary.free_shipping_applied ? (
            <div
              style={{
                backgroundColor: 'var(--color-mint)',
                color: 'var(--color-primary-dark)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '20px',
              }}
            >
              <Truck size={16} /> Free Delivery Applied to your Farm!
            </div>
          ) : (
            <div
              style={{
                backgroundColor: 'var(--color-cream)',
                color: '#60583A',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                marginBottom: '20px',
              }}
            >
              Add ₹{(999 - Number(summary.effective_subtotal)).toFixed(2)} more for <strong>FREE Farm Delivery</strong>.
            </div>
          )}

          <button
            type="button"
            onClick={handleProceedToCheckout}
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
          >
            Proceed to Checkout <ArrowRight size={18} />
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '16px',
              fontSize: '0.78rem',
              color: 'var(--color-text-muted)',
            }}
          >
            <ShieldCheck size={16} color="var(--color-primary)" /> Server-Calculated Price Guarantee
          </div>
        </div>
      </div>
    </div>
  );
};
