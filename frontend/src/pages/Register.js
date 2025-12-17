import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Register.css';

// Green color palette
const brandGradient = 'linear-gradient(135deg, #6bbf8a 0%, #4b9b6e 50%, #2e7d5c 100%)';

function Register() {
  const navigate = useNavigate();
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
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
          background: 'linear-gradient(135deg, #6bbf8a 0%, #4b9b6e 50%, #2e7d5c 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          cursor: 'pointer',
        }}>
            vezeeto
          </span>
        </Link>
        <div style={{ fontSize: 14, color: '#5a7a65', fontWeight: 500 }}>
          Your Medical Platform
        </div>
      </header>
      <div className="register-container">
        <div className="register-form">
        <h2>Create Account</h2>
        <p className="subtitle">Join our Medical Platform</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
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
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Register as</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          {formData.role === 'doctor' && (
            <>
              <div className="form-group">
                <label htmlFor="specialization">Specialization / التخصص</label>
                <select
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
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
              <div className="form-group">
                <label htmlFor="fees">Consultation Fees</label>
                <input
                  type="number"
                  id="fees"
                  name="fees"
                  value={formData.fees}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  required
                />
              </div>
            </>
          )}

          <button type="submit" className="register-button">
            Create Account
          </button>
        </form>

        <div className="register-link">
          <p>
            Already have an account? <a href="/login">Login here</a>
          </p>
        </div>
        </div>
      </div>
    </>
  );
}

export default Register;
