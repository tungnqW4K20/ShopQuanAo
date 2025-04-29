import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiGift, FiRepeat, FiUsers } from 'react-icons/fi'; // Example icons

// Helper function to format large numbers
const formatMemberCount = (num) => {
  return new Intl.NumberFormat('de-DE').format(num); // Using German format for dot separators
};

const CoolClubSection = () => {
  const memberCount = 376595; // Or fetch dynamically

  const benefits = [
    {
      id: 1,
      title: 'Mời bạn bè',
      subtitle: 'hoàn tiền 10%/CoolCash',
      Icon: FiUsers, // Placeholder icon
    },
    {
      id: 2,
      title: 'Hoàn tiền đến 7%',
      subtitle: '(X2 vào thứ 6)',
      Icon: FiRepeat, // Placeholder icon - needs better X2 representation
    },
    {
      id: 3,
      title: 'Quà tặng sinh nhật,',
      subtitle: 'quà dịp đặc biệt',
      Icon: FiGift,
    },
  ];

  const recentActivities = [
    "🔥 [HOT] Coolmate kết hợp cùng ... sắp ra mắt BST mới nhất đặc biệt.",
    "🎁 Chúc mừng sinh nhật bạn ... đã nhận được phần quà đặc biệt.",
    "🎉 Chào mừng Khang Trịnh vừa gia nhập CoolClub!",
    "💰 Long Đỗ vừa được cộng 20.000 CoolCash vào tài khoản.",
    // Add more activities
  ];

  return (
    <div className="container mx-auto px-8 py-10 sm:py-16">
      <div className="bg-gray-100 rounded-xl md:rounded-2xl p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Left Column: Benefits */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5 sm:mb-6">
              ĐẶC QUYỀN DÀNH CHO{' '}
              <span className="text-indigo-600">{formatMemberCount(memberCount)}</span>{' '}
              THÀNH VIÊN COOLCLUB
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className="bg-indigo-600 rounded-lg p-4 text-white flex justify-between items-center h-full" // Added h-full
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold leading-tight">{benefit.title}</span>
                    <span className="text-xs font-light opacity-90 leading-tight mt-0.5">{benefit.subtitle}</span>
                  </div>
                   {/* Use a wrapper for potentially custom icon sizes */}
                  <div className="ml-2">
                       {benefit.Icon && <benefit.Icon className="w-5 h-5 sm:w-6 sm:h-6 opacity-90" />}
                       {/* Add specific handling for X2 icon if needed */}
                       {benefit.id === 2 && !benefit.Icon && <span className="font-bold text-xl opacity-90">X2</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Recent Activity */}
          <div className="ml-20">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              HOẠT ĐỘNG GẦN ĐÂY
            </h2>
            <div className="space-y-1.5 mb-5 text-xs sm:text-sm text-gray-600 max-h-24  pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {recentActivities.map((activity, index) => (
                <p key={index} className="truncate">{activity}</p>
              ))}
            </div>
            <Link
              to="/coolclub" // Adjust link
              className="inline-flex items-center bg-black text-white rounded-full px-5 py-2 sm:px-6 sm:py-2.5 font-semibold text-xs sm:text-sm hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-gray-100"
            >
              GIA NHẬP COOLCLUB NGAY
              <FiArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
       {/* scrollbar-thin needs plugin or custom CSS */}
       {/* Add to global CSS if needed:
        .scrollbar-thin { scrollbar-width: thin; }
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 4px;}
        .scrollbar-track-gray-100::-webkit-scrollbar-track { background-color: #f3f4f6; }
        *::-webkit-scrollbar { width: 4px; height: 4px;}
       */}
    </div>
  );
};

export default CoolClubSection;