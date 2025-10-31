import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { getCartItemsCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark bg-dark ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand" to="/" onClick={closeMobileMenu}>
          🛍️ Cartlify
        </Link>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* Navigation Menu */}
        <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`} id="navbarNav">
          {/* Left Navigation */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item" >
              <Link 
                className="nav-link" 
                to="/" 
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link 
              className='nav-link'
              to="/"
              onClick={closeMobileMenu}
              >
                About
              </Link>
            </li>
            
            {/* Buyer Navigation */}
            {isAuthenticated && currentUser.role === 'buyer' && (
              <>
                <li className="nav-item">
                  <Link 
                    className="nav-link" 
                    to="/buyer/products" 
                    onClick={closeMobileMenu}
                  >
                    Products
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className="nav-link" 
                    to="/buyer/orders" 
                    onClick={closeMobileMenu}
                  >
                    Orders
                  </Link>
                </li>
              </>
            )}
            
            {/* Seller Navigation */}
            {isAuthenticated && currentUser.role === 'seller' && (
              <>
                <li className="nav-item">
                  <Link 
                    className="nav-link" 
                    to="/seller/dashboard" 
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className="nav-link" 
                    to="/seller/products" 
                    onClick={closeMobileMenu}
                  >
                    My Products
                  </Link>
                </li>
              </>
            )}
            
            {/* Admin Navigation */}
            {isAuthenticated && currentUser.role === 'admin' && (
              <>
                <li className="nav-item">
                  <Link 
                    className="nav-link" 
                    to="/admin/dashboard" 
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className="nav-link" 
                    to="/admin/users" 
                    onClick={closeMobileMenu}
                  >
                    Users
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Right Navigation */}
          <ul className="navbar-nav">
            {isAuthenticated ? (
              <>
                {/* Cart for Buyers */}
                {currentUser.role === 'buyer' && (
                  <li className="nav-item">
                    <Link 
                      className="nav-link position-relative" 
                      to="/buyer/cart" 
                      onClick={closeMobileMenu}
                    >
                      🛒 Cart
                      {getCartItemsCount() > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {getCartItemsCount()}
                        </span>
                      )}
                    </Link>
                  </li>
                )}
                
                {/* User Dropdown */}
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle" 
                    href="#" 
                    role="button" 
                    data-bs-toggle="dropdown"
                    onClick={(e) => e.preventDefault()}
                  >
                    👋 {currentUser.name}
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <span className="dropdown-item-text">
                        Role: <strong className="text-capitalize">{currentUser.role}</strong>
                      </span>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item" 
                        onClick={() => {
                          closeMobileMenu();
                          handleLogout();
                        }}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              /* Authentication Links */
              <>
                <li className="nav-item">
                  <Link 
                    className="nav-link" 
                    to="/login" 
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className="nav-link" 
                    to="/signup" 
                    onClick={closeMobileMenu}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;