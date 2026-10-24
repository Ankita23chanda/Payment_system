import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import { RazorpayModal } from '../components/RazorpayModal';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Lock,
  ArrowRight,
  AlertCircle,
  Info,
} from 'lucide-react';

export const CheckoutPage = () => {
  const { user } = useAuth();
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();

  const items = cart?.items || [];
  const summary = cart?.summary || {
    subtotal: '0.00',
    discount_amount: '0.00',
    shipping_fee: '0.00',
    tax_amount: '0.00',
    total_amount: '0.00',
  };

  const [cartLoading, setCartLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  // Active order and Razorpay modal state
  const [activeOrder, setActiveOrder] = useState(null);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);

  // Redirect if cart is empty and no active order
  useEffect(() => {
    if (!cartLoading && items.length === 0 && !activeOrder) {
      navigate('/cart');
    }
  }, [items, cartLoading, activeOrder, navigate]);

  // Form State
  const [formData, setFormData] = useState({
    customer_name: user?.name || '',
    customer_email: user?.email || '',
    customer_phone: user?.phone || '',
    shipping_address: '',
    city: '',
    state: '',
    country: 'India',
    postal_code: '',
  });

  // Pre-fill user profile fields if available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customer_name: prev.customer_name || user.name || '',
        customer_email: prev.customer_email || user.email || '',
        customer_phone: prev.customer_phone || user.phone || '',
        shipping_address: prev.shipping_address || user.address || '',
        city: prev.city || user.location || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!formData.customer_name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.customer_email.trim() || !formData.customer_email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!formData.customer_phone.trim()) {
      setErrorMsg('Please enter your mobile phone number.');
      return;
    }
    if (!formData.shipping_address.trim()) {
      setErrorMsg('Please enter your farm or doorstep delivery address.');
      return;
    }
    if (!formData.city.trim() || !formData.state.trim() || !formData.postal_code.trim()) {
      setErrorMsg('Please complete city, state, and postal pin code.');
      return;
    }

    setSubmitting(true);
    try {
      let order = activeOrder;
      // If we don't have an active order yet, create it from authoritative cart
      if (!order) {
        const response = await orderService.checkout(formData);
        order = response.order;
        setActiveOrder(order);
      }

      // Launch Razorpay Demo Payment directly during checkout
      setShowRazorpayModal(true);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to initialize order checkout.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (result) => {
    setShowRazorpayModal(false);
    // Refresh cart in context since backend cleared cart items
    await fetchCart();
    // Navigate immediately to confirmed receipt
    if (activeOrder?.order_number) {
      navigate(`/order-success/${activeOrder.order_number}`);
    }
  };

  const handleModalClose = () => {
    setShowRazorpayModal(false);
    if (activeOrder) {
      setInfoMsg(
        `Order #${activeOrder.order_number} is created and pending payment. Click "Make Payment" to open Razorpay anytime.`
      );
    }
  };

  return (
    <div className="container section-spacing">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
          Farm Order Checkout
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Provide delivery coordinates and review your server-calculated order summary.
        </p>
      </div>

      {errorMsg && (
        <div
          style={{
            backgroundColor: 'var(--color-error-bg)',
            color: 'var(--color-error)',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '24px',
            border: '1.5px solid #FFCDD2',
          }}
        >
          <AlertCircle size={20} />
          <span>{errorMsg}</span>
        </div>
      )}

      {infoMsg && (
        <div
          style={{
            backgroundColor: '#EFF6FF',
            color: '#1E40AF',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '24px',
            border: '1.5px solid #BFDBFE',
          }}
        >
          <Info size={20} color="#2563EB" />
          <span>{infoMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 420px',
            gap: '36px',
            alignItems: 'start',
          }}
          className="checkout-layout"
        >
          {/* Left Column: Customer & Address Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Section 1: Customer Information */}
            <div className="agri-card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
              <h2
                style={{
                  fontSize: '1.3rem',
                  color: 'var(--color-primary-dark)',
                  marginBottom: '20px',
                  paddingBottom: '12px',
                  borderBottom: '1.5px solid var(--color-mint)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span>1.</span> Customer Contact Information
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Full Name / Farmer Name *</label>
                  <input
                    type="text"
                    name="customer_name"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="customer_email"
                    required
                    placeholder="farmer.patel@gmail.com"
                    value={formData.customer_email}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile Number (with Country Code) *</label>
                  <input
                    type="tel"
                    name="customer_phone"
                    required
                    placeholder="+919876543210"
                    value={formData.customer_phone}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Shipping Address */}
            <div className="agri-card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
              <h2
                style={{
                  fontSize: '1.3rem',
                  color: 'var(--color-primary-dark)',
                  marginBottom: '20px',
                  paddingBottom: '12px',
                  borderBottom: '1.5px solid var(--color-mint)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span>2.</span> Farm Gate / Shipping Address
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Farm / House Address, Plot / Survey No. *</label>
                  <textarea
                    rows={3}
                    name="shipping_address"
                    required
                    placeholder="Plot No. 45, Near Cooperative Milk Society, Farm Road"
                    value={formData.shipping_address}
                    onChange={handleInputChange}
                    className="form-textarea"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">City / Taluka *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="Nashik"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">State / Province *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      placeholder="Maharashtra"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Postal PIN Code *</label>
                    <input
                      type="text"
                      name="postal_code"
                      required
                      placeholder="422001"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Country *</label>
                    <input
                      type="text"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Authoritative Order Summary & Pay Action */}
          <div
            className="agri-card"
            style={{
              padding: '28px',
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

            {/* Purchased Items List Snapshot */}
            <div
              style={{
                maxHeight: '220px',
                overflowY: 'auto',
                marginBottom: '18px',
                paddingRight: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.88rem',
                  }}
                >
                  <div style={{ maxWidth: '240px' }}>
                    <div style={{ fontWeight: '700', color: 'var(--color-primary-dark)' }}>
                      {item.product.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      Qty: {item.quantity} × ₹{Number(item.product.effective_price).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <span style={{ fontWeight: '700' }}>
                    ₹{Number(item.line_total).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div
              style={{
                borderTop: '1px solid var(--color-border)',
                paddingTop: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
                <span>₹{Number(summary.subtotal).toLocaleString('en-IN')}</span>
              </div>

              {Number(summary.discount_amount) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--color-success)' }}>
                  <span>Discounts Applied</span>
                  <span>- ₹{Number(summary.discount_amount).toLocaleString('en-IN')}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Shipping Fee</span>
                <span>
                  {Number(summary.shipping_fee) === 0 ? (
                    <strong style={{ color: 'var(--color-success)' }}>FREE</strong>
                  ) : (
                    `₹${Number(summary.shipping_fee).toLocaleString('en-IN')}`
                  )}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Agricultural Tax (5% GST)</span>
                <span>₹{Number(summary.tax_amount).toLocaleString('en-IN')}</span>
              </div>

              {/* Amount to Pay Highlight */}
              <div
                style={{
                  borderTop: '2px solid var(--color-mint)',
                  paddingTop: '16px',
                  marginTop: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block' }}>
                    Amount to Pay
                  </span>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-primary-dark)' }}>
                    Total
                  </span>
                </div>
                <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                  ₹{Number(summary.total_amount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Make Payment Button */}
            <button
              type="submit"
              disabled={submitting || (items.length === 0 && !activeOrder)}
              className="btn btn-primary btn-lg"
              style={{
                width: '100%',
                gap: '10px',
                backgroundColor: '#3399CC',
                borderColor: '#3399CC',
                fontSize: '1.05rem',
                fontWeight: '800',
                boxShadow: '0 4px 14px rgba(51, 153, 204, 0.35)',
              }}
            >
              <Lock size={18} />
              {submitting
                ? 'Preparing Razorpay Checkout...'
                : `Make Payment — ₹${Number(summary.total_amount).toLocaleString('en-IN')}`}
            </button>

            <div
              style={{
                marginTop: '16px',
                textAlign: 'center',
                fontSize: '0.78rem',
                color: 'var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <ShieldCheck size={16} color="#3399CC" />
              <span>Razorpay 256-Bit SSL Demo Sandbox Payment</span>
            </div>
          </div>
        </div>
      </form>

      {/* Embedded Razorpay Demo Payment Modal during checkout */}
      {activeOrder && (
        <RazorpayModal
          isOpen={showRazorpayModal}
          order={activeOrder}
          onClose={handleModalClose}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
