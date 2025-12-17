import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';
import Footer from '../components/Footer';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5001/api/users/login', formData);
      const { token, user } = response.data;
      
      // Store the token and user data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect based on user role
      if (user.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <>
      <header style={{
        padding: '16px 36px',
        background: 'rgba(255, 255, 255, 0.95)',
        borderBottom: '1px solid rgba(107, 191, 138, 0.2)',
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
          color: '#4b9b6e',
          cursor: 'pointer',
          transition: 'color 0.2s',
        }}>
            vezeeto
          </span>
        </Link>
        <div style={{ fontSize: 14, color: '#5a7a65', fontWeight: 500 }}>
          Your Medical Platform
        </div>
      </header>
      <div className="login-container">
        <div className="login-box">
        <h1>Welcome Back</h1>
        <h3>Login to Your Account</h3>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="additional-options">
          <a href="/forgot-password">Forgot Password?</a>
          <p>
            Don't have an account? <a href="/register">Register Now</a>
          </p>
        </div>
      </div>
      </div>

      <Footer theme={{ appBg: 'rgba(255, 255, 255, 0.95)', textPrimary: '#0f1a14', textMuted: 'rgba(15,26,20,0.7)', headerBorder: '1px solid rgba(107,191,138,0.2)' }} />
    </>
  );
};

export default Login;
