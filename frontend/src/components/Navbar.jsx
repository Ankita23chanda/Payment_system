import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  Sprout,
  ShoppingCart,
  User,
  Search,
  LogOut,
  Package,
  Menu,
  X,
  PhoneCall,
  CheckCircle,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#FFFFFF',
        borderBottom: '1.5px solid var(--color-mint)',
        boxShadow: '0 2px 10px rgba(45, 106, 79, 0.06)',
      }}
    >
      {/* Top Agriculture Notice & Helpline Bar */}
      <div
        style={{
          backgroundColor: 'var(--color-primary-dark)',
          color: '#E8F5E9',
          fontSize: '0.78rem',
          padding: '6px 0',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#52B788' }}></span>
            <span>Government Certified Agrochemicals & 100% Genuine Hybrid Seeds</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <PhoneCall size={12} /> Kisan Kisan Support: 1800-425-AGRI
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container" style={{ padding: '14px 20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          {/* Brand Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-mint)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)',
              }}
            >
              <Sprout size={26} strokeWidth={2.4} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.45rem',
                  fontWeight: '800',
                  color: 'var(--color-primary-dark)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                Agri<span style={{ color: 'var(--color-light-green)' }}>Products</span>
              </div>
              <div
                style={{
                  fontSize: '0.68rem',
                  color: 'var(--color-text-muted)',
                  fontWeight: '600',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Modern Farm Supplies
              </div>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: '1',
              maxWidth: '520px',
              position: 'relative',
            }}
            className="desktop-search"
          >
            <input
              type="text"
              placeholder="Search pesticides, seeds, fertilizers, brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 42px 10px 18px',
                borderRadius: 'var(--radius-pill)',
                border: '1.5px solid var(--color-sage)',
                backgroundColor: 'var(--color-offwhite)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: '6px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              aria-label="Search"
            >
              <Search size={16} />
            </button>
          </form>

          {/* Desktop Navigation Links & Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <Link
              to="/products"
              style={{
                fontWeight: '600',
                fontSize: '0.95rem',
                color: location.pathname === '/products' ? 'var(--color-primary)' : 'var(--color-text-main)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              Marketplace
            </Link>

            <Link
              to="/orders"
              style={{
                fontWeight: '600',
                fontSize: '0.95rem',
                color: location.pathname.startsWith('/orders') ? 'var(--color-primary)' : 'var(--color-text-main)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              My Orders
            </Link>

            {/* Cart Link with Badge */}
            <Link
              to="/cart"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--color-mint)',
                color: 'var(--color-primary-dark)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-pill)',
                fontWeight: '700',
                textDecoration: 'none',
                transition: 'background-color 0.2s',
              }}
            >
              <ShoppingCart size={18} />
              <span>Cart</span>
              <span
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                }}
              >
                {cart.total_items_count || 0}
              </span>
            </Link>

            {/* User Profile / Auth Area */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'var(--color-beige)',
                    border: '1.5px solid var(--color-beige-dark)',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-pill)',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    color: '#433D25',
                  }}
                >
                  <User size={16} />
                  <span>{user?.name || user?.email?.split('@')[0] || user?.phone || 'Farmer Account'}</span>
                </button>

                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '230px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      border: '1px solid var(--color-border)',
                      padding: '8px 0',
                      zIndex: 1000,
                    }}
                  >
                    <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Signed in as</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '700', wordBreak: 'break-all' }}>
                        {user?.email || user?.phone}
                      </div>
                      {user?.is_email_verified && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.72rem', color: 'var(--color-success)' }}>
                          <CheckCircle size={12} /> Verified Farmer
                        </div>
                      )}
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 16px',
                        fontSize: '0.9rem',
                        color: 'var(--color-text-main)',
                      }}
                    >
                      <User size={16} /> My Farm Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 16px',
                        fontSize: '0.9rem',
                        color: 'var(--color-text-main)',
                      }}
                    >
                      <Package size={16} /> Order History
                    </Link>

                    <div style={{ borderTop: '1px solid var(--color-border)', margin: '4px 0' }} />

                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 16px',
                        fontSize: '0.9rem',
                        color: 'var(--color-error)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                Login / Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              className="mobile-toggle"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
