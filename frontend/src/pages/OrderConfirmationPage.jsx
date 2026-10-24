import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import {
  CheckCircle2,
  Printer,
  Package,
  Truck,
  ShieldCheck,
  Calendar,
  MapPin,
  ArrowRight,
} from 'lucide-react';

export const OrderConfirmationPage = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await orderService.getOrderDetails(orderNumber);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order confirmation:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderNumber]);

  const handlePrintReceipt = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <div style={{ color: 'var(--color-primary)', fontWeight: '700', fontSize: '1.2rem' }}>
          Finalizing Farm Order Receipt...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Order Confirmation Not Found</h2>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="container section-spacing" style={{ maxWidth: '840px' }}>
      {/* Success Hero Header */}
      <div
        className="agri-card"
        style={{
          backgroundColor: '#FFFFFF',
          padding: '40px 32px',
          textAlign: 'center',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '32px',
          borderTop: '6px solid var(--color-success)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-success-bg)',
            color: 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
          }}
        >
          <CheckCircle2 size={38} />
        </div>

        <h1 style={{ fontSize: '2rem', color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
          Order Confirmed & Placed!
        </h1>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', maxWidth: '540px', margin: '0 auto 24px auto' }}>
          Thank you for choosing AgriProducts. Your agricultural supplies have been scheduled for dispatch to your farm gate.
        </p>

        {/* Essential Identifiers */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '24px',
            backgroundColor: 'var(--color-offwhite)',
            padding: '12px 24px',
            borderRadius: 'var(--radius-pill)',
            border: '1.5px solid var(--color-mint)',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
              Order Number
            </span>
            <strong style={{ color: 'var(--color-primary-dark)', fontSize: '1rem' }}>{order.order_number}</strong>
          </div>

          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)' }} />

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
              Transaction ID
            </span>
            <strong style={{ color: 'var(--color-primary-dark)', fontSize: '0.95rem' }}>
              {order.transaction_id || 'TXN-CONFIRMED'}
            </strong>
          </div>

          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)' }} />

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
              Payment Status
            </span>
            <span className="badge badge-success">
              {order.payment_status}
            </span>
          </div>
        </div>
      </div>

      {/* Order Invoice Details */}
      <div
        className="agri-card"
        style={{
          backgroundColor: '#FFFFFF',
          padding: '36px',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '28px',
            paddingBottom: '16px',
            borderBottom: '1.5px solid var(--color-mint)',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)' }}>Order Invoice Summary</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}
            </span>
          </div>

          <button
            type="button"
            onClick={handlePrintReceipt}
            className="btn btn-secondary btn-sm"
            style={{ gap: '6px' }}
          >
            <Printer size={16} /> Print Tax Invoice
          </button>
        </div>

        {/* Delivery Coordinates & Contact */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
            padding: '20px',
            backgroundColor: 'var(--color-offwhite)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--color-primary-dark)' }}>
              <MapPin size={16} color="var(--color-primary)" /> Farm Shipping Address
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: 1.5 }}>
              <div>{order.customer_name}</div>
              <div>{order.shipping_address}</div>
              <div>{order.city}, {order.state} - {order.postal_code}</div>
              <div>{order.country}</div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--color-primary-dark)' }}>
              <Truck size={16} color="var(--color-primary)" /> Delivery Timeline
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: 1.5 }}>
              <div>Estimated Delivery: <strong>2 - 4 Business Days</strong></div>
              <div>Carrier: Certified AgriLogistics Express</div>
              <div>Customer Mobile: {order.customer_phone}</div>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div style={{ marginBottom: '28px' }}>
          <h4 style={{ fontSize: '1rem', color: 'var(--color-primary-dark)', marginBottom: '14px' }}>
            Purchased Agricultural Supplies
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {order.items?.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--color-primary-dark)' }}>
                    {item.product_name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {item.product_brand && <span>Brand: {item.product_brand} • </span>}
                    Qty: {item.quantity} × ₹{Number(item.unit_price).toLocaleString('en-IN')}
                  </div>
                </div>
                <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--color-primary-dark)' }}>
                  ₹{Number(item.total_price).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div
          style={{
            borderTop: '1.5px solid var(--color-mint)',
            paddingTop: '20px',
            maxWidth: '360px',
            marginLeft: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Subtotal:</span>
            <span>₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
          </div>
          {Number(order.discount_amount) > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--color-success)' }}>
              <span>Discounts:</span>
              <span>- ₹{Number(order.discount_amount).toLocaleString('en-IN')}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Farm Shipping:</span>
            <span>{Number(order.shipping_fee) === 0 ? 'FREE' : `₹${order.shipping_fee}`}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>GST (5%):</span>
            <span>₹{Number(order.tax_amount).toLocaleString('en-IN')}</span>
          </div>
          <div
            style={{
              borderTop: '2px solid var(--color-mint)',
              paddingTop: '12px',
              marginTop: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <span style={{ fontSize: '1.1rem', fontWeight: '800' }}>Paid Total:</span>
            <span style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-primary)' }}>
              ₹{Number(order.total_amount).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Options */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link to="/orders" className="btn btn-secondary">
          <Package size={18} /> View All Farm Orders
        </Link>
        <Link to="/products" className="btn btn-primary">
          Continue Shopping <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};
