import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';

const CartSummary: React.FC = () => {
  //get cart info from context
  const { cartItems, totalItems, totalPrice } = useCart();

  //hook to navigate to other pages
  const navigate = useNavigate();

  //hide summary if cart is empty
  if (totalItems === 0) return null;

  return (
    //main container for cart summary with styling
    <div className="alert alert-dark d-flex justify-content-between align-items-center mb-4 shadow-sm" role="alert">
      
      {/*list of cart*/}
      <div>
        <strong>Your Cart:</strong>{' '}
        {cartItems.map((item, i) => (
          //cart item display
          <span key={item.book.BookID}>
            <em>{item.book.Title}</em> × {item.quantity}
            {/*add comma between items*/}
            {i < cartItems.length - 1 ? ', ' : ''}
          </span>
        ))}
      </div>

      {/*total price and view cart button*/}
      <div className="d-flex align-items-center gap-3">
        {/*display total price*/}
        <span className="fw-bold">${totalPrice.toFixed(2)}</span>

        {/*navigate to full cart page*/}
        <button
          className="btn btn-primary btn-sm fw-bold"
          onClick={() => navigate('/cart')}
        >
          View Cart ({totalItems})
        </button>
      </div>
    </div>
  );
};

//export component for use in other files
export default CartSummary;