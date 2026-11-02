import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);



  // ==========================================
  // Add product to cart
  // ==========================================
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.name === product.name
      );

      // If product already exists,
      // increase its quantity
      if (existingItem) {
        return prevItems.map((item) =>
          item.name === product.name
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      // Add new product
      return [
        ...prevItems,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // ==========================================
  // Update product quantity
  // ==========================================
  const updateQuantity = (productName, quantity) => {
    // Prevent quantity from becoming 0 or negative
    if (quantity < 1) {
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.name === productName
          ? {
              ...item,
              quantity: quantity,
            }
          : item
      )
    );
  };

  // ==========================================
  // Remove product completely
  // ==========================================
  const removeFromCart = (productName) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => item.name !== productName
      )
    );
  };

  // ==========================================
  // Clear entire cart
  // ==========================================
  const clearCart = () => {
    setCartItems([]);
  };

  // ==========================================
  // Total quantity of all products
  // ==========================================
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // ==========================================
  // Provide everything to the application
  // ==========================================
  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ==========================================
// Custom hook
// ==========================================
export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};