import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  
  // Khởi tạo state: Ưu tiên lấy từ localStorage nếu là khách
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const localCart = window.localStorage.getItem('guestCart');
        return localCart ? JSON.parse(localCart) : [];
      } catch (error) {
        console.error("Lỗi khi đọc giỏ hàng từ localStorage", error);
        return [];
      }
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hàm này giữ nguyên, dùng để format dữ liệu từ API
  const formatCartData = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) return [];
    return apiData.map(item => {
      const basePrice = parseFloat(item.product.price) || 0;
      const colorPrice = parseFloat(item.colorVariant.price) || 0;
      const sizePrice = parseFloat(item.sizeVariant.price) || 0;
      const finalPrice = basePrice + colorPrice + sizePrice;
      const originalFinalPrice = finalPrice * 1.25;

      return {
        id: item.id,
        productId: item.product.id,
        colorProductId: item.color_product_id, 
        sizeProductId: item.size_product_id,  
        name: item.product.name,
        image: item.colorVariant.image_urls?.[0] || item.product.image_url,
        color: item.colorVariant.name,
        size: item.sizeVariant.name,
        quantity: item.quantity,
        price: finalPrice,
        originalPrice: originalFinalPrice
      };
    });
  };

  const fetchCart = useCallback(async () => {
    // Nếu đã đăng nhập, gọi API
    if (isAuthenticated && token) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('https://benodejs-9.onrender.com/api/carts', {
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
    } else {
      // Nếu là khách, tải từ localStorage (đã được thực hiện khi khởi tạo state)
      const localCart = window.localStorage.getItem('guestCart');
      setCartItems(localCart ? JSON.parse(localCart) : []);
    }
  }, [isAuthenticated, token]);

  // useEffect quan trọng: Đồng bộ giỏ hàng local lên server KHI người dùng đăng nhập
  useEffect(() => {
    const mergeLocalCartToServer = async () => {
        if (isAuthenticated && token) {
            const localCartString = window.localStorage.getItem('guestCart');
            const localCart = localCartString ? JSON.parse(localCartString) : [];

            if (localCart.length > 0) {
                setIsLoading(true);
                try {
                    const mergePromises = localCart.map(item => 
                        axios.post('https://benodejs-9.onrender.com/api/carts', {
                            product_id: item.productId,
                            color_product_id: item.colorProductId,
                            size_product_id: item.sizeProductId,
                            quantity: item.quantity
                        }, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        })
                    );
                    await Promise.all(mergePromises);
                    window.localStorage.removeItem('guestCart');
                } catch (err) {
                    console.error("Lỗi khi đồng bộ giỏ hàng:", err);
                    setError('Đồng bộ giỏ hàng thất bại. Vui lòng tải lại trang.');
                } finally {
                    await fetchCart(); // Luôn tải lại giỏ hàng từ server để có dữ liệu mới nhất
                    setIsLoading(false);
                }
            } else {
                fetchCart(); // Nếu không có giỏ local, chỉ cần tải giỏ hàng từ server
            }
        }
    };
    mergeLocalCartToServer();
  }, [isAuthenticated, token, fetchCart]); 

  // useEffect: Lưu giỏ hàng vào localStorage mỗi khi cartItems thay đổi (chỉ khi là khách)
  useEffect(() => {
    if (!isAuthenticated) {
        window.localStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const addToCart = async (cartItemPayload, productDetailsForGuest) => {
    // --- Luồng cho khách ---
    if (!isAuthenticated) {
        setIsLoading(true);
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item =>
                item.productId === cartItemPayload.product_id &&
                item.colorProductId === cartItemPayload.color_product_id &&
                item.sizeProductId === cartItemPayload.size_product_id
            );
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === existingItem.id
                        ? { ...item, quantity: item.quantity + cartItemPayload.quantity }
                        : item
                );
            } else {
                const newItem = {
                    id: `${cartItemPayload.product_id}-${cartItemPayload.color_product_id}-${cartItemPayload.size_product_id}`,
                    productId: cartItemPayload.product_id,
                    colorProductId: cartItemPayload.color_product_id,
                    sizeProductId: cartItemPayload.size_product_id,
                    quantity: cartItemPayload.quantity,
                    ...productDetailsForGuest 
                };
                return [...prevItems, newItem];
            }
        });
        setIsLoading(false);
        return;
    }

    // --- Luồng cho người dùng đã đăng nhập (như cũ) ---
    setIsLoading(true);
    try {
      await axios.post('https://benodejs-9.onrender.com/api/carts', cartItemPayload, {
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
    if (!isAuthenticated) {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantity: Math.max(1, newQuantity) } : item
            ).filter(item => item.quantity > 0)
        );
        return;
    }
    setIsLoading(true);
    try {
      await axios.put(`https://benodejs-9.onrender.com/api/carts/${itemId}`, { quantity: newQuantity }, {
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
    if (!isAuthenticated) {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        return;
    }
    setIsLoading(true);
    try {
      await axios.delete(`https://benodejs-9.onrender.com/api/carts/${itemId}`, {
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
    if (!isAuthenticated) {
        setCartItems([]);
    }
    // Logic xóa giỏ hàng cho người dùng đăng nhập cần gọi API riêng nếu cần
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