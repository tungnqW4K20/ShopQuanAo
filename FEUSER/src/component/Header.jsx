import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiSearch, FiUser, FiShoppingBag, FiMenu, FiX, FiStar } from 'react-icons/fi';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { useAuth } from '../context/AuthContext';
import CartPopup from './CartPopup'; // 1. Import component giỏ hàng mini
import axios from 'axios';           // 2. Import axios để gọi API

// Component Link cho dropdown menu
const DropdownLink = ({ to, children }) => (
  <Link to={to} className="block py-1 text-sm text-gray-700 hover:text-blue-600 hover:font-medium transition-colors">
    {children}
  </Link>
);

// Các component MegaMenu (giữ nguyên không thay đổi)
const MegaMenuNam = () => (
  <div className="grid grid-cols-4 gap-x-8 gap-y-4">
    <div>
      <Link to="/tat-ca-san-pham-nam" className="block text-sm font-bold text-gray-900 mb-2 hover:text-blue-600">TẤT CẢ SẢN PHẨM →</Link>
      <ul>
        <li><DropdownLink to="/san-pham-moi-nam">Sản phẩm mới</DropdownLink></li>
        <li><DropdownLink to="/ban-chay-nhat-nam">Bán chạy nhất</DropdownLink></li>
        <li><DropdownLink to="/ecc-collection-nam">ECC Collection</DropdownLink></li>
        <li><DropdownLink to="/excool-collection-nam">Excool Collection</DropdownLink></li>
        <li><DropdownLink to="/copper-denim-nam">Copper Denim</DropdownLink></li>
        <li><DropdownLink to="/promax-nam">Promax</DropdownLink></li>
      </ul>
      <div className='mt-6'>
        <Link to="/do-lot-nam" className="block text-sm font-bold text-gray-900 mb-2 hover:text-blue-600">ĐỒ LÓT</Link>
        <Link to="/do-the-thao-nam" className="block text-sm font-bold text-gray-900 mb-2 hover:text-blue-600">ĐỒ THỂ THAO</Link>
        <Link to="/mac-hang-ngay-nam" className="block text-sm font-bold text-gray-900 mb-2 hover:text-blue-600">MẶC HẰNG NGÀY</Link>
      </div>
    </div>

    <div>
      <Link to="/ao-nam" className="block text-sm font-bold text-gray-900 mb-2 hover:text-blue-600">ÁO NAM →</Link>
      <ul>
        <li><DropdownLink to="/ao-tanktop-nam">Áo Tanktop</DropdownLink></li>
        <li><DropdownLink to="/ao-thun-nam">Áo Thun</DropdownLink></li>
        <li><DropdownLink to="/ao-the-thao-nam">Áo Thể Thao</DropdownLink></li>
        <li><DropdownLink to="/ao-polo-nam">Áo Polo</DropdownLink></li>
        <li><DropdownLink to="/ao-so-mi-nam">Áo Sơ Mi</DropdownLink></li>
        <li><DropdownLink to="/ao-dai-tay-nam">Áo Dài Tay</DropdownLink></li>
        <li><DropdownLink to="/ao-khoac-nam">Áo Khoác</DropdownLink></li>
      </ul>
    </div>

    <div className="grid grid-rows-2 gap-y-6">
       <div>
        <Link to="/quan-nam" className="block text-sm font-bold text-gray-900 mb-2 hover:text-blue-600">QUẦN NAM →</Link>
        <ul>
          <li><DropdownLink to="/quan-short-nam">Quần Short</DropdownLink></li>
          <li><DropdownLink to="/quan-jogger-nam">Quần Jogger</DropdownLink></li>
          <li><DropdownLink to="/quan-the-thao-nam">Quần Thể Thao</DropdownLink></li>
          <li><DropdownLink to="/quan-dai-nam">Quần Dài</DropdownLink></li>
          <li><DropdownLink to="/quan-jean-nam">Quần Jean</DropdownLink></li>
          <li><DropdownLink to="/quan-boi-nam">Quần Bơi</DropdownLink></li>
        </ul>
       </div>
       <div>
        <Link to="/quan-lot-nam" className="block text-sm font-bold text-gray-900 mb-2 hover:text-blue-600">QUẦN LÓT NAM →</Link>
        <ul>
          <li><DropdownLink to="/quan-brief-nam">Brief (Tam giác)</DropdownLink></li>
          <li><DropdownLink to="/quan-trunk-nam">Trunk (Boxer)</DropdownLink></li>
          <li><DropdownLink to="/quan-boxer-brief-nam">Boxer Brief (Boxer dài)</DropdownLink></li>
          <li><DropdownLink to="/quan-long-leg-nam">Long Leg</DropdownLink></li>
          <li><DropdownLink to="/quan-short-mac-nha-nam">Short mặc nhà</DropdownLink></li>
        </ul>
       </div>
    </div>

    <div>
      <Link to="/phu-kien-nam" className="block text-sm font-bold text-gray-900 mb-2 hover:text-blue-600">PHỤ KIỆN →</Link>
      <ul>
        <li><DropdownLink to="/tat-vo-nam">Tất cả phụ kiện (Tất, mũ,...)</DropdownLink></li>
      </ul>
      <div className="mt-4">
         <img src="https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/mceclip24.png" alt="Áo Sơ Mi Dài Tay Essentials Cotton" className="w-full h-auto object-cover rounded mb-2" />
         <p className="text-xs text-center text-gray-600">Áo Sơ Mi Dài Tay Essentials Cotton</p>
         <img src="https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/mceclip23.png" alt="Quần Jeans Nam siêu nhẹ" className="w-full h-auto object-cover rounded mt-4 mb-2" />
         <p className="text-xs text-center text-gray-600">Quần Jeans Nam siêu nhẹ</p>
      </div>
    </div>
  </div>
);

