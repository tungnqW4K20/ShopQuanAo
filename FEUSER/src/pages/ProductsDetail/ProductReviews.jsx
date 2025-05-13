import React, { useState } from 'react';

// --- Mock Data (Now inside ProductReviews.jsx) ---
const mockReviewsData = {
  averageRating: 4.7,
  totalReviews: 158,
  reviewsList: [
    { 
      id: 'rev001', 
      email: "dinhanhtravelbg@gmail.com", 
      authorName: "Dinh Anh",
      date: "03.05.2025", 
      rating: 5, 
      comment: "Chất liệu và phom dáng chưa bao giờ làm mình thất vọng. Vải mát, co giãn tốt, mặc tập gym rất thoải mái.",
      images: [] 
    },
    { 
      id: 'rev002', 
      email: "thaonguyen@example.com",
      authorName: "Thảo Nguyễn", 
      date: "01.05.2025", 
      rating: 4, 
      comment: "Áo đẹp, chất lượng tốt. Giao hàng nhanh. Chỉ có điều màu xám hơi tối hơn so với ảnh web một chút.",
      images: []
    },
    { 
      id: 'rev003', 
      email: "minhduc.athlete@sport.com", 
      authorName: "Minh Đức",
      date: "28.04.2025", 
      rating: 5, 
      comment: "Sản phẩm tuyệt vời! Mua 2 cái để thay đổi. Vải thấm hút mồ hôi cực tốt, vận động không bị bí.",
      // Assuming you have these in public/images/ or use full URLs
      images: ['/images/review-placeholder-1.jpg'] 
    },
    { 
      id: 'rev004', 
      email: "user123@domain.net", 
      authorName: "User123",
      date: "25.04.2025", 
      rating: 3, 
      comment: "Áo bình thường, không quá đặc sắc. Giá hơi cao so với chất lượng nhận được.",
      images: [] 
    },
    { 
      id: 'rev005', 
      email: "coolfan@mail.co", 
      authorName: "Cool Fan",
      date: "22.04.2025", 
      rating: 5, 
      comment: "Yêu Coolmate! Áo này là item thứ 5 mình mua rồi. Luôn hài lòng.",
      images: ['/images/review-placeholder-2.jpg', '/images/review-placeholder-3.jpg']
    },
    { 
      id: 'rev006', 
      email: "another.reviewer@example.org", 
      authorName: "Reviewer Nữa",
      date: "20.04.2025", 
      rating: 4, 
      comment: "Form áo chuẩn, mặc lên tôn dáng. Hy vọng shop ra thêm nhiều màu mới.",
      images: [] 
    },
  ]
};

// --- Helper Components (StarRating, SearchIcon, CheckIcon, ReviewCard) ---
// These remain the same as in the previous version of ProductReviews.jsx

const StarRating = ({ rating, totalStars = 5, filledColor = "text-yellow-400", emptyColor = "text-gray-300" }) => {
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span key={index} className={`text-xl ${starValue <= rating ? filledColor : emptyColor}`}>
            ★
          </span>
        );
      })}
    </div>
  );
};

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
    </svg>
);

const ReviewCard = ({ review }) => (
  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm mb-4">
    <div className="flex items-center mb-2">
      <span className="font-semibold text-sm text-gray-800">{review.authorName || review.email || "Khách hàng"}</span>
      <span className="text-gray-400 mx-2 text-xs">•</span>
      <span className="text-gray-500 text-xs">{review.date}</span>
    </div>
    <StarRating rating={review.rating} />
    <p className="text-gray-700 text-sm mt-2 leading-relaxed">{review.comment}</p>
    {review.images && review.images.length > 0 && (
      <div className="mt-3 flex flex-wrap gap-2">
        {review.images.map((imgUrl, index) => (
          <img 
            key={index} 
            src={imgUrl} 
            alt={`Review image ${index + 1}`} 
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md border border-gray-200" 
          />
        ))}
      </div>
    )}
  </div>
);


