import React, { createContext, useContext, useState, useEffect } from 'react';
import { RESTAURANT_INFO } from '../data/menuData';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('wings_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [kitchenNotes, setKitchenNotes] = useState('');
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('wings_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (newItem) => {
    setCartItems(prev => {
      // Create a unique cart item ID
      const cartItemId = newItem.cartItemId || `cart_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      return [...prev, { ...newItem, cartItemId, quantity: newItem.quantity || 1 }];
    });
    // Open drawer or show feedback
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setKitchenNotes('');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (item.unitTotal * (item.quantity || 1));
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartCount,
        subtotal,
        kitchenNotes,
        setKitchenNotes,
        isOrderSubmitted,
        setIsOrderSubmitted,
        lastOrderDetails,
        setLastOrderDetails,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
