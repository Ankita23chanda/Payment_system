import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { QuantitySelector } from '../components/QuantitySelector';
import { ProductCard } from '../components/ProductCard';
import {
  ShieldAlert,
  ShieldCheck,
  Truck,
  Droplets,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ShoppingCart,
  ArrowLeft,
  Share2,
  ArrowRight,
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart, loading: cartLoading } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'usage' | 'safety'
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
        setQuantity(1);
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <div style={{ color: 'var(--color-primary)', fontWeight: '700', fontSize: '1.2rem' }}>
          Loading agricultural specifications...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px' }}>Agricultural Product Not Found</h2>
        <Link to="/products" className="btn btn-primary">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!product.in_stock || cartLoading) return;
    try {
      await addToCart(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const discountPercent = product.discount_percentage || 0;

  return (
    <div className="container section-spacing">
      {/* Breadcrumb Navigation */}
      <nav style={{ marginBottom: '24px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
        <Link to="/" style={{ color: 'var(--color-primary)' }}>Home</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <Link to="/products" style={{ color: 'var(--color-primary)' }}>Marketplace</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <Link to={`/products?category=${product.category?.slug}`} style={{ color: 'var(--color-primary)' }}>
          {product.category?.name}
        </Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: 'var(--color-text-main)', fontWeight: '600' }}>{product.name}</span>
      </nav>

      {/* Main Details Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '48px',
          alignItems: 'start',
          marginBottom: '56px',
        }}
      >
        {/* Left Column: Product Visual Showcase */}
        <div>
          <div
            className="agri-card"
            style={{
              padding: '24px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              textAlign: 'center',
            }}
          >
            <img
              src={product.image || 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=800&auto=format&fit=crop&q=80'}
              alt={product.name}
              style={{
                width: '100%',
                maxHeight: '440px',
                objectFit: 'contain',
                borderRadius: 'var(--radius-lg)',
              }}
            />
          </div>

          {/* Trust Guarantees under image */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginTop: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                backgroundColor: 'var(--color-mint)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                color: 'var(--color-primary-dark)',
                fontWeight: '600',
              }}
            >
              <ShieldCheck size={18} color="var(--color-primary)" /> Genuine Certified Stock
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                backgroundColor: 'var(--color-cream)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                color: '#554A26',
                fontWeight: '600',
              }}
            >
              <Truck size={18} color="#856404" /> Fast Farm Gate Delivery
            </div>
          </div>
        </div>

        {/* Right Column: Information, Pricing, Actions */}
        <div>
          {/* Brand & Category */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span
              style={{
                backgroundColor: 'var(--color-beige)',
                color: '#524823',
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.8rem',
                fontWeight: '700',
                border: '1px solid var(--color-beige-dark)',
              }}
            >
              {product.brand}
            </span>
            <span
              style={{
                backgroundColor: 'var(--color-mint)',
                color: 'var(--color-primary-dark)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.8rem',
                fontWeight: '700',
              }}
            >
              {product.category?.name}
            </span>
          </div>

          {/* Product Name */}
          <h1
            style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              color: 'var(--color-primary-dark)',
              fontWeight: '800',
              marginBottom: '16px',
              lineHeight: 1.2,
            }}
          >
            {product.name}
          </h1>

          {/* Pricing Box */}
          <div
            style={{
              backgroundColor: 'var(--color-offwhite)',
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--color-mint)',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '6px' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--color-primary-dark)' }}>
                ₹{Number(product.effective_price).toLocaleString('en-IN')}
              </span>
              {discountPercent > 0 && (
                <>
                  <span
                    style={{
                      fontSize: '1.2rem',
                      color: 'var(--color-text-light)',
                      textDecoration: 'line-through',
                    }}
                  >
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </span>
                  <span
                    style={{
                      backgroundColor: '#E63946',
                      color: '#FFFFFF',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.8rem',
                      fontWeight: '800',
                    }}
                  >
                    {discountPercent}% OFF
                  </span>
                </>
              )}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              Inclusive of all 5% Agricultural GST & Taxes. Free delivery on orders over ₹999.
            </div>
          </div>

          {/* Stock Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: product.in_stock ? 'var(--color-success)' : 'var(--color-error)',
              }}
            />
            <span
              style={{
                fontWeight: '700',
                fontSize: '0.95rem',
                color: product.in_stock ? 'var(--color-success)' : 'var(--color-error)',
              }}
            >
              {product.in_stock ? `In Stock (${product.stock} units remaining)` : 'Currently Out of Stock'}
            </span>
          </div>

          {/* Brief Description */}
          <p
            style={{
              color: 'var(--color-text-main)',
              fontSize: '1rem',
              lineHeight: 1.6,
              marginBottom: '28px',
            }}
          >
            {product.description}
          </p>

          {/* Purchase Actions (Quantity + Buttons) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              paddingTop: '20px',
              borderTop: '1px solid var(--color-border)',
              marginBottom: '32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>
                Quantity:
              </span>
              <QuantitySelector
                value={quantity}
                min={1}
                max={product.stock || 1}
                onChange={setQuantity}
                disabled={!product.in_stock}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Pack size per unit
              </span>
            </div>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.in_stock || cartLoading}
                className={`btn ${added ? 'btn-secondary' : 'btn-primary'} btn-lg`}
                style={{ flex: '1', minWidth: '180px' }}
              >
                {added ? (
                  <>
                    <CheckCircle2 size={20} /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} /> Add to Cart
                  </>
                )}
              </button>

              <Link
                to="/cart"
                className="btn btn-secondary btn-lg"
                style={{
                  flex: '1',
                  minWidth: '180px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                View Cart <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications, Usage & Safety Tabs */}
      <section
        className="agri-card"
        style={{
          padding: '32px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '56px',
        }}
      >
        {/* Tab Headers */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            borderBottom: '2px solid var(--color-mint)',
            paddingBottom: '12px',
            marginBottom: '28px',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              backgroundColor: activeTab === 'specs' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'specs' ? '#FFFFFF' : 'var(--color-text-main)',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            <FileText size={18} /> Agronomic Specifications
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('usage')}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              backgroundColor: activeTab === 'usage' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'usage' ? '#FFFFFF' : 'var(--color-text-main)',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            <Droplets size={18} /> Dosage & Application
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('safety')}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              backgroundColor: activeTab === 'safety' ? '#D32F2F' : 'transparent',
              color: activeTab === 'safety' ? '#FFFFFF' : '#D32F2F',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            <AlertTriangle size={18} /> Agricultural Safety & PPE
          </button>
        </div>

        {/* Tab 1: Specifications Table */}
        {activeTab === 'specs' && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--color-primary-dark)' }}>
              Technical Product Specifications
            </h3>
            {product.specifications && Object.keys(product.specifications).length > 0 ? (
              <div
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                }}
              >
                {Object.entries(product.specifications).map(([key, val], idx) => (
                  <div
                    key={key}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '240px 1fr',
                      padding: '12px 18px',
                      backgroundColor: idx % 2 === 0 ? 'var(--color-offwhite)' : '#FFFFFF',
                      borderBottom: idx === Object.keys(product.specifications).length - 1 ? 'none' : '1px solid var(--color-border)',
                    }}
                  >
                    <span style={{ fontWeight: '700', color: 'var(--color-primary-dark)', fontSize: '0.9rem' }}>
                      {key}
                    </span>
                    <span style={{ color: 'var(--color-text-main)', fontSize: '0.9rem' }}>
                      {String(val)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-muted)' }}>Standard agricultural grade specifications apply.</p>
            )}
          </div>
        )}

        {/* Tab 2: Usage Instructions */}
        {activeTab === 'usage' && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--color-primary-dark)' }}>
              Recommended Application Method & Spray Schedule
            </h3>
            <div
              style={{
                backgroundColor: 'var(--color-cream)',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-beige-dark)',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                color: '#413A22',
              }}
            >
              {product.usage_instructions ||
                'Mix thoroughly with clean neutral-pH water according to the prescribed dosage per acre. Apply in calm weather conditions during early morning or late afternoon hours to prevent foliar evaporation.'}
            </div>
          </div>
        )}

        {/* Tab 3: Safety Information & PPE Alert */}
        {activeTab === 'safety' && (
          <div className="animate-fade-in">
            <div
              style={{
                backgroundColor: '#FFEBEE',
                border: '1.5px solid #FFCDD2',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                color: '#B71C1C',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <ShieldAlert size={24} color="#D32F2F" />
                <h3 style={{ fontSize: '1.25rem', color: '#B71C1C', fontWeight: '800' }}>
                  Statutory Chemical Safety & Withholding Period Notice
                </h3>
              </div>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '16px' }}>
                {product.safety_information ||
                  'Keep locked away from children and domestic animals. Use chemical-resistant nitrile gloves, safety goggles, and respiratory mask while handling concentrate or spraying in fields. Observe recommended pre-harvest interval before crop picking.'}
              </p>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#7F0000' }}>
                Emergency First Aid: In case of accidental eye contact or ingestion, flush with clean water and call your nearest medical health centre immediately with the product label.
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Related Products Carousel / Grid */}
      {product.related_products && product.related_products.length > 0 && (
        <section>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary-dark)', marginBottom: '24px' }}>
            Related {product.category?.name} Products
          </h2>
          <div className="grid-products">
            {product.related_products.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
