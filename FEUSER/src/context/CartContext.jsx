import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatCartData = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) return [];
    return apiData.map(item => ({
      id: item.id,
      productId: item.product.id,
      name: item.product.name,
      image: item.colorVariant.image_urls?.[0] || item.product.image_url,
      color: item.colorVariant.name,
      size: item.sizeVariant.name,
      quantity: item.quantity,
      price: parseFloat(item.colorVariant.price) + parseFloat(item.sizeVariant.price),
      originalPrice: (parseFloat(item.colorVariant.price) + parseFloat(item.sizeVariant.price)) * 1.25
    }));
  };

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setCartItems([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3000/api/carts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.success) {
        const formattedItems = formatCartData(response.data.data);
        setCartItems(formattedItems);
      }
    } catch (err) {
      console.error("Lỗi khi tải giỏ hàng:", err);
      setError(err.response?.data?.message || 'Không thể tải giỏ hàng.');
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (cartItemPayload) => {
    if (!isAuthenticated) throw new Error("Vui lòng đăng nhập để thực hiện chức năng này.");
    setIsLoading(true);
    try {
      await axios.post('http://localhost:3000/api/carts', cartItemPayload, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await fetchCart();
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      setError(err.response?.data?.message || 'Thêm vào giỏ hàng thất bại.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (itemId, newQuantity) => {
    setIsLoading(true);
    try {
      await axios.put(`http://localhost:3000/api/carts/${itemId}`, { quantity: newQuantity }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await fetchCart();
    } catch (err) {
      console.error("Lỗi khi cập nhật giỏ hàng:", err);
      setError(err.response?.data?.message || 'Cập nhật giỏ hàng thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:3000/api/carts/${itemId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await fetchCart();
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
      setError(err.response?.data?.message || 'Xóa sản phẩm thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartItemCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cartItems]);

  const value = {
    cartItems,
    isLoading,
    error,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    cartItemCount,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};