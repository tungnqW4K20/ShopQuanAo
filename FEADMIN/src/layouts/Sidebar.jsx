import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  AiOutlineHome,
  AiOutlineSetting,
  AiOutlineUsergroupAdd,
  AiOutlineLogout,
  AiOutlineShop,
  // AiOutlineSolution, // Kept for potential icon swap
} from 'react-icons/ai';
import { BiCategoryAlt } from "react-icons/bi";
import {
  TbFileInvoice,
  TbReceipt2
} from "react-icons/tb";
import { HiOutlineChartPie } from "react-icons/hi";
import { MdOutlineRateReview } from "react-icons/md";
import { FaTruck, FaTshirt } from "react-icons/fa"; // FaTshirt as a placeholder for brand icon

import { useAuth } from '../contexts/AuthContext'; // Ensure this path is correct

function Sidebar() {
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
  };

  const getNavLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-3 rounded-md transition-colors duration-150 ease-in-out group ${
      isActive
        ? 'bg-blue-600 text-white font-medium shadow-lg' // Ensure font-medium for active text
        : 'text-slate-300 hover:bg-slate-700/80 hover:text-white font-normal' // Slightly lighter hover, slate-300 for inactive
    }`;
    // Note: slate-700/80 is bg-slate-700 with 80% opacity. You can use bg-slate-800 if preferred.

  return (
    <div className="flex flex-col w-72 h- full bg-slate-900 text-slate-200 border-r border-slate-700/60">
      {/* Branding / Logo Area */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-slate-700/60">
        {/* Replace with actual Coolmate logo SVG if available for best results */}
        {/* <img src="/path-to-coolmate-logo.svg" alt="Coolmate Admin" className="h-8 w-auto" /> */}
        <FaTshirt className="h-7 w-7 text-blue-500 mr-2.5" /> {/* Example Icon */}
        <h1 className="text-xl font-bold text-white tracking-wider uppercase">
          COOLMATE
          <span className="ml-1.5 font-medium text-blue-400 opacity-90 normal-case text-lg">Admin</span>
        </h1>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col flex-grow p-3 space-y-1.5 mt-2"> {/* Slightly reduced padding, tighter space */}
        <NavLink to="/" end className={getNavLinkClass}>
          <AiOutlineHome className="w-5 h-5 mr-3 flex-shrink-0" />
          Dashboard
        </NavLink>
        <NavLink to="/manage/customers" className={getNavLinkClass}>
          <AiOutlineUsergroupAdd className="w-5 h-5 mr-3 flex-shrink-0" />
          Quản lý Khách Hàng
        </NavLink>
        <NavLink to="/manage/categories" className={getNavLinkClass}>
          <BiCategoryAlt className="w-5 h-5 mr-3 flex-shrink-0" />
          Quản lý Danh mục
        </NavLink>
        <NavLink to="/manage/suppliers" className={getNavLinkClass}>
          <FaTruck className="w-5 h-5 mr-3 flex-shrink-0" />
          Quản lý Nhà cung cấp
        </NavLink>
        <NavLink to="/manage/products" className={getNavLinkClass}>
          <AiOutlineShop className="w-5 h-5 mr-3 flex-shrink-0" />
          Quản lý Sản phẩm
        </NavLink>
        <NavLink to="/manage/orders" className={getNavLinkClass}>
          <TbFileInvoice className="w-5 h-5 mr-3 flex-shrink-0" />
          Quản lý Hóa đơn Bán
        </NavLink>
        <NavLink to="/manage/purchase-invoices" className={getNavLinkClass}>
          <TbReceipt2 className="w-5 h-5 mr-3 flex-shrink-0" />
          Quản lý Hóa đơn Nhập
        </NavLink>
        <NavLink to="/manage/reviews" className={getNavLinkClass}>
          <MdOutlineRateReview className="w-5 h-5 mr-3 flex-shrink-0" />
          Quản lý Bình luận
        </NavLink>

        <div className="border-t border-slate-700/60">
        <nav className="flex flex-col space-y-1.5">
            <NavLink to="/reports/revenue" className={getNavLinkClass}>
                <HiOutlineChartPie className="w-5 h-5 mr-3 flex-shrink-0" />
                Báo cáo Doanh thu
            </NavLink>
            <NavLink to="/manage/settings" className={getNavLinkClass}>
                <AiOutlineSetting className="w-5 h-5 mr-3 flex-shrink-0" />
                Cài đặt
            </NavLink>
        </nav>
        <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 mt-3 text-slate-300 rounded-md hover:bg-red-600 hover:text-white transition-colors duration-150 ease-in-out group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
            <AiOutlineLogout className="w-5 h-5 mr-3 flex-shrink-0" />
            Đăng xuất
        </button>
      </div>

      </nav>

      {/* Bottom Section: Reports, Settings, Logout */}
      
    </div>
  );
}

export default Sidebar;