import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  CheckCircle2,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Package,
  LogOut,
  Clock,
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container section-spacing" style={{ maxWidth: '780px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
          Farmer Account Profile
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Manage your verified customer credentials, authentication status, and orders.
        </p>
      </div>

      <div
        className="agri-card"
        style={{
          backgroundColor: '#FFFFFF',
          padding: '36px',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '32px',
        }}
      >
        {/* User Identity Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            paddingBottom: '24px',
            borderBottom: '1.5px solid var(--color-mint)',
            marginBottom: '28px',
            flexWrap: 'wrap',
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
            }}
          >
            <User size={34} />
          </div>

          <div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary-dark)', marginBottom: '4px' }}>
              {user?.name || user?.email?.split('@')[0] || user?.phone || 'Farmer Customer'}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-brand">Registered Customer #{user?.id}</span>
              <span className="badge badge-success">
                <ShieldCheck size={13} /> Active Account
              </span>
            </div>
          </div>
        </div>

        {/* Verification & Details Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          {/* Email verification card */}
          <div
            style={{
              padding: '18px',
              backgroundColor: 'var(--color-offwhite)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>
                <Mail size={16} color="var(--color-primary)" /> Email Address
              </div>
              {user?.is_email_verified && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-success)' }}>
                  <CheckCircle2 size={14} /> Verified
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.92rem', color: 'var(--color-text-main)', wordBreak: 'break-all' }}>
              {user?.email || 'No email attached'}
            </div>
          </div>

          {/* Phone verification card */}
          <div
            style={{
              padding: '18px',
              backgroundColor: 'var(--color-offwhite)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>
                <Phone size={16} color="var(--color-primary)" /> Mobile Number
              </div>
            </div>
            <div style={{ fontSize: '0.92rem', color: 'var(--color-text-main)' }}>
              {user?.phone || 'Not provided'}
            </div>
          </div>

          {/* Location card */}
          <div
            style={{
              padding: '18px',
              backgroundColor: 'var(--color-offwhite)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '0.9rem', color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
              <span style={{ fontSize: '1rem' }}>📍</span> Location / City
            </div>
            <div style={{ fontSize: '0.92rem', color: 'var(--color-text-main)' }}>
              {user?.location || 'Not provided'}
            </div>
          </div>

          {/* Address card */}
          <div
            style={{
              padding: '18px',
              backgroundColor: 'var(--color-offwhite)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '0.9rem', color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
              <span style={{ fontSize: '1rem' }}>🏡</span> Delivery Address
            </div>
            <div style={{ fontSize: '0.92rem', color: 'var(--color-text-main)' }}>
              {user?.address || 'Not provided'}
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: 'var(--color-cream)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-beige-dark)',
            fontSize: '0.85rem',
            color: '#554A28',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={15} /> Member Since: {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN') : 'Recent'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={15} /> Last Authentication: {user?.last_login ? new Date(user.last_login).toLocaleDateString('en-IN') : 'Active Session'}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <Link to="/orders" className="btn btn-primary" style={{ gap: '8px' }}>
            <Package size={18} /> View My Orders
          </Link>
          <Link to="/products" className="btn btn-secondary">
            Browse Farm Supplies
          </Link>
          <button
            type="button"
            onClick={logout}
            className="btn btn-outline"
            style={{ color: 'var(--color-error)', borderColor: '#EF9A9A', marginLeft: 'auto', gap: '8px' }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
