import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './ProductDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faShoppingCart,
  faBolt,
  faTruck,
  faShieldAlt,
  faUndo,
  faHeart,
  faShare,
  faSpinner,
  faExclamationTriangle,
  faChevronLeft,
  faChevronRight,
  faUser,
  faCalendar
} from '@fortawesome/free-solid-svg-icons';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProductData();
  }, [id]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productResponse, reviewsResponse, relatedResponse] = await Promise.all([
        fetch(`/api/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`/api/products/${id}/reviews`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`/api/products/${id}/related`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (!productResponse.ok) {
        throw new Error('Failed to fetch product details');
      }

      const productData = await productResponse.json();
      const reviewsData = await reviewsResponse.json();
      const relatedData = await relatedResponse.json();

      setProduct(productData.product);
      setReviews(reviewsData.reviews || []);
      setRelatedProducts(relatedData.products || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching product data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      
      // Optional: Sync with backend
      await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity
        })
      });

      alert(`${quantity} ${product.name} added to cart!`);
    } catch (err) {
      alert('Failed to add item to cart: ' + err.message);
    }
  };

  const handleBuyNow = async () => {
    try {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }

      await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity
        })
      });

      window.location.href = '/buyer/checkout';
    } catch (err) {
      alert('Failed to proceed to checkout: ' + err.message);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId: product.id })
      });

      if (response.ok) {
        alert('Product added to wishlist!');
      } else {
        throw new Error('Failed to add to wishlist');
      }
    } catch (err) {
      alert('Failed to add to wishlist: ' + err.message);
    }
  };

  const handleShareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FontAwesomeIcon
        key={index}
        icon={faStar}
        className={index < rating ? 'star-filled' : 'star-empty'}
      />
    ));
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" className="loading-icon" />
        <h3>Loading product details...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-error">
        <FontAwesomeIcon icon={faExclamationTriangle} size="3x" className="error-icon" />
        <h3>Error Loading Product</h3>
        <p className="error-message">{error}</p>
        <button className="retry-btn" onClick={fetchProductData}>
          Try Again
        </button>
        <Link to="/buyer/products" className="back-to-products">
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <Link to="/buyer/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="product-detail">
      {/* Breadcrumb */}
      <nav className="breadcrumb-nav">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/buyer/products">
                <FontAwesomeIcon icon={faChevronLeft} className="me-1" />
                Products
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/buyer/products?category=${product.category}`}>
                {product.category}
              </Link>
            </li>
            <li className="breadcrumb-item active">{product.name}</li>
          </ol>
        </div>
      </nav>

      <div className="container">
        <div className="product-main">
          {/* Product Images */}
          <div className="product-gallery">
            <div className="main-image">
              <img 
                src={product.images?.[selectedImage] || product.image} 
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  e.target.src = '/images/placeholder-product.jpg';
                }}
              />
              {product.isNew && <span className="product-badge new">New</span>}
              {product.discount > 0 && (
                <span className="product-badge discount">-{product.discount}%</span>
              )}
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      onError={(e) => {
                        e.target.src = '/images/placeholder-product.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <div className="product-actions">
                <button className="action-btn wishlist-btn" onClick={handleAddToWishlist}>
                  <FontAwesomeIcon icon={faHeart} />
                </button>
                <button className="action-btn share-btn" onClick={handleShareProduct}>
                  <FontAwesomeIcon icon={faShare} />
                </button>
              </div>
            </div>

            <div className="product-meta">
              <div className="seller-info">
                <span className="seller-label">Sold by:</span>
                <Link to={`/seller/${product.sellerId}`} className="seller-name">
                  {product.seller}
                </Link>
                <div className="seller-rating">
                  {renderStars(product.sellerRating)}
                  <span>({product.sellerReviews} reviews)</span>
                </div>
              </div>
            </div>

            <div className="product-rating-overview">
              <div className="rating-score">
                <span className="score">{product.rating}</span>
                <div className="stars">{renderStars(product.rating)}</div>
                <span className="reviews-count">({product.reviews} reviews)</span>
              </div>
            </div>

            <div className="product-pricing">
              <div className="current-price">${product.price}</div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="original-price">${product.originalPrice}</div>
              )}
              {product.discount > 0 && (
                <div className="savings">Save ${(product.originalPrice - product.price).toFixed(2)}</div>
              )}
            </div>

            <div className="product-description">
              <p>{product.description}</p>
            </div>

            {product.features && product.features.length > 0 && (
              <div className="product-features">
                <h4>Key Features</h4>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>
                      <FontAwesomeIcon icon={faBolt} className="feature-icon" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Shipping & Returns */}
            <div className="product-benefits">
              <div className="benefit-item">
                <FontAwesomeIcon icon={faTruck} className="benefit-icon" />
                <div>
                  <strong>Free Shipping</strong>
                  <span>Delivery in 2-3 days</span>
                </div>
              </div>
              <div className="benefit-item">
                <FontAwesomeIcon icon={faUndo} className="benefit-icon" />
                <div>
                  <strong>30-Day Returns</strong>
                  <span>Easy return policy</span>
                </div>
              </div>
              <div className="benefit-item">
                <FontAwesomeIcon icon={faShieldAlt} className="benefit-icon" />
                <div>
                  <strong>Secure Payment</strong>
                  <span>Protected by our guarantee</span>
                </div>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="purchase-section">
              {product.inStock ? (
                <>
                  <div className="quantity-selector">
                    <label htmlFor="quantity">Quantity:</label>
                    <select 
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="quantity-dropdown"
                    >
                      {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                    <span className="stock-info">{product.stock} in stock</span>
                  </div>

                  <div className="action-buttons">
                    <button 
                      className="btn btn-primary add-to-cart-btn"
                      onClick={handleAddToCart}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                      Add to Cart
                    </button>
                    <button 
                      className="btn btn-success buy-now-btn"
                      onClick={handleBuyNow}
                    >
                      Buy Now
                    </button>
                  </div>
                </>
              ) : (
                <div className="out-of-stock">
                  <button className="btn btn-secondary" disabled>
                    Out of Stock
                  </button>
                  <button className="btn btn-outline-primary notify-btn">
                    Notify When Available
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="product-tabs">
          <div className="tab-content">
            <div className="tab-panel active" id="description">
              <h3>Product Description</h3>
              <div className="description-content">
                {product.fullDescription || product.description}
              </div>
              
              {product.specifications && (
                <div className="specifications">
                  <h4>Specifications</h4>
                  <div className="specs-grid">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="spec-item">
                        <span className="spec-label">{key}:</span>
                        <span className="spec-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="reviews-section">
            <h2>Customer Reviews</h2>
            <div className="reviews-summary">
              <div className="overall-rating">
                <div className="rating-score-large">
                  <span className="score">{product.rating}</span>
                  <div className="stars">{renderStars(product.rating)}</div>
                  <span className="reviews-count">{product.reviews} reviews</span>
                </div>
              </div>
              
              <div className="reviews-list">
                {reviews.slice(0, 5).map(review => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <FontAwesomeIcon icon={faUser} className="user-icon" />
                        <span className="reviewer-name">{review.userName}</span>
                      </div>
                      <div className="review-meta">
                        <div className="review-rating">
                          {renderStars(review.rating)}
                        </div>
                        <span className="review-date">
                          <FontAwesomeIcon icon={faCalendar} className="me-1" />
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="review-content">
                      <h4>{review.title}</h4>
                      <p>{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {reviews.length > 5 && (
              <div className="text-center mt-4">
                <Link to={`/products/${id}/reviews`} className="btn btn-outline-primary">
                  View All Reviews
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2>Related Products</h2>
            <div className="related-products-grid">
              {relatedProducts.map(relatedProduct => (
                <div key={relatedProduct.id} className="related-product-card">
                  <Link to={`/products/${relatedProduct.id}`}>
                    <img 
                      src={relatedProduct.image} 
                      alt={relatedProduct.name}
                      className="related-product-image"
                    />
                    <div className="related-product-info">
                      <h4>{relatedProduct.name}</h4>
                      <div className="related-product-price">${relatedProduct.price}</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;