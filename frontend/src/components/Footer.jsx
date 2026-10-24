import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Truck, Award, HelpCircle, PhoneCall, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#132A13',
        color: '#E8F5E9',
        borderTop: '4px solid var(--color-light-green)',
        marginTop: '60px',
      }}
    >
      {/* Trust & Assurance Ribbon */}
      <div
        style={{
          backgroundColor: '#1B4332',
          padding: '24px 0',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  backgroundColor: 'rgba(82, 183, 136, 0.2)',
                  padding: '10px',
                  borderRadius: '12px',
                  color: 'var(--color-pale-green)',
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem' }}>100% Certified Genuine</h4>
                <p style={{ color: '#A3B18A', fontSize: '0.8rem' }}>Direct from authenticated manufacturers</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  backgroundColor: 'rgba(82, 183, 136, 0.2)',
                  padding: '10px',
                  borderRadius: '12px',
                  color: 'var(--color-pale-green)',
                }}
              >
                <Truck size={24} />
              </div>
              <div>
                <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem' }}>Farm Doorstep Delivery</h4>
                <p style={{ color: '#A3B18A', fontSize: '0.8rem' }}>Free shipping on orders above ₹999</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  backgroundColor: 'rgba(82, 183, 136, 0.2)',
                  padding: '10px',
                  borderRadius: '12px',
                  color: 'var(--color-pale-green)',
                }}
              >
                <Award size={24} />
              </div>
              <div>
                <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem' }}>Government Approved</h4>
                <p style={{ color: '#A3B18A', fontSize: '0.8rem' }}>CIB&RC and Seed Act compliance</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  backgroundColor: 'rgba(82, 183, 136, 0.2)',
                  padding: '10px',
                  borderRadius: '12px',
                  color: 'var(--color-pale-green)',
                }}
              >
                <HelpCircle size={24} />
              </div>
              <div>
                <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem' }}>Agronomist Advisory</h4>
                <p style={{ color: '#A3B18A', fontSize: '0.8rem' }}>Expert crop dosage guidance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{ padding: '48px 20px 32px 20px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '36px',
            marginBottom: '40px',
          }}
        >
          {/* Col 1: About */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-light-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#081C15',
                }}
              >
                <Sprout size={20} />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#FFFFFF' }}>AgriProducts</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#A3B18A', lineHeight: 1.6, marginBottom: '16px' }}>
              Empowering farmers with high-performance crop protection chemicals, certified hybrid seeds, specialized fertilizers, and precision farming tools.
            </p>
            <div style={{ fontSize: '0.85rem', color: '#D8F3DC' }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <PhoneCall size={14} color="#74C69D" /> 1800-425-AGRI (Toll Free)
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} color="#74C69D" /> support@agriproducts.com
              </p>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 style={{ color: '#FFFFFF', marginBottom: '16px', fontSize: '1rem' }}>Product Categories</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><Link to="/products?category=pesticides" style={{ color: '#A3B18A' }}>Pesticides & Insecticides</Link></li>
              <li><Link to="/products?category=herbicides" style={{ color: '#A3B18A' }}>Herbicides & Weedicides</Link></li>
              <li><Link to="/products?category=fungicides" style={{ color: '#A3B18A' }}>Fungicides & Disease Control</Link></li>
              <li><Link to="/products?category=fertilizers" style={{ color: '#A3B18A' }}>Water Soluble Fertilizers</Link></li>
              <li><Link to="/products?category=seeds" style={{ color: '#A3B18A' }}>High Yield Hybrid Seeds</Link></li>
            </ul>
          </div>

          {/* Col 3: More Categories */}
          <div>
            <h4 style={{ color: '#FFFFFF', marginBottom: '16px', fontSize: '1rem' }}>Farm Solutions</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><Link to="/products?category=plant-growth-products" style={{ color: '#A3B18A' }}>Plant Growth Regulators</Link></li>
              <li><Link to="/products?category=agricultural-tools" style={{ color: '#A3B18A' }}>Agricultural Hand Tools</Link></li>
              <li><Link to="/products?category=agricultural-equipment" style={{ color: '#A3B18A' }}>Sprayers & Irrigation Equipment</Link></li>
              <li><Link to="/products?category=organic-farming-products" style={{ color: '#A3B18A' }}>Certified Organic Inputs</Link></li>
              <li><Link to="/cart" style={{ color: '#A3B18A' }}>Shopping Cart & Summary</Link></li>
            </ul>
          </div>

          {/* Col 4: Safe Handling Notice */}
          <div>
            <h4 style={{ color: '#FFFFFF', marginBottom: '16px', fontSize: '1rem' }}>Agri Chemical Safety</h4>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                color: '#B7E4C7',
                lineHeight: 1.5,
                border: '1px solid rgba(82, 183, 136, 0.2)',
              }}
            >
              Always adhere to the recommended dilution ratios and wear Personal Protective Equipment (PPE). Store chemical containers away from domestic animals and food grain storage.
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.78rem',
            color: '#74C69D',
          }}
        >
          <div>
            © {new Date().getFullYear()} AgriProducts Marketplace Ltd. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Security: SHA-256 Encrypted</span>
            <span>Manual JWT Config Architecture Enabled</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