const MegaMenuNu = () => (
    <div className="grid grid-cols-4 gap-x-8 gap-y-4">
    <div>
      <Link to="/tat-ca-san-pham-nu" className="block text-sm font-bold text-gray-900 mb-2 hover:text-blue-600">TẤT CẢ SẢN PHẨM →</Link>
      <ul>
        <li><DropdownLink to="/chay-bo-nu">Chạy bộ</DropdownLink></li>
        <li><DropdownLink to="/yoga-pilates-nu">Yoga & Pilates</DropdownLink></li>
        <li><DropdownLink to="/the-thao-chung-nu">Thể thao chung</DropdownLink></li>
        <li><DropdownLink to="/pickleball-tennis-nu">Pickleball & Tennis (Coming soon)</DropdownLink></li>
        <li><DropdownLink to="/cau-long-bong-ban-nu">Cầu lông & Bóng bàn (Coming soon)</DropdownLink></li>
      </ul>
    </div>
    <div>
      <Link to="/ao-nu" className="block text-sm font-bold text-gray-900 mb-2 hover:text-blue-600">ÁO NỮ →</Link>
      <ul>
        <li><DropdownLink to="/ao-sport-bra-nu">Áo Sport Bra</DropdownLink></li>
        <li><DropdownLink to="/ao-croptop-nu">Áo Croptop</DropdownLink></li>
        <li><DropdownLink to="/ao-singlet-nu">Áo Singlet</DropdownLink></li>
        <li><DropdownLink to="/ao-thun-nu">Áo Thun</DropdownLink></li>
      </ul>
    </div>
     <div className="grid grid-rows-2 gap-y-6">
      <div>
        <Link to="/quan-nu" className="block text-sm font-bold text-gray-900 mb-2 hover:text-blue-600">QUẦN NỮ →</Link>
        <ul>
          <li><DropdownLink to="/quan-legging-nu">Quần Legging</DropdownLink></li>
          <li><DropdownLink to="/quan-shorts-nu">Quần Shorts</DropdownLink></li>
          <li><DropdownLink to="/quan-biker-shorts-nu">Quần Biker Shorts</DropdownLink></li>
        </ul>
      </div>
       <div>
          <Link to="/phu-kien-nu" className="block text-sm font-bold text-gray-900 mb-2 hover:text-blue-600">PHỤ KIỆN →</Link>
          <ul>
            <li><DropdownLink to="/tat-vo-nu">Tất cả phụ kiện (Tất, mũ,...)</DropdownLink></li>
          </ul>
       </div>
     </div>
     <div>
       <h3 className="block text-sm font-bold text-gray-900 mb-2">KHÁM PHÁ</h3>
       <ul>
         <li><DropdownLink to="/huong-dan-chon-size-nu">Hướng dẫn chọn Size Nữ</DropdownLink></li>
         <li><DropdownLink to="/dai-su-coolmate-nu">Đại sứ của chúng tôi</DropdownLink></li>
         <li><DropdownLink to="/cau-lac-bo-dong-hanh-nu">Câu lạc bộ đồng hành</DropdownLink></li>
       </ul>
        <div className="mt-4">
         <img src="https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/mceclip30.png" alt="Coolmate Active For Women" className="w-full h-auto object-cover rounded mb-2" />
         <p className="text-xs text-center text-gray-600">COOLMATE ACTIVE FOR WOMEN</p>
         <img src="https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/mceclip29.png" alt="Legging Yoga Ribbed" className="w-full h-auto object-cover rounded mt-4 mb-2" />
         <p className="text-xs text-center text-gray-600">LEGGING YOGA RIBBED</p>
      </div>
     </div>
  </div>
);

