import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, CheckIcon } from '@heroicons/react/20/solid';
import RatingStars from './RatingStars'; // Import the helper

// --- Sample Review Data (Replace with actual data prop) ---
const sampleReviewsData = {
  averageRating: 4.8,
  totalReviews: 274,
  reviewsList: [
    { id: 1, authorName: "Thảo", date: "29.04.2025", rating: 5, comment: "Giá tốt, giao hàng nhanh, áo mặc mát mẻ. Ok nha", hasReply: false, images: [] },
    { id: 2, authorName: "Thảo", date: "29.04.2025", rating: 5, comment: "Giá tốt, giao hàng nhanh, áo mặc mát mẻ. Ok nha", hasReply: true, images: [] },
    { id: 3, authorName: "Truong Tien Dat", date: "07.04.2025", rating: 5, comment: "Sản phẩm đẹp, đúng sản phẩm đã đặt, giao hàng nhanh", hasReply: false, images: ['/path/to/img1.jpg'] },
    { id: 4, authorName: "Thảo", date: "17.04.2025", rating: 4, comment: "Sản phẩm tốt, giá cả cạnh tranh, cskh tuyệt vời", hasReply: false, images: [] },
    { id: 5, authorName: "Anh Khoa", date: "15.03.2025", rating: 3, comment: "Áo ổn nhưng màu hơi khác so với ảnh.", hasReply: false, images: [] },
    { id: 6, authorName: "Minh", date: "01.03.2025", rating: 5, comment: "Mua lần thứ 3 rồi, rất hài lòng!", hasReply: true, images: ['/path/to/img2.jpg', '/path/to/img3.jpg'] },
    // ... add more reviews
  ]
};
// --- End Sample Data ---


