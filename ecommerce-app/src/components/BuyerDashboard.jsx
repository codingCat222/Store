import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BuyerDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingBag,
  faClock,
  faShoppingCart,
  faHeart,
  faEye,
  faBox,
  faTruck,
  faCheckCircle,
  faSearch,
  faStar,
  faUsers,
  faChartLine,
  faGift,
  faFire,
  faSpinner,
  faExclamationTriangle,
  faRedo
} from '@fortawesome/free-solid-svg-icons';
import './BuyerDashboard.css';

const BuyerDashboard = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [productsResponse, ordersResponse, statsResponse] = await Promise.all([
        fetch('/api/buyer/dashboard/featured-products', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('/api/buyer/dashboard/recent-orders', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('/api/buyer/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (!productsResponse.ok || !ordersResponse.ok || !statsResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const productsData = await productsResponse.json();
      const ordersData = await ordersResponse.json();
      const statsData = await statsResponse.json();

      setFeaturedProducts(productsData.products || []);
      setRecentOrders(ordersData.orders || []);
      setStats(statsData.stats || {});
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'delivered': { class: 'status-delivered', icon: faCheckCircle, text: 'Delivered' },
      'shipped': { class: 'status-shipped', icon: faTruck, text: 'Shipped' },
      'processing': { class: 'status-processing', icon: faClock, text: 'Processing' },
      'pending': { class: 'status-processing', icon: faClock, text: 'Pending' },
      'cancelled': { class: 'status-cancelled', icon: faTimesCircle, text: 'Cancelled' },
      'completed': { class: 'status-delivered', icon: faCheckCircle, text: 'Completed' }
    };
    
    const config = statusConfig[status] || { class: 'status-default', icon: faClock, text: status };
    
    return (
      <span className={`status-badge ${config.class}`}>
        <FontAwesomeIcon icon={config.icon} />
        {config.text}
      </span>
    );
  };

  const getProductBadge = (product) => {
    if (product.isFeatured) {
      return <span className="product-badge featured">Featured</span>;
    }
    if (product.isNew) {
      return <span className="product-badge new">New</span>;
    }
    if (product.isTrending) {
      return <span className="product-badge trending">Trending</span>;
    }
    if (product.discount > 0) {
      return <span className="product-badge discount">-{product.discount}%</span>;
    }
    return null;
  };

  const handleQuickAction = async (action, data = null) => {
    try {
      switch (action) {
        case 'add_to_cart':
          const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId: data.productId, quantity: 1 })
          });
          
          if (response.ok) {
            alert('Product added to cart!');
          }
          break;
        
        case 'track_order':
          window.open(`/tracking/${data.orderId}`, '_blank');
          break;
          
        default:
          break;
      }
    } catch (err) {
      alert('Action failed: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="buyer-dashboard-loading">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" className="loading-icon" />
        <h3>Loading your dashboard...</h3>
        <p>Please wait while we load your personalized content</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="buyer-dashboard-error">
        <FontAwesomeIcon icon={faExclamationTriangle} size="3x" className="error-icon" />
        <h3>Error Loading Dashboard</h3>
        <p className="error-message">{error}</p>
        <button className="retry-btn" onClick={fetchDashboardData}>
          <FontAwesomeIcon icon={faRedo} className="me-2" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="buyer-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1 className="dashboard-title">
              <FontAwesomeIcon icon={faShoppingBag} className="title-icon" />
              Buyer Dashboard
            </h1>
            <p className="dashboard-subtitle">
              Welcome back! Discover amazing products from trusted sellers.
            </p>
          </div>
          <div className="header-stats">
            <div className="stat-item mini">
              <FontAwesomeIcon icon={faChartLine} className="stat-icon" />
              <div>
                <span className="stat-value">${stats.totalSpent?.toFixed(2) || '0.00'}</span>
                <span className="stat-label">Total Spent</span>
              </div>
            </div>
            <div className="stat-item mini">
              <FontAwesomeIcon icon={faGift} className="stat-icon" />
              <div>
                <span className="stat-value">${stats.savedAmount?.toFixed(2) || '0.00'}</span>
                <span className="stat-label">Saved</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card orders">
          <div className="stat-icon-wrapper">
            <FontAwesomeIcon icon={faShoppingBag} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalOrders || 0}</h3>
            <p className="stat-description">Total Orders</p>
          </div>
          <div className={`stat-trend ${(stats.orderTrend || 0) >= 0 ? 'positive' : 'negative'}`}>
            {stats.orderTrend >= 0 ? '+' : ''}{stats.orderTrend || 0}%
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon-wrapper">
            <FontAwesomeIcon icon={faClock} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.pendingOrders || 0}</h3>
            <p className="stat-description">Pending Orders</p>
          </div>
        </div>

        <div className="stat-card cart">
          <div className="stat-icon-wrapper">
            <FontAwesomeIcon icon={faShoppingCart} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.cartItems || 0}</h3>
            <p className="stat-description">Cart Items</p>
          </div>
        </div>

        <div className="stat-card favorites">
          <div className="stat-icon-wrapper">
            <FontAwesomeIcon icon={faHeart} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.favoriteSellers || 0}</h3>
            <p className="stat-description">Favorite Sellers</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <div className="section-header">
          <h2 className="section-title">
            <FontAwesomeIcon icon={faFire} className="section-icon" />
            Quick Actions
          </h2>
        </div>
        <div className="quick-actions-grid">
          <Link to="/buyer/products" className="quick-action-card primary">
            <FontAwesomeIcon icon={faSearch} className="action-icon" />
            <div className="action-content">
              <h4>Browse Products</h4>
              <p>Discover new items from sellers</p>
            </div>
          </Link>

          <Link to="/buyer/cart" className="quick-action-card secondary">
            <FontAwesomeIcon icon={faShoppingCart} className="action-icon" />
            <div className="action-content">
              <h4>View Cart</h4>
              <p>{stats.cartItems || 0} items waiting</p>
            </div>
          </Link>

          <Link to="/buyer/orders" className="quick-action-card secondary">
            <FontAwesomeIcon icon={faBox} className="action-icon" />
            <div className="action-content">
              <h4>My Orders</h4>
              <p>Track your purchases</p>
            </div>
          </Link>

          <Link to="/buyer/wishlist" className="quick-action-card secondary">
            <FontAwesomeIcon icon={faHeart} className="action-icon" />
            <div className="action-content">
              <h4>Wishlist</h4>
              <p>Your saved items</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <div className="featured-products-section">
          <div className="section-header">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faStar} className="section-icon" />
              Featured Products
            </h2>
            <Link to="/buyer/products" className="view-all-link">
              View All <FontAwesomeIcon icon={faEye} />
            </Link>
          </div>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-product.jpg';
                    }}
                  />
                  {getProductBadge(product)}
                  <button 
                    className="quick-add-btn"
                    onClick={() => handleQuickAction('add_to_cart', { productId: product.id })}
                  >
                    <FontAwesomeIcon icon={faShoppingCart} />
                  </button>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-seller">
                    <FontAwesomeIcon icon={faUsers} className="me-1" />
                    {product.seller}
                  </p>
                  <div className="product-rating">
                    <FontAwesomeIcon icon={faStar} className="star-icon" />
                    <span>{product.rating}</span>
                    <span className="reviews">({product.reviews})</span>
                  </div>
                  <div className="product-price">
                    <span className="current-price">${product.price}</span>
                    {product.originalPrice && (
                      <span className="original-price">${product.originalPrice}</span>
                    )}
                  </div>
                  <Link to={`/buyer/products/${product.id}`} className="view-details-btn">
                    <FontAwesomeIcon icon={faEye} className="me-2" />
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div className="recent-orders-section">
          <div className="section-header">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faClock} className="section-icon" />
              Recent Orders
            </h2>
            <Link to="/buyer/orders" className="view-all-link">
              View All <FontAwesomeIcon icon={faEye} />
            </Link>
          </div>
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td className="order-id">#{order.id}</td>
                    <td className="order-product">{order.product}</td>
                    <td className="order-date">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="order-items">{order.items}</td>
                    <td className="order-status">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="order-total">${order.total?.toFixed(2)}</td>
                    <td className="order-actions">
                      {order.status === 'shipped' && order.trackingNumber && (
                        <button 
                          className="action-btn track-btn"
                          onClick={() => handleQuickAction('track_order', { orderId: order.id })}
                        >
                          <FontAwesomeIcon icon={faTruck} />
                          Track
                        </button>
                      )}
                      <Link to={`/buyer/orders/${order.id}`} className="action-btn view-btn">
                        <FontAwesomeIcon icon={faEye} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty States */}
      {featuredProducts.length === 0 && recentOrders.length === 0 && (
        <div className="empty-dashboard">
          <FontAwesomeIcon icon={faShoppingBag} size="4x" className="empty-icon" />
          <h3>Welcome to Your Dashboard!</h3>
          <p>Start exploring products and make your first purchase to see your activity here.</p>
          <Link to="/buyer/products" className="cta-button">
            <FontAwesomeIcon icon={faSearch} className="me-2" />
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;