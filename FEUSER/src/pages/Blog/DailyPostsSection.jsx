import React, { useState } from 'react';

// Expanded list of daily posts - add as many as you need for testing
const allDailyPosts = [
  // Initial 4 from your example
  { id: 1, image: "https://media3.coolmate.me/cdn-cgi/image/width=550,height=623,quality=80,format=auto/uploads/May2025/chay-dien-kinh-la-gi.jpg", title: "Chạy Điền Kinh Là Gì? Cách Chạy Điền Kinh Không Mệt", category: "Sức khỏe & Thể thao", date: "12.05.2025", tag: "CHẠY ĐIỀN KINH", tagSub: "CÁCH CHẠY ĐIỀN KINH KHÔNG MỆT", description: "Khám phá về chạy điền kinh và bí quyết để không mệt mỏi khi tập luyện." },
  { id: 2, image: "https://media3.coolmate.me/cdn-cgi/image/width=550,height=623,quality=80,format=auto/uploads/May2025/cach-phoi-voi-ao-so-mi-linen-nam-cuc-trendy-thoi-trang_65.jpg", title: "8+ cách phối với áo sơ mi linen nam cực trendy, thời trang", category: "Phối đồ", date: "12.05.2025", tag: "ÁO SƠ MI LINEN NAM", tagSub: "CÁCH PHỐI ĐỒ", description: "Những gợi ý phối đồ sành điệu với áo sơ mi linen dành cho nam giới." },
  { id: 3, image: "https://media3.coolmate.me/cdn-cgi/image/width=550,height=623,quality=80,format=auto/uploads/May2025/1-tuan-nen-chay-bo-may-lan-20.jpg", title: "Giải Đáp: 1 Tuần Nên Chạy Bộ Mấy Lần Là Tốt Nhất Cho Bạn?", category: "Sức khỏe & Thể thao", date: "12.05.2025", tag: "1 TUẦN NÊN CHẠY BỘ MẤY LẦN?", tagSub: "GIẢI ĐÁP", description: "Tìm hiểu tần suất chạy bộ lý tưởng trong tuần để đạt hiệu quả tốt nhất." },
  { id: 4, image: "https://media3.coolmate.me/cdn-cgi/image/width=550,height=623,quality=80,format=auto/uploads/May2025/chay-bo-co-nen-doi-mu-khong-8.jpg", title: "Giải Đáp: Chạy Bộ Có Nên Đội Mũ Không?", category: "Giải đáp", date: "12.05.2025", tag: "CHẠY BỘ CÓ NÊN ĐỘI MŨ KHÔNG?", tagSub: "GIẢI ĐÁP", description: "Lợi ích và những lưu ý khi quyết định đội mũ lúc chạy bộ." },
  // Additional posts based on your new images
  { id: 5, image: "https://media3.coolmate.me/cdn-cgi/image/width=550,height=623,quality=80,format=auto/uploads/May2025/cach-chon-va-phoi-ao-so-mi-mac-vest.jpg", title: "10+ Cách Chọn Và Phối Áo Sơ Mi Mặc Vest Chuẩn Lịch Lãm", category: "Phối đồ", date: "12.05.2025", tag: "ÁO SƠ MI MẶC VEST", tagSub: "CÁCH CHỌN VÀ PHỐI", description: "Bạn chưa biết cách chọn áo sơ mi mặc vest? Bài viết này mách bạn cách chọn màu sắc, kiểu dáng sơ mi mặc vest phù hợp, tôn dáng và cực kỳ sang trọng." },
  { id: 6, image: "https://media3.coolmate.me/cdn-cgi/image/width=550,height=623,quality=80,format=auto/uploads/May2025/top-15-vi-tri-in-logo-len-ao-thun-dep-chuan-nhat-2025.jpg", title: "Top 15+ vị trí in logo lên áo thun đẹp và cách chọn chuẩn nhất 2025", category: "Coolxprint Blog", date: "10.05.2025", tag: "VỊ TRÍ IN LOGO ÁO THUN", tagSub: "TOP 15+", description: "Tổng hợp các vị trí in logo lên áo thun đẹp và chuyên nghiệp. Gợi ý vị trí phổ biến: ngực trái, sau gáy, tay áo,... giúp bạn chọn vị trí phù hợp nhất." },
  { id: 7, image: "https://media3.coolmate.me/cdn-cgi/image/width=550,height=623,quality=80,format=auto/uploads/May2025/Lich_Tap_Gym_4_Ngay_1_Tuan_Cho_Nam_Tang_Co_Hieu_Qua.jpg", title: "Lịch Tập Gym 4 Ngày 1 Tuần Cho Nam Tăng Cơ, Giảm Mỡ Hiệu Quả", category: "Sức khỏe & Thể thao", date: "10.05.2025", tag: "LỊCH TẬP GYM 4 NGÀY", tagSub: "LỊCH TẬP GYM NAM", description: "Khám phá lịch tập gym 4 ngày 1 tuần cho nam tối ưu, từ người mới bắt đầu đến tăng cơ, giảm mỡ. Kèm chế độ dinh dưỡng và phục hồi. Tập ngay!" },
  { id: 8, image: "https://media3.coolmate.me/cdn-cgi/image/width=550,height=623,quality=80,format=auto/uploads/May2025/lich-tap-gym-5-ngay-1-tuan.jpg", title: "Lịch Tập Gym 5 Ngày 1 Tuần Cho Nam Giúp Tăng Cơ Bắp Hiệu Quả", category: "Sức khỏe & Thể thao", date: "10.05.2025", tag: "TĂNG CƠ BẮP HIỆU QUẢ CHO NAM", tagSub: "HƯỚNG DẪN LỊCH TẬP 5 NGÀY 1 TUẦN", description: "Lịch tập gym 5 ngày 1 tuần được thiết kế khoa học giúp nam giới tối ưu hóa quá trình tăng cơ, cải thiện vóc dáng và hiệu suất tập luyện. Bài viết cung cấp lộ trình chi tiết theo từng nhóm cơ cùng nguyên t..." },
  { id: 9, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdg95KTit3tX2bLsW3c7Wgcw88awFee9xP5A&s", title: "Chạy Road là gì? Cẩm nang chạy road cho người mới bắt đầu", category: "Sức khỏe & Thể thao", date: "10.05.2025", tag: "ROAD LÀ GÌ", tagSub: "CHẠY", description: "Chạy road là hình thức chạy bộ trên đường bằng, lý tưởng cho người mới bắt đầu rèn luyện sức khỏe và nâng cao thể lực. Bài viết cung cấp kiến thức nền tảng, kỹ thuật cần biết và bí quyết chạy hiệu qu..." },
  // Add more posts here to have enough for "Load More"
  { id: 10, image: "https://via.placeholder.com/550x623/CCCCCC/FFFFFF?text=Sample+Post+10", title: "Tiêu đề bài viết mẫu số 10", category: "Mẹo hay", date: "09.05.2025", tag: "BÀI MẪU", tagSub: "TIPS", description: "Mô tả ngắn cho bài viết mẫu số 10, khám phá những điều thú vị." },
  { id: 11, image: "https://via.placeholder.com/550x623/DDDDDD/FFFFFF?text=Sample+Post+11", title: "Tiêu đề bài viết mẫu số 11", category: "Review", date: "08.05.2025", tag: "ĐÁNH GIÁ", tagSub: "SẢN PHẨM", description: "Mô tả ngắn cho bài viết mẫu số 11, cung cấp thông tin chi tiết." },
  { id: 12, image: "https://via.placeholder.com/550x623/EEEEEE/FFFFFF?text=Sample+Post+12", title: "Tiêu đề bài viết mẫu số 12", category: "Hướng dẫn", date: "07.05.2025", tag: "CẨM NANG", tagSub: "HOW-TO", description: "Mô tả ngắn cho bài viết mẫu số 12, giúp bạn thực hiện dễ dàng." },
];

const LightningIcon = () => <span className="text-sm">⚡</span>; // Or your preferred icon

const PostCard = ({ post }) => (
  <div className="bg-white rounded-lg overflow-hidden group flex flex-col h-full"> {/* Ensure cards can grow to full height */}
    <div className="relative">
      {/* Image container with aspect ratio */}
      <div className="w-full aspect-[550/623]"> 
        <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover" 
        />
      </div>
      {post.tag && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-3 text-center">
          <div className="text-xs font-light uppercase tracking-wider">{post.tagSub}</div>
          <div className="text-base sm:text-lg font-semibold">{post.tag}</div>
        </div>
      )}
      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center">
        <LightningIcon />
      </div>
    </div>
    <div className="p-4 flex flex-col flex-grow"> {/* flex-grow allows text content to push footer down if needed */}
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 cursor-pointer leading-tight">
        {post.title}
      </h3>
      <div className="text-xs text-gray-500 mb-3">
        {post.category} | {post.date}
      </div>
      {/* Adding the description part from your image */}
      {post.description && (
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-auto"> {/* mb-auto pushes this content up, and category/date down */}
            {post.description}
        </p>
      )}
    </div>
  </div>
);


