import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { FiX, FiEye, FiEyeOff, FiGift, FiPercent, FiRefreshCw } from 'react-icons/fi';
import { FcGoogle } from "@react-icons/all-files/fc/FcGoogle";
import { FaFacebook } from "@react-icons/all-files/fa/FaFacebook";


const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
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
            setTimeout(() => firstInput?.focus(), 100);
        } else {
            
            setEmail('');
            setPassword('');
            setShowPassword(false);
        }

        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]); 

    
    if (!isOpen) {
        return null;
    }

    
    const handleRegisterClick = () => {
        if (onSwitchToRegister) {
            onSwitchToRegister(); 
        } else {
            
            console.error("onSwitchToRegister prop is not defined in LoginModal");
            onClose(); 
        }
    };


    return (
        
        <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out animate-fade-in"
            onClick={handleOverlayClick} 
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
        >
            <div
                className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto p-6 sm:p-8 relative transform transition-transform duration-300 ease-in-out scale-100 animate-slide-up"
                onClick={handleModalContentClick} 
            >
                <button
                    type="button" 
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full p-1" // Adjusted styling to match RegisterModal close button
                    aria-label="Đóng cửa sổ đăng nhập"
                >
                    <FiX className="w-6 h-6" />
                </button>

                <div className="text-center mb-4">
                    <span className="text-xl font-bold text-blue-600 tracking-wide">
                        COOL <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded-sm ml-0.5">CLUB</span>
                    </span>
                </div>

                <h2 id="login-modal-title" className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4">
                    Chào mừng bạn quay trở lại! 
                </h2>

                <div className="flex justify-around items-stretch gap-2 sm:gap-3 mb-6 text-center">
                    <div className="border rounded-lg p-2 sm:p-3 flex-1 flex flex-col items-center justify-center space-y-1 min-h-[80px]">
                        <FiPercent className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 mb-1" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">Voucher ưu đãi</span>
                    </div>
                    <div className="border rounded-lg p-2 sm:p-3 flex-1 flex flex-col items-center justify-center space-y-1 min-h-[80px]">
                        <FiGift className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 mb-1" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">Quà tặng độc quyền</span>
                    </div>
                    <div className="border rounded-lg p-2 sm:p-3 flex-1 flex flex-col items-center justify-center space-y-1 min-h-[80px]">
                        <FiRefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mb-1" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">Hoàn tiền Coolcash</span>
                    </div>
                </div>


                 <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-3 text-center">Đăng nhập bằng:</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                        type="button"
                        onClick={() => handleSocialLogin('Google')}
                        className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 transition-colors"
                        aria-label="Đăng nhập bằng Google"
                        >
                        <FcGoogle className="w-5 h-5" />
                        Google
                        </button>
                        <button
                        type="button"
                        onClick={() => handleSocialLogin('Facebook')}
                        className="flex-1 flex items-center justify-center gap-2 border border-blue-600 bg-blue-600 text-white rounded-md py-2 px-4 text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-colors"
                        aria-label="Đăng nhập bằng Facebook"
                        >
                        <FaFacebook className="w-5 h-5" />
                        Facebook
                        </button>
                    </div>
                </div>


                
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-2 bg-white text-sm text-gray-500">Hoặc đăng nhập bằng tài khoản</span>
                    </div>
                </div>

                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="login-email" className="sr-only">Email hoặc số điện thoại</label>
                        <input
                            id="login-email"
                            name="email" 
                            type="text" 
                            inputMode="text"
                            placeholder="Email/SĐT của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" // Using style from RegisterModal for consistency
                            autoComplete="username"
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="login-password" className="sr-only">Mật khẩu</label>
                        <input
                            id="login-password"
                            name="password" // Added name attribute
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm pr-10" // Added padding-right for icon
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400 rounded-r-md" // Adjusted focus and rounding
                            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                            {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors" // Using style from RegisterModal button
                    >
                        ĐĂNG NHẬP
                    </button>
                </form>

                 
                <div className="flex justify-between items-center mt-5 text-sm">
                     
                    <button
                        type="button"
                        onClick={handleRegisterClick} 
                        className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
                    >
                        Chưa có tài khoản? <span className="font-bold">Đăng ký</span>
                    </button>
                     
                    <Link
                        to="/forgot-password" 
                        onClick={onClose} 
                        className="font-medium text-sm text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
                    >
                        Quên mật khẩu?
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;