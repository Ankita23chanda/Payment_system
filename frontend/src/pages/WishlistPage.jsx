import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { wishlistService } from '../services/wishlistService';
import {
  Heart,
  ArrowRight,
  Trash2,
  ShoppingCart,
  User,
  Package,
} from 'lucide-react';

export const WishlistPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState(null);

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await wishlistService.getWishlist();
      setWishlist(data.items || []);
    } catch (err) {
      setError('Failed to load your wishlist. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/wishlist' } } });
      return;
    }
    fetchWishlist();
  }, [isAuthenticated, fetchWishlist]);

  const handleRemove = async (productId) => {
    setRemovingId(productId);
    try {
      await wishlistService.removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((item) => item.product_id !== productId));
    } catch (err) {
      setError('Could not remove item. Please try again.');
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <div style={{ color: 'var(--color-primary)', fontWeight: '700', fontSize: '1.2rem' }}>
          Loading your wishlist...
        </div>
      </div>
    );
  }

  return (
    <div className="container section-spacing" style={{ maxWidth: '960px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
              My Wishlist
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Products you've saved — available on any device after login.
            </p>
          </div>
          {user?.customer_id && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--color-mint)',
                color: 'var(--color-primary-dark)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-pill)',
                fontWeight: '700',
                fontSize: '0.88rem',
                border: '1.5px solid var(--color-primary)',
                whiteSpace: 'nowrap',
              }}
            >
              <User size={15} />
              {user.customer_id}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#FFEBEE',
          color: '#C62828',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          fontWeight: '600',
          fontSize: '0.88rem',
        }}>
          {error}
        </div>
      )}

      {wishlist.length === 0 ? (
        <div
          className="agri-card"
          style={{ padding: '80px 20px', textAlign: 'center', backgroundColor: '#FFFFFF' }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#FCE4EC',
              color: '#E91E63',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
            }}
          >
            <Heart size={32} />
          </div>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
            Your Wishlist is Empty
          </h3>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px', margin: '0 auto 24px auto', fontSize: '0.92rem' }}>
            Browse our marketplace and save the products you're interested in. They'll be waiting for you here.
          </p>
          <Link to="/products" className="btn btn-primary">
            Explore Products <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="agri-card"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Product image */}
              {item.product_image && (
                <div style={{ height: '180px', overflow: 'hidden', backgroundColor: 'var(--color-offwhite)' }}>
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                {item.product_brand && (
                  <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {item.product_brand}
                  </span>
                )}
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-text-main)', margin: 0 }}>
                  {item.product_name}
                </h3>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                  ₹{Number(item.product_price).toLocaleString('en-IN')}
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  Saved on {new Date(item.added_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                </p>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '12px' }}>
                  <Link
                    to={`/products/${item.product_id}`}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    <ShoppingCart size={14} /> View
                  </Link>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleRemove(item.product_id)}
                    disabled={removingId === item.product_id}
                    style={{ color: '#C62828', borderColor: '#FFCDD2' }}
                    aria-label={`Remove ${item.product_name} from wishlist`}
                  >
                    {removingId === item.product_id ? '...' : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
