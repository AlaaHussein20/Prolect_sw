import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const themes = {
  dark: {
    appBg: 'linear-gradient(145deg, #0c1410 0%, #0f1c15 40%, #13261c 100%)',
    textPrimary: '#e8f2ea',
    textMuted: 'rgba(232,242,234,0.6)',
    headerBorder: '1px solid rgba(46,125,92,0.2)',
    cardBg: 'linear-gradient(135deg, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0.014) 100%)',
    cardBorder: '1px solid rgba(107,191,138,0.18)',
    primaryGradient: 'linear-gradient(135deg, rgba(107,191,138,0.95) 0%, rgba(75,155,110,0.95) 100%)',
    primaryText: '#0b1a12',
    inputBorder: '1px solid rgba(255,255,255,0.12)',
    inputBg: 'rgba(255,255,255,0.06)',
  },
  light: {
    appBg: 'linear-gradient(145deg, #f4fff7 0%, #eef9f2 40%, #e4f2e9 100%)',
    textPrimary: '#0f1a14',
    textMuted: 'rgba(15,26,20,0.7)',
    headerBorder: '1px solid rgba(75,155,110,0.15)',
    cardBg: 'rgba(255,255,255,0.9)',
    cardBorder: '1px solid rgba(107,191,138,0.2)',
    primaryGradient: 'linear-gradient(135deg, #6bbf8a 0%, #4b9b6e 100%)',
    primaryText: '#f6fff9',
    inputBorder: '1px solid rgba(75,155,110,0.2)',
    inputBg: '#f8fff9',
  },
};

