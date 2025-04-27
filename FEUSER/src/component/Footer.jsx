import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiArrowRight, FiChevronUp } from 'react-icons/fi';
import { FaFacebookF, FaTiktok, FaInstagram, FaYoutube } from 'react-icons/fa';
// You might need to find a specific Zalo icon or use a placeholder
// import { SiZalo } from 'react-icons/si'; // Example if available

// Placeholder URLs for badges - replace with your actual image URLs or import local images
const ncscImageUrl = 'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2022/handle_cert.png'; // Example path - adjust as needed
const dmcaImageUrl = 'https://media3.coolmate.me/cdn-cgi/image/quality=8…=auto/uploads/March2022/dmca_protected_15_120.png'; // Example path - adjust as needed
const qrImageUrl = 'https://www.coolmate.me/images/footer/Coolmate-info.png';   // Example path - adjust as needed
const boCongThuongImageUrl = 'https://www.coolmate.me/images/footer/logoSaleNoti.png'; // Example path - adjust as needed
const zaloImageUrl = '/images/zalo-icon.png'; // Example path for Zalo floating icon

const Footer = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const checkScrollTop = () => {
            if (!showScrollTop && window.pageYOffset > 300) {
                setShowScrollTop(true);
            } else if (showScrollTop && window.pageYOffset <= 300) {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', checkScrollTop);
        return () => window.removeEventListener('scroll', checkScrollTop); // Cleanup listener
    }, [showScrollTop]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-black text-white pt-12 pb-6">
            <div className="container mx-auto px-4">
                {/* Top Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-10 pb-10 border-b border-gray-700">
                    {/* Left: Text & Button */}
                    <div className="w-full lg:w-1/3 space-y-4">
                        <h2 className="text-xl font-bold">COOLMATE lắng nghe bạn!</h2>
                        <p className="text-sm text-gray-400">
                            Chúng tôi luôn trân trọng và mong đợi nhận được mọi ý kiến đóng góp từ khách hàng để có thể nâng cấp trải nghiệm dịch vụ và sản phẩm tốt hơn nữa.
                        </p>
                        <Link
                            to="/feedback" // Update this path as needed
                            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors text-sm"
                        >
                            ĐÓNG GÓP Ý KIẾN
                            <FiArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </div>

                    {/* Right: Contact & Social */}
                    <div className="w-full lg:w-auto flex flex-col sm:flex-row justify-between lg:justify-start lg:flex-col gap-6 lg:gap-4">
                         {/* Contact Info */}
                         <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <FiPhone className="w-5 h-5 text-gray-400"/>
                                <div>
                                    <p className="text-xs text-gray-400">Hotline</p>
                                    <a href="tel:1900272737" className="font-semibold hover:text-blue-400 transition-colors block">1900.272737 - 028.7777.2737</a>
                                    <p className="text-xs text-gray-400">(8:30 - 22:00)</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-3">
                                <FiMail className="w-5 h-5 text-gray-400"/>
                                <div>
                                    <p className="text-xs text-gray-400">Email</p>
                                    <a href="mailto:Cool@coolmate.me" className="font-semibold hover:text-blue-400 transition-colors block">Cool@coolmate.me</a>
                                </div>
                            </div>
                         </div>
                        {/* Social Icons */}
                        <div className="flex items-center space-x-4">
                            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors border border-gray-600 rounded p-2">
                                <FaFacebookF className="w-4 h-4" />
                            </a>
                             {/* Placeholder for Zalo icon - use correct icon */}
                             <a href="#" aria-label="Zalo" className="text-gray-400 hover:text-white transition-colors border border-gray-600 rounded p-2 flex items-center justify-center w-8 h-8 text-xs font-bold">
                                {/* <SiZalo className="w-4 h-4" /> */}
                                Zalo
                            </a>
                            <a href="#" aria-label="Tiktok" className="text-gray-400 hover:text-white transition-colors border border-gray-600 rounded p-2">
                                <FaTiktok className="w-4 h-4" />
                            </a>
                            <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors border border-gray-600 rounded p-2">
                                <FaInstagram className="w-4 h-4" />
                            </a>
                            <a href="#" aria-label="Youtube" className="text-gray-400 hover:text-white transition-colors border border-gray-600 rounded p-2">
                                <FaYoutube className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Middle Section: Link Columns */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-8 mb-10 text-sm">
                    {/* Column 1 */}
                    <div className="space-y-3">
                        <p className="font-bold mb-2">COOLCLUB</p>
                        <Link to="/club-register" className="block text-gray-400 hover:text-white transition-colors">Đăng kí thành viên</Link>
                        <Link to="/club-benefits" className="block text-gray-400 hover:text-white transition-colors">Ưu đãi & Đặc quyền</Link>

                        <p className="font-bold pt-4 mb-2">TÀI LIỆU - TUYỂN DỤNG</p>
                        <Link to="/careers" className="block text-gray-400 hover:text-white transition-colors">Tuyển dụng</Link>
                        <Link to="/franchise" className="block text-gray-400 hover:text-white transition-colors">Đăng ký bản quyền</Link>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-3">
                        <p className="font-bold mb-2">CHÍNH SÁCH</p>
                        <Link to="/policy/return" className="block text-gray-400 hover:text-white transition-colors">Chính sách đổi trả 60 ngày</Link>
                        <Link to="/policy/promotion" className="block text-gray-400 hover:text-white transition-colors">Chính sách khuyến mãi</Link>
                        <Link to="/policy/privacy" className="block text-gray-400 hover:text-white transition-colors">Chính sách bảo mật</Link>
                        <Link to="/policy/shipping" className="block text-gray-400 hover:text-white transition-colors">Chính sách giao hàng</Link>

                        <p className="font-bold pt-4 mb-2">COOLMATE.ME</p>
                         {/* This might be an external link */}
                         <a href="https://blog.coolmate.me/changelog" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-white transition-colors">
                           Lịch sử thay đổi website
                         </a>
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-3">
                        <p className="font-bold mb-2">CHĂM SÓC KHÁCH HÀNG</p>
                        <Link to="/experience" className="block text-gray-400 hover:text-white transition-colors">Trải nghiệm mua sắm 100% hài lòng</Link>
                        <Link to="/faq" className="block text-gray-400 hover:text-white transition-colors">Hỏi đáp - FAQs</Link>

                        <p className="font-bold pt-4 mb-2">KIẾN THỨC MẶC ĐẸP</p>
                        <Link to="/guides/size-men" className="block text-gray-400 hover:text-white transition-colors">Hướng dẫn chọn size đồ nam</Link>
                        <Link to="/guides/size-women" className="block text-gray-400 hover:text-white transition-colors">Hướng dẫn chọn size đồ nữ</Link>
                         {/* Link to the main blog page */}
                         <Link to="/blog" className="block text-gray-400 hover:text-white transition-colors">Blog</Link>
                    </div>

                    {/* Column 4 */}
                     <div className="space-y-3">
                        <p className="font-bold mb-2">VỀ COOLMATE</p>
                        <Link to="/about/code-of-conduct" className="block text-gray-400 hover:text-white transition-colors">Quy tắc ứng xử của Coolmate</Link>
                        <Link to="/about/101" className="block text-gray-400 hover:text-white transition-colors">Coolmate 101</Link>
                        <Link to="/about/dvk" className="block text-gray-400 hover:text-white transition-colors">DVKH xuất sắc</Link>
                        <Link to="/about/story" className="block text-gray-400 hover:text-white transition-colors">Câu chuyện về Coolmate</Link>
                        <Link to="/about/factory" className="block text-gray-400 hover:text-white transition-colors">Nhà máy</Link>
                        <Link to="/care-share" className="block text-gray-400 hover:text-white transition-colors">Care & Share</Link> {/* Reuse existing route */}
                        <Link to="/about/sustainability" className="block text-gray-400 hover:text-white transition-colors">Cam kết bền vững</Link>
                        <Link to="/about/vision-2030" className="block text-gray-400 hover:text-white transition-colors">Tầm nhìn 2030</Link>
                    </div>

                    {/* Column 5: Address */}
                    <div className="space-y-3 col-span-2 sm:col-span-1"> {/* Take more space if needed on smaller grid */}
                        <p className="font-bold mb-2">ĐỊA CHỈ LIÊN HỆ</p>
                        <p className="text-gray-400 leading-relaxed">
                           <span className="font-semibold text-white block">Văn phòng Hà Nội:</span> Tầng 3 Tòa nhà BMM, KM2, Đường Phùng Hưng, Phường Phúc La, Quận Hà Đông, TP Hà Nội
                        </p>
                         <p className="text-gray-400 leading-relaxed">
                           <span className="font-semibold text-white block">Trung tâm vận hành Hà Nội:</span> Lô C8, KCN Lai Yên, Xã Lai Yên, Huyện Hoài Đức, Thành phố Hà Nội
                        </p>
                         <p className="text-gray-400 leading-relaxed">
                           <span className="font-semibold text-white block">Văn phòng và Trung tâm vận hành TP.HCM:</span> Lô C3, đường D2, KCN Cát Lái, Thạnh Mỹ Lợi, TP. Thủ Đức, TP. Hồ Chí Minh.
                        </p>
                         <p className="text-gray-400 leading-relaxed">
                           <span className="font-semibold text-white block">Trung tâm R&D:</span> T6-01, The Manhattan Vinhomes Grand Park, Long Bình, TP. Thủ Đức
                        </p>
                    </div>
                </div>

                 {/* Bottom Section: Copyright & Badges */}
                 <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-gray-700 text-xs text-gray-500">
                    <div className="text-center md:text-left">
                        <p className="font-semibold text-gray-400 mb-1">@ CÔNG TY TNHH FASTECH ASIA</p>
                        <p>Mã số doanh nghiệp: 0108617038. Giấy chứng nhận đăng ký doanh nghiệp do Sở Kế hoạch và Đầu tư TP Hà Nội cấp lần đầu ngày 20/02/2019.</p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                         {/* Replace src with actual badge images */}
                        <img src={ncscImageUrl} alt="NCSC Verified" className="h-8 md:h-10"/>
                        <img src={dmcaImageUrl} alt="DMCA Protected" className="h-8 md:h-10"/>
                        <img src={qrImageUrl} alt="QR Verified" className="h-8 md:h-10"/>
                        <img src={boCongThuongImageUrl} alt="Bộ Công Thương" className="h-8 md:h-10"/>
                    </div>
                 </div>
            </div>

            {/* Scroll-to-top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-5 left-5 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
                    aria-label="Scroll to top"
                >
                    <FiChevronUp className="w-5 h-5" />
                </button>
            )}

            {/* Placeholder for fixed Zalo button - Implementation might vary (e.g., script) */}
            <a
              href="#" // Add your Zalo link here
              className="fixed bottom-5 right-5 bg-[#0068FF] text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50 flex items-center justify-center"
              aria-label="Chat via Zalo"
              target="_blank"
              rel="noopener noreferrer"
            >
                 {/* Replace with actual Zalo Icon or image */}
                 {/* <img src={zaloImageUrl} alt="Zalo" className="w-6 h-6"/> */}
                 <FiPhone className="w-6 h-6" />
            </a>
        </footer>
    );
};

export default Footer;