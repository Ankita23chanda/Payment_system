import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { ProductCard } from '../components/ProductCard';
import {
  Sprout,
  ShieldCheck,
  Truck,
  Droplets,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';

export const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [cats, prods] = await Promise.all([
          productService.getCategories(),
          productService.getProducts({ sort: 'discount' }),
        ]);
        setCategories(cats || []);
        setFeaturedProducts((prods || []).slice(0, 8));
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 60%, #40916C 100%)',
          color: '#FFFFFF',
          padding: '64px 0 72px 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(116, 198, 157, 0.2) 0%, rgba(27, 67, 50, 0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'center',
            }}
          >
            {/* Hero Left Content */}
            <div style={{ maxWidth: '600px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(216, 243, 220, 0.2)',
                  color: '#B7E4C7',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  marginBottom: '20px',
                  border: '1px solid rgba(183, 228, 199, 0.3)',
                }}
              >
                <Sparkles size={16} /> Certified Quality Agricultural Inputs
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                  color: '#FFFFFF',
                  fontWeight: '800',
                  marginBottom: '18px',
                  lineHeight: 1.15,
                }}
              >
                Grow More. <br />
                <span style={{ color: '#95D5B2' }}>Protect Better.</span>
              </h1>

              <p
                style={{
                  fontSize: '1.1rem',
                  color: '#D8F3DC',
                  marginBottom: '32px',
                  lineHeight: 1.6,
                }}
              >
                Source government-certified pesticides, hybrid seeds, soluble fertilizers, and modern equipment directly to your farm gate with transparent pricing and agronomic dosage advice.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <Link to="/products" className="btn btn-secondary btn-lg">
                  Explore Products <ArrowRight size={18} />
                </Link>
                <Link
                  to="/products?category=organic-farming-products"
                  className="btn btn-outline btn-lg"
                  style={{ color: '#FFFFFF', borderColor: '#B7E4C7' }}
                >
                  Organic Farming Inputs
                </Link>
              </div>

              {/* Farmer Trust Stats */}
              <div
                style={{
                  display: 'flex',
                  gap: '32px',
                  marginTop: '40px',
                  paddingTop: '24px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#B7E4C7' }}>100%</div>
                  <div style={{ fontSize: '0.78rem', color: '#D8F3DC' }}>CIB&RC Registered</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#B7E4C7' }}>₹999+</div>
                  <div style={{ fontSize: '0.78rem', color: '#D8F3DC' }}>Free Farm Shipping</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#B7E4C7' }}>10+</div>
                  <div style={{ fontSize: '0.78rem', color: '#D8F3DC' }}>Agri Categories</div>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Banner */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(8, 28, 21, 0.4)',
                  border: '4px solid rgba(255, 255, 255, 0.2)',
                  maxWidth: '460px',
                  width: '100%',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80"
                  alt="High Quality Agricultural Products"
                  style={{ width: '100%', height: '360px', objectFit: 'cover', display: 'block' }}
                />
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: 'var(--color-primary-dark)',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                      Kharif & Rabi Season Special
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '800' }}>Up to 25% Off Sucking Pest Control</div>
                  </div>
                  <Link to="/products?category=insecticides" className="btn btn-primary btn-sm">
                    View Offers
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="section-spacing">
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '32px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                Catalog Directory
              </div>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary-dark)' }}>Shop by Agricultural Category</h2>
            </div>
            <Link
              to="/products"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--color-primary)',
                fontWeight: '700',
                fontSize: '0.92rem',
              }}
            >
              Browse All Categories <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '18px',
            }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.id || cat.slug}
                to={`/products?category=${cat.slug}`}
                className="agri-card"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--color-mint)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '14px',
                  }}
                >
                  <Sprout size={24} />
                </div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', marginBottom: '6px' }}>
                  {cat.name}
                </h3>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.45,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {cat.description || 'Certified quality agricultural inputs.'}
                </p>
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '12px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  View Products <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Deals & Best-Sellers */}
      <section
        style={{
          backgroundColor: 'var(--color-cream)',
          padding: '56px 0 64px 0',
          borderTop: '1px solid var(--color-beige-dark)',
          borderBottom: '1px solid var(--color-beige-dark)',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '32px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--color-beige)',
                  color: '#655728',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  marginBottom: '8px',
                }}
              >
                <TrendingUp size={14} /> Seasonal Farmer Specials
              </div>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary-dark)' }}>
                Featured Deals & Crop Protection
              </h2>
            </div>
            <Link to="/products?sort=discount" className="btn btn-outline btn-sm">
              View All Deals
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-primary)' }}>
              Loading agricultural catalog...
            </div>
          ) : (
            <div className="grid-products">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Agronomic Guidance & Farmer Helpline Promo */}
      <section className="section-spacing">
        <div className="container">
          <div
            style={{
              backgroundColor: 'var(--color-primary-dark)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              padding: '48px 40px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  color: 'var(--color-pale-green)',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                Crop Advisory & Technical Support
              </div>
              <h3 style={{ fontSize: '1.8rem', color: '#FFFFFF', marginBottom: '16px' }}>
                Unsure about chemical dosage or target pests?
              </h3>
              <p style={{ color: '#D8F3DC', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
                Every agricultural product on our platform contains exact dilution guidelines, formulation data, and required Personal Protective Equipment (PPE) advice. Our agronomists are available to guide you.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link to="/products" className="btn btn-secondary">
                  Browse Verified Products
                </Link>
                <Link to="/login" className="btn btn-outline" style={{ color: '#FFFFFF', borderColor: '#FFFFFF' }}>
                  Register Farmer Account
                </Link>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '30px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <h4 style={{ color: '#FFFFFF', fontSize: '1.15rem', marginBottom: '14px' }}>
                Customer Workflow Guarantee
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#D8F3DC' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="#74C69D" /> Passwordless OTP Verification (Email/Mobile)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="#74C69D" /> Authoritative Server-Side Pricing Engine
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="#74C69D" /> Real-time Duplicate Payment Protection
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="#74C69D" /> Doorstep Delivery Tracking & Invoicing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