const MegaMenuTheThao = () => (
   <div className="grid grid-cols-4 gap-x-8 gap-y-4">
    <div>
      <Link to="/the-thao-nam" className="block text-sm font-bold text-gray-900 mb-2 hover:text-blue-600">THỂ THAO NAM →</Link>
      <ul className="space-y-2">
        <li className="flex items-center"><span className="mr-2">🌍</span><DropdownLink to="/the-thao-chung-nam">Thể thao chung</DropdownLink></li>
        <li className="flex items-center"><span className="mr-2">🏃</span><DropdownLink to="/chay-bo-nam">Chạy bộ</DropdownLink></li>
        <li className="flex items-center"><span className="mr-2">🏋️</span><DropdownLink to="/tap-gym-nam">Tập gym</DropdownLink></li>
        <li className="flex items-center"><span className="mr-2">⚽</span><DropdownLink to="/bong-da-nam">Bóng đá</DropdownLink></li>
        <li className="flex items-center"><span className="mr-2">🏊</span><DropdownLink to="/boi-loi-nam">Bơi lội</DropdownLink></li>
        <li className="flex items-center"><span className="mr-2">🏸</span><DropdownLink to="/cau-long-bong-ban-nam">Cầu lông & Bóng Bàn</DropdownLink></li>
        <li className="flex items-center"><span className="mr-2">🌲</span><DropdownLink to="/outdoor-nam">Outdoor</DropdownLink></li>
      </ul>
    </div>

    <div>
      <Link to="/the-thao-nu" className="block text-sm font-bold text-gray-900 mb-2 hover:text-blue-600">THỂ THAO NỮ →</Link>
      <ul className="space-y-2">
         <li className="flex items-center"><span className="mr-2">🧘‍♀️</span><DropdownLink to="/yoga-pilates-nu">Yoga & Pilates</DropdownLink></li>
         <li className="flex items-center"><span className="mr-2">🏃‍♀️</span><DropdownLink to="/chay-bo-nu">Chạy bộ</DropdownLink></li>
         <li className="flex items-center"><span className="mr-2">🤸‍♀️</span><DropdownLink to="/the-thao-chung-nu">Thể thao chung</DropdownLink></li>
      </ul>
    </div>

    <div>
       <h3 className="block text-sm font-bold text-gray-900 mb-2 opacity-0 pointer-events-none">Spacer</h3>
       <ul className="space-y-2">
          <li className="flex items-center"><span className="mr-2">👕</span><DropdownLink to="/ao-the-thao-nu">Áo thể thao nữ</DropdownLink></li>
          <li className="flex items-center"><span className="mr-2">👖</span><DropdownLink to="/quan-the-thao-nu">Quần thể thao nữ</DropdownLink></li>
          <li className="flex items-center"><span className="mr-2">🧢</span><DropdownLink to="/phu-kien-the-thao-nu">Phụ kiện thể thao nữ</DropdownLink></li>
       </ul>
    </div>

    <div>
        <h3 className="block text-sm font-bold text-gray-900 mb-2 opacity-0 pointer-events-none">Spacer</h3>
       <div className="mt-0">
         <img src="https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/April2025/mceclip5_67.jpg" alt="Áo Polo Nam Thể Thao Promax-S1" className="w-full h-auto object-cover rounded mb-2" />
         <p className="text-xs text-center text-gray-600">Áo Polo Nam Thể Thao Promax-S1</p>
         <img src="https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/April2025/mceclip4_98.jpg" alt="Quần Shorts Nam Thể Thao Promax-S1" className="w-full h-auto object-cover rounded mt-4 mb-2" />
         <p className="text-xs text-center text-gray-600">Quần Shorts Nam Thể Thao Promax-S1</p>
      </div>
    </div>
  </div>
);

