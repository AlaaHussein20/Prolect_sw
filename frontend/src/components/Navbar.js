import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="app-navbar">
      <div className="navbar-content">
        <div className="navbar-logo">
          <span className="logo-text">Vezeeta</span>
          <span className="logo-badge">.com</span>
        </div>
        <div className="navbar-links">
          <a href="/login" className="nav-link">Login</a>
          <a href="/register" className="nav-link">Register</a>
          <a href="/" className="nav-link">Home</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
