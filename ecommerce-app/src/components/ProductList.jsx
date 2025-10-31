import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    // Mock data - Replace with API call
    const mockProducts = [
      { id: 1, name: 'Wireless Headphones', price: 99.99, category: 'electronics', image: 'https://via.placeholder.com/200', seller: 'TechStore', rating: 4.5 },
      { id: 2, name: 'Running Shoes', price: 129.99, category: 'sports', image: 'https://via.placeholder.com/200', seller: 'SportGear', rating: 4.2 },
      { id: 3, name: 'Smart Watch', price: 199.99, category: 'electronics', image: 'https://via.placeholder.com/200', seller: 'GadgetWorld', rating: 4.7 },
      { id: 4, name: 'Coffee Maker', price: 79.99, category: 'home', image: 'https://via.placeholder.com/200', seller: 'HomeEssentials', rating: 4.3 },
      { id: 5, name: 'Yoga Mat', price: 29.99, category: 'sports', image: 'https://via.placeholder.com/200', seller: 'FitLife', rating: 4.1 },
      { id: 6, name: 'Bluetooth Speaker', price: 59.99, category: 'electronics', image: 'https://via.placeholder.com/200', seller: 'AudioPro', rating: 4.4 }
    ];
    
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.seller.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by price range
    if (priceRange) {
      switch (priceRange) {
        case 'under50':
          filtered = filtered.filter(product => product.price < 50);
          break;
        case '50-100':
          filtered = filtered.filter(product => product.price >= 50 && product.price <= 100);
          break;
        case '100-200':
          filtered = filtered.filter(product => product.price > 100 && product.price <= 200);
          break;
        case 'over200':
          filtered = filtered.filter(product => product.price > 200);
          break;
        default:
          break;
      }
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, priceRange, products]);

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1>Products</h1>
          <p>Discover amazing products from our trusted sellers</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="row mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search products or sellers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="sports">Sports</option>
            <option value="home">Home & Garden</option>
            <option value="fashion">Fashion</option>
            <option value="beauty">Beauty</option>
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="">All Prices</option>
            <option value="under50">Under $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100-200">$100 - $200</option>
            <option value="over200">Over $200</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="row">
        {filteredProducts.map(product => (
          <div key={product.id} className="col-lg-4 col-md-6 mb-4">
            <div className="card product-card h-100">
              <img src={product.image} className="card-img-top" alt={product.name} style={{height: '200px', objectFit: 'cover'}} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text flex-grow-1">{product.description}</p>
                <div className="mb-2">
                  <span className="fw-bold text-primary">${product.price}</span>
                </div>
                <div className="mb-2">
                  <small className="text-muted">Sold by: {product.seller}</small>
                </div>
                <div className="mb-3">
                  <span className="badge bg-warning text-dark">
                    ⭐ {product.rating}
                  </span>
                </div>
                <div className="d-flex gap-2">
                  <Link 
                    to={`/buyer/products/${product.id}`}
                    className="btn btn-outline-primary btn-sm flex-fill"
                  >
                    View Details
                  </Link>
                  <button 
                    className="btn btn-primary btn-sm flex-fill"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-5">
          <h4>No products found</h4>
          <p>Try adjusting your search filters</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