const ProductReviews = ({ reviewsData = sampleReviewsData }) => {
  const { averageRating, totalReviews, reviewsList = [] } = reviewsData;

  // State for filters and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRatings, setSelectedRatings] = useState([]); // Array of selected numbers [5, 4, ...]
  const [filterHasReply, setFilterHasReply] = useState(false);
  const [filterHasImage, setFilterHasImage] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'highest', 'lowest'

  // State for the reviews to display
  const [displayReviews, setDisplayReviews] = useState([]);

  // --- Filtering and Sorting Logic ---
  useEffect(() => {
    let filtered = [...reviewsList];

    // 1. Filter by Search Term (simple search in comment/author)
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(review =>
        review.comment.toLowerCase().includes(lowerSearchTerm) ||
        review.authorName.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // 2. Filter by Rating
    if (selectedRatings.length > 0) {
      filtered = filtered.filter(review => selectedRatings.includes(review.rating));
    }

    // 3. Filter by Has Reply
    if (filterHasReply) {
      filtered = filtered.filter(review => review.hasReply);
    }

    // 4. Filter by Has Image
    if (filterHasImage) {
      filtered = filtered.filter(review => review.images && review.images.length > 0);
    }

    // 5. Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'newest':
        default:
          // Assuming date is DD.MM.YYYY - convert for proper sorting
          const dateA = a.date.split('.').reverse().join('');
          const dateB = b.date.split('.').reverse().join('');
          return dateB.localeCompare(dateA); // Newest first
      }
    });

    setDisplayReviews(sorted);

  }, [reviewsList, searchTerm, selectedRatings, filterHasReply, filterHasImage, sortBy]);

  // --- Filter Handlers ---
  const handleRatingChange = (rating) => {
    setSelectedRatings(prev =>
      prev.includes(rating)
        ? prev.filter(r => r !== rating) // Remove if already selected
        : [...prev, rating] // Add if not selected
    );
  };

  return (
    <div className="bg-[#F8F8F8] py-12 lg:py-16 mt-12"> {/* Light background */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16">

          {/* --- Left Column: Filters --- */}
          <div className="lg:col-span-4 xl:col-span-3 mb-10 lg:mb-0">
             <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-wide">Đánh giá <br/>Sản phẩm</h2>

              {/* Search Input */}
              <div className="relative mb-6">
                  <input
                      type="text"
                      placeholder="Tìm kiếm đánh giá"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  />
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Phân loại xếp hạng</h3>
                  <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                          <label key={rating} className="flex items-center cursor-pointer">
                              <input
                                  type="checkbox"
                                  checked={selectedRatings.includes(rating)}
                                  onChange={() => handleRatingChange(rating)}
                                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-3"
                              />
                              <span className="text-sm mr-2 text-gray-700">{rating}</span>
                              <RatingStars rating={rating} starClassName="h-4 w-4" />
                          </label>
                      ))}
                  </div>
              </div>

              {/* Verified Purchase Notice */}
               <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs p-3 rounded-md mb-6 flex items-start">
                   <CheckIcon className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0"/>
                   <span>Các review đều đến từ khách hàng đã thực sự mua hàng của Coolmate</span>
               </div>

                {/* Feedback Filters */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Lọc phản hồi</h3>
                  <div className="space-y-2">
                      <label className="flex items-center cursor-pointer">
                          <input
                              type="checkbox"
                              checked={filterHasReply}
                              onChange={(e) => setFilterHasReply(e.target.checked)}
                              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-3"
                          />
                           <span className="text-sm text-gray-700">Đã phản hồi</span>
                      </label>
                       <label className="flex items-center cursor-pointer">
                          <input
                              type="checkbox"
                              checked={filterHasImage}
                              onChange={(e) => setFilterHasImage(e.target.checked)}
                              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-3"
                          />
                           <span className="text-sm text-gray-700">Có hình ảnh</span>
                      </label>
                  </div>
              </div>
          </div>

          {/* --- Right Column: Summary & Reviews --- */}
          <div className="lg:col-span-8 xl:col-span-9">
              {/* Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div className="flex items-center mb-4 sm:mb-0">
                      <span className="text-5xl font-bold text-gray-900 mr-3">{averageRating.toFixed(1)}</span>
                      <div>
                           <RatingStars rating={averageRating} starClassName="h-6 w-6" />
                           <p className="text-sm text-gray-500 mt-0.5">Dựa trên {totalReviews} đánh giá từ khách hàng</p>
                      </div>
                  </div>
                   {/* Sort Dropdown */}
                    <div className="relative">
                         <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none block w-full sm:w-auto bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-full leading-tight focus:outline-none focus:bg-white focus:border-gray-500 focus:ring-1 focus:ring-indigo-500 text-sm shadow-sm"
                         >
                            <option value="newest">Mới nhất</option>
                            <option value="highest">Cao nhất</option>
                            <option value="lowest">Thấp nhất</option>
                            {/* Add other sort options if needed */}
                         </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
              </div>

              {/* Review List */}
              <div className="space-y-6">
                 <p className="text-sm text-gray-600">Hiển thị đánh giá {displayReviews.length > 0 ? `1-${Math.min(10, displayReviews.length)}` : 0} {/* Simple count display */}</p>
                  {displayReviews.length > 0 ? (
                       displayReviews.slice(0, 10).map((review) => ( // Show first 10, add pagination later if needed
                          <div key={review.id} className="bg-white p-5 rounded-lg shadow">
                              <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center">
                                       <span className="font-semibold text-sm text-gray-800 mr-2">{review.authorName}</span>
                                       <span className="text-xs text-gray-400">• {review.date}</span>
                                  </div>
                                  <RatingStars rating={review.rating} starClassName="h-4 w-4" />
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                              {/* Optional: Display images */}
                              {review.images && review.images.length > 0 && (
                                  <div className="mt-3 flex flex-wrap gap-2">
                                      {review.images.map((imgSrc, idx) => (
                                          <img key={idx} src={imgSrc} alt={`Review image ${idx + 1}`} className="h-16 w-16 rounded object-cover border" />
                                      ))}
                                  </div>
                              )}
                               {/* Optional: Display reply indicator */}
                              {review.hasReply && (
                                  <p className="mt-2 text-xs text-blue-600 italic">Đã có phản hồi từ người bán</p>
                              )}
                          </div>
                      ))
                  ) : (
                      <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow">
                          Không có đánh giá nào phù hợp.
                      </div>
                  )}
              </div>
               {/* TODO: Add Pagination if needed */}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductReviews;