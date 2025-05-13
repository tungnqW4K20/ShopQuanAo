import React from 'react';

// Placeholder data
const featuredPost = {
  image: "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/September2024/bo-quy-tac-ung-xu-va-dao-duc-cua-coolmate-2024-4393.jpg",
  category: "Sự kiện MỚI",
  date: "23.09.2024",
  title: "[09/2024] COOLMATE công bố bộ quy tắc ứng xử & đạo đức của COOLMATE",
  description: "Coolmate xin trân trọng công bố Bộ Quy tắc Ứng xử & Đạo đức, đây là văn bản quan trọng, là kim chỉ nam định hướng cho mọi hoạt động của công ty, đồng thời thể hiện rõ ràng về những giá trị cốt lõi mà chúng tôi theo đuổi.",
  views: "1924"
};

const mostViewedPosts = [
  { id: 1, image: "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/August2024/cach_phoi_do_nam_di_tap_gym.jpg", title: "Bí kíp phối đồ tập gym nam cực chất lại thoải mái cho chàng", category: "Phối đồ", date: "21.05.2023" },
  { id: 2, image: "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/April2025/tao-dang-chup-anh-nam_(19).jpg", title: "Bí kíp tạo dáng chụp ảnh nam đẹp ngầu như mẫu nam Hàn Quốc", category: "Kinh nghiệm hay", date: "05.10.2024" },
  { id: 3, image: "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/January2022/di-tich-lich-su-viet-nam-11_63.png", category: "Văn hóa", date: "21.01.2022" },
  { id: 4, image: "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/May2023/tho-hay-ve-tinh-yeu.jpg", title: "Thơ Tình Yêu ❤️ 1001+ Bài Thơ Hay & Lãng Mạn Nhất", category: "Trend mới", date: "21.05.2023" },
];

const FeaturedSection = () => {
  return (
    <section className="mb-8 sm:mb-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Featured Post */}
        <div className="lg:w-2/3">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Bài viết nổi bật</h2>
          <div className="bg-white rounded-lg overflow-hidden">
            <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-auto object-cover aspect-[16/9] sm:aspect-[2/1]" />
            <div className="p-4 sm:p-6">
              <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-2">
                <span>{featuredPost.category}</span>
                <span className="mx-2">|</span>
                <span>Ngày đăng: {featuredPost.date}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 hover:text-blue-600 cursor-pointer">
                {featuredPost.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base mb-3 leading-relaxed">
                {featuredPost.description}
              </p>
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <button className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 font-medium flex items-center">
                  {/* Replaced SVG icon with text/simple element */}
                  <span className="mr-1 text-sm">📄</span> {/* Simple document emoji or other char */}
                  THÔNG TIN CÔNG TY
                </button>
                <span className="text-gray-500">Số lượt xem: {featuredPost.views}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Most Viewed */}
        <div className="lg:w-1/3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Xem nhiều nhất</h2>
          <div className="space-y-4">
            {mostViewedPosts.map((post) => (
              <div key={post.id} className="flex items-start space-x-3 group">
                <img src={post.image} alt={post.title} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                <div>
                  <span className="text-xs text-gray-500">{post.category} | {post.date}</span>
                  <h4 className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-blue-600 cursor-pointer leading-tight">
                    {post.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;