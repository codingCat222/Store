import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <div className="card text-center py-5">
              <h3>Your cart is empty</h3>
              <p>Start shopping to add items to your cart</p>
              <Link to="/buyer/products" className="btn btn-primary">
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1>Shopping Cart</h1>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Cart Items ({cartItems.length})</h4>
                <button 
                  className="btn btn-outline-danger btn-sm"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
              </div>

              {cartItems.map(item => (
                <div key={item.id} className="row align-items-center mb-4 pb-4 border-bottom">
                  <div className="col-md-2">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="img-fluid rounded"
                      style={{width: '80px', height: '80px', objectFit: 'cover'}}
                    />
                  </div>
                  <div className="col-md-4">
                    <h6 className="mb-1">{item.name}</h6>
                    <small className="text-muted">Seller: {item.seller}</small>
                  </div>
                  <div className="col-md-2">
                    <span className="fw-bold">${item.price}</span>
                  </div>
                  <div className="col-md-2">
                    <div className="input-group input-group-sm">
                      <button 
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        className="form-control text-center"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                        min="1"
                      />
                      <button 
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <span className="fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="col-md-1">
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h4>Order Summary</h4>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>$5.00</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>${(getCartTotal() + 5 + (getCartTotal() * 0.08)).toFixed(2)}</strong>
              </div>

              <div className="d-grid gap-2">
                <Link to="/buyer/checkout" className="btn btn-primary btn-lg">
                  Proceed to Checkout
                </Link>
                <Link to="/buyer/products" className="btn btn-outline-primary">
                  Continue Shopping
                </Link>
              </div>

              <div className="mt-3">
                <small className="text-muted">
                  💡 5% commission will be deducted for platform maintenance
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;