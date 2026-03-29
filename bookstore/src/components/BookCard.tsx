import React, { useEffect, useRef } from 'react';
import { Book, useCart } from '../CartContext';

//Props for the BookCard component
interface Props {
  book: Book;
}

const BookCard: React.FC<Props> = ({ book }) => {
  //get addToCart function and cart items from context
  const { addToCart, cartItems } = useCart();

  //ref for Bootstrap tooltip button
  const tooltipRef = useRef<HTMLButtonElement>(null);

  //check if the book is already in the cart
  const cartItem = cartItems.find(item => item.book.BookID === book.BookID);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  //NEW BOOTSTRAP FEATURE 2 TOOLTIP FEATURE
  //initialize tooltip showing quantity in cart or default message
  useEffect(() => {
    let tooltip: any = null;
    if (tooltipRef.current && (window as any).bootstrap) {
      tooltip = new (window as any).bootstrap.Tooltip(tooltipRef.current, {
        title: quantityInCart > 0
          ? `${quantityInCart} already in cart`
          : 'Add to your cart',
        placement: 'top',
        trigger: 'hover',
      });
    }
    //cleanup tooltip on unmount or change
    return () => {
      if (tooltip) tooltip.dispose();
    };
  }, [quantityInCart]);

  //define colors for book categories
  const categoryColor: Record<string, string> = {
    Action: 'secondary',
    Biography: 'secondary',
    'Self-Help': 'secondary',
    Historical: 'secondary',
    Classic: 'secondary',
    Technology: 'secondary',
    Business: 'secondary',
    'Christian Books': 'secondary',
    Thrillers: 'secondary',
  };

  //get badge color for this book's category
  const badgeColor = categoryColor[book.Category] || 'secondary';

  return (
    //main card container
    <div className="card h-100 shadow-sm border-0 book-card">

      {/*card header with category badge and quantity badge*/}
      <div className="card-header border-0 d-flex justify-content-between align-items-center bg-dark text-white">
        <span className={`badge bg-${badgeColor} rounded-pill`}>
          {book.Category}
        </span>

        {/*show badge if book is already in cart*/}
        {quantityInCart > 0 && (
          <span className="badge bg-primary rounded-circle">
            {quantityInCart}
          </span>
        )}
      </div>

      {/*card body with book details*/}
      <div className="card-body d-flex flex-column p-3">
        {/*Book Icon placeholder*/}
        <div
          className="text-center mb-2"
          style={{
            fontSize: '2.5rem',
            color: '#6c757d',
            lineHeight: 1,
          }}
        >
          {/*icon can be added here*/}
        </div>

        {/*book title*/}
        <h6
          className="card-title fw-bold mb-1"
          style={{
            fontSize: '0.9rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {book.Title}
        </h6>

        {/*book author*/}
        <p className="card-text text-muted mb-1" style={{ fontSize: '0.8rem' }}>
          <em>{book.Author}</em>
        </p>

        {/*book publisher*/}
        <p className="card-text text-muted mb-1" style={{ fontSize: '0.75rem' }}>
          {book.Publisher}
        </p>

        {/*page count*/}
        <p className="card-text text-muted mb-2" style={{ fontSize: '0.75rem' }}>
          {book.PageCount} pages
        </p>

        {/*price and add to cart button at bottom*/}
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center">
            {/*book price*/}
            <span className="fw-bold fs-5 text-dark">
              ${book.Price.toFixed(2)}
            </span>

            {/*add to cart button with tooltip*/}
            <button
              ref={tooltipRef}
              className="btn btn-primary btn-sm"
              onClick={() => addToCart(book)}
            >
              {quantityInCart > 0 ? '+ Add More' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

//export BookCard component
export default BookCard;