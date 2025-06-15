import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// 1. Tạo Context
const AuthContext = createContext(null);

// API URL (nên đặt trong file .env ở dự án thực tế)
const API_URL = 'http://localhost:3000/api/auth';

// 2. Tạo Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(Cookies.get('token') || null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('token'));
    const [loading, setLoading] = useState(false); // Thêm trạng thái loading

    // Tự động load thông tin người dùng từ cookie khi component được mount
    useEffect(() => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            setUser(JSON.parse(userCookie));
        }
    }, []);

    // Hàm đăng nhập
    const login = async (emailOrUsername, password) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login`, {
                emailOrUsername,
                password,
            });

            if (response.data.success) {
                const { token, customer } = response.data.data;

                // Lưu token và thông tin người dùng vào state và cookie
                setToken(token);
                setUser(customer);
                setIsAuthenticated(true);
                
                // Thiết lập cookie: token hết hạn sau 1 ngày, user info cũng vậy
                Cookies.set('token', token, { expires: 1, secure: true, sameSite: 'Strict' });
                Cookies.set('user', JSON.stringify(customer), { expires: 1 });
                
                setLoading(false);
                return { success: true };
            }
        } catch (error) {
            setLoading(false);
            // Trả về message lỗi từ API
            const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
            throw new Error(errorMessage);
        }
    };

    // Hàm đăng xuất
    const logout = () => {
        // Xóa state và cookie
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        Cookies.remove('token');
        Cookies.remove('user');
    };

    // Giá trị cung cấp cho các component con
    const value = {
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Tạo Custom Hook để sử dụng Context dễ dàng hơn
export const useAuth = () => {
    return useContext(AuthContext);
};