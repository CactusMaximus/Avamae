import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo" onClick={closeMobileMenu}>
            <img src="/Logo.svg" alt="Company logo" className="logo-img" />
          </Link>

          {/* Mobile menu button */}
          <button 
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Navigation */}
          <nav className={`nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link 
              to="/about-us" 
              className={`nav-link ${location.pathname === '/about-us' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              About us
            </Link>
            <Link 
              to="/contact-us" 
              className={`nav-link ${location.pathname === '/contact-us' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Contact us
            </Link>
            <button className="btn btn-secondary sign-in-btn">
              Sign in
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 