const MegaMenuCareShare = () => (
    <div className="flex items-center justify-between gap-8">
      <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Coolmate cam kết dành 10% doanh thu từ sản phẩm "Care & Share" đóng góp vào quỹ để tổ chức các hoạt động thiện nguyện dành cho trẻ em có hoàn cảnh khó khăn.</h3>
          <div className="flex items-center justify-around space-x-2 my-6 text-center text-xs sm:text-sm">
             <div className="flex flex-col items-center">
                <span className="text-3xl mb-1">🫂</span>
                <span className='font-medium'>Khách hàng</span>
             </div>
             <span className="text-2xl text-gray-400">+</span>
             <div className="flex flex-col items-center">
                <span className="text-3xl mb-1">🎁</span>
                <span className='font-medium'>Care<br/>& Share</span>
             </div>
             <span className="text-2xl text-gray-400">→</span>
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-1">💰</span>
                <span className='font-medium'>10% doanh thu<br/>từ sản phẩm C&S</span>
             </div>
             <span className="text-2xl text-gray-400">→</span>
             <div className="flex flex-col items-center">
                <span className="text-3xl mb-1">❤️</span>
                <span className='font-medium'>Trẻ em khó khăn<br/>được giúp đỡ</span>
             </div>
          </div>
          <Link to="/care-share-details" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors">
            CARE & SHARE →
          </Link>
      </div>
       <div className="flex-1 max-w-md">
          <img src="https://media3.coolmate.me/cdn-cgi/image/width=713…80,format=auto/uploads/March2025/mceclip0_226.jpg" alt="Ấm áp cho em" className="w-full h-auto object-cover rounded-lg shadow-md"/>
      </div>
    </div>
);


