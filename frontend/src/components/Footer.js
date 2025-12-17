import React from 'react';

const Footer = ({ theme = {} }) => {
  const defaultTheme = {
    appBg: '#f4fff7',
    textPrimary: '#0f1a14',
    textMuted: 'rgba(15,26,20,0.7)',
    headerBorder: '1px solid rgba(75,155,110,0.15)',
    primaryGradient: 'linear-gradient(135deg, #6bbf8a 0%, #4b9b6e 100%)',
  };

  const finalTheme = { ...defaultTheme, ...theme };

  return (
    <footer
      style={{
        background: finalTheme.appBg,
        borderTop: finalTheme.headerBorder,
        padding: '24px 36px',
        marginTop: 'auto',
        color: finalTheme.textPrimary,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 24,
          maxWidth: '100%',
        }}
      >
        <div style={{ fontSize: 14, color: finalTheme.textMuted }}>
          &copy; 2025 Vezeeto Medical Platform. All rights reserved.
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <a
            href="tel:+201019981038"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: finalTheme.textPrimary,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.7')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            <span>📞</span>
            <span>01019981038</span>
          </a>

          <a
            href="mailto:bassel@gmail.com"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: finalTheme.textPrimary,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.7')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            <span>✉️</span>
            <span>bassel@gmail.com</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