const AboutUs = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(localStorage.getItem('appTheme') === 'dark');
  
  const handleThemeChange = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('appTheme', newIsDark ? 'dark' : 'light');
  };
  
  const theme = isDark ? themes.dark : themes.light;

  return (
    <div style={{ minHeight: '100vh', background: theme.appBg, color: theme.textPrimary, fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Helvetica Neue', Arial, sans-serif" }}>
      {/* Header */}
      <header style={{
        padding: '20px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: theme.headerBorder,
        flexWrap: 'wrap',
        gap: 16,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: isDark ? '#1a2a1f' : '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{
            fontSize: 26,
            fontWeight: 800,
            background: isDark
              ? 'linear-gradient(135deg, #a8d5ba 0%, #6bbf8a 50%, #4b9b6e 100%)'
              : 'linear-gradient(135deg, #6bbf8a 0%, #4b9b6e 50%, #2e7d5c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'pointer',
            onClick: () => navigate('/'),
          }}>
            vezeeto
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ fontSize: 14, color: theme.textMuted, fontWeight: 500 }}>
            Your Medical Platform
          </div>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#4b9b6e',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              padding: '8px 12px',
              borderRadius: 8,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(107,191,138,0.1)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            Home
          </button>
          <button
            onClick={() => navigate('/about')}
            style={{
              background: 'rgba(107,191,138,0.2)',
              border: '1px solid rgba(107,191,138,0.3)',
              color: theme.textPrimary,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              padding: '8px 12px',
              borderRadius: 8,
              transition: 'all 0.2s',
            }}
          >
            About Us
          </button>
          <button
            onClick={() => handleThemeChange(!isDark)}
            style={{
              background: 'transparent',
              border: `1px solid ${theme.textMuted}`,
              color: theme.textPrimary,
              cursor: 'pointer',
              fontSize: 18,
              padding: '6px 10px',
              borderRadius: 8,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(107,191,138,0.1)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: theme.primaryGradient,
              border: 'none',
              color: theme.primaryText,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              padding: '10px 16px',
              borderRadius: 8,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.target.opacity = '0.9'}
            onMouseLeave={(e) => e.target.opacity = '1'}
          >
            Login
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '56px 48px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {/* Hero Section */}
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <h1 style={{ fontSize: 52, fontWeight: 800, marginBottom: 20, background: theme.primaryGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2 }}>
              About Vezeeto
            </h1>
            <p style={{ fontSize: 19, color: theme.textMuted, maxWidth: 720, margin: '0 auto', lineHeight: 1.6 }}>
              Your trusted medical platform connecting patients with healthcare professionals for seamless appointment booking and medical consultations.
            </p>
          </div>

          {/* Mission & Vision */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, marginBottom: 72 }}>
            <div style={{
              background: theme.cardBg,
              border: theme.cardBorder,
              padding: 40,
              borderRadius: 20,
              transition: 'all 0.3s',
            }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 18, color: '#4b9b6e' }}>🎯 Our Mission</h2>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: theme.textMuted }}>
                To revolutionize healthcare accessibility by providing a seamless, user-friendly platform that connects patients with qualified healthcare professionals, making quality medical consultations accessible to everyone.
              </p>
            </div>

            <div style={{
              background: theme.cardBg,
              border: theme.cardBorder,
              padding: 40,
              borderRadius: 20,
              transition: 'all 0.3s',
            }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 18, color: '#4b9b6e' }}>💡 Our Vision</h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: theme.textMuted }}>
                To create a world where every individual has access to quality healthcare services regardless of geographical barriers, creating a bridge between patients and medical experts.
              </p>
            </div>

            <div style={{
              background: theme.cardBg,
              border: theme.cardBorder,
              padding: 40,
              borderRadius: 20,
              transition: 'all 0.3s',
            }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 18, color: '#4b9b6e' }}>✨ Our Values</h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: theme.textMuted }}>
                Integrity, transparency, and patient-centric care. We prioritize security, privacy, and the highest standards of healthcare service delivery.
              </p>
            </div>
          </div>

          {/* Features */}
          <div style={{ marginBottom: 72 }}>
            <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 40, textAlign: 'center', color: theme.textPrimary }}>Why Choose Vezeeto?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
              {[
                { icon: '🏥', title: 'Expert Doctors', desc: 'Access to certified and experienced healthcare professionals' },
                { icon: '📅', title: 'Easy Booking', desc: 'Simple and quick appointment scheduling system' },
                { icon: '🔒', title: 'Secure & Private', desc: 'Your medical data is protected with advanced encryption' },
                { icon: '⏰', title: '24/7 Available', desc: 'Book appointments anytime, anywhere' },
                { icon: '💬', title: 'Communication', desc: 'Direct communication with your healthcare provider' },
                { icon: '📊', title: 'Health Records', desc: 'Maintain your appointment history and medical notes' },
              ].map((feature, idx) => (
                <div key={idx} style={{
                  background: theme.cardBg,
                  border: theme.cardBorder,
                  padding: 32,
                  borderRadius: 16,
                  textAlign: 'center',
                  transition: 'all 0.3s',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{ fontSize: 44, marginBottom: 16 }}>{feature.icon}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: theme.textPrimary }}>{feature.title}</h3>
                  <p style={{ fontSize: 15, color: theme.textMuted, lineHeight: 1.6 }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div style={{
            background: theme.primaryGradient,
            padding: 56,
            borderRadius: 20,
            textAlign: 'center',
            color: theme.primaryText,
            marginTop: 72,
          }}>
            <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 18 }}>Ready to Get Started?</h2>
            <p style={{ fontSize: 18, marginBottom: 28, opacity: 0.9, lineHeight: 1.6 }}>
              Join thousands of patients who trust Vezeeto for their healthcare needs.
            </p>
            <button
              onClick={() => navigate('/register')}
              style={{
                background: theme.primaryText === '#0b1a12' ? '#fff' : '#0b1a12',
                color: theme.primaryText === '#0b1a12' ? '#4b9b6e' : '#fff',
                border: 'none',
                padding: '16px 40px',
                borderRadius: 12,
                fontSize: 17,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.target.opacity = '0.9'}
              onMouseLeave={(e) => e.target.opacity = '1'}
            >
              Register Now
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: 64,
        padding: '32px 36px',
        borderTop: theme.headerBorder,
        textAlign: 'center',
        color: theme.textMuted,
        fontSize: 14,
      }}>
        <p>© 2025 Vezeeto. All rights reserved. Your health is our priority.</p>
      </footer>
    </div>
  );
};

export default AboutUs;
