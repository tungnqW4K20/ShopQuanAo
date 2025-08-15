import React from 'react';
import {
    FiUser, FiGift, FiFileText, FiRefreshCw, FiPercent, FiMapPin,
    FiMessageSquare, FiHelpCircle, FiLogOut, FiChevronRight
} from 'react-icons/fi';

// Định nghĩa menuItems bên ngoài để không phải tạo lại mỗi lần render
const menuItems = [
    { id: 'account', icon: <FiUser />, text: 'Thông tin tài khoản' },
    { id: 'orderHistory', icon: <FiFileText />, text: 'Lịch sử đơn hàng' },
    { id: 'refer', icon: <FiGift />, text: 'Giới thiệu bạn bè' },
    { id: 'coolCash', icon: <FiRefreshCw />, text: 'Lịch sử CoolCash' },
    { id: 'voucher', icon: <FiPercent />, text: 'Ví Voucher' },
    { id: 'address', icon: <FiMapPin />, text: 'Sổ địa chỉ' },
    { id: 'feedback', icon: <FiMessageSquare />, text: 'Đánh giá và phản hồi' },
    { id: 'faq', icon: <FiHelpCircle />, text: 'Chính sách & Câu hỏi thường gặp' },
    { id: 'logout', icon: <FiLogOut />, text: 'Đăng xuất' },
];

const ProfileSidebar = ({ activeItem, onItemClick }) => {
    return (
        <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.id}
                            onClick={() => onItemClick(item.id)}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer mb-2 transition-colors duration-200 
                            ${activeItem === item.id
                                    ? 'bg-black text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-center">
                                <span className="mr-3 text-lg">{item.icon}</span>
                                <span className="font-medium">{item.text}</span>
                            </div>
                            <FiChevronRight />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProfileSidebar;