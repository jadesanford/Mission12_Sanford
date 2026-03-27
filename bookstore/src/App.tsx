import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { CartProvider, useCart } from './CartContext';
import BookList from './components/BookList';
import Cart from './components/Cart';
import './App.css';

//Navbar component showing site title and cart button
const Navbar: React.FC = () => {
  //get total items in cart from context
  const { totalItems } = useCart();

  //hook to navigate to other pages
  const navigate = useNavigate();

  return (
    //main navbar container with dark theme and sticky top
    <nav className="navbar navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        {/*site brand/title clickable to go to home*/}
        <span
          className="navbar-brand fw-bold fs-4"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Online Bookstore
        </span>

        {/*cart button with badge showing number of items*/}
        <button
          className="btn btn-primary position-relative"
          onClick={() => navigate('/cart')}
        >
          Cart
          {/*show badge only if there are items in cart*/}
          {totalItems > 0 && (
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: '0.65rem' }}
            >
              {totalItems}
              <span className="visually-hidden">items in cart</span>
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

//main App component with router and cart provider
function App() {
  return (
    //router for navigation
    <BrowserRouter>
      {/*provide cart context to children*/}
      <CartProvider>
        {/*navbar visible on all pages*/}
        <Navbar />
        {/*main page content container*/}
        <div className="container mt-4">
          <Routes>
            {/*home route showing book list*/}
            <Route path="/" element={<BookList />} />
            {/*cart page route*/}
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

//export App component for rendering
export default App;