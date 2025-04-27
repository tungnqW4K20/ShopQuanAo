import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiSearch, FiUser, FiShoppingBag, FiMenu, FiX, FiStar } from 'react-icons/fi';
import LoginModal from './LoginModal'; // Assuming LoginModal exists
import RegisterModal from './RegisterModal'; // Import the new Register Modal

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); // State for Register Modal

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // --- Modal Control Functions ---

  const openLoginModal = () => {
    setIsRegisterModalOpen(false); // Close register modal if open
    setIsLoginModalOpen(true);
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openRegisterModal = () => {
    setIsLoginModalOpen(false); // Close login modal if open
    setIsRegisterModalOpen(true);
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };
  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  // --- Switching Functions ---
  const switchToRegister = () => {
    closeLoginModal();
    openRegisterModal();
  };

  const switchToLogin = () => {
    closeRegisterModal();
    openLoginModal();
  };

  // --- Active NavLink Style ---
  const activeClassName = "text-blue-600 font-bold";

  return (
    <>
      <header className="w-full sticky top-0 z-30 bg-white shadow-sm">
        {/* Top Bar */}
        <div className="bg-gray-600 text-white text-xs sm:text-sm">
          <div className="container mx-auto px-4 py-1.5 flex justify-between items-center">
            {/* Left Links */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              <Link to="/about" className="hover:text-gray-300 transition-colors">VỀ COOLMATE</Link>
              <Link to="/84rising" className="hover:text-gray-300 transition-colors">84RISING*</Link>
              <Link to="/coolxprint" className="hover:text-gray-300 transition-colors">COOLXPRINT</Link>
            </div>
            {/* Right Links */}
            <div className="flex items-center space-x-3 sm:space-x-5">
               <Link to="/coolclub" className="flex items-center hover:text-gray-300 transition-colors">
                CoolClub <FiStar className="ml-1 w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
              </Link>
               <span className="hidden sm:inline text-gray-400">|</span>
              <Link to="/blog" className="hidden sm:inline hover:text-gray-300 transition-colors">Blog</Link>
               <span className="text-gray-400">|</span>
              <Link to="/support" className="hover:text-gray-300 transition-colors">Trung tâm CSKH</Link>
               <span className="text-gray-400">|</span>
              
              <button
                type="button"
                onClick={openLoginModal} 
                className="hover:text-gray-300 transition-colors focus:outline-none focus:text-gray-100"
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </div>

       
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
            
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-extrabold text-lg sm:text-xl tracking-tight">
                  COOL<span className="bg-black text-white px-1 ml-0.5">MATE</span>
                </span>
              </Link>
            </div>

            
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 font-semibold text-sm text-gray-700">
              <NavLink to="/nam" className={({ isActive }) => `px-1 py-0.5 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 hover:text-blue-600 transition-colors ${isActive ? activeClassName : ""}`}>NAM</NavLink>
              <NavLink to="/nu" className={({ isActive }) => `px-1 py-0.5 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 hover:text-blue-600 transition-colors ${isActive ? activeClassName : ""}`}>NỮ</NavLink>
              <NavLink to="/the-thao" className={({ isActive }) => `px-1 py-0.5 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 hover:text-blue-600 transition-colors ${isActive ? activeClassName : ""}`}>THỂ THAO</NavLink>
              <NavLink to="/care-share" className={({ isActive }) => `px-1 py-0.5 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 hover:text-blue-600 transition-colors ${isActive ? activeClassName : ""}`}>CARE & SHARE</NavLink>
            </nav>

             
            <div className="flex items-center space-x-3 sm:space-x-4">
             
              <div className="relative hidden md:block">
                <label htmlFor="desktop-search" className="sr-only">Tìm kiếm sản phẩm</label>
                <input id="desktop-search" type="search" placeholder="Tìm kiếm sản phẩm..." className="border border-gray-300 rounded-full py-1.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-48 lg:w-64" />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FiSearch className="text-gray-400 w-4 h-4" />
                </div>
              </div>
              
              <Link to="/account" className="text-gray-600 hover:text-blue-600 transition-colors p-1 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500" aria-label="Tài khoản">
                <FiUser className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              
              <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 transition-colors p-1 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500" aria-label="Giỏ hàng">
                <FiShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center pointer-events-none">0</span>
              </Link>
              
              <button type="button" onClick={toggleMobileMenu} className="lg:hidden text-gray-600 hover:text-blue-600 focus:outline-none p-1 rounded-md focus:ring-1 focus:ring-blue-500" aria-label="Toggle menu" aria-expanded={isMobileMenuOpen} aria-controls="mobile-menu">
                {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden bg-white border-b border-gray-200 absolute top-full left-0 w-full z-40 shadow-md transition-transform duration-300 ease-in-out origin-top">
           <div className="container mx-auto px-4 py-4">
               
               <div className="relative mb-4 md:hidden">
                <label htmlFor="mobile-search" className="sr-only">Tìm kiếm sản phẩm</label>
                <input id="mobile-search" type="search" placeholder="Tìm kiếm sản phẩm..." className="border border-gray-300 rounded-full py-1.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full"/>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FiSearch className="text-gray-400 w-4 h-4" />
                </div>
              </div>
             
             <nav className="flex flex-col space-y-1 font-semibold text-gray-700">
               <NavLink to="/nam" className={({isActive}) => `px-2 py-1.5 rounded hover:bg-gray-100 hover:text-blue-600 transition-colors block ${isActive ? activeClassName : ""}`} onClick={toggleMobileMenu}>NAM</NavLink>
               <NavLink to="/nu" className={({isActive}) => `px-2 py-1.5 rounded hover:bg-gray-100 hover:text-blue-600 transition-colors block ${isActive ? activeClassName : ""}`} onClick={toggleMobileMenu}>NỮ</NavLink>
               <NavLink to="/the-thao" className={({isActive}) => `px-2 py-1.5 rounded hover:bg-gray-100 hover:text-blue-600 transition-colors block ${isActive ? activeClassName : ""}`} onClick={toggleMobileMenu}>THỂ THAO</NavLink>
               <NavLink to="/care-share" className={({isActive}) => `px-2 py-1.5 rounded hover:bg-gray-100 hover:text-blue-600 transition-colors block ${isActive ? activeClassName : ""}`} onClick={toggleMobileMenu}>CARE & SHARE</NavLink>
               <hr className="my-2"/>
               <Link to="/blog" className="px-2 py-1.5 rounded hover:bg-gray-100 hover:text-blue-600 transition-colors block" onClick={toggleMobileMenu}>Blog</Link>
               <Link to="/support" className="px-2 py-1.5 rounded hover:bg-gray-100 hover:text-blue-600 transition-colors block" onClick={toggleMobileMenu}>Trung tâm CSKH</Link>
                
               <button
                  type="button"
                  onClick={openLoginModal} 
                  className="px-2 py-1.5 rounded hover:bg-gray-100 hover:text-blue-600 transition-colors block w-full text-left font-semibold text-gray-700"
                >
                  Đăng nhập / Đăng ký
                </button>
             </nav>
            </div>
          </div>
        )}
      </header>

      
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSwitchToRegister={switchToRegister} 
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={closeRegisterModal}
        onSwitchToLogin={switchToLogin} 
      />
    </>
  );
};

export default Header;