// --- Main ProductReviews Component ---
// If props are passed, they will override the mock data. Otherwise, mock data is used.
const ProductReviews = ({ 
  averageRating: propAverageRating, 
  totalReviews: propTotalReviews, 
  reviewsList: propReviewsList 
}) => {
  // Use passed props if available, otherwise default to mockData
  const averageRating = propAverageRating !== undefined ? propAverageRating : mockReviewsData.averageRating;
  const totalReviews = propTotalReviews !== undefined ? propTotalReviews : mockReviewsData.totalReviews;
  const reviewsList = propReviewsList && propReviewsList.length > 0 ? propReviewsList : mockReviewsData.reviewsList;

  const ratingFilters = [5, 4, 3, 2, 1];
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviewsList.slice(indexOfFirstReview, indexOfLastReview);
  const displayedReviewCount = Math.min(indexOfLastReview, totalReviews);

  // --- Pagination Handlers ---
  const totalPages = Math.ceil(reviewsList.length / reviewsPerPage);
  const handlePrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));

  return (
    <div className="bg-gray-50 py-10 sm:py-12 md:py-16 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 leading-tight">
            ĐÁNH GIÁ <br className="hidden sm:block md:hidden" /> SẢN PHẨM
          </h1>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center">
              <span className="text-4xl sm:text-5xl font-bold text-gray-800 mr-2">
                {averageRating ? averageRating.toFixed(1) : 'N/A'}
              </span>
              <StarRating rating={averageRating || 0} filledColor="text-yellow-400" emptyColor="text-yellow-400 opacity-40" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Dựa trên {totalReviews || 0} đánh giá đến từ khách hàng</p>
          </div>
        </div>

        {/* Search and Sort Section (UI Only) */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 md:mb-8 gap-4">
          <div className="relative w-full md:w-auto md:flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm đánh giá"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm"
            />
          </div>
          <div className="relative w-full md:w-auto">
            <select className="appearance-none w-full md:w-auto bg-white border border-gray-200 text-gray-700 py-2.5 px-4 pr-8 rounded-full leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm shadow-sm">
              <option>Sắp xếp</option>
              <option>Mới nhất</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        {/* Main Content: Filters and Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Filters Column (Sidebar - UI Only) */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Phân loại xếp hạng</h3>
              <div className="space-y-2.5">
                {ratingFilters.map(rating => (
                  <label key={rating} className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0" />
                    <StarRating rating={rating} />
                  </label>
                ))}
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg flex items-start space-x-2 text-blue-700">
              <div className="bg-blue-600 rounded-sm p-0.5 mt-0.5"><CheckIcon/></div>
              <p className="text-xs leading-snug">Các review đều đến từ khách hàng đã thực sự mua hàng của Coolmate</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Lọc phản hồi</h3>
              <div className="space-y-2.5">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0" />
                  <span className="text-sm text-gray-700">Đã phản hồi</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0" />
                  <span className="text-sm text-gray-700">Có hình ảnh</span>
                </label>
              </div>
            </div>
          </div>

          {/* Reviews List Column */}
          <div className="lg:col-span-9">
            <p className="text-sm text-gray-500 mb-4">
              Hiển thị đánh giá {currentReviews.length > 0 ? indexOfFirstReview + 1 : 0}-{displayedReviewCount} trên tổng {totalReviews || 0}
            </p>
            {currentReviews.length > 0 ? (
              currentReviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <p className="text-gray-600">Không có đánh giá nào.</p>
            )}
            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                    <button 
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 mx-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                        Trước
                    </button>
                    {/* You can add page number indicators here if desired */}
                    <span className="px-4 py-2 mx-1 text-sm text-gray-700">
                        Trang {currentPage} / {totalPages}
                    </span>
                    <button 
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 mx-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                        Sau
                    </button>
                </div>
            )}
          </div>
        </div>
      </div>
      {/* Floating Action Button (FAB) - Zalo/Hotline UI Only */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-yellow-400 text-blue-700 p-3 rounded-full shadow-lg hover:bg-yellow-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5h-1.528a1.5 1.5 0 0 1-1.471-1.258l-.203-.608a13.042 13.042 0 0 1-8.608-8.608l-.608-.203A1.5 1.5 0 0 1 2 5.028V3.5Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductReviews;