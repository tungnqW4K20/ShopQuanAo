import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
  
    if (isLoading) {
      return (
        <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
            <div className="text-xl font-semibold animate-pulse">Loading...</div>
        </div>
      )
    }
  
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/";
      return <Navigate to={from} replace />;
    }
    return children;
  };

export default PublicRoute;