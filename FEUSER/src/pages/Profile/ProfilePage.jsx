import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

// Import các component con
import ProfileSidebar from './ProfileSidebar';
import AccountInfo from './AccountInfo';
import OrderHistory from './OrderHistory';

const ProfilePage = () => {
    // State để quản lý component nào đang được hiển thị
    const [activeComponent, setActiveComponent] = useState('account');
    const { user } = useAuth(); // Lấy thông tin user để hiển thị lời chào

    // Hàm render component dựa trên state
    const renderContent = () => {
        switch (activeComponent) {
            case 'account':
                return <AccountInfo />;
            case 'orderHistory':
                return <OrderHistory />;
            // Thêm các case khác cho các mục menu khác ở đây
            // case 'voucher':
            //     return <VoucherComponent />;
            default:
                return <AccountInfo />;
        }
    };
    
    // Hàm xử lý khi click vào một mục trong sidebar
    const handleSidebarClick = (componentId) => {
        setActiveComponent(componentId);
    };

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Phần Header Profile */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {user ? `Chào ${user.name}` : 'Tài khoản của tôi'}
                    </h1>
                    <p className="text-gray-600 mt-1">Quản lý thông tin cá nhân và đơn hàng của bạn.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <ProfileSidebar activeItem={activeComponent} onItemClick={handleSidebarClick} />
                    
                    {/* Phần nội dung chính */}
                    <div className="lg:col-span-2">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;