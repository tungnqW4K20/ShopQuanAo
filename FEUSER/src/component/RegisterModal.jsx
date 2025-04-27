import React from 'react';
import { FiX, FiGift, FiPercent, FiRefreshCw, FiLogIn } from 'react-icons/fi'; 
import { FcGoogle } from 'react-icons/fc'; 
import { FaFacebook } from 'react-icons/fa'; 


const CoolcashIcon = () => <FiRefreshCw className="w-6 h-6 text-blue-500" />; 

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  if (!isOpen) return null;

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="register-modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md m-4 relative transform transition-all duration-300 ease-in-out scale-100"
        onClick={stopPropagation} 
      >
       
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full p-1"
          aria-label="Đóng cửa sổ đăng ký"
        >
          <FiX className="w-6 h-6" />
        </button>

        
        <div className="text-center mb-4">
           <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-blue-600">
                COOL<span className="bg-blue-600 text-white px-1.5 py-0.5 ml-0.5 rounded">CLUB</span>
            </span>
          <h2 id="register-modal-title" className="text-lg sm:text-xl font-bold text-gray-800 mt-3 mb-2">
            Rất nhiều đặc quyền và quyền lợi mua sắm đang chờ bạn
          </h2>
        </div>

        
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center mb-6 text-xs sm:text-sm text-gray-700">
          <div className="flex flex-col items-center p-2 border border-gray-200 rounded-md">
            <FiPercent className="w-5 h-5 sm:w-6 sm:h-6 mb-1 text-orange-500" />
            <span>Voucher<br/>ưu đãi</span>
          </div>
          <div className="flex flex-col items-center p-2 border border-gray-200 rounded-md">
            <FiGift className="w-5 h-5 sm:w-6 sm:h-6 mb-1 text-purple-500" />
             <span>Quà tặng<br/>độc quyền</span>
          </div>
          <div className="flex flex-col items-center p-2 border border-gray-200 rounded-md">
             <CoolcashIcon /> 
             <span>Hoàn tiền<br/>Coolcash</span>
          </div>
        </div>

        
        <div className="mb-4">
           <p className="text-sm text-gray-600 mb-3 text-center">Đăng nhập bằng:</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 transition-colors"
            >
              <FcGoogle className="w-5 h-5" />
              Google
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 border border-blue-600 bg-blue-600 text-white rounded-md py-2 px-4 text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-colors"
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
            <span className="px-2 bg-white text-sm text-gray-500">Hoặc đăng ký tài khoản</span>
          </div>
        </div>

        
        <form onSubmit={(e) => e.preventDefault()}> 
          <div className="space-y-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="register-name" className="sr-only">Tên của bạn</label>
                    <input
                      id="register-name"
                      name="name"
                      type="text"
                      required
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Tên của bạn"
                    />
                  </div>
                  <div>
                    <label htmlFor="register-phone" className="sr-only">SĐT của bạn</label>
                    <input
                      id="register-phone"
                      name="phone"
                      type="tel" 
                      required
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="SĐT của bạn"
                    />
                 </div>
             </div>

            <div>
              <label htmlFor="register-email" className="sr-only">Email của bạn</label>
              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email của bạn"
              />
            </div>
            <div>
              <label htmlFor="register-password" className="sr-only">Mật khẩu</label>
              <input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password" 
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Mật khẩu"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
            >
              ĐĂNG KÝ TÀI KHOẢN
            </button>
          </div>
        </form>

        
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium text-sm text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
          >
             Đã có tài khoản? <span className="font-bold">Đăng nhập</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;