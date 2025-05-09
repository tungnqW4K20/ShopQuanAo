import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Ensure this path is correct
// You can use a more abstract icon if FaTshirt feels too literal,
// or a custom SVG that represents "quality" or "apparel"
// import { FiTag } from 'react-icons/fi'; // Example: Tag icon

const ProtectedRoute = ({ children, rolesAllowed }) => {
  const auth = useAuth();
  const location = useLocation();
  const [isInitialDelayActive, setIsInitialDelayActive] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Minimum display time for the loader
    const minDisplayTimer = setTimeout(() => {
      setIsInitialDelayActive(false);
    }, 600); // 600ms minimum display

    // Gentle fade-in for the content after a short delay
    const fadeInTimer = setTimeout(() => {
      setShowContent(true);
    }, 150); // Content starts fading in after 150ms

    return () => {
      clearTimeout(minDisplayTimer);
      clearTimeout(fadeInTimer);
    };
  }, []);

  const isLoading = isInitialDelayActive || auth.isLoading;

  if (isLoading) {
    return (
      <div
        className={`fixed inset-0 flex flex-col justify-center items-center bg-slate-900 z-[9999] text-slate-300 transition-opacity duration-500 ease-in-out ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* "Garment Tag" or Brand Element */}
        <div className="relative flex flex-col items-center mb-6 p-5 bg-slate-800/70 rounded-lg shadow-xl w-64">
          {/* Brand Name (like on a label) */}
          <h1 className="text-2xl font-bold text-blue-400 tracking-wider uppercase mb-1">
            COOLMATE
          </h1>
          <p className="text-xs text-slate-400 mb-4 tracking-widest">PREMIUM APPAREL</p>

          {/* Subtle Loading Bar */}
          <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{
                width: '100%', // Start full and shrink, or animate width from 0 to 100%
                animation: 'subtle-progress 2s ease-in-out infinite',
              }}
            ></div>
          </div>
        </div>

        <p className="text-md font-medium text-slate-200 tracking-wide">
          Đang chuẩn bị không gian làm việc...
        </p>
        <p className="text-sm text-slate-400 mt-1.5">
          Vui lòng chờ trong giây lát, chúng tôi đang sắp xếp mọi thứ.
        </p>

        {/* CSS for animations (can be moved to a global CSS file) */}
        <style>
          {`
            @keyframes subtle-progress {
              0% { transform: translateX(-100%); } /* Start off-screen to the left */
              50% { transform: translateX(0%); }   /* Move to fill the container */
              100% { transform: translateX(100%); }/* Move off-screen to the right */
            }
            /* Alternative shimmer effect:
            @keyframes shimmer {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
            .shimmer-bar {
              background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
              background-size: 200% 100%;
              animation: shimmer 1.5s linear infinite;
            }
            */
          `}
        </style>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (rolesAllowed && rolesAllowed.length > 0) {
    const userRoles = auth.user?.roles || [];
    const hasPermission = rolesAllowed.some(allowedRole => userRoles.includes(allowedRole));
    
    if (!hasPermission) {
      console.warn(`User does not have required roles: ${rolesAllowed}. User roles: ${userRoles}`);
      return <Navigate to="/unauthorized" state={{ from: location, requiredRoles: rolesAllowed }} replace />;
    }
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;