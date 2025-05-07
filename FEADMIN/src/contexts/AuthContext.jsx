import React, { createContext, useContext, useState, useEffect } from 'react';
import { setAuthCookies, getAuthToken, getUserInfo, removeAuthCookies } from '../services/cookieService';
import LoginApiService from '../services/LoginApiService'; // Assuming LoginAdmin is here

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // To handle initial auth check

  useEffect(() => {
    const storedToken = getAuthToken();
    const storedUser = getUserInfo();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const responseData = await LoginApiService.LoginAdmin(credentials);
      console.log("check: ", responseData)
      if (responseData && responseData.data.token && responseData.data.admin) {
        setToken(responseData.data.token);
        setUser(responseData.data.admin);
        setIsAuthenticated(true);
        setAuthCookies(responseData.data.token, responseData.data.admin);
        return responseData;
      } else {
        throw new Error(responseData.message || 'Login failed: Invalid response from server.');
      }
    } catch (error) {
      console.error("AuthContext login error:", error);
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
      removeAuthCookies();
      throw error; // Re-throw for LoginPage to handle
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    removeAuthCookies();
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};