import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock data - Replace with API call
    const mockProducts = [
      { 
        id: 1, 
        name: 'Wireless Headphones', 
        price: 99.99, 
        category: 'electronics', 
        image: 'https://via.placeholder.com/100',
        stock: 15,
        status: 'active',
        sales: 25,
        featured: true,
        createdAt: '2024-01-01'
      },
      { 
        id: 2, 
        name: 'Bluetooth Speaker', 
        price: 59.99, 
        category: 'electronics', 
        image: 'https://via.placeholder.com/100',
        stock: 8,
        status: 'active',
        sales: 15,
        featured: false,
        createdAt: '2024-01-05'
      },
      { 
        id: 3, 
        name: 'Smart Watch', 
        price: 199.99, 
        category: 'electronics', 
        image: 'https://via.placeholder.com/100',
        stock: 0,
        status: 'out_of_stock',
        sales: 5,
        featured: true,
        createdAt: '2024-01-10'
      }
    ];
    
    setProducts(mockProducts);
  }, []);

  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    if (filter === 'active') return product.status === 'active';
    if (filter === 'out_of_stock') return product.status === 'out_of_stock';
    if (filter === 'featured') return product.featured;
    return true;
  });

  const handleStatusChange = (productId, newStatus) => {
    setProducts(prev => prev.map(product =>
      product.id === productId ? { ...product, status: newStatus } : product
    ));
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(product => product.id !== productId));
      alert('Product deleted successfully!');
    }
  };

  const toggleFeatured = (productId) => {
    setProducts(prev => prev.map(product =>
      product.id === productId ? { ...product, featured: !product.featured } : product
    ));
  };

  const getStatusBadge = (product) => {
    if (product.stock === 0) {
      return <span className="badge bg-danger">Out of Stock</span>;
    }
    return <span className="badge bg-success">Active</span>;
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1>Manage Products</h1>
              <p>View and manage your product listings</p>
            </div>
            <Link to="/seller/products/add" className="btn btn-primary">
              ➕ Add New Product
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex gap-3 flex-wrap">
                <button
                  className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('all')}
                >
                  All Products
                </button>
                <button
                  className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('active')}
                >
                  Active
                </button>
                <button
                  className={`btn ${filter === 'out_of_stock' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('out_of_stock')}
                >
                  Out of Stock
                </button>
                <button
                  className={`btn ${filter === 'featured' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('featured')}
                >
                  Featured
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Sales</th>
                      <th>Status</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="rounded me-3"
                              style={{width: '50px', height: '50px', objectFit: 'cover'}}
                            />
                            <div>
                              <strong>{product.name}</strong>
                              <br />
                              <small className="text-muted">{product.category}</small>
                            </div>
                          </div>
                        </td>
                        <td>${product.price}</td>
                        <td>
                          <span className={product.stock === 0 ? 'text-danger' : ''}>
                            {product.stock}
                          </span>
                        </td>
                        <td>{product.sales}</td>
                        <td>{getStatusBadge(product)}</td>
                        <td>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={product.featured}
                              onChange={() => toggleFeatured(product.id)}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="dropdown">
                            <button
                              className="btn btn-outline-secondary btn-sm dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                            >
                              Actions
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <button className="dropdown-item">
                                  ✏️ Edit
                                </button>
                              </li>
                              <li>
                                <button 
                                  className="dropdown-item"
                                  onClick={() => handleStatusChange(
                                    product.id, 
                                    product.status === 'active' ? 'out_of_stock' : 'active'
                                  )}
                                >
                                  {product.status === 'active' ? '🛑 Mark Out of Stock' : '✅ Mark In Stock'}
                                </button>
                              </li>
                              <li><hr className="dropdown-divider" /></li>
                              <li>
                                <button 
                                  className="dropdown-item text-danger"
                                  onClick={() => handleDelete(product.id)}
                                >
                                  🗑️ Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-5">
                  <h4>No products found</h4>
                  <p>Get started by adding your first product</p>
                  <Link to="/seller/products/add" className="btn btn-primary">
                    Add Your First Product
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>{products.length}</h3>
              <p>Total Products</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>{products.filter(p => p.status === 'active').length}</h3>
              <p>Active Products</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>{products.filter(p => p.featured).length}</h3>
              <p>Featured Products</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>{products.reduce((sum, product) => sum + product.sales, 0)}</h3>
              <p>Total Sales</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;