const DailyPostsSection = () => {
  const postsPerPage = 8; // Number of posts to load each time (matches lg:grid-cols-4 * 2 rows ideally)
  const initialPostsToShow = 4; // Number of posts to show initially

  const [visiblePostsCount, setVisiblePostsCount] = useState(initialPostsToShow);

  const handleLoadMore = () => {
    setVisiblePostsCount(prevCount => Math.min(prevCount + postsPerPage, allDailyPosts.length));
  };

  const handleShowLess = () => {
    setVisiblePostsCount(initialPostsToShow);
    // Optional: Scroll to the top of the section when collapsing
    // const sectionElement = document.getElementById('daily-posts-section');
    // if (sectionElement) {
    //   sectionElement.scrollIntoView({ behavior: 'smooth' });
    // }
  };

  const postsToDisplay = allDailyPosts.slice(0, visiblePostsCount);
  const canLoadMore = visiblePostsCount < allDailyPosts.length;
  const showShowLessButton = visiblePostsCount > initialPostsToShow;

  return (
    <section className="py-8 sm:py-12" id="daily-posts-section">
       <div className="mb-6 sm:mb-8 bg-blue-600 p-3 sm:p-4 rounded-md">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Bài mới mỗi ngày</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {postsToDisplay.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Buttons Container */}
      <div className="text-center mt-8 sm:mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
        {canLoadMore && (
          <button 
            onClick={handleLoadMore}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md text-sm sm:text-base"
          >
            Xem thêm
          </button>
        )}
        {showShowLessButton && (
           <button 
            onClick={handleShowLess}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-md text-sm sm:text-base"
          >
            Thu gọn
          </button>
        )}
      </div>
    </section>
  );
};

export default DailyPostsSection;