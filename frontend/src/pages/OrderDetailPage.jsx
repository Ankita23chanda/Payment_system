import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import {
  Package,
  Calendar,
  CreditCard,
  MapPin,
  Truck,
  ArrowLeft,
  Printer,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const OrderDetailPage = () => {
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
        console.error('Failed to load order details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <div style={{ color: 'var(--color-primary)', fontWeight: '700', fontSize: '1.2rem' }}>
          Loading order details...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <Link to="/orders" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container section-spacing" style={{ maxWidth: '880px' }}>
      {/* Top back button */}
      <div style={{ marginBottom: '24px' }}>
        <Link to="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', fontWeight: '700', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to My Orders
        </Link>
      </div>

      {/* Main Order Card */}
      <div className="agri-card" style={{ padding: '36px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '20px',
            borderBottom: '1.5px solid var(--color-mint)',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '1.8rem', color: 'var(--color-primary-dark)' }}>
                Order #{order.order_number}
              </h1>
              <span className={`badge ${order.status === 'CONFIRMED' ? 'badge-success' : 'badge-pending'}`}>
                {order.status}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Placed on {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="btn btn-secondary btn-sm"
            style={{ gap: '6px' }}
          >
            <Printer size={16} /> Print Receipt
          </button>
        </div>

        {/* Payment & Shipping Summary Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          {/* Payment Card */}
          <div
            style={{
              padding: '20px',
              backgroundColor: 'var(--color-offwhite)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: 'var(--color-primary-dark)', marginBottom: '12px' }}>
              <CreditCard size={18} color="var(--color-primary)" /> Payment Information
            </div>
            <div style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>
                Status: <strong style={{ color: order.payment_status === 'SUCCESS' ? 'var(--color-success)' : 'var(--color-warning)' }}>{order.payment_status}</strong>
              </div>
              <div>
                Transaction ID: <strong>{order.transaction_id || 'Pending Gateway Sync'}</strong>
              </div>
              <div>
                Total Amount: <strong>₹{Number(order.total_amount).toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>

          {/* Shipping Card */}
          <div
            style={{
              padding: '20px',
              backgroundColor: 'var(--color-offwhite)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: 'var(--color-primary-dark)', marginBottom: '12px' }}>
              <MapPin size={18} color="var(--color-primary)" /> Farm Shipping Address
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--color-text-main)', lineHeight: 1.5 }}>
              <div>{order.customer_name}</div>
              <div>{order.shipping_address}</div>
              <div>{order.city}, {order.state} - {order.postal_code}</div>
              <div>Mobile: {order.customer_phone}</div>
            </div>
          </div>
        </div>

        {/* Purchased Products */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '16px' }}>
            Purchased Products ({order.items?.length || 0})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {order.items?.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--color-primary-dark)', fontSize: '0.95rem' }}>
                    {item.product_name}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Qty: {item.quantity} × ₹{Number(item.unit_price).toLocaleString('en-IN')}
                  </div>
                </div>
                <div style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--color-primary-dark)' }}>
                  ₹{Number(item.total_price).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown */}
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
              <span>Agricultural Discounts:</span>
              <span>- ₹{Number(order.discount_amount).toLocaleString('en-IN')}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Farm Shipping:</span>
            <span>{Number(order.shipping_fee) === 0 ? 'FREE' : `₹${order.shipping_fee}`}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Tax (5% GST):</span>
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
            <span style={{ fontSize: '1.15rem', fontWeight: '800' }}>Total Paid:</span>
            <span style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-primary)' }}>
              ₹{Number(order.total_amount).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
