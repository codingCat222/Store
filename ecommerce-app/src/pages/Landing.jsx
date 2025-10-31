import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingCart, 
  faStore, 
  faUserTie, 
  faSearch, 
  faLock, 
  faPercentage,
  faShieldAlt,
  faCheckCircle,
  faMoneyBillWave,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import './Landing.css';

const Landing = () => {
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqData = [
    {
      question: "How do I create an account?",
      answer: "Click on either 'Sign up as Buyer' or 'Sign up as Seller' button and follow the registration process."
    },
    {
      question: "What commission do you charge?",
      answer: "We charge only 5% commission on successful transactions to maintain and improve our platform."
    },
    {
      question: "How are payments secured?",
      answer: "We use industry-standard encryption and secure payment gateways to protect all transactions."
    },
    {
      question: "Can I be both a buyer and seller?",
      answer: "Yes! You can use the same account to both buy and sell products on our platform."
    }
  ];

  if (loading) {
    return (
      <div className="preloader">
        <div className="spinner"></div>
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-links">
          <button onClick={() => scrollToSection('home')} className="nav-link">
            Home
          </button>
          <button onClick={() => scrollToSection('about')} className="nav-link">
            About
          </button>
          <button onClick={() => scrollToSection('faq')} className="nav-link">
            FAQ
          </button>
        </div>
      </nav>

      {/* Home/Hero Section */}
      <section id="home" className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Buy and Sell with <span className="highlight">Ease</span>
            </h1>
            <p className="hero-subtitle">
              Connect directly with trusted sellers. Safe, secure, and simple trading platform.
            </p>
            <div className="hero-buttons">
              <Link to="/signup?role=buyer" className="btn btn-primary">
                <FontAwesomeIcon icon={faShoppingCart} /> Sign up as Buyer
              </Link>
              <Link to="/signup?role=seller" className="btn btn-secondary">
                <FontAwesomeIcon icon={faStore} /> Sign up as Seller
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faUserTie} />
              </div>
              <h3>Seller Posts Goods</h3>
              <p>Sellers create accounts and list their products with details and prices.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <h3>Buyer Discovers</h3>
              <p>Buyers search, filter, and find products they love from verified sellers.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faLock} />
              </div>
              <h3>Secure Payment</h3>
              <p>Buyers pay securely through our integrated payment system.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faPercentage} />
              </div>
              <h3>Low Commission</h3>
              <p>We take only 5% commission to maintain and improve the platform.</p>
            </div>
          </div>

          <div className="why-us">
            <h2 className="section-title">Why Choose Us?</h2>
            <div className="benefits-grid">
              <div className="benefit-item">
                <div className="benefit-icon">
                  <FontAwesomeIcon icon={faShieldAlt} />
                </div>
                <h4>Secure Payments</h4>
                <p>Your transactions are protected with industry-standard security.</p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <FontAwesomeIcon icon={faCheckCircle} />
                </div>
                <h4>Verified Sellers</h4>
                <p>All sellers undergo verification process for your safety.</p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <FontAwesomeIcon icon={faMoneyBillWave} />
                </div>
                <h4>Low Commission</h4>
                <p>Only 5% commission fee - one of the lowest in the market.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqData.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-question">
                  <h4>{faq.question}</h4>
                  <FontAwesomeIcon icon={activeFaq === index ? faChevronUp : faChevronDown} />
                </div>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;