import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Ensure this path is correct
import { FiLock, FiUser, FiLogIn } from 'react-icons/fi'; // Icons for inputs and button

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated && !auth.isLoading) {
      navigate('/', { replace: true });
    }
  }, [auth.isAuthenticated, auth.isLoading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loginData = { username, password };
      await auth.login(loginData);
      navigate('/', { replace: true });
    } catch (apiError) {
      setError(apiError.message || 'Tên đăng nhập hoặc mật khẩu không đúng, hoặc có lỗi xảy ra.');
      console.error('Lỗi đăng nhập:', apiError);
    } finally {
      setLoading(false);
    }
  };

  if (auth.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-slate-700 text-lg">Đang tải...</p>
      </div>
    );
  }

  if (auth.isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-slate-100 px-4 sm:px-6 lg:px-8">
      {/* Optional: Add a subtle background pattern or image if desired */}
       <div className="absolute inset-0 bg-[url('https://cdn.brvn.vn/topics/1280px/2021/321782_Coolmate-cover_1638433173.jpg')] opacity-100"></div> 

      <div className="relative w-full max-w-md p-8 sm:p-10 space-y-8 bg-white rounded-xl shadow-2xl transform transition-all hover:shadow-3xl">
        {/* Decorative element (optional, can be brand color) */}
        {/* <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-blue-600 rounded-full shadow-lg"></div> */}
        
        <div className="text-center">
          {/* You can replace this with an <img> tag for your store's logo */}
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800">
            <span className="text-blue-600">Admin</span> Panel
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Đăng nhập để quản lý cửa hàng của bạn.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username Input */}
          <div className="relative">
            <label
              htmlFor="username"
              className="sr-only" // Visually hidden, but accessible
            >
              Tên đăng nhập
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow duration-150 ease-in-out hover:shadow-md"
              placeholder="Tên đăng nhập (ví dụ: admin)"
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <label
              htmlFor="password"
              className="sr-only" // Visually hidden, but accessible
            >
              Mật khẩu
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow duration-150 ease-in-out hover:shadow-md"
              placeholder="Mật khẩu"
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-sm text-center text-red-500 bg-red-50 p-3 rounded-md border border-red-200">
              <FiLock className="inline w-4 h-4 mr-1 align-text-bottom" /> {error}
            </p>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:shadow-sm"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <FiLogIn className={`h-5 w-5 text-blue-500 group-hover:text-blue-400 ${loading ? 'hidden' : ''}`} aria-hidden="true" />
              </span>
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </div>
        </form>
        <p className="mt-8 text-xs text-center text-slate-500">
          © {new Date().getFullYear()} Your Clothing Store. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;