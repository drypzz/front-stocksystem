import React, { createContext, useState, useEffect } from "react";

import ToastService from "../services/toastservice";

import { getCart, saveCart } from "../services/cartStorage";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(getCart);

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  const addToCart = (product) => {
    const itemExists = cartItems.find(item => item.id === product.id);

    if (itemExists) {
      if (itemExists.quantity < product.quantity) {
        const nextCartItems = cartItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCartItems(nextCartItems);
        ToastService.show({ type: "success", message: `"${product.name}" adicionado ao carrinho!` });
      } else {
        ToastService.show({ type: "info", message: `Estoque máximo de "${product.name}" atingido.` });
      }
    } else {
      const nextCartItems = [...cartItems, { ...product, quantity: 1 }];
      setCartItems(nextCartItems);
      ToastService.show({ type: "success", message: `"${product.name}" adicionado ao carrinho!` });
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems(prevItems => {
      const itemToUpdate = prevItems.find(item => item.id === productId);
      const stockLimit = itemToUpdate.originalQuantity || itemToUpdate.quantity;

      if (newQuantity < 1) {
        return prevItems.filter(item => item.id !== productId);
      }
      if (newQuantity > stockLimit) {
        ToastService.show({ type: "info", message: "Quantidade máxima de estoque atingida." });
        return prevItems;
      }
      return prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    ToastService.show({ type: "info", message: "Item removido do carrinho." });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};