import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { setAuthCookies, getAuthToken as getAuthTokenFromCookie, getUserInfo, removeAuthCookies } from '../services/cookieService';
import LoginApiService from '../services/LoginApiService';
import { setGlobalAuthTokenGetter } from '../services/apiService'; 
import { setUploadAuthTokenGetter } from '../services/uploadApiService'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getContextToken = useCallback(() => {
    return token || getAuthTokenFromCookie(); 
  }, [token]);

  useEffect(() => {
    const storedToken = getAuthTokenFromCookie();
    const storedUser = getUserInfo();

    setGlobalAuthTokenGetter(getContextToken);
    setUploadAuthTokenGetter(getContextToken); 

    if (storedToken && storedUser) {
      setToken(storedToken); 
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    setIsLoading(false);

    return () => {
      setGlobalAuthTokenGetter(() => null);
      setUploadAuthTokenGetter(() => null);
    };
  }, [getContextToken]); 

  const login = async (credentials) => {
    try {
      const responseData = await LoginApiService.LoginAdmin(credentials);
      if (responseData && responseData.data.token && responseData.data.admin) {
        const newToken = responseData.data.token;
        const newUser = responseData.data.admin;

        setToken(newToken); 
        setUser(newUser);
        setIsAuthenticated(true);
        setAuthCookies(newToken, newUser);
        return responseData;
      } else {
        throw new Error(responseData.message || 'Login failed: Invalid response from server.');
      }
    } catch (error) {
      console.error("AuthContext login error:", error);
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      removeAuthCookies();
      throw error;
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