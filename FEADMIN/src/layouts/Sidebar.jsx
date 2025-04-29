import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  AiOutlineHome,
  AiOutlineSetting,
  AiOutlineUsergroupAdd,
  AiOutlineLogout
} from 'react-icons/ai'; 

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/login');
  };

  const getNavLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <div className="flex flex-col w-64 h-screen px-4 py-8 bg-gray-900 text-gray-100 border-r border-gray-700">
      <div className="flex items-center justify-center mb-8">
         <h2 className="text-2xl font-semibold text-white">Admin Panel</h2>
      </div>
      <nav className="flex flex-col flex-grow space-y-2">
        <NavLink to="/" end className={getNavLinkClass}>
          <AiOutlineHome className="w-5 h-5 mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/manage/users" className={getNavLinkClass}>
          <AiOutlineUsergroupAdd className="w-5 h-5 mr-3" />
          Quản lý Users
        </NavLink>
        <NavLink to="/manage/settings" className={getNavLinkClass}>
          <AiOutlineSetting className="w-5 h-5 mr-3" />
          Cài đặt
        </NavLink>
      </nav>

      <div className="mt-auto">
         <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-300 rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200"
        >
            <AiOutlineLogout className="w-5 h-5 mr-3" />
            Đăng xuất
        </button>
      </div>
    </div>
  );
}

export default Sidebar;