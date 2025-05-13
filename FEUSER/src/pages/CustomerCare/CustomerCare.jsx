import React from 'react';

// --- Icon Imports ---
import {
  MdOutlineTrackChanges,
  MdOutlineGroups,
  MdOutlineNewspaper,
  MdOutlineCameraAlt,
  MdOutlineQuestionAnswer,
  MdOutlineLiveHelp,
  MdChat, // Added for Zalo icon replacement
} from "react-icons/md";
import { TbShieldCheckered, TbArrowRight } from "react-icons/tb";
import { BsSearch } from "react-icons/bs"; // BsChatDotsFill could also be an option
import { FiUsers, FiShoppingBag, FiInfo, FiRefreshCw, FiHeadphones, FiArrowRight } from 'react-icons/fi';

// --- Asset Imports (Removed local image imports) ---
// import ZaloIcon from './assets/zalo-icon.png'; // Replaced with react-icon
// import teamPhoto1 from './assets/team1.jpg';   // Replaced with placeholder
// import teamPhoto2 from './assets/team2.jpg';   // Replaced with placeholder

//======================================================================
// Component Definitions (Internal to CustomerCare.jsx)
//======================================================================

const ServiceCard = ({ icon: Icon, title, description, bgColor = 'bg-white', textColor = 'text-gray-800', iconColor = 'text-coolmate-blue' }) => {
  return (
    <div className={`${bgColor} ${textColor} rounded-lg p-5 md:p-6 flex items-start space-x-4 shadow-md hover:shadow-lg transition duration-300 ease-in-out cursor-pointer`}>
      <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${iconColor} ${bgColor === 'bg-white' ? 'bg-blue-100' : 'bg-white/20'}`}>
        <Icon className="text-2xl md:text-3xl" />
      </div>
      <div>
        <h3 className="font-semibold text-base md:text-lg mb-1">{title}</h3>
        <p className={`text-xs md:text-sm ${bgColor === 'bg-white' ? 'text-gray-600' : 'text-white/80'}`}>{description}</p>
      </div>
    </div>
  );
};

const FaqCategoryLink = ({ icon: Icon, label }) => {
  return (
    <a
      href="#" // Replace with actual links later
      className="flex items-center justify-between p-3 rounded-md hover:bg-gray-200 transition duration-200"
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-coolmate-blue">
          <Icon className="text-lg" />
        </div>
        <span className="font-medium text-sm">{label}</span>
      </div>
      <FiArrowRight className="text-gray-400" />
    </a>
  );
};

const FaqArticleCard = ({ title, snippet }) => {
  return (
    <a href="#" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
      <h4 className="font-semibold text-base md:text-lg mb-2 text-coolmate-dark">{title}</h4>
      <p className="text-sm text-gray-600 leading-relaxed">{snippet}</p>
    </a>
  );
};

const FloatingChatButton = () => {
  return (
    <a
      href="#" // Add your Zalo chat link here
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 bg-blue-500 rounded-full p-3 shadow-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center"
      aria-label="Chat via Zalo"
    >
      {/* Replaced img tag with react-icon */}
      <MdChat className="w-7 h-7 text-white" />
    </a>
  );
};


//======================================================================
// Main Customer Care Page Component
//======================================================================
function CustomerCare() {
  // --- Data Definitions ---
  const services = [
    { id: 1, icon: MdOutlineTrackChanges, title: "Tra cứu đơn hàng", description: "Hành trình đơn hàng của bạn" },
    { id: 2, icon: MdOutlineGroups, title: "Thành viên CoolClub", description: "Ưu đãi khách hàng thân thiết" },
    { id: 3, icon: MdOutlineNewspaper, title: "CoolNews", description: "Điểm chạm mới mỗi tuần" },
    { id: 4, icon: MdOutlineLiveHelp, title: "CoolWOW", description: "Câu chuyện hay" }, // Placeholder icon
    { id: 5, icon: MdOutlineCameraAlt, title: "CoolMoments", description: "Life at CS" },
    { id: 6, icon: TbShieldCheckered, title: "11 Cam kết của Coolmate", description: "Mang đến trải nghiệm hài lòng" },
    { id: 7, icon: MdOutlineQuestionAnswer, title: "Thư viện Hỏi & Đáp", description: "Bạn hỏi - CSKH trả lời" },
  ];

  const faqCategories = [
    { id: 'interest', icon: FiInfo, label: 'CÓ THỂ BẠN QUAN TÂM' },
    { id: 'purchase', icon: FiShoppingBag, label: 'MUA HÀNG' },
    { id: 'order-info', icon: FiInfo, label: 'THÔNG TIN ĐƠN HÀNG' },
    { id: 'return', icon: FiRefreshCw, label: 'ĐỔI/TRẢ HÀNG' },
    { id: 'other', icon: FiHeadphones, label: 'HỖ TRỢ KHÁC' },
  ];

  const faqArticles = [
    { id: 1, title: "[Mua hàng] Cần nhận gấp đơn hàng ngay làm như thế nào?", snippet: "Đối với đơn hàng trong nội thành Hồ Chí Minh, Hà Nội (giờ hành chính) khách hàng liên hệ hotline 1900272737 hoặc Facebook, Zalo Coolmate để..." },
    { id: 2, title: "Cách thay đổi thông tin mua hàng tại Website", snippet: "Bạn cần thay đổi thông tin nhận hàng, liên hệ Cool qua tổng đài 1900272737, Facebook Coolmate" },
    { id: 3, title: "Làm thế nào để đổi/trả hàng?", snippet: "Bạn tham khảo quy trình đổi trả hàng tại trang..." },
    { id: 4, title: "Tại sao mua hàng trên sàn TMĐT giá thường thấp hơn Website?", snippet: "Cool thường xuyên nhận được thắc mắc của khách hàng về giá của sản phẩm tại các kênh là khác nhau, có một số lý do giải thích..." },
    // Add more articles as needed
  ];

  // --- Placeholder image URLs ---
  const teamPhoto1_placeholder = "https://mcdn.coolmate.me/image/November2023/mceclip2_60.jpg";
  const teamPhoto2_placeholder = "https://mcdn.coolmate.me/image/November2023/mceclip3_53.jpg";


  // --- Component Return JSX ---
  return (
    <div className="bg-white">

      {/* --- Hero Section --- */}
      <section className="bg-coolmate-blue text-white py-12 md:py-20 px-4">
        <div className="container mx-auto text-center">
          <p className="text-sm uppercase tracking-wider mb-2 opacity-80">COOLMATE - CHÀO MỪNG BẠN ĐẾN VỚI</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-10 md:mb-16">TRUNG TÂM DỊCH VỤ KHÁCH HÀNG</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {services.slice(0, 6).map((service) => (
                <ServiceCard
                    key={service.id}
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                />
            ))}
             <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
                {services[6] && (
                    <ServiceCard
                        key={services[6].id}
                        icon={services[6].icon}
                        title={services[6].title}
                        description={services[6].description}
                    />
                 )}
             </div>
          </div>
        </div>
      </section>

      {/* --- FAQ / Search Section --- */}
      <section className="bg-gray-100 py-12 md:py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-coolmate-dark">CHÚNG MÌNH CÓ THỂ GIÚP GÌ CHO BẠN?</h2>
          <p className="text-center text-gray-600 mb-8 md:mb-10">CS Team luôn ở đây để lắng nghe và hỗ trợ.</p>

          <div className="max-w-2xl mx-auto mb-10 md:mb-16 relative">
            <input
              type="text"
              placeholder='Thử bắt đầu với "Đổi trả hàng" xem sao'
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-coolmate-blue/50 shadow-sm"
            />
            <BsSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          </div>

          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            <aside className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-semibold mb-4 px-3 text-coolmate-dark">THƯ VIỆN VÀ HỎI ĐÁP</h3>
                <nav className="space-y-1">
                  {faqCategories.map(category => (
                    <FaqCategoryLink
                      key={category.id}
                      icon={category.icon}
                      label={category.label}
                    />
                  ))}
                </nav>
              </div>
            </aside>

            <main className="w-full md:w-3/4 lg:w-4/5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {faqArticles.map(article => (
                   <FaqArticleCard
                     key={article.id}
                     title={article.title}
                     snippet={article.snippet}
                   />
                ))}
              </div>

               <div className="text-center mt-10">
                   <button className="bg-coolmate-dark text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-700 transition duration-300 inline-flex items-center group">
                       TÌM HIỂU THÊM
                       <TbArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200"/>
                   </button>
               </div>
            </main>
          </div>
        </div>
      </section>

      {/* --- Further Help Section --- */}
      <section className="bg-white py-12 md:py-20 px-4">
         <div className="container mx-auto text-center">
             <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-coolmate-dark">NẾU BẠN CÒN BẤT KỲ CÂU HỎI NÀO CHƯA CÓ LỜI GIẢI, HÃY LIÊN HỆ VỚI COOLMATE NHÉ!</h2>
             <p className="text-gray-600 mb-8">COOLMATE sẵn sàng hỗ trợ bạn mọi lúc</p>
             <button className="bg-coolmate-dark text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-700 transition duration-300 inline-flex items-center group">
                 LIÊN HỆ TRỰC TIẾP
                 <TbArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200"/>
             </button>
         </div>
      </section>

      {/* --- Team Photos Section --- */}
      <section className="bg-gray-50 py-10 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
           <div className="overflow-hidden rounded-lg shadow-md">
               <img src={teamPhoto1_placeholder} alt="Coolmate Team Photo 1" className="w-full h-auto md:h-[450px] object-cover transition duration-300 hover:scale-105"/>
           </div>
            <div className="overflow-hidden rounded-lg shadow-md">
               <img src={teamPhoto2_placeholder} alt="Coolmate Team Photo 2" className="w-full h-auto md:h-[450px] object-cover transition duration-300 hover:scale-105"/>
           </div>
        </div>
      </section>

       {/* --- Floating Chat Button --- */}
       <FloatingChatButton />

       {/* --- Basic Footer --- */}
       <footer className="bg-coolmate-dark text-gray-400 text-center p-6 text-sm">
           © {new Date().getFullYear()} Coolmate. All Rights Reserved.
       </footer>

    </div>
  );
}

// --- Export the main component ---
export default CustomerCare;