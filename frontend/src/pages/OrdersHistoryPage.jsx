import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import {
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Truck,
  ShieldCheck,
  User,
} from 'lucide-react';

export const OrdersHistoryPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/orders' } } });
      return;
    }
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        // Orders are fetched via authenticated JWT — no email/phone needed
        const data = await orderService.getOrders();
        setOrders(data || []);
      } catch (err) {
        setError('Failed to load your order history. Please try again.');
        console.error('Failed to load orders history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated, user]);

  const getStatusBadge = (orderStatus) => {
    switch (orderStatus) {
      case 'CONFIRMED':
        return <span className="badge badge-success">Confirmed</span>;
      case 'PENDING':
        return <span className="badge badge-pending">Pending Payment</span>;
      case 'PROCESSING':
        return <span className="badge badge-brand">Processing</span>;
      case 'SHIPPED':
        return <span className="badge badge-success">In Transit</span>;
      case 'DELIVERED':
        return <span className="badge badge-success">Delivered</span>;
      case 'CANCELLED':
        return <span className="badge" style={{ backgroundColor: '#FFEBEE', color: '#C62828' }}>Cancelled</span>;
      default:
        return <span className="badge badge-pending">{orderStatus}</span>;
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <div style={{ color: 'var(--color-primary)', fontWeight: '700', fontSize: '1.2rem' }}>
          Loading your farm orders...
        </div>
      </div>
    );
  }

  return (
    <div className="container section-spacing" style={{ maxWidth: '960px' }}>
      {/* Page Header with Customer ID Badge */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
              My Farm Orders
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Track fulfillment status, view past invoices, and review purchased agrochemicals &amp; seeds.
            </p>
          </div>
          {/* Permanent Customer ID badge */}
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

      {orders.length === 0 ? (
        <div
          className="agri-card"
          style={{
            padding: '80px 20px',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-mint)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
            }}
          >
            <Package size={32} />
          </div>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
            No Orders Placed Yet
          </h3>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px', margin: '0 auto 24px auto', fontSize: '0.92rem' }}>
            You haven't placed any orders with us yet. Browse our certified marketplace for seasonal farming inputs.
          </p>
          <Link to="/products" className="btn btn-primary">
            Explore Farm Supplies <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => (
            <div
              key={order.id}
              className="agri-card"
              style={{
                backgroundColor: '#FFFFFF',
                padding: '24px',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              {/* Order Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '16px',
                  borderBottom: '1px solid var(--color-border)',
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--color-primary-dark)' }}>
                      {order.order_number}
                    </span>
                    {getStatusBadge(order.status)}
                    {/* Customer ID per-order for traceability */}
                    {order.customer_id && (
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: '600',
                        backgroundColor: '#EDE7F6',
                        color: '#4527A0',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-pill)',
                      }}>
                        {order.customer_id}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} /> Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                    ₹{Number(order.total_amount).toLocaleString('en-IN')}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    {order.payment_status === 'SUCCESS' ? 'Paid Online' : 'Payment Pending'}
                  </span>
                </div>
              </div>

              {/* Items Summary preview */}
              <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {order.items?.slice(0, 3).map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--color-text-main)' }}>
                      <strong>{item.quantity}x</strong> {item.product_name}
                    </span>
                    <span style={{ fontWeight: '600', color: 'var(--color-text-muted)' }}>
                      ₹{Number(item.total_price).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
                {order.items?.length > 3 && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                    + {order.items.length - 3} more product(s)
                  </div>
                )}
              </div>

              {/* Action row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--color-surface-hover)',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Delivery to: <strong>{order.city}, {order.state}</strong>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {order.status === 'PENDING' && (
                    <Link to={`/payment/${order.order_number}`} className="btn btn-primary btn-sm">
                      Complete Payment
                    </Link>
                  )}
                  <Link to={`/orders/${order.order_number}`} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
                    View Full Details <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
