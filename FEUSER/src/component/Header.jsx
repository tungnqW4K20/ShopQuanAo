import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiSearch, FiUser, FiShoppingBag, FiMenu, FiX, FiStar } from 'react-icons/fi';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const activeClassName = "text-blue-600 font-bold";

  return (
    <header className="w-full sticky top-0 z-50 bg-white">
      <div className="bg-gray-600 text-white text-xs sm:text-sm">
        <div className="container mx-auto px-4 py-1.5 flex justify-between items-center">
          <div className="flex items-center space-x-3 sm:space-x-5">
            <Link to="/about" className="hover:text-gray-300 transition-colors">VỀ COOLMATE</Link>
            <Link to="/84rising" className="hover:text-gray-300 transition-colors">84RISING*</Link>
            <Link to="/coolxprint" className="hover:text-gray-300 transition-colors">COOLXPRINT</Link>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-5">
             <Link to="/coolclub" className="flex items-center hover:text-gray-300 transition-colors">
              CoolClub <FiStar className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
             <span className="hidden sm:inline text-gray-400">|</span>
            <Link to="/blog" className="hidden sm:inline hover:text-gray-300 transition-colors">Blog</Link>
             <span className="text-gray-400">|</span>
            <Link to="/support" className="hover:text-gray-300 transition-colors">Trung tâm CSKH</Link>
             <span className="text-gray-400">|</span>
            <Link to="/login" className="hover:text-gray-300 transition-colors">Đăng nhập</Link>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-1 text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight">
                COOL<span className="bg-black text-white px-1 ml-0.5">MATE</span>
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 font-semibold text-sm text-gray-700">
            <NavLink
              to="/nam"
              className={({ isActive }) =>
                `hover:text-blue-600 transition-colors ${isActive ? activeClassName : ""}`
              }
            >
              NAM
            </NavLink>
            <NavLink
              to="/nu"
              className={({ isActive }) =>
                `hover:text-blue-600 transition-colors ${isActive ? activeClassName : ""}`
              }
            >
              NỮ
            </NavLink>
             <NavLink
              to="/the-thao"
              className={({ isActive }) =>
                `hover:text-blue-600 transition-colors ${isActive ? activeClassName : ""}`
              }
            >
              THỂ THAO
            </NavLink>
            <NavLink
              to="/care-share"
               className={({ isActive }) =>
                `hover:text-blue-600 transition-colors ${isActive ? activeClassName : ""}`
              }
            >
              CARE & SHARE
            </NavLink>
          </nav>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="border border-gray-300 rounded-full py-1.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-48 lg:w-64"
              />
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            <Link to="/account" className="text-gray-600 hover:text-blue-600 transition-colors">
              <FiUser className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>

            <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 transition-colors">
              <FiShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </Link>

            <button
              onClick={toggleMobileMenu}
              className="lg:hidden text-gray-600 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 fixed top-[81px] sm:top-[89px] left-0 w-full z-40 shadow-md transition-transform duration-300 ease-in-out"> {/* Adjust top value based on your header height */}
         <div className="container mx-auto px-4 py-4">
             <div className="relative mb-4 md:hidden">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="border border-gray-300 rounded-full py-1.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full"
              />
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

           <nav className="flex flex-col space-y-3 font-semibold text-gray-700">
             <NavLink to="/nam" className={({isActive}) => `hover:text-blue-600 transition-colors block py-1 ${isActive ? activeClassName : ""}`} onClick={toggleMobileMenu}>NAM</NavLink>
             <NavLink to="/nu" className={({isActive}) => `hover:text-blue-600 transition-colors block py-1 ${isActive ? activeClassName : ""}`} onClick={toggleMobileMenu}>NỮ</NavLink>
             <NavLink to="/the-thao" className={({isActive}) => `hover:text-blue-600 transition-colors block py-1 ${isActive ? activeClassName : ""}`} onClick={toggleMobileMenu}>THỂ THAO</NavLink>
             <NavLink to="/care-share" className={({isActive}) => `hover:text-blue-600 transition-colors block py-1 ${isActive ? activeClassName : ""}`} onClick={toggleMobileMenu}>CARE & SHARE</NavLink>
             <hr className="my-2"/>
             <Link to="/blog" className="hover:text-blue-600 transition-colors block py-1" onClick={toggleMobileMenu}>Blog</Link>
             <Link to="/support" className="hover:text-blue-600 transition-colors block py-1" onClick={toggleMobileMenu}>Trung tâm CSKH</Link>
             <Link to="/login" className="hover:text-blue-600 transition-colors block py-1" onClick={toggleMobileMenu}>Đăng nhập / Đăng ký</Link>
           </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;