const Header = () => {
  // State cho các chức năng cũ
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuTimeoutId, setMenuTimeoutId] = useState(null);
  const [dropdownTimeoutId, setDropdownTimeoutId] = useState(null);

  // 3. Các state mới để quản lý giỏ hàng và popup
  const [cartItems, setCartItems] = useState([]);
  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false);
  const [cartPopupTimeoutId, setCartPopupTimeoutId] = useState(null);
  
  // Lấy thông tin xác thực từ Context
  const { user, isAuthenticated, logout, token } = useAuth();

  // 4. Hook để lấy dữ liệu giỏ hàng từ API
  useEffect(() => {
    const fetchCartItems = async () => {
      // Chỉ gọi API khi người dùng đã đăng nhập và có token
      if (isAuthenticated && token) {
        try {
          const response = await axios.get('http://localhost:3000/api/carts', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.data.success) {
            // Định dạng lại dữ liệu từ API cho phù hợp với component
            const formattedItems = response.data.data.map(item => ({
              id: item.id,
              productId: item.product.id,
              name: item.product.name,
              image: item.colorVariant.image_urls[0] || item.product.image_url,
              color: item.colorVariant.name,
              size: item.sizeVariant.name,
              quantity: item.quantity,
              price: parseFloat(item.colorVariant.price) + parseFloat(item.sizeVariant.price),
              originalPrice: (parseFloat(item.colorVariant.price) + parseFloat(item.sizeVariant.price)) * 1.25,
            }));
            setCartItems(formattedItems);
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu giỏ hàng:", error);
          setCartItems([]); // Reset giỏ hàng về rỗng nếu có lỗi
        }
      } else {
        setCartItems([]); // Nếu không đăng nhập, giỏ hàng luôn trống
      }
    };

    fetchCartItems();
  }, [isAuthenticated, token]); // Chạy lại hook này mỗi khi trạng thái đăng nhập hoặc token thay đổi

  // Các hàm xử lý chức năng cũ (giữ nguyên không thay đổi)
  const toggleMobileMenu = () => { setIsMobileMenuOpen(!isMobileMenuOpen); };
  const openLoginModal = () => { setIsRegisterModalOpen(false); setIsLoginModalOpen(true); setIsMobileMenuOpen(false); setActiveMenu(null); };
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const openRegisterModal = () => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true); setIsMobileMenuOpen(false); setActiveMenu(null); };
  const closeRegisterModal = () => setIsRegisterModalOpen(false);
  const switchToRegister = () => { closeLoginModal(); openRegisterModal(); };
  const switchToLogin = () => { closeRegisterModal(); openLoginModal(); };
  const handleMouseEnterNav = (menuName) => { if (dropdownTimeoutId) clearTimeout(dropdownTimeoutId); if (menuTimeoutId) clearTimeout(menuTimeoutId); setActiveMenu(menuName); };
  const handleMouseLeaveNav = () => { const timeoutId = setTimeout(() => { setActiveMenu(null); }, 150); setMenuTimeoutId(timeoutId); };
  const handleMouseEnterDropdown = () => { if (menuTimeoutId) clearTimeout(menuTimeoutId); if (dropdownTimeoutId) clearTimeout(dropdownTimeoutId); };
  const handleMouseLeaveDropdown = () => { const timeoutId = setTimeout(() => { setActiveMenu(null); }, 150); setDropdownTimeoutId(timeoutId); };
  const handleLogout = () => { logout(); };

  // 5. Các hàm mới để xử lý popup giỏ hàng
  const handleMouseEnterCart = () => {
    if (cartPopupTimeoutId) clearTimeout(cartPopupTimeoutId);
    // Chỉ mở popup nếu đã đăng nhập và có sản phẩm trong giỏ
    if (isAuthenticated && cartItems.length > 0) {
      setIsCartPopupOpen(true);
    }
  };

  const handleMouseLeaveCart = () => {
    // Đặt một khoảng thời gian chờ trước khi đóng popup.
    // Điều này cho phép người dùng di chuột từ icon vào popup mà không làm nó bị đóng.
    const timeoutId = setTimeout(() => {
      setIsCartPopupOpen(false);
    }, 200);
    setCartPopupTimeoutId(timeoutId);
  };

  const closeCartPopup = () => {
    setIsCartPopupOpen(false);
  };

  // Tính tổng số lượng sản phẩm để hiển thị trên huy hiệu.
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const activeClassName = "text-blue-600 font-bold border-b-2 border-blue-600";
  const inactiveClassName = "border-b-2 border-transparent";

  return (
    <>
      <header className="w-full sticky top-0 z-30 bg-white shadow-sm">
        {/* Thanh header trên cùng */}
        <div className="bg-gray-600 text-white text-xs sm:text-sm">
          <div className="container mx-auto px-4 py-1.5 flex justify-between items-center">
            <div className="flex items-center space-x-3 sm:space-x-5">
              <Link to="/about" className="hover:text-gray-300 transition-colors">VỀ COOLMATE</Link>
              <Link to="/84rising" className="hover:text-gray-300 transition-colors">84RISING*</Link>
              <Link to="/coolxprint" className="hover:text-gray-300 transition-colors">COOLXPRINT</Link>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-5">
               <Link to="/coolclub" className="flex items-center hover:text-gray-300 transition-colors">
                CoolClub <FiStar className="ml-1 w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
              </Link>
               <span className="hidden sm:inline text-gray-400">|</span>
              <Link to="/blog" className="hidden sm:inline hover:text-gray-300 transition-colors">Blog</Link>
               <span className="text-gray-400">|</span>
              <Link to="/customer-care" className="hover:text-gray-300 transition-colors">Trung tâm CSKH</Link>
               <span className="text-gray-400">|</span>
               {isAuthenticated && user ? 
                  <div className='flex space-x-2'>
                    <h1>Xin chào {user.name},</h1>
                    <button
                      className='cursor-pointer'
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </div>
                :
                  <button
                    type="button"
                    onClick={openLoginModal}
                    className="hover:text-gray-300 transition-colors focus:outline-none focus:text-gray-100"
                  >
                    Đăng nhập
                  </button>
               }
            </div>
          </div>
        </div>

        {/* Thanh header chính với logo, menu và các icon */}
        <div className="bg-white border-b border-gray-200 relative">
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

            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 font-semibold text-sm text-gray-700 h-full">
              <div className="h-full flex items-center" onMouseEnter={() => handleMouseEnterNav('nam')} onMouseLeave={handleMouseLeaveNav}>
                <NavLink to="/nam" className={({ isActive }) => `h-full flex items-center px-1 pt-0.5 pb-[calc(0.125rem+2px)] focus:outline-none focus:ring-1 focus:ring-blue-400 hover:text-blue-600 transition-colors ${isActive ? activeClassName : inactiveClassName}`}>NAM</NavLink>
              </div>
              <div className="h-full flex items-center" onMouseEnter={() => handleMouseEnterNav('nu')} onMouseLeave={handleMouseLeaveNav}>
                 <NavLink to="/nu" className={({ isActive }) => `h-full flex items-center px-1 pt-0.5 pb-[calc(0.125rem+2px)] focus:outline-none focus:ring-1 focus:ring-blue-400 hover:text-blue-600 transition-colors ${isActive ? activeClassName : inactiveClassName}`}>NỮ</NavLink>
              </div>
               <div className="h-full flex items-center" onMouseEnter={() => handleMouseEnterNav('the-thao')} onMouseLeave={handleMouseLeaveNav}>
                <NavLink to="/the-thao" className={({ isActive }) => `h-full flex items-center px-1 pt-0.5 pb-[calc(0.125rem+2px)] focus:outline-none focus:ring-1 focus:ring-blue-400 hover:text-blue-600 transition-colors ${isActive ? activeClassName : inactiveClassName}`}>THỂ THAO</NavLink>
              </div>
               <div className="h-full flex items-center" onMouseEnter={() => handleMouseEnterNav('care-share')} onMouseLeave={handleMouseLeaveNav}>
                 <NavLink to="/care-share" className={({ isActive }) => `h-full flex items-center px-1 pt-0.5 pb-[calc(0.125rem+2px)] focus:outline-none focus:ring-1 focus:ring-blue-400 hover:text-blue-600 transition-colors ${isActive ? activeClassName : inactiveClassName}`}>CARE & SHARE</NavLink>
              </div>
            </nav>

            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative hidden md:block">
                <label htmlFor="desktop-search" className="sr-only">Tìm kiếm sản phẩm</label>
                <input id="desktop-search" type="search" placeholder="Tìm kiếm sản phẩm..." className="border border-gray-300 rounded-full py-1.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-48 lg:w-64" />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FiSearch className="text-gray-400 w-4 h-4" />
                </div>
              </div>
              {isAuthenticated && 
                <Link to="/account" className="text-gray-600 hover:text-blue-600 transition-colors p-1 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500" aria-label="Tài khoản">
                  <FiUser className="w-5 h-5 sm:w-6 sm:h-6" />
                </Link>
              }
              {/* 6. Khu vực giỏ hàng đã được cập nhật */}
              <div
                className="relative"
                onMouseEnter={handleMouseEnterCart}
                onMouseLeave={handleMouseLeaveCart}
              >
                <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 transition-colors p-1 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500" aria-label="Giỏ hàng">
                  <FiShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                  {/* Chỉ hiển thị số lượng khi đã đăng nhập và có sản phẩm */}
                  {isAuthenticated && cartItemCount > 0 && (
                     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center pointer-events-none">
                       {cartItemCount}
                     </span>
                  )}
                </Link>

                {/* Hiển thị popup giỏ hàng mini một cách có điều kiện */}
                {isCartPopupOpen && <CartPopup items={cartItems} onClose={closeCartPopup} />}
              </div>

              <button type="button" onClick={toggleMobileMenu} className="lg:hidden text-gray-600 hover:text-blue-600 focus:outline-none p-1 rounded-md focus:ring-1 focus:ring-blue-500" aria-label="Toggle menu" aria-expanded={isMobileMenuOpen} aria-controls="mobile-menu">
                {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>

           {/* Khu vực Mega Menu */}
           <div
             className={`absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 z-40 transition-opacity duration-150 ease-in-out ${activeMenu ? 'opacity-100 visible' : 'opacity-0 invisible'} lg:block hidden`}
             onMouseEnter={handleMouseEnterDropdown}
             onMouseLeave={handleMouseLeaveDropdown}
           >
                <div className="container mx-auto px-4 py-6">
                    {activeMenu === 'nam' && <MegaMenuNam />}
                    {activeMenu === 'nu' && <MegaMenuNu />}
                    {activeMenu === 'the-thao' && <MegaMenuTheThao />}
                    {activeMenu === 'care-share' && <MegaMenuCareShare />}
                </div>
           </div>
        </div>

        {/* Menu cho thiết bị di động */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden bg-white border-b border-gray-200 absolute top-full left-0 w-full z-40 shadow-md transition-transform duration-300 ease-in-out origin-top transform scale-y-100">
           <div className="container mx-auto px-4 py-4">
               <div className="relative mb-4 md:hidden">
                <label htmlFor="mobile-search" className="sr-only">Tìm kiếm sản phẩm</label>
                <input id="mobile-search" type="search" placeholder="Tìm kiếm sản phẩm..." className="border border-gray-300 rounded-full py-1.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full"/>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FiSearch className="text-gray-400 w-4 h-4" />
                </div>
              </div>
             <nav className="flex flex-col space-y-1 font-semibold text-gray-700">
               <NavLink to="/nam" className={({isActive}) => `px-2 py-1.5 rounded hover:bg-gray-100 hover:text-blue-600 transition-colors block ${isActive ? 'text-blue-600 font-bold' : ""}`} onClick={toggleMobileMenu}>NAM</NavLink>
               <NavLink to="/nu" className={({isActive}) => `px-2 py-1.5 rounded hover:bg-gray-100 hover:text-blue-600 transition-colors block ${isActive ? 'text-blue-600 font-bold' : ""}`} onClick={toggleMobileMenu}>NỮ</NavLink>
               <NavLink to="/the-thao" className={({isActive}) => `px-2 py-1.5 rounded hover:bg-gray-100 hover:text-blue-600 transition-colors block ${isActive ? 'text-blue-600 font-bold' : ""}`} onClick={toggleMobileMenu}>THỂ THAO</NavLink>
               <NavLink to="/care-share" className={({isActive}) => `px-2 py-1.5 rounded hover:bg-gray-100 hover:text-blue-600 transition-colors block ${isActive ? 'text-blue-600 font-bold' : ""}`} onClick={toggleMobileMenu}>CARE & SHARE</NavLink>
               <hr className="my-2"/>
               <Link to="/blog" className="px-2 py-1.5 rounded hover:bg-gray-100 hover:text-blue-600 transition-colors block" onClick={toggleMobileMenu}>Blog</Link>
               <Link to="/customer-care" className="px-2 py-1.5 rounded hover:bg-gray-100 hover:text-blue-600 transition-colors block" onClick={toggleMobileMenu}>Trung tâm CSKH</Link>
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

      {/* Các modal đăng nhập/đăng ký */}
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