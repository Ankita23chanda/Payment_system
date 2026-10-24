import React, { useState, useEffect } from 'react';
import { paymentService } from '../services/paymentService';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  QrCode,
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Wallet,
  Zap,
  ChevronRight,
  X,
  Copy,
  Check,
} from 'lucide-react';

export const RazorpayModal = ({
  isOpen,
  order,
  onClose,
  onSuccess,
}) => {
  // Session & UI States
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [_paymentSuccessData, setPaymentSuccessData] = useState(null);

  // Payment Method: 'upi' | 'card' | 'netbanking' | 'wallet' | 'kcc'
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Simulator controls: 'SUCCESS' | 'FAILED' | 'CANCELLED'
  const [simulationAction, setSimulationAction] = useState('SUCCESS');

  // Form states
  const [upiId, setUpiId] = useState('farmer@okhdfcbank');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [cardName, setCardName] = useState(order?.customer_name || 'Valued Farmer');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [selectedWallet, setSelectedWallet] = useState('Paytm');
  const [qrTimer, setQrTimer] = useState(599);

  // Initialize Payment Session when modal opens
  useEffect(() => {
    let isMounted = true;
    const initSession = async () => {
      setSessionLoading(true);
      setErrorMessage('');
      try {
        const sessionData = await paymentService.createSession(order.order_number);
        if (isMounted) {
          setSession(sessionData);
        }
      } catch (err) {
        if (isMounted) {
          // If session fails because already paid, report success
          if (err.data && err.data.status === 'SUCCESS') {
            if (onSuccess) onSuccess(err.data);
            return;
          }
          setErrorMessage(err.message || 'Unable to establish payment gateway session.');
        }
      } finally {
        if (isMounted) setSessionLoading(false);
      }
    };

    if (isOpen && order?.order_number) {
      initSession();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, order?.order_number, onSuccess]);

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

  const getCardBrand = () => {
    const clean = cardNumber.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'VISA';
    if (clean.startsWith('5')) return 'MASTERCARD';
    if (clean.startsWith('6')) return 'RUPAY';
    return 'CARD';
  };

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Process Demo Payment
  const handleProcessPayment = async () => {
    setProcessing(true);
    setErrorMessage('');
    setPaymentSuccessData(null);

    setProcessingStage('Connecting to Razorpay Demo Gateway...');
    await new Promise((r) => setTimeout(r, 650));

    setProcessingStage('Simulating bank authorization (DEMO)...');
    await new Promise((r) => setTimeout(r, 850));

    const fakePaymentId = `pay_DEMO_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
    const fakeSignature = `sig_${Math.random().toString(36).substring(2, 16)}`;

    try {
      const payload = {
        order_number: order.order_number,
        gateway_order_id: session?.gateway_order_id || `order_${Math.random().toString(36).substring(2, 14)}`,
        gateway_payment_id: fakePaymentId,
        gateway_signature: fakeSignature,
        simulate_action: simulationAction,
      };

      let result = null;
      try {
        result = await paymentService.verifyPayment(payload);
      } catch (apiErr) {
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
        await new Promise((r) => setTimeout(r, 900));
        if (onSuccess) onSuccess(result);
      } else if (result.status === 'CANCELLED') {
        setErrorMessage(
          '⚠ Demo payment cancelled. Switch simulation to "Test Success" and try again.'
        );
      } else {
        setErrorMessage(
          result.reason ||
            '✕ Demo bank declined this transaction. Switch simulation to "Test Success" to complete payment.'
        );
      }
    } catch (err) {
      setErrorMessage(err.message || 'Demo payment processing error. Please try again.');
    } finally {
      setProcessing(false);
      setProcessingStage('');
    }
  };

  if (!isOpen || !order) return null;

  const formattedAmount = Number(order?.total_amount || 0).toLocaleString('en-IN');

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(12, 35, 64, 0.75)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !processing) {
          onClose();
        }
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '860px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '94vh',
          animation: 'modalSlideUp 0.25s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes modalSlideUp {
            from { opacity: 0; transform: translateY(18px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>

        {/* ================= SIMULATOR TEST ACTIONS BAR ================= */}
        <div
          style={{
            backgroundColor: '#0C2340',
            color: '#FFFFFF',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                backgroundColor: '#3399CC',
                color: '#FFFFFF',
                fontSize: '0.7rem',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '4px',
                letterSpacing: '0.8px',
              }}
            >
              RAZORPAY DEMO SANDBOX
            </span>
            <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
              Select payment simulation outcome:
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                color: simulationAction === 'SUCCESS' ? '#4ADE80' : '#E2E8F0',
              }}
            >
              <input
                type="radio"
                name="simActionModal"
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
                gap: '5px',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                color: simulationAction === 'FAILED' ? '#F87171' : '#E2E8F0',
              }}
            >
              <input
                type="radio"
                name="simActionModal"
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
                gap: '5px',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                color: simulationAction === 'CANCELLED' ? '#FBBF24' : '#E2E8F0',
              }}
            >
              <input
                type="radio"
                name="simActionModal"
                checked={simulationAction === 'CANCELLED'}
                onChange={() => setSimulationAction('CANCELLED')}
                style={{ accentColor: '#FBBF24' }}
              />
              ⚠ User Cancel
            </label>
          </div>
        </div>

        {/* ================= RAZORPAY BRANDED HEADER ================= */}
        <div
          style={{
            backgroundColor: '#0C2340',
            background: 'linear-gradient(135deg, #0C2340 0%, #17375E 100%)',
            color: '#FFFFFF',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: '#3399CC',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '900',
                fontSize: '1.25rem',
                boxShadow: '0 4px 10px rgba(51, 153, 204, 0.4)',
              }}
            >
              R
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: '800', letterSpacing: '-0.2px' }}>
                  AgriProducts Marketplace
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    backgroundColor: 'rgba(51, 153, 204, 0.25)',
                    color: '#67C5F7',
                    border: '1px solid #3399CC',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: '700',
                  }}
                >
                  RAZORPAY SECURE
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px' }}>
                Order #{order.order_number} • Demo Checkout
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '700' }}>
                Amount to Pay
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#FFFFFF' }}>
                ₹{formattedAmount}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={processing}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#FFFFFF',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: processing ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
              title="Close payment window"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ================= DEMO DISCLAIMER STRIP ================= */}
        <div
          style={{
            backgroundColor: '#FEF9EC',
            borderBottom: '1px solid #FDE68A',
            padding: '8px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.76rem',
            color: '#92400E',
            fontWeight: '600',
          }}
        >
          <AlertTriangle size={15} color="#D97706" style={{ flexShrink: 0 }} />
          <span>🎭 <strong>DEMO MODE:</strong> No real bank deduction. Choose "Test Success" above to simulate an approved payment.</span>
        </div>

        {/* Error message alert inside modal */}
        {errorMessage && (
          <div
            style={{
              backgroundColor: '#FEF2F2',
              borderBottom: '1px solid #FCA5A5',
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              fontSize: '0.82rem',
              color: '#B91C1C',
              fontWeight: '600',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <XCircle size={17} color="#DC2626" style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
            {simulationAction !== 'SUCCESS' && (
              <button
                type="button"
                onClick={() => {
                  setSimulationAction('SUCCESS');
                  setErrorMessage('');
                }}
                style={{
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '0.74rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                Switch to Test Success
              </button>
            )}
          </div>
        )}

        {/* ================= MAIN RAZORPAY BODY (2 COLUMNS) ================= */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '230px 1fr',
            flex: '1',
            overflowY: 'auto',
            minHeight: '380px',
          }}
        >
          {/* Left Column: Payment Options List */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRight: '1px solid #E2E8F0',
              padding: '14px 10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', padding: '6px 10px' }}>
              Payment Modes
            </div>

            {/* UPI Option */}
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: paymentMethod === 'upi' ? '#FFFFFF' : 'transparent',
                color: paymentMethod === 'upi' ? '#0C2340' : '#475569',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: paymentMethod === 'upi' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                borderLeft: paymentMethod === 'upi' ? '4px solid #3399CC' : '4px solid transparent',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <QrCode size={17} color={paymentMethod === 'upi' ? '#3399CC' : '#64748B'} />
                <span>UPI / QR</span>
              </div>
              {paymentMethod === 'upi' && <ChevronRight size={15} color="#3399CC" />}
            </button>

            {/* Card Option */}
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: paymentMethod === 'card' ? '#FFFFFF' : 'transparent',
                color: paymentMethod === 'card' ? '#0C2340' : '#475569',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: paymentMethod === 'card' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                borderLeft: paymentMethod === 'card' ? '4px solid #3399CC' : '4px solid transparent',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={17} color={paymentMethod === 'card' ? '#3399CC' : '#64748B'} />
                <span>Cards (Debit/Credit)</span>
              </div>
              {paymentMethod === 'card' && <ChevronRight size={15} color="#3399CC" />}
            </button>

            {/* Net Banking */}
            <button
              type="button"
              onClick={() => setPaymentMethod('netbanking')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: paymentMethod === 'netbanking' ? '#FFFFFF' : 'transparent',
                color: paymentMethod === 'netbanking' ? '#0C2340' : '#475569',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: paymentMethod === 'netbanking' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                borderLeft: paymentMethod === 'netbanking' ? '4px solid #3399CC' : '4px solid transparent',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={17} color={paymentMethod === 'netbanking' ? '#3399CC' : '#64748B'} />
                <span>Net Banking</span>
              </div>
              {paymentMethod === 'netbanking' && <ChevronRight size={15} color="#3399CC" />}
            </button>

            {/* Wallets */}
            <button
              type="button"
              onClick={() => setPaymentMethod('wallet')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: paymentMethod === 'wallet' ? '#FFFFFF' : 'transparent',
                color: paymentMethod === 'wallet' ? '#0C2340' : '#475569',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: paymentMethod === 'wallet' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                borderLeft: paymentMethod === 'wallet' ? '4px solid #3399CC' : '4px solid transparent',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wallet size={17} color={paymentMethod === 'wallet' ? '#3399CC' : '#64748B'} />
                <span>Wallets</span>
              </div>
              {paymentMethod === 'wallet' && <ChevronRight size={15} color="#3399CC" />}
            </button>

            {/* Kisan Credit Card */}
            <button
              type="button"
              onClick={() => setPaymentMethod('kcc')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: paymentMethod === 'kcc' ? '#FFFFFF' : 'transparent',
                color: paymentMethod === 'kcc' ? '#0C2340' : '#475569',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: paymentMethod === 'kcc' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                borderLeft: paymentMethod === 'kcc' ? '4px solid #16A34A' : '4px solid transparent',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={17} color={paymentMethod === 'kcc' ? '#16A34A' : '#64748B'} />
                <span>KCC Agri Card</span>
              </div>
              {paymentMethod === 'kcc' && <ChevronRight size={15} color="#16A34A" />}
            </button>

            <div style={{ marginTop: 'auto', padding: '12px 10px', fontSize: '0.72rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#3399CC" />
              <span>Razorpay 256-bit SSL</span>
            </div>
          </div>

          {/* Right Column: Tab View */}
          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column' }}>
            {/* ================= TAB 1: UPI / QR ================= */}
            {paymentMethod === 'upi' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0C2340', margin: 0 }}>
                    Scan QR or Enter UPI ID
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Expires in: <strong style={{ color: '#D97706' }}>{formatTimer(qrTimer)}</strong>
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                    padding: '16px',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  {/* Generated QR Code Preview */}
                  <div
                    style={{
                      width: '120px',
                      height: '120px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      padding: '8px',
                      border: '1px solid #CBD5E1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      flexShrink: 0,
                    }}
                  >
                    <svg viewBox="0 0 100 100" width="104" height="104">
                      {/* Stylized QR Matrix */}
                      <rect x="0" y="0" width="30" height="30" fill="#0C2340" />
                      <rect x="5" y="5" width="20" height="20" fill="#FFFFFF" />
                      <rect x="10" y="10" width="10" height="10" fill="#0C2340" />

                      <rect x="70" y="0" width="30" height="30" fill="#0C2340" />
                      <rect x="75" y="5" width="20" height="20" fill="#FFFFFF" />
                      <rect x="80" y="10" width="10" height="10" fill="#0C2340" />

                      <rect x="0" y="70" width="30" height="30" fill="#0C2340" />
                      <rect x="5" y="75" width="20" height="20" fill="#FFFFFF" />
                      <rect x="10" y="80" width="10" height="10" fill="#0C2340" />

                      <circle cx="50" cy="50" r="14" fill="#3399CC" />
                      <text x="50" y="55" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">₹</text>

                      <rect x="36" y="10" width="8" height="8" fill="#0C2340" />
                      <rect x="48" y="10" width="8" height="8" fill="#0C2340" />
                      <rect x="10" y="36" width="8" height="8" fill="#0C2340" />
                      <rect x="22" y="48" width="8" height="8" fill="#0C2340" />
                      <rect x="70" y="40" width="8" height="8" fill="#0C2340" />
                      <rect x="82" y="52" width="8" height="8" fill="#0C2340" />
                      <rect x="40" y="76" width="8" height="8" fill="#0C2340" />
                      <rect x="64" y="76" width="8" height="8" fill="#0C2340" />
                      <rect x="76" y="84" width="8" height="8" fill="#0C2340" />
                    </svg>
                  </div>

                  <div style={{ flex: '1' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0C2340', marginBottom: '4px' }}>
                      Scan with any UPI App
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '10px' }}>
                      PhonePe, Google Pay, Paytm, BHIM or any banking app
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                        <span
                          key={app}
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '4px',
                            padding: '3px 8px',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            color: '#475569',
                          }}
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: '700' }}>
                    Or Enter Demo UPI ID
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. mobile@upi"
                      style={{ flex: '1', fontSize: '0.88rem' }}
                    />
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="btn btn-outline btn-sm"
                      style={{ gap: '4px', fontSize: '0.78rem' }}
                    >
                      {copiedUpi ? <Check size={14} color="#16A34A" /> : <Copy size={14} />}
                      {copiedUpi ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 2: CARDS ================= */}
            {paymentMethod === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0C2340', margin: 0 }}>
                    Credit / Debit Card
                  </h3>
                  <button
                    type="button"
                    onClick={handleQuickFillCard}
                    style={{
                      background: 'none',
                      border: '1px dashed #3399CC',
                      borderRadius: '4px',
                      padding: '3px 8px',
                      fontSize: '0.74rem',
                      fontWeight: '700',
                      color: '#3399CC',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Zap size={13} /> Auto-fill Test Card
                  </button>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '700' }}>
                    Card Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4111 1111 1111 1111"
                      style={{ letterSpacing: '1px', fontSize: '0.9rem', paddingRight: '56px' }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '0.68rem',
                        fontWeight: '800',
                        color: '#64748B',
                        backgroundColor: '#F1F5F9',
                        padding: '3px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      {getCardBrand()}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '700' }}>
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      maxLength={5}
                      style={{ fontSize: '0.9rem' }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '700' }}>
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      className="form-input"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      maxLength={4}
                      style={{ fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '700' }}>
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Farmer Name"
                    style={{ fontSize: '0.9rem' }}
                  />
                </div>
              </div>
            )}

            {/* ================= TAB 3: NET BANKING ================= */}
            {paymentMethod === 'netbanking' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0C2340', margin: 0 }}>
                  Select Bank
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {['HDFC', 'SBI', 'ICICI', 'Axis Bank', 'Kotak', 'Punjab NB'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      style={{
                        padding: '12px 10px',
                        borderRadius: '8px',
                        border: selectedBank === bank ? '2px solid #3399CC' : '1px solid #CBD5E1',
                        backgroundColor: selectedBank === bank ? '#F0F9FF' : '#FFFFFF',
                        color: selectedBank === bank ? '#0C2340' : '#475569',
                        fontWeight: '700',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '4px' }}>
                  Selected: <strong style={{ color: '#0C2340' }}>{selectedBank}</strong> (Simulated retail banking)
                </div>
              </div>
            )}

            {/* ================= TAB 4: WALLETS ================= */}
            {paymentMethod === 'wallet' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0C2340', margin: 0 }}>
                  Select Digital Wallet
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {['Paytm', 'PhonePe', 'Amazon Pay', 'MobiKwik'].map((wallet) => (
                    <button
                      key={wallet}
                      type="button"
                      onClick={() => setSelectedWallet(wallet)}
                      style={{
                        padding: '14px',
                        borderRadius: '8px',
                        border: selectedWallet === wallet ? '2px solid #3399CC' : '1px solid #CBD5E1',
                        backgroundColor: selectedWallet === wallet ? '#F0F9FF' : '#FFFFFF',
                        color: selectedWallet === wallet ? '#0C2340' : '#475569',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      {wallet}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB 5: KCC ================= */}
            {paymentMethod === 'kcc' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={18} color="#16A34A" />
                  <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0C2340', margin: 0 }}>
                    Kisan Credit Card (Agri Subsidy / Credit)
                  </h3>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>
                  Direct agricultural credit settlement backed by Government of India NABARD scheme.
                </p>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '700' }}>
                    16-Digit KCC Number
                  </label>
                  <input
                    type="text"
                    defaultValue="6071 8840 9104 2201"
                    className="form-input"
                    style={{ fontSize: '0.9rem' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '700' }}>
                    Registered Farmer Mobile Number
                  </label>
                  <input
                    type="text"
                    defaultValue={order?.customer_phone || '+91 9876543210'}
                    className="form-input"
                    readOnly
                    style={{ fontSize: '0.9rem', backgroundColor: '#F8FAFC' }}
                  />
                </div>
              </div>
            )}

            {/* ================= BOTTOM ACTION / SUBMIT BUTTON ================= */}
            <div style={{ marginTop: 'auto', paddingTop: '22px' }}>
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={processing || sessionLoading}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor:
                    simulationAction === 'SUCCESS'
                      ? '#3399CC'
                      : simulationAction === 'FAILED'
                      ? '#DC2626'
                      : '#D97706',
                  color: '#FFFFFF',
                  fontSize: '1rem',
                  fontWeight: '800',
                  cursor: processing || sessionLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 14px rgba(51, 153, 204, 0.4)',
                  transition: 'all 0.2s ease',
                  opacity: processing || sessionLoading ? 0.7 : 1,
                }}
              >
                <Lock size={18} />
                {processing
                  ? 'Authorizing Demo Payment...'
                  : sessionLoading
                  ? 'Connecting Gateway...'
                  : `[DEMO] Simulate ${simulationAction} — ₹${formattedAmount}`}
              </button>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '10px',
                  fontSize: '0.72rem',
                  color: '#64748B',
                }}
              >
                <ShieldCheck size={14} color="#16A34A" />
                <span>256-Bit SSL Encrypted Razorpay Sandbox Transaction</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PROCESSING OVERLAY INSIDE MODAL ================= */}
        {processing && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(12, 35, 64, 0.88)',
              backdropFilter: 'blur(3px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              padding: '24px',
              textAlign: 'center',
              color: '#FFFFFF',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: '4px solid rgba(255, 255, 255, 0.2)',
                borderTopColor: '#3399CC',
                animation: 'spin 0.9s linear infinite',
                marginBottom: '18px',
              }}
            />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '6px', color: '#FFFFFF' }}>
              🎭 Razorpay Demo Payment Processing
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#93C5FD', marginBottom: '8px' }}>
              {processingStage || 'Processing payment simulation...'}
            </p>
            <div
              style={{
                fontSize: '0.74rem',
                color: '#94A3B8',
                backgroundColor: 'rgba(255,255,255,0.08)',
                padding: '6px 14px',
                borderRadius: '6px',
                marginTop: '10px',
              }}
            >
              Order #{order.order_number} • Total ₹{formattedAmount}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default RazorpayModal;
