import React, { createContext, useContext, useState, ReactNode } from 'react';

/*book in the store*/
export interface Book {
  BookID: number;
  Title: string;
  Author: string;
  Publisher: string;
  ISBN: string;
  Category: string;
  PageCount: number;
  Price: number;
}

/*item in cart with quantity*/
export interface CartItem {
  book: Book;
  quantity: number;
}

/*cart context structure*/
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: number) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

/*create context*/
const CartContext = createContext<CartContextType | undefined>(undefined);

/*provider for cart*/
export const CartProvider = ({ children }: { children: ReactNode }) => {
  /*cart state*/
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  /*add book to cart*/
  const addToCart = (book: Book) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.book.BookID === book.BookID);

      if (existing) {
        /*increase quantity if exists*/
        return prev.map(item =>
          item.book.BookID === book.BookID
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      /*add new item*/
      return [...prev, { book, quantity: 1 }];
    });
  };

  /*remove book from cart*/
  const removeFromCart = (bookId: number) => {
    setCartItems(prev => prev.filter(item => item.book.BookID !== bookId));
  };

  /*update item quantity*/
  const updateQuantity = (bookId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.book.BookID === bookId ? { ...item, quantity } : item
      )
    );
  };

  /*clear cart*/
  const clearCart = () => setCartItems([]);

  /*total items count*/
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  /*total price*/
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.book.Price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

/*use cart hook*/
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};