import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import { FiX, FiEye, FiEyeOff, FiGift, FiPercent, FiRefreshCw } from 'react-icons/fi';
import { FcGoogle } from "@react-icons/all-files/fc/FcGoogle";
import { FaFacebook } from "@react-icons/all-files/fa/FaFacebook";

const LoginModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    
    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Attempting login with:', { email, password });
       
    };

    const handleSocialLogin = (provider) => {
        console.log(`Initiating ${provider} login...`);
        
    };

    const handleOverlayClick = () => {
        onClose();
    };

    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

   

    
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

       
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            
            const firstInput = document.getElementById('login-email');
            firstInput?.focus();
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]); 

    if (!isOpen) {
        return null; 
    }

    return (
        
        <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out animate-fade-in"
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
        >
            {/* Modal Content */}
            <div
                className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto p-6 sm:p-8 relative transform transition-transform duration-300 ease-in-out scale-100 animate-slide-up"
                onClick={handleModalContentClick}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 bg-gray-700 text-white rounded-full p-1.5 hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
                    aria-label="Close login modal"
                >
                    <FiX className="w-5 h-5" />
                </button>

                {/* Cool Club Logo */}
                <div className="text-center mb-4">
                    <span className="text-xl font-bold text-blue-600 tracking-wide">
                        COOL <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded-sm ml-0.5">CLUB</span>
                    </span>
                </div>

                <h2 id="login-modal-title" className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4">
                    Rất nhiều đặc quyền và quyền lợi mua sắm đang chờ bạn
                </h2>

                {/* Benefit Icons */}
                <div className="flex justify-around items-stretch gap-2 sm:gap-3 mb-6 text-center">
                    <div className="border rounded-lg p-2 sm:p-3 flex-1 flex flex-col items-center justify-center space-y-1 min-h-[80px]">
                        <FiPercent className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mb-1" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">Voucher ưu đãi</span>
                    </div>
                    <div className="border rounded-lg p-2 sm:p-3 flex-1 flex flex-col items-center justify-center space-y-1 min-h-[80px]">
                        <FiGift className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mb-1" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">Quà tặng độc quyền</span>
                    </div>
                    <div className="border rounded-lg p-2 sm:p-3 flex-1 flex flex-col items-center justify-center space-y-1 min-h-[80px]">
                        <FiRefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mb-1" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">Hoàn tiền Coolcash</span>
                    </div>
                </div>

                {/* Social Login */}
                <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4">
                    <span className="text-sm text-gray-600 shrink-0">Đăng nhập bằng:</span>
                    <button
                        onClick={() => handleSocialLogin('Google')}
                        className="border rounded-md p-2 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                        aria-label="Login with Google"
                    >
                        <FcGoogle className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button
                        onClick={() => handleSocialLogin('Facebook')}
                        className="border rounded-md p-2 text-blue-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                        aria-label="Login with Facebook"
                    >
                         <FaFacebook className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                <p className="text-center text-sm text-gray-500 mb-4">
                    Hoặc đăng nhập tài khoản:
                </p>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="login-email" className="sr-only">Email hoặc số điện thoại</label>
                        <input
                            id="login-email"
                            type="text"
                            inputMode="text"
                            placeholder="Email/SĐT của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                            autoComplete="username"
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="login-password" className="sr-only">Mật khẩu</label>
                        <input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 pr-10"
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400 rounded-r-lg"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                        ĐĂNG NHẬP
                    </button>
                </form>

                <div className="flex justify-between items-center mt-5 text-sm">
                    <Link
                        to="/register"
                        onClick={onClose}
                        className="text-blue-600 hover:underline focus:outline-none focus:ring-1 focus:ring-blue-300 rounded px-1 py-0.5"
                    >
                        Đăng ký
                    </Link>
                    <Link
                        to="/forgot-password"
                        onClick={onClose}
                        className="text-blue-600 hover:underline focus:outline-none focus:ring-1 focus:ring-blue-300 rounded px-1 py-0.5"
                    >
                        Quên mật khẩu
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;