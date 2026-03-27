import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';

/*cart page*/
const Cart: React.FC = () => {
  /*get cart data and functions*/
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  /*if cart is empty*/
  if (cartItems.length === 0) {
    return (
      <div className="container mt-5">
        <div className="text-center py-5">
          <div style={{ fontSize: '4rem' }}></div>
          <h3 className="mt-3 text-muted">Your cart is empty</h3>
          <p className="text-muted">Add some books to get started!</p>

          {/*go home*/}
          <button
            className="btn btn-dark mt-2"
            onClick={() => navigate('/')}
          >
            ← Browse Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* the header*/}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Shopping Cart</h2>

        {/*go back*/}
        <button
          className="btn btn-outline-dark"
          onClick={() => navigate(-1)}
        >
          ← Continue Shopping
        </button>
      </div>

      <div className="row g-4">
        {/*cart items list*/}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0">

            {/*cart header*/}
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
              <span>
                <strong>{totalItems}</strong> item{totalItems !== 1 ? 's' : ''}
              </span>

              {/*clear cart*/}
              <button
                className="btn btn-outline-light btn-sm"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>

            <div className="card-body p-0">
              {/*loop through items*/}
              {cartItems.map((item, index) => (
                <div
                  key={item.book.BookID}
                  className={`p-3 ${index < cartItems.length - 1 ? 'border-bottom' : ''}`}
                >
                  <div className="row align-items-center g-2">

                    {/*book info*/}
                    <div className="col-12 col-md-5">
                      <h6 className="fw-bold mb-0">{item.book.Title}</h6>
                      <small className="text-muted">{item.book.Author}</small>
                      <br />
                      <span className="badge bg-secondary mt-1">
                        {item.book.Category}
                      </span>
                    </div>

                    {/*price*/}
                    <div className="col-4 col-md-2 text-center">
                      <small className="text-muted d-block">Unit Price</small>
                      <span className="fw-semibold">
                        ${item.book.Price.toFixed(2)}
                      </span>
                    </div>

                    {/*quantity controls*/}
                    <div className="col-4 col-md-3">
                      <small className="text-muted d-block text-center mb-1">
                        Qty
                      </small>
                      <div className="input-group input-group-sm justify-content-center">
                        
                        {/*decrease*/}
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            updateQuantity(item.book.BookID, item.quantity - 1)
                          }
                        >
                          −
                        </button>

                        {/*quantity display*/}
                        <input
                          type="text"
                          className="form-control text-center"
                          style={{ maxWidth: '50px' }}
                          value={item.quantity}
                          readOnly
                        />

                        {/*increase*/}
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            updateQuantity(item.book.BookID, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/*subtotal*/}
                    <div className="col-3 col-md-1 text-center">
                      <small className="text-muted d-block">Subtotal</small>
                      <strong>
                        ${(item.book.Price * item.quantity).toFixed(2)}
                      </strong>
                    </div>

                    {/*remove item*/}
                    <div className="col-1 text-center">
                      <button
                        className="btn btn-link text-danger p-0"
                        title="Remove"
                        onClick={() => removeFromCart(item.book.BookID)}
                      >
                        ✕
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/*order summary*/}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm border-0 sticky-top" style={{ top: '1rem' }}>
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">Order Summary</h5>
            </div>

            <div className="card-body">

              {/*item breakdown*/}
              {cartItems.map(item => (
                <div
                  key={item.book.BookID}
                  className="d-flex justify-content-between mb-2 small"
                >
                  <span className="text-muted">
                    {item.book.Title.length > 22
                      ? item.book.Title.slice(0, 22) + '…'
                      : item.book.Title}{' '}
                    × {item.quantity}
                  </span>
                  <span>${(item.book.Price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <hr />

              {/*totals*/}
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Shipping</span>
                <span className="text-primary">Free</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Tax (8%)</span>
                <span>${(totalPrice * 0.08).toFixed(2)}</span>
              </div>

              <hr />

              {/*final total*/}
              <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                <span>Total</span>
                <span>${(totalPrice * 1.08).toFixed(2)}</span>
              </div>

              {/*checkout*/}
              <button className="btn btn-primary w-100 fw-bold mb-2">
                Proceed to Checkout
              </button>

              {/*back to shop*/}
              <button
                className="btn btn-outline-dark w-100"
                onClick={() => navigate('/')}
              >
                ← Continue Shopping
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;