import React from 'react';
import { NavLink } from 'react-router-dom'; // useNavigate không cần thiết trong component này nếu chỉ để điều hướng qua NavLink
import {
  AiOutlineHome,
  AiOutlineSetting,
  AiOutlineUsergroupAdd,
  AiOutlineLogout,
  AiOutlineShop, // Icon cho Sản phẩm
  AiOutlineSolution, // Icon cho Nhà Cung Cấp (hoặc FaTruck)
} from 'react-icons/ai';
import { BiCategoryAlt } from "react-icons/bi";
import { 
  TbFileInvoice, // Icon cho Hóa đơn bán
  TbReceipt2 // Icon cho Hóa đơn nhập (hoặc TbFileImport)
} from "react-icons/tb";
import { HiOutlineChartPie } from "react-icons/hi"; // Icon cho Báo cáo
import { MdOutlineRateReview } from "react-icons/md"; // Icon cho Bình luận
import { FaTruck } from "react-icons/fa"; // Một lựa chọn khác cho Nhà Cung Cấp

import { useAuth } from '../contexts/AuthContext';

function Sidebar() {
  // const navigate = useNavigate(); // Bỏ nếu không dùng trực tiếp navigate()
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
    // navigate('/login'); // Bạn có thể thêm navigate ở đây nếu muốn chuyển hướng sau logout từ AuthContext chưa xử lý
  };

  const getNavLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-indigo-600 text-white shadow-md' // Thêm shadow cho active
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <div className="flex flex-col w-72 h-screen px-4 py-8 bg-gray-900 text-gray-100 border-r border-gray-700 overflow-y-auto"> {/* Thêm overflow-y-auto nếu nội dung dài */}
      <nav className="flex flex-col flex-grow space-y-2">
        <NavLink to="/" end className={getNavLinkClass}>
          <AiOutlineHome className="w-5 h-5 mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/manage/users" className={getNavLinkClass}>
          <AiOutlineUsergroupAdd className="w-5 h-5 mr-3" />
          Quản lý Khách Hàng
        </NavLink>
        <NavLink to="/manage/categories" className={getNavLinkClass}>
          <BiCategoryAlt className="w-5 h-5 mr-3" />
          Quản lý Danh mục
        </NavLink>
        {/* --- Các mục mới --- */}
        <NavLink to="/manage/suppliers" className={getNavLinkClass}>
          <FaTruck className="w-5 h-5 mr-3" /> {/* Hoặc AiOutlineSolution */}
          Quản lý Nhà cung cấp
        </NavLink>
        <NavLink to="/manage/products" className={getNavLinkClass}>
          <AiOutlineShop className="w-5 h-5 mr-3" />
          Quản lý Sản phẩm
        </NavLink>
        <NavLink to="/manage/sales-invoices" className={getNavLinkClass}>
          <TbFileInvoice className="w-5 h-5 mr-3" />
          Quản lý Hóa đơn Bán
        </NavLink>
        <NavLink to="/manage/purchase-invoices" className={getNavLinkClass}>
          <TbReceipt2 className="w-5 h-5 mr-3" /> {/* Hoặc TbFileImport */}
          Quản lý Hóa đơn Nhập
        </NavLink>
        <NavLink to="/manage/reviews" className={getNavLinkClass}>
          <MdOutlineRateReview className="w-5 h-5 mr-3" />
          Quản lý Bình luận
        </NavLink>
         {/* --- End Các mục mới --- */}
      </nav>

      {/* Phần Báo cáo và Cài đặt có thể tách ra hoặc để chung */}
      <div className="mt-auto pt-4 border-t border-gray-700"> {/* Thêm đường kẻ phân cách */}
        <nav className="flex flex-col space-y-2">
            <NavLink to="/reports/revenue" className={getNavLinkClass}>
                <HiOutlineChartPie className="w-5 h-5 mr-3" />
                Báo cáo Doanh thu
            </NavLink>
            <NavLink to="/manage/settings" className={getNavLinkClass}>
                <AiOutlineSetting className="w-5 h-5 mr-3" />
                Cài đặt
            </NavLink>
        </nav>
        <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 mt-4 text-gray-300 rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200"
        >
            <AiOutlineLogout className="w-5 h-5 mr-3" />
            Đăng xuất
        </button>
      </div>
    </div>
  );
}

export default Sidebar;