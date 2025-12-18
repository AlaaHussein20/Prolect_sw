import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Register.css';
import Footer from '../components/Footer';

const themes = {
  dark: {
    appBg: 'linear-gradient(145deg, #0c1410 0%, #0f1c15 40%, #13261c 100%)',
    textPrimary: '#e8f2ea',
    textMuted: 'rgba(232,242,234,0.6)',
    headerBg: '#1a2a1f',
    headerBorder: '1px solid rgba(46,125,92,0.2)',
    cardBg: 'rgba(255,255,255,0.06)',
    cardBorder: '1px solid rgba(107,191,138,0.18)',
    inputBg: 'rgba(255,255,255,0.08)',
    inputBorder: '1px solid rgba(107,191,138,0.2)',
  },
  light: {
    appBg: 'linear-gradient(145deg, #f4fff7 0%, #eef9f2 40%, #e4f2e9 100%)',
    textPrimary: '#0f1a14',
    textMuted: 'rgba(15,26,20,0.7)',
    headerBg: '#fff',
    headerBorder: '1px solid rgba(107,191,138,0.2)',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    cardBorder: '1px solid rgba(107,191,138,0.2)',
    inputBg: '#f8fff9',
    inputBorder: '1px solid rgba(75,155,110,0.2)',
  },
};

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    specialization: '',
    fees: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDark, setIsDark] = useState(localStorage.getItem('appTheme') === 'dark');
  const theme = isDark ? themes.dark : themes.light;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      // Register user
      const registerPayload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };
      if (formData.role === 'doctor') {
        registerPayload.specialization = formData.specialization;
        registerPayload.fees = formData.fees;
      }
      const res = await fetch('http://localhost:5001/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }


      // If doctor, check if doctorProfile was created
      if (formData.role === 'doctor' && !data.doctorProfile) {
        setError('User registered, but failed to create doctor profile.');
        return;
      }

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleThemeToggle = () => {
    setIsDark(!isDark);
    localStorage.setItem('appTheme', !isDark ? 'dark' : 'light');
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.appBg, transition: 'background 0.3s' }}>
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
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{
          fontSize: 26,
          fontWeight: 800,
          background: isDark 
            ? 'linear-gradient(135deg, #a8d5ba 0%, #6bbf8a 50%, #4b9b6e 100%)'
            : 'linear-gradient(135deg, #6bbf8a 0%, #4b9b6e 50%, #2e7d5c 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          cursor: 'pointer',
          transition: 'color 0.2s',
        }}>
            vezeeto
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ fontSize: 14, color: theme.textMuted, fontWeight: 500 }}>
            Your Medical Platform
          </div>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button style={{
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
          </Link>
          <Link to="/about" style={{ textDecoration: 'none' }}>
            <button style={{
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
              About Us
            </button>
          </Link>
          <button
            onClick={handleThemeToggle}
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
        </div>
      </header>
      <div style={{ minHeight: 'calc(100vh - 74px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', color: theme.textPrimary }}>
        <div style={{
          background: theme.cardBg,
          padding: '48px',
          borderRadius: '24px',
          boxShadow: '0 12px 36px rgba(75, 155, 110, 0.18)',
          width: '100%',
          maxWidth: '480px',
          position: 'relative',
          overflow: 'hidden',
          border: theme.cardBorder,
          backdropFilter: 'blur(10px)',
        }}>
        <h2 style={{ color: '#4b9b6e', margin: '0 0 12px 0', textAlign: 'center', fontSize: '34px', fontWeight: 700, textShadow: '0 2px 8px rgba(75, 155, 110, 0.1)' }}>Create Account</h2>
        <p style={{ color: theme.textMuted, margin: '0 0 36px 0', textAlign: 'center', fontWeight: 400, fontSize: '17px' }}>Join our Medical Platform</p>

        {error && <div style={{ background: 'rgba(220, 53, 69, 0.1)', border: '1px solid rgba(220, 53, 69, 0.3)', color: isDark ? '#ff8a9b' : '#c82333', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>{error}</div>}
        {success && <div style={{ background: 'rgba(40, 167, 69, 0.1)', border: '1px solid rgba(40, 167, 69, 0.3)', color: isDark ? '#90ee90' : '#155724', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px', position: 'relative', zIndex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', color: theme.textPrimary, fontWeight: 600, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }} htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: theme.inputBorder,
                borderRadius: '10px',
                background: theme.inputBg,
                color: theme.textPrimary,
                fontSize: '15px',
                boxSizing: 'border-box',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(107,191,138,0.2)'}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
              required
            />
          </div>

          <div style={{ marginBottom: '24px', position: 'relative', zIndex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', color: theme.textPrimary, fontWeight: 600, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }} htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: theme.inputBorder,
                borderRadius: '10px',
                background: theme.inputBg,
                color: theme.textPrimary,
                fontSize: '15px',
                boxSizing: 'border-box',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(107,191,138,0.2)'}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
              required
            />
          </div>

          <div style={{ marginBottom: '24px', position: 'relative', zIndex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', color: theme.textPrimary, fontWeight: 600, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }} htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: theme.inputBorder,
                borderRadius: '10px',
                background: theme.inputBg,
                color: theme.textPrimary,
                fontSize: '15px',
                boxSizing: 'border-box',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(107,191,138,0.2)'}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
              required
            />
          </div>

          <div style={{ marginBottom: '24px', position: 'relative', zIndex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', color: theme.textPrimary, fontWeight: 600, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }} htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: theme.inputBorder,
                borderRadius: '10px',
                background: theme.inputBg,
                color: theme.textPrimary,
                fontSize: '15px',
                boxSizing: 'border-box',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(107,191,138,0.2)'}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
              required
            />
          </div>

          <div style={{ marginBottom: '24px', position: 'relative', zIndex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', color: theme.textPrimary, fontWeight: 600, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }} htmlFor="role">Register as</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: theme.inputBorder,
                borderRadius: '10px',
                background: theme.inputBg,
                color: theme.textPrimary,
                fontSize: '15px',
                boxSizing: 'border-box',
                transition: 'all 0.2s',
              }}
              required
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          {formData.role === 'doctor' && (
            <>
              <div style={{ marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', color: theme.textPrimary, fontWeight: 600, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }} htmlFor="specialization">Specialization / التخصص</label>
                <select
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: theme.inputBorder,
                    borderRadius: '10px',
                    background: theme.inputBg,
                    color: theme.textPrimary,
                    fontSize: '15px',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s',
                  }}
                  required
                >
                  <option value="">Select specialization / اختر التخصص</option>
                  <option value="Dentistry">Dentistry - طب الأسنان</option>
                  <option value="Cardiology">Cardiology - أمراض القلب</option>
                  <option value="Dermatology">Dermatology - الجلدية</option>
                  <option value="Neurology">Neurology - الأعصاب</option>
                  <option value="Pediatrics">Pediatrics - الأطفال</option>
                  <option value="Orthopedics">Orthopedics - العظام</option>
                  <option value="Psychiatry">Psychiatry - الطب النفسي</option>
                  <option value="Gynecology">Gynecology - النساء والتوليد</option>
                  <option value="Ophthalmology">Ophthalmology - العيون</option>
                  <option value="ENT">ENT - الأنف والأذن والحنجرة</option>
                  <option value="General Medicine">General Medicine - باطنة عامة</option>
                </select>
              </div>
              <div style={{ marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', color: theme.textPrimary, fontWeight: 600, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }} htmlFor="fees">Consultation Fees</label>
                <input
                  type="number"
                  id="fees"
                  name="fees"
                  value={formData.fees}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: theme.inputBorder,
                    borderRadius: '10px',
                    background: theme.inputBg,
                    color: theme.textPrimary,
                    fontSize: '15px',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(107,191,138,0.2)'}
                  onBlur={(e) => e.target.style.boxShadow = 'none'}
                  required
                />
              </div>
            </>
          )}

          <button type="submit" style={{
            width: '100%',
            padding: '14px',
            background: '#6bbf8a',
            border: 'none',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s',
            position: 'relative',
            zIndex: 1,
          }}
          onMouseEnter={(e) => e.target.style.background = '#4b9b6e'}
          onMouseLeave={(e) => e.target.style.background = '#6bbf8a'}
          >
            Create Account
          </button>
        </form>

        <div style={{ marginTop: '28px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <p style={{ margin: 0, color: theme.textMuted, fontSize: '14px' }}>
            Already have an account? <a href="/login" style={{ color: '#4b9b6e', textDecoration: 'none', fontWeight: 600 }}>Login here</a>
          </p>
        </div>
        </div>
      </div>

      <Footer theme={{ appBg: theme.appBg, textPrimary: theme.textPrimary, textMuted: theme.textMuted, headerBorder: theme.headerBorder }} />
    </div>
  );
}

export default Register;
