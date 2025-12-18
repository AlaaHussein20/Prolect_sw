import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';
import Footer from '../components/Footer';

const Home = () => {
  const [isDark, setIsDark] = useState(false);

  const theme = isDark ? {
    appBg: 'linear-gradient(145deg, #0c1410 0%, #0f1c15 40%, #13261c 100%)',
    textPrimary: '#e8f2ea',
    textMuted: 'rgba(232,242,234,0.6)',
    headerBg: '#232b3e',
    headerBorder: '1px solid rgba(46,125,92,0.2)',
    logoGradient: 'linear-gradient(135deg, #a8d5ba 0%, #6bbf8a 50%, #4b9b6e 100%)',
    heroBg: 'linear-gradient(135deg, rgba(168,213,186,0.16) 0%, rgba(107,191,138,0.14) 50%, rgba(75,155,110,0.14) 100%)',
    heroBorder: '1px solid rgba(107,191,138,0.22)',
    cardBg: 'linear-gradient(135deg, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0.014) 100%)',
    cardBorder: '1px solid rgba(107,191,138,0.18)',
    primaryGradient: 'linear-gradient(135deg, rgba(107,191,138,0.95) 0%, rgba(75,155,110,0.95) 100%)',
  } : {
    appBg: 'linear-gradient(145deg, #f4fff7 0%, #eef9f2 40%, #e4f2e9 100%)',
    textPrimary: '#0f1a14',
    textMuted: 'rgba(15,26,20,0.7)',
    headerBg: 'rgba(255, 255, 255, 0.95)',
    headerBorder: '1px solid rgba(75,155,110,0.15)',
    logoGradient: 'linear-gradient(135deg, #6bbf8a 0%, #4b9b6e 50%, #2e7d5c 100%)',
    heroBg: 'linear-gradient(135deg, rgba(168,213,186,0.32) 0%, rgba(107,191,138,0.26) 50%, rgba(75,155,110,0.22) 100%)',
    heroBorder: '1px solid rgba(107,191,138,0.3)',
    cardBg: 'rgba(255,255,255,0.9)',
    cardBorder: '1px solid rgba(107,191,138,0.2)',
    primaryGradient: 'linear-gradient(135deg, #6bbf8a 0%, #4b9b6e 100%)',
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.appBg, color: theme.textPrimary, fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Helvetica Neue', Arial, sans-serif" }}>
      {/* Toolbar Header */}
      <header style={{
        padding: '20px 48px',
        background: theme.headerBg,
        borderBottom: theme.headerBorder,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{
            fontSize: 26,
            fontWeight: 800,
            color: isDark ? '#a8d5ba' : '#4b9b6e',
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}>
            vezeeto
          </span>
        </Link>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link to="/about" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'transparent',
              border: 'none',
              color: theme.textPrimary,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              padding: '8px 12px',
              borderRadius: 8,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.background = isDark ? 'rgba(168,213,186,0.1)' : 'rgba(107,191,138,0.1)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              About Us
            </button>
          </Link>
          <button onClick={() => setIsDark(!isDark)} style={{
            background: isDark ? 'rgba(168,213,186,0.08)' : 'rgba(168,213,186,0.35)',
            border: isDark ? '1px solid rgba(168,213,186,0.24)' : '1px solid rgba(75,155,110,0.35)',
            color: isDark ? '#f4fffa' : '#0f1a14',
            padding: '10px 14px',
            borderRadius: 12,
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 14,
          }}>
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>
          <Link to="/login" style={{
            textDecoration: 'none',
            background: theme.primaryGradient,
            color: isDark ? '#0b1a12' : '#f6fff9',
            padding: '10px 18px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
          }}>
            Sign in
          </Link>
        </div>
      </header>

      <main style={{ padding: '40px 48px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Hero Section */}
        <section style={{ maxWidth: 1200, margin: '0 auto 48px' }}>
          <div style={{ padding: '48px 40px', borderRadius: 20, background: theme.heroBg, border: theme.heroBorder, textAlign: 'center' }}>
            <h1 style={{ margin: '0 0 16px 0', fontSize: '2.8rem', fontWeight: 800, color: theme.textPrimary, lineHeight: 1.2 }}>
              Find Your Perfect Doctor
            </h1>
            <p style={{ margin: '0 0 32px 0', color: theme.textMuted, fontSize: '1.15rem', maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
              vezeeto connects you with trusted healthcare professionals. Book appointments, manage your health records, and get expert care—all in one place.
            </p>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/register" style={{
                textDecoration: 'none',
                background: theme.primaryGradient,
                color: isDark ? '#0b1a12' : '#f6fff9',
                padding: '12px 24px',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 14,
              }}>
                Get Started
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={{ maxWidth: 1200, margin: '0 auto 48px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 32, fontSize: '2rem', color: theme.textPrimary, fontWeight: 700 }}>Why Choose vezeeto?</h2>
          <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <div style={{ padding: 28, borderRadius: 16, background: theme.cardBg, border: theme.cardBorder }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>🔍</div>
              <h3 style={{ margin: '0 0 12px 0', color: theme.textPrimary, fontSize: '1.25rem' }}>Find Specialists</h3>
              <p style={{ margin: 0, color: theme.textMuted, fontSize: 15, lineHeight: 1.6 }}>Browse doctors by specialization, experience, and patient reviews.</p>
            </div>
            <div style={{ padding: 28, borderRadius: 16, background: theme.cardBg, border: theme.cardBorder }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>📅</div>
              <h3 style={{ margin: '0 0 12px 0', color: theme.textPrimary, fontSize: '1.25rem' }}>Instant Booking</h3>
              <p style={{ margin: 0, color: theme.textMuted, fontSize: 15, lineHeight: 1.6 }}>Check real-time availability and book appointments in seconds.</p>
            </div>
            <div style={{ padding: 28, borderRadius: 16, background: theme.cardBg, border: theme.cardBorder }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>🔒</div>
              <h3 style={{ margin: '0 0 12px 0', color: theme.textPrimary, fontSize: '1.25rem' }}>Secure Records</h3>
              <p style={{ margin: 0, color: theme.textMuted, fontSize: 15, lineHeight: 1.6 }}>Your medical history and appointments are encrypted and private.</p>
            </div>
            <div style={{ padding: 28, borderRadius: 16, background: theme.cardBg, border: theme.cardBorder }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>💬</div>
              <h3 style={{ margin: '0 0 12px 0', color: theme.textPrimary, fontSize: '1.25rem' }}>Easy Management</h3>
              <p style={{ margin: 0, color: theme.textMuted, fontSize: 15, lineHeight: 1.6 }}>Reschedule, cancel, or view your appointment history anytime.</p>
            </div>
            <div style={{ padding: 28, borderRadius: 16, background: theme.cardBg, border: theme.cardBorder }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>⭐</div>
              <h3 style={{ margin: '0 0 12px 0', color: theme.textPrimary, fontSize: '1.25rem' }}>Trusted Network</h3>
              <p style={{ margin: 0, color: theme.textMuted, fontSize: 15, lineHeight: 1.6 }}>Connect with verified healthcare professionals across multiple fields.</p>
            </div>
            <div style={{ padding: 28, borderRadius: 16, background: theme.cardBg, border: theme.cardBorder }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>🏥</div>
              <h3 style={{ margin: '0 0 12px 0', color: theme.textPrimary, fontSize: '1.25rem' }}>All Specializations</h3>
              <p style={{ margin: 0, color: theme.textMuted, fontSize: 15, lineHeight: 1.6 }}>From cardiology to dermatology, find experts in every field.</p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section style={{ maxWidth: 1200, margin: '0 auto 48px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 32, fontSize: '2rem', color: theme.textPrimary, fontWeight: 700 }}>How It Works</h2>
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', textAlign: 'center' }}>
            <div style={{ padding: '24px 20px' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: theme.primaryGradient, color: isDark ? '#0b1a12' : '#f6fff9', fontWeight: 800, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>1</div>
              <h4 style={{ margin: '0 0 12px 0', color: theme.textPrimary, fontSize: '1.15rem' }}>Create Account</h4>
              <p style={{ margin: 0, color: theme.textMuted, fontSize: 14, lineHeight: 1.6 }}>Sign up as a patient or doctor in minutes.</p>
            </div>
            <div style={{ padding: '24px 20px' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: theme.primaryGradient, color: isDark ? '#0b1a12' : '#f6fff9', fontWeight: 800, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>2</div>
              <h4 style={{ margin: '0 0 12px 0', color: theme.textPrimary, fontSize: '1.15rem' }}>Search & Browse</h4>
              <p style={{ margin: 0, color: theme.textMuted, fontSize: 14, lineHeight: 1.6 }}>Find doctors by specialization and availability.</p>
            </div>
            <div style={{ padding: '24px 20px' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: theme.primaryGradient, color: isDark ? '#0b1a12' : '#f6fff9', fontWeight: 800, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>3</div>
              <h4 style={{ margin: '0 0 12px 0', color: theme.textPrimary, fontSize: '1.15rem' }}>Book & Confirm</h4>
              <p style={{ margin: 0, color: theme.textMuted, fontSize: 14, lineHeight: 1.6 }}>Select a time slot and confirm your appointment.</p>
            </div>
            <div style={{ padding: '24px 20px' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: theme.primaryGradient, color: isDark ? '#0b1a12' : '#f6fff9', fontWeight: 800, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>4</div>
              <h4 style={{ margin: '0 0 12px 0', color: theme.textPrimary, fontSize: '1.15rem' }}>Attend & Review</h4>
              <p style={{ margin: 0, color: theme.textMuted, fontSize: 14, lineHeight: 1.6 }}>Complete your visit and share your experience.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ maxWidth: 1200, margin: '0 auto 64px', textAlign: 'center', padding: '0 40px' }}>
          <div style={{ padding: 48, borderRadius: 20, background: theme.primaryGradient }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '2rem', color: isDark ? '#0b1a12' : '#f6fff9', fontWeight: 700 }}>Ready to Book Your Appointment?</h2>
            <p style={{ margin: 0, color: isDark ? 'rgba(11,26,18,0.8)' : 'rgba(246,255,249,0.9)', fontSize: '1.15rem', marginBottom: 24, lineHeight: 1.5 }}>
              Join thousands of patients who trust vezeeto for their healthcare needs.
            </p>
            <Link to="/register" style={{
              textDecoration: 'none',
              background: isDark ? '#e8f2ea' : '#0f1a14',
              color: isDark ? '#0f1a14' : '#e8f2ea',
              padding: '16px 40px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 17,
              display: 'inline-block',
              transition: 'transform 0.2s',
            }}>
              Create Free Account
            </Link>
          </div>
        </section>
      </main>

      <Footer theme={{
        appBg: isDark ? 'linear-gradient(145deg, #0c1410 0%, #0f1c15 40%, #13261c 100%)' : 'linear-gradient(145deg, #f4fff7 0%, #eef9f2 40%, #e4f2e9 100%)',
        textPrimary: isDark ? '#e8f2ea' : '#0f1a14',
        textMuted: isDark ? 'rgba(232,242,234,0.6)' : 'rgba(15,26,20,0.7)',
        headerBorder: isDark ? '1px solid rgba(46,125,92,0.2)' : '1px solid rgba(75,155,110,0.15)',
      }} />
    </div>
  );
};

export default Home;
