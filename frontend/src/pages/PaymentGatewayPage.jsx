import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  QrCode,
  Building2,
  XCircle,
  AlertTriangle,
  Wallet,
  Zap,
  ChevronRight,
} from 'lucide-react';

export const PaymentGatewayPage = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [_paymentSuccessData, setPaymentSuccessData] = useState(null);

  // Payment Method: 'upi' | 'card' | 'netbanking' | 'wallet' | 'kcc'
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Simulator controls: 'SUCCESS' | 'FAILED' | 'CANCELLED'
  const [simulationAction, setSimulationAction] = useState('SUCCESS');
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [upiId, setUpiId] = useState('farmer@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [selectedWallet, setSelectedWallet] = useState('Paytm');
  const [qrTimer, setQrTimer] = useState(599);

  // Initialize Payment Session
  useEffect(() => {
    const initPayment = async () => {
      setLoading(true);
      try {
        const orderData = await orderService.getOrderDetails(orderNumber);
        setOrder(orderData);

        if (orderData.payment_status === 'SUCCESS') {
          navigate(`/order-success/${orderNumber}`);
          return;
        }

        const sessionData = await paymentService.createSession(orderNumber);
        setSession(sessionData);
        setCardName(orderData.customer_name || 'Valued Farmer');
      } catch (err) {
        setErrorMessage(err.message || 'Unable to establish payment gateway session.');
      } finally {
        setLoading(false);
      }
    };
    initPayment();
  }, [orderNumber, navigate]);

  // QR countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setQrTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Quick fill test card
  const handleQuickFillCard = () => {
    setCardNumber('4111 1111 1111 1111');
    setCardExpiry('12/28');
    setCardCvv('789');
    setCardName(order?.customer_name || 'Ramesh Patel');
  };

  // Card number formatter
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 16);
    const parts = raw.match(/.{1,4}/g) || [];
    setCardNumber(parts.join(' '));
  };

  // Card brand detection
  const getCardBrand = () => {
    const clean = cardNumber.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'VISA';
    if (clean.startsWith('5')) return 'MASTERCARD';
    if (clean.startsWith('6')) return 'RUPAY';
    return 'CARD';
  };

  // Process Demo Payment Transaction
  const handleProcessPayment = async () => {
    setProcessing(true);
    setErrorMessage('');
    setPaymentSuccessData(null);

    // Animated demo stage progression
    setProcessingStage('Connecting to Demo Payment Gateway...');
    await new Promise((r) => setTimeout(r, 800));

    setProcessingStage('Simulating bank authorization (DEMO)...');
    await new Promise((r) => setTimeout(r, 1000));

    const fakePaymentId = `pay_DEMO_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
    const fakeSignature = `sig_${Math.random().toString(36).substring(2, 16)}`;

    try {
      const payload = {
        order_number: orderNumber,
        gateway_order_id: session?.gateway_order_id || `order_${Math.random().toString(36).substring(2, 14)}`,
        gateway_payment_id: fakePaymentId,
        gateway_signature: fakeSignature,
        simulate_action: simulationAction,
      };

      // For FAILED/CANCELLED the backend returns HTTP 400, which our api.js throws.
      // We catch that and read the structured error data from err.data.
      let result;
      try {
        result = await paymentService.verifyPayment(payload);
      } catch (apiErr) {
        // Backend returned 400 for FAILED or CANCELLED — extract structured data
        if (apiErr.data && (apiErr.data.status === 'FAILED' || apiErr.data.status === 'CANCELLED')) {
          result = apiErr.data;
        } else {
          throw apiErr;
        }
      }

      if (result.status === 'SUCCESS') {
        setProcessingStage('Demo Payment Authorized! Confirming order...');
        setPaymentSuccessData({
          paymentId: fakePaymentId,
          orderId: payload.gateway_order_id,
        });
        await new Promise((r) => setTimeout(r, 1200));
        navigate(`/order-success/${orderNumber}`);
      } else if (result.status === 'CANCELLED') {
        setErrorMessage(
          '⚠ Demo payment cancelled. You closed the checkout window. Switch to "Test Success" and try again, or choose a different payment method.'
        );
      } else {
        setErrorMessage(
          result.reason ||
            '✕ Demo bank declined this transaction. Switch to "Test Success" to simulate a successful payment.'
        );
      }
    } catch (err) {
      setErrorMessage(err.message || 'Demo payment processing error. Please try again.');
    } finally {
      setProcessing(false);
      setProcessingStage('');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '120px 20px', textAlign: 'center' }}>
        <div style={{ color: '#0C2340', fontWeight: '800', fontSize: '1.4rem', marginBottom: '12px' }}>
          Opening Razorpay Secure Gateway...
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Initializing 256-bit encrypted SSL handshake for Order <strong>#{orderNumber}</strong>.
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const formattedAmount = Number(order.total_amount).toLocaleString('en-IN');

  return (
    <div className="container section-spacing" style={{ maxWidth: '920px' }}>

      {/* ================= DEMO PAYMENT DISCLAIMER BANNER ================= */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
          border: '2px solid #F59E0B',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 20px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <AlertTriangle size={22} color="#B45309" style={{ flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#92400E', marginBottom: '2px' }}>
            🎭 DEMO PAYMENT — No real money will be charged
          </div>
          <div style={{ fontSize: '0.82rem', color: '#78350F', lineHeight: '1.5' }}>
            This is a <strong>simulated payment interface</strong> for project demonstration only.
            Do NOT enter real card numbers, real UPI PINs, or real bank credentials.
            All transactions are fake and purely local — no real bank or payment processor is contacted.
          </div>
        </div>
      </div>

      {/* ================= SIMULATOR CONTROLS BANNER ================= */}
      <div
        style={{
          backgroundColor: '#0C2340',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 4px 14px rgba(12, 35, 64, 0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              backgroundColor: '#3399CC',
              color: '#FFFFFF',
              fontSize: '0.75rem',
              fontWeight: '800',
              padding: '3px 8px',
              borderRadius: '4px',
              letterSpacing: '1px',
            }}
          >
            RAZORPAY TEST SANDBOX
          </span>
          <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
            Simulate realistic payment behavior without real bank deduction:
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              color: simulationAction === 'SUCCESS' ? '#4ADE80' : '#E2E8F0',
            }}
          >
            <input
              type="radio"
              name="simAction"
              checked={simulationAction === 'SUCCESS'}
              onChange={() => setSimulationAction('SUCCESS')}
              style={{ accentColor: '#4ADE80' }}
            />
            ✓ Test Success
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              color: simulationAction === 'FAILED' ? '#F87171' : '#E2E8F0',
            }}
          >
            <input
              type="radio"
              name="simAction"
              checked={simulationAction === 'FAILED'}
              onChange={() => setSimulationAction('FAILED')}
              style={{ accentColor: '#F87171' }}
            />
            ✕ Bank Decline
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              color: simulationAction === 'CANCELLED' ? '#FBBF24' : '#E2E8F0',
            }}
          >
            <input
              type="radio"
              name="simAction"
              checked={simulationAction === 'CANCELLED'}
              onChange={() => setSimulationAction('CANCELLED')}
              style={{ accentColor: '#FBBF24' }}
            />
            ⚠ User Cancel
          </label>
        </div>
      </div>

      {/* ================= RAZORPAY HEADER CARD ================= */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
          border: '1.5px solid #E2E8F0',
          borderBottom: 'none',
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Razorpay Brand Icon */}
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#0C2340',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3399CC',
              boxShadow: '0 4px 10px rgba(12, 35, 64, 0.2)',
            }}
          >
            <Zap size={26} color="#3399CC" fill="#3399CC" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#0C2340', fontWeight: '800', margin: 0 }}>
                Razorpay
              </h3>
              <span
                style={{
                  fontSize: '0.72rem',
                  backgroundColor: '#E0F2FE',
                  color: '#0369A1',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}
              >
                Trusted Business
              </span>
            </div>
            <p style={{ margin: '3px 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
              Merchant: <strong>AgriProducts Marketplace Ltd</strong>
            </p>
          </div>
        </div>

        {/* Order Amount Pill */}
        <div
          style={{
            textAlign: 'right',
            backgroundColor: '#F1F5F9',
            padding: '10px 20px',
            borderRadius: '12px',
            border: '1px solid #CBD5E1',
          }}
        >
          <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', display: 'block' }}>
            Amount to Pay
          </span>
          <span style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0C2340' }}>
            ₹{formattedAmount}
          </span>
        </div>
      </div>

      {/* ================= MAIN RAZORPAY CHECKOUT MODAL BOX ================= */}
      <div
        className="agri-card"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
          border: '1.5px solid #E2E8F0',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          minHeight: '440px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Left Sidebar: Razorpay Payment Modes */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            borderRight: '1.5px solid #E2E8F0',
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', padding: '8px 12px' }}>
            Payment Options
          </div>

          {/* UPI */}
          <button
            type="button"
            onClick={() => setPaymentMethod('upi')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: paymentMethod === 'upi' ? '#FFFFFF' : 'transparent',
              color: paymentMethod === 'upi' ? '#0C2340' : '#475569',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: paymentMethod === 'upi' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              borderLeft: paymentMethod === 'upi' ? '4px solid #3399CC' : '4px solid transparent',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <QrCode size={18} color={paymentMethod === 'upi' ? '#3399CC' : '#64748B'} />
              <span>UPI / QR</span>
            </div>
            {paymentMethod === 'upi' && <ChevronRight size={16} color="#3399CC" />}
          </button>

          {/* Cards */}
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: paymentMethod === 'card' ? '#FFFFFF' : 'transparent',
              color: paymentMethod === 'card' ? '#0C2340' : '#475569',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: paymentMethod === 'card' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              borderLeft: paymentMethod === 'card' ? '4px solid #3399CC' : '4px solid transparent',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditCard size={18} color={paymentMethod === 'card' ? '#3399CC' : '#64748B'} />
              <span>Card (Credit/Debit)</span>
            </div>
            {paymentMethod === 'card' && <ChevronRight size={16} color="#3399CC" />}
          </button>

          {/* Net Banking */}
          <button
            type="button"
            onClick={() => setPaymentMethod('netbanking')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: paymentMethod === 'netbanking' ? '#FFFFFF' : 'transparent',
              color: paymentMethod === 'netbanking' ? '#0C2340' : '#475569',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: paymentMethod === 'netbanking' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              borderLeft: paymentMethod === 'netbanking' ? '4px solid #3399CC' : '4px solid transparent',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building2 size={18} color={paymentMethod === 'netbanking' ? '#3399CC' : '#64748B'} />
              <span>Net Banking</span>
            </div>
            {paymentMethod === 'netbanking' && <ChevronRight size={16} color="#3399CC" />}
          </button>

          {/* Wallets */}
          <button
            type="button"
            onClick={() => setPaymentMethod('wallet')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: paymentMethod === 'wallet' ? '#FFFFFF' : 'transparent',
              color: paymentMethod === 'wallet' ? '#0C2340' : '#475569',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: paymentMethod === 'wallet' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              borderLeft: paymentMethod === 'wallet' ? '4px solid #3399CC' : '4px solid transparent',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Wallet size={18} color={paymentMethod === 'wallet' ? '#3399CC' : '#64748B'} />
              <span>Wallets</span>
            </div>
            {paymentMethod === 'wallet' && <ChevronRight size={16} color="#3399CC" />}
          </button>

          {/* Kisan Credit Card */}
          <button
            type="button"
            onClick={() => setPaymentMethod('kcc')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: paymentMethod === 'kcc' ? '#FFFFFF' : 'transparent',
              color: paymentMethod === 'kcc' ? '#0C2340' : '#475569',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: paymentMethod === 'kcc' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              borderLeft: paymentMethod === 'kcc' ? '4px solid #3399CC' : '4px solid transparent',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1rem' }}>🌾</span>
              <span>Kisan Card (KCC)</span>
            </div>
            {paymentMethod === 'kcc' && <ChevronRight size={16} color="#3399CC" />}
          </button>

          <div style={{ marginTop: 'auto', padding: '12px 10px', fontSize: '0.74rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="#16A34A" />
            <span>PCI-DSS Certified 3.2.1</span>
          </div>
        </div>

        {/* Right Content Area */}
        <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column' }}>
          {/* Error Notice */}
          {errorMessage && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px',
                border: '1px solid #FECACA',
              }}
            >
              <XCircle size={20} style={{ flexShrink: 0 }} />
              <div>{errorMessage}</div>
            </div>
          )}

          {/* 1. UPI / QR METHOD VIEW */}
          {paymentMethod === 'upi' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '1.15rem', color: '#0C2340', fontWeight: '800', margin: 0 }}>
                  Scan & Pay using UPI QR Code
                </h4>
                <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '600' }}>
                  Expires in <strong style={{ color: '#E11D48' }}>{formatTimer(qrTimer)}</strong>
                </span>
              </div>

              {/* Realistic Visual QR Code Display */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  backgroundColor: '#F8FAFC',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1.5px dashed #CBD5E1',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    width: '130px',
                    height: '130px',
                    backgroundColor: '#FFFFFF',
                    padding: '8px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Clean SVG Vector QR simulation */}
                  <svg viewBox="0 0 100 100" width="100%" height="100%">
                    <rect width="100" height="100" fill="#ffffff" />
                    {/* Top-left marker */}
                    <rect x="5" y="5" width="26" height="26" fill="#0C2340" />
                    <rect x="9" y="9" width="18" height="18" fill="#ffffff" />
                    <rect x="13" y="13" width="10" height="10" fill="#0C2340" />

                    {/* Top-right marker */}
                    <rect x="69" y="5" width="26" height="26" fill="#0C2340" />
                    <rect x="73" y="9" width="18" height="18" fill="#ffffff" />
                    <rect x="77" y="13" width="10" height="10" fill="#0C2340" />

                    {/* Bottom-left marker */}
                    <rect x="5" y="69" width="26" height="26" fill="#0C2340" />
                    <rect x="9" y="73" width="18" height="18" fill="#ffffff" />
                    <rect x="13" y="77" width="10" height="10" fill="#0C2340" />

                    {/* Pattern dots */}
                    <rect x="36" y="8" width="8" height="8" fill="#0C2340" />
                    <rect x="48" y="14" width="8" height="8" fill="#0C2340" />
                    <rect x="38" y="26" width="6" height="6" fill="#0C2340" />
                    <rect x="52" y="28" width="10" height="6" fill="#0C2340" />
                    <rect x="12" y="40" width="12" height="6" fill="#0C2340" />
                    <rect x="30" y="42" width="16" height="8" fill="#3399CC" />
                    <rect x="50" y="40" width="18" height="8" fill="#0C2340" />
                    <rect x="74" y="44" width="14" height="6" fill="#0C2340" />
                    <rect x="36" y="60" width="10" height="14" fill="#0C2340" />
                    <rect x="52" y="58" width="12" height="12" fill="#0C2340" />
                    <rect x="70" y="66" width="12" height="12" fill="#0C2340" />
                    <rect x="44" y="78" width="8" height="10" fill="#0C2340" />
                    <rect x="60" y="82" width="14" height="8" fill="#3399CC" />
                    <rect x="80" y="80" width="10" height="10" fill="#0C2340" />
                  </svg>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0C2340', marginBottom: '4px' }}>
                    Scan with any UPI app
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 12px 0' }}>
                    Google Pay, PhonePe, Paytm, or BHIM. Instant verification.
                  </p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'CRED'].map((app) => (
                      <span
                        key={app}
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          backgroundColor: '#FFFFFF',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: '1px solid #E2E8F0',
                          color: '#334155',
                        }}
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Or UPI ID Input */}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '700' }}>
                  Or enter your Virtual Payment Address (UPI ID)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="form-input"
                    placeholder="e.g. farmer@okhdfcbank"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. CARD METHOD VIEW */}
          {paymentMethod === 'card' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '1.15rem', color: '#0C2340', fontWeight: '800', margin: 0 }}>
                  Credit or Debit Card
                </h4>
                <button
                  type="button"
                  onClick={handleQuickFillCard}
                  style={{
                    backgroundColor: '#E0F2FE',
                    color: '#0369A1',
                    border: '1px solid #BAE6FD',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Zap size={13} /> Quick Fill Test Card
                </button>
              </div>

              {/* Interactive Virtual Card Preview Widget */}
              <div
                style={{
                  backgroundColor: 'linear-gradient(135deg, #0C2340 0%, #1E3A8A 100%)',
                  background: '#0C2340',
                  color: '#FFFFFF',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  marginBottom: '20px',
                  boxShadow: '0 4px 12px rgba(12, 35, 64, 0.25)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94A3B8', letterSpacing: '1px' }}>
                    RAZORPAY TEST CARD
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '900', color: '#38BDF8', letterSpacing: '2px' }}>
                    {getCardBrand()}
                  </span>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '3px', marginBottom: '10px', fontFamily: 'monospace' }}>
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <div>
                    <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.65rem' }}>CARD HOLDER</span>
                    <span style={{ fontWeight: '700' }}>{cardName.toUpperCase()}</span>
                  </div>
                  <div>
                    <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.65rem' }}>EXPIRES</span>
                    <span style={{ fontWeight: '700' }}>{cardExpiry}</span>
                  </div>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: '700' }}>Card Number</label>
                <input
                  type="text"
                  maxLength={19}
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="form-input"
                  placeholder="4111 1111 1111 1111"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: '700' }}>Expiry (MM/YY)</label>
                  <input
                    type="text"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="form-input"
                    placeholder="MM/YY"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: '700' }}>CVV (DEMO — enter any 3 digits)</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    className="form-input"
                    placeholder="123"
                  />
                </div>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748B', backgroundColor: '#F8FAFC', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', marginTop: '4px' }}>
                🎭 <strong>DEMO:</strong> These card details are fake. No real card data is collected or transmitted.
              </div>
            </div>
          )}

          {/* 3. NET BANKING METHOD VIEW */}
          {paymentMethod === 'netbanking' && (
            <div>
              <h4 style={{ fontSize: '1.15rem', color: '#0C2340', fontWeight: '800', marginBottom: '16px' }}>
                Select Your Bank
              </h4>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px',
                  marginBottom: '20px',
                }}
              >
                {[
                  { id: 'HDFC', name: 'HDFC Bank' },
                  { id: 'SBI', name: 'State Bank of India' },
                  { id: 'ICICI', name: 'ICICI Bank' },
                  { id: 'AXIS', name: 'Axis Bank' },
                  { id: 'KOTAK', name: 'Kotak Bank' },
                  { id: 'PNB', name: 'Punjab National' },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBank(b.id)}
                    style={{
                      padding: '12px 10px',
                      borderRadius: '8px',
                      border: selectedBank === b.id ? '2px solid #3399CC' : '1px solid #CBD5E1',
                      backgroundColor: selectedBank === b.id ? '#F0F9FF' : '#FFFFFF',
                      color: selectedBank === b.id ? '#0C2340' : '#475569',
                      fontWeight: '700',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    {b.name}
                  </button>
                ))}
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: '700' }}>
                  All Other Indian Banks
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="form-select"
                >
                  <option value="HDFC">HDFC Bank</option>
                  <option value="SBI">State Bank of India (SBI)</option>
                  <option value="ICICI">ICICI Bank</option>
                  <option value="AXIS">Axis Bank</option>
                  <option value="BOB">Bank of Baroda</option>
                  <option value="CANARA">Canara Bank</option>
                  <option value="UNION">Union Bank of India</option>
                  <option value="INDUSIND">IndusInd Bank</option>
                  <option value="IDBI">IDBI Bank</option>
                  <option value="YES">Yes Bank</option>
                </select>
              </div>
            </div>
          )}

          {/* 4. WALLETS METHOD VIEW */}
          {paymentMethod === 'wallet' && (
            <div>
              <h4 style={{ fontSize: '1.15rem', color: '#0C2340', fontWeight: '800', marginBottom: '16px' }}>
                Select Wallet
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                {['Paytm Wallet', 'PhonePe Wallet', 'MobiKwik', 'Airtel Money'].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setSelectedWallet(w)}
                    style={{
                      padding: '16px',
                      borderRadius: '8px',
                      border: selectedWallet === w ? '2px solid #3399CC' : '1px solid #E2E8F0',
                      backgroundColor: selectedWallet === w ? '#F0F9FF' : '#FFFFFF',
                      fontWeight: '700',
                      fontSize: '0.88rem',
                      color: '#0C2340',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 5. KISAN CREDIT CARD (KCC) VIEW */}
          {paymentMethod === 'kcc' && (
            <div>
              <h4 style={{ fontSize: '1.15rem', color: '#0C2340', fontWeight: '800', marginBottom: '8px' }}>
                Kisan Credit Card (KCC) Facility
              </h4>
              <p style={{ color: '#64748B', fontSize: '0.82rem', marginBottom: '16px' }}>
                Govt. Subsidized Agriculture Credit (Interest Rate 7% p.a.). Authorized for Seeds & Fertilizers.
              </p>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: '700' }}>16-Digit KCC Number</label>
                <input
                  type="text"
                  defaultValue="6071 8840 9104 2201"
                  className="form-input"
                />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: '700' }}>Registered Farmer Mobile</label>
                <input
                  type="text"
                  defaultValue={order?.customer_phone || '+91 9876543210'}
                  className="form-input"
                  readOnly
                />
              </div>
            </div>
          )}

          {/* ================= PAY BUTTON ================= */}
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            {/* Outcome selector legend */}
            <div style={{ fontSize: '0.76rem', color: '#64748B', marginBottom: '10px', textAlign: 'center' }}>
              Current simulation: <strong style={{ color: simulationAction === 'SUCCESS' ? '#16A34A' : simulationAction === 'FAILED' ? '#DC2626' : '#D97706' }}>{simulationAction}</strong>
              &nbsp;— change it in the blue bar above.
            </div>

            <button
              type="button"
              onClick={handleProcessPayment}
              disabled={processing}
              style={{
                width: '100%',
                padding: '14px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: simulationAction === 'SUCCESS' ? '#3399CC' : simulationAction === 'FAILED' ? '#DC2626' : '#D97706',
                color: '#FFFFFF',
                fontSize: '1.05rem',
                fontWeight: '800',
                cursor: processing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 12px rgba(51, 153, 204, 0.35)',
                transition: 'all 0.2s ease',
                opacity: processing ? 0.7 : 1,
              }}
            >
              <Lock size={18} />
              {processing
                ? 'Processing Demo Payment...'
                : `[DEMO] Simulate ${simulationAction} — ₹${formattedAmount}`}
            </button>

            <div
              style={{
                marginTop: '10px',
                padding: '8px 12px',
                backgroundColor: '#FEF9EC',
                border: '1px solid #FDE68A',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.74rem',
                color: '#92400E',
                fontWeight: '600',
              }}
            >
              <AlertTriangle size={14} />
              <span>🎭 DEMO PAYMENT — No real money will be charged. This is for demonstration purposes only.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= PROCESSING & 3D SECURE OVERLAY MODAL ================= */}
      {processing && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(12, 35, 64, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '36px 32px',
              maxWidth: '420px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Spinning Razorpay Loader */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: '5px solid #E2E8F0',
                borderTopColor: '#3399CC',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px auto',
              }}
            />
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>

            <h3 style={{ fontSize: '1.25rem', color: '#0C2340', fontWeight: '800', marginBottom: '4px' }}>
              🎭 Demo Payment Processing
            </h3>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginBottom: '10px', fontWeight: '600' }}>
              SIMULATION MODE — No real bank contacted
            </div>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '20px' }}>
              {processingStage || 'Simulating demo payment...'}
            </p>

            <div
              style={{
                backgroundColor: '#F8FAFC',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: '#475569',
              }}
            >
              Do not refresh or press back while we confirm your payment of <strong>₹{formattedAmount}</strong>.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentGatewayPage;
