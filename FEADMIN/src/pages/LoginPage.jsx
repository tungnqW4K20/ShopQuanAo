import React, { useState, useEffect } from 'react'; // Add useEffect
import { useNavigate } from 'react-router-dom';
// import LoginApiService from '../services/LoginApiService'; // No longer directly used here
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth(); // Get auth context

  // Redirect if already logged in
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
      await auth.login(loginData); // Call login from context

      // console.log('Đăng nhập API thành công (handled by context)');
      // No need to manually set localStorage here, context and cookie service do it
      navigate('/', { replace: true }); // Navigate to dashboard or home
    } catch (apiError) {
      setError(apiError.message || 'Tên đăng nhập hoặc mật khẩu không đúng, hoặc có lỗi xảy ra.');
      console.error('Lỗi đăng nhập:', apiError);
    } finally {
      setLoading(false);
    }
  };

  // Don't render the form if authentication is still loading or if already authenticated
  if (auth.isLoading) {
    return <div>Loading authentication...</div>; // Or a proper spinner
  }
  // The useEffect above handles redirection if authenticated, but this is an extra guard
  if (auth.isAuthenticated) {
     return null; // Or redirect again, though useEffect should have caught it.
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Admin Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username Input */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Tên đăng nhập
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="admin"
              disabled={loading}
            />
          </div>
          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="password"
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-sm text-center text-red-600">{error}</p>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;