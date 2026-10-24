import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Mail,
  Lock,
  User,
  MapPin,
  Home,
  Phone,
  Eye,
  EyeOff,
  Sprout,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const LoginPage = () => {
  const { login, register, isAuthenticated, loading, getRememberedEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to intended route if already authenticated
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Tab mode: 'login' | 'register'
  const [mode, setMode] = useState('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regLocation, setRegLocation] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize remembered email
  useEffect(() => {
    const remembered = getRememberedEmail();
    if (remembered) {
      setLoginEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(loginEmail.trim(), loginPassword, rememberMe);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(
        err.message || 'Invalid email or password. Please verify your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regEmail.trim() || !regPassword) {
      setErrorMsg('Email and Password are required.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        location: regLocation.trim(),
        address: regAddress.trim(),
        phone: regPhone.trim(),
      });
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(
        err.message || 'Registration failed. Please check the provided details.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 180px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        backgroundColor: 'var(--color-offwhite)',
      }}
    >
      <div
        className="agri-card"
        style={{
          width: '100%',
          maxWidth: mode === 'register' ? '540px' : '440px',
          padding: '36px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Header Icon & Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: 'var(--color-mint)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto',
            }}
          >
            <Sprout size={32} />
          </div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary-dark)', marginBottom: '6px' }}>
            {mode === 'login' ? 'Welcome Back' : 'Create Farmer Account'}
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            {mode === 'login'
              ? 'Sign in with your email and password to access the portal'
              : 'Join the Agriculture Marketplace community today'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            backgroundColor: 'var(--color-offwhite)',
            padding: '4px',
            borderRadius: 'var(--radius-pill)',
            marginBottom: '24px',
            border: '1.5px solid var(--color-mint)',
          }}
        >
          <button
            type="button"
            onClick={() => switchMode('login')}
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              backgroundColor: mode === 'login' ? 'var(--color-primary)' : 'transparent',
              color: mode === 'login' ? '#FFFFFF' : 'var(--color-text-main)',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode('register')}
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              backgroundColor: mode === 'register' ? 'var(--color-primary)' : 'transparent',
              color: mode === 'register' ? '#FFFFFF' : 'var(--color-text-main)',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Create Account
          </button>
        </div>

        {/* Global Error Notice */}
        {errorMsg && (
          <div
            style={{
              backgroundColor: 'var(--color-error-bg)',
              color: 'var(--color-error)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px',
              border: '1px solid #FFCDD2',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Global Success Notice */}
        {successMsg && (
          <div
            style={{
              backgroundColor: '#E8F5E9',
              color: '#2E7D32',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px',
              border: '1px solid #C8E6C9',
            }}
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ======================= LOGIN FORM ======================= */}
        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={15} color="var(--color-primary)" /> Email Address
              </label>
              <input
                type="email"
                required
                placeholder="farmer.patel@gmail.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="form-input"
                disabled={isSubmitting || loading}
                autoFocus
              />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={15} color="var(--color-primary)" /> Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingRight: '42px' }}
                  disabled={isSubmitting || loading}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                  }}
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
                fontSize: '0.85rem',
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: 'var(--color-text-main)',
                  fontWeight: '500',
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px', cursor: 'pointer' }}
                />
                Remember my email
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: '16px' }}
            >
              {isSubmitting || loading ? 'Signing In...' : 'Sign In to Portal'} <ArrowRight size={18} />
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('register')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Create one now
              </button>
            </div>
          </form>
        ) : (
          /* ======================= REGISTER FORM ======================= */
          <form onSubmit={handleRegister}>
            {/* Full Name */}
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={{ fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={15} color="var(--color-primary)" /> Full Name
              </label>
              <input
                type="text"
                placeholder="Ramesh Patel"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="form-input"
                disabled={isSubmitting || loading}
                autoFocus
              />
            </div>

            {/* Email Address */}
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={{ fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={15} color="var(--color-primary)" /> Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="ramesh.patel@gmail.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="form-input"
                disabled={isSubmitting || loading}
              />
            </div>

            {/* Password */}
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={{ fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={15} color="var(--color-primary)" /> Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  placeholder="Create a password (min 6 characters)"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingRight: '42px' }}
                  disabled={isSubmitting || loading}
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                  }}
                  aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                >
                  {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Location (City / Region) */}
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={{ fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} color="var(--color-primary)" /> Location / City
              </label>
              <input
                type="text"
                placeholder="e.g. Pune, Maharashtra"
                value={regLocation}
                onChange={(e) => setRegLocation(e.target.value)}
                className="form-input"
                disabled={isSubmitting || loading}
              />
            </div>

            {/* Delivery / Farm Address */}
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={{ fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Home size={15} color="var(--color-primary)" /> Farm / Delivery Address
              </label>
              <textarea
                rows={2}
                placeholder="Plot 42, Green Valley Road, Post Khed, Pincode 410501"
                value={regAddress}
                onChange={(e) => setRegAddress(e.target.value)}
                className="form-input"
                style={{ resize: 'vertical' }}
                disabled={isSubmitting || loading}
              />
            </div>

            {/* Mobile Phone (Optional) */}
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={15} color="var(--color-primary)" /> Mobile Phone Number (Optional)
              </label>
              <input
                type="tel"
                placeholder="9876543210"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                className="form-input"
                disabled={isSubmitting || loading}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: '16px' }}
            >
              {isSubmitting || loading ? 'Creating Account...' : 'Create Account & Enter Portal'}{' '}
              <ArrowRight size={18} />
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* Security Notice */}
        <div
          style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
          }}
        >
          <ShieldCheck size={16} color="var(--color-primary)" />
          <span>Secure encrypted passwords & industry-standard JWT authentication.</span>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
