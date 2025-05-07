// src/components/ProductReviews.jsx
import React, { useState } from 'react';
import StarRating from './StarRating'; // Import the StarRating component

// --- Icon Components (can be moved to a separate icons.js file if preferred) ---
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-blue-700">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

const DownArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const ReplyIcon = () => ( // Simple reply icon placeholder
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-500 mr-1">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
  </svg>
);
// --- End Icon Components ---


const ProductReviews = ({ reviewsData }) => {
  if (!reviewsData || !reviewsData.reviewsList || reviewsData.reviewsList.length === 0) {
    // Or render a "No reviews yet" message
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
             <h2 className="text-2xl font-bold text-gray-800 mb-6">ĐÁNH GIÁ SẢN PHẨM</h2>
             <p className="text-gray-600">Chưa có đánh giá nào cho sản phẩm này.</p>
        </div>
    );
  }

  const { averageRating, totalReviews, reviewsList } = reviewsData;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStarFilters, setSelectedStarFilters] = useState([]);
  const [filterReplied, setFilterReplied] = useState(false);
  const [filterHasImages, setFilterHasImages] = useState(false);
  const [sortBy, setSortBy] = useState('Sắp xếp'); // Default sort option

  // Placeholder for pagination and filtering logic
  const displayedReviews = reviewsList.slice(0, 10); // Show first 10 for now

  const starFilterLevels = [5, 4, 3, 2, 1];

  // TODO: Implement actual filtering logic based on state variables

  return (
    <div className="bg-gray-50 py-8 md:py-12"> {/* Outer background for the section */}
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex flex-col md:flex-row md:space-x-6 lg:space-x-8">
          {/* --- Left Sidebar --- */}
          <div className="w-full md:w-1/3 lg:w-1/4 p-4 mb-8 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">ĐÁNH GIÁ SẢN PHẨM</h2>
            
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input 
                type="text" 
                placeholder="Tìm kiếm đánh giá" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Phân loại xếp hạng</h3>
              {starFilterLevels.map(level => (
                <label key={level} className="flex items-center space-x-2.5 mb-2 cursor-pointer hover:bg-gray-100 p-1.5 rounded-md transition-colors">
                  <input 
                    type="checkbox" 
                    className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                    // onChange={() => handleStarFilterChange(level)} 
                    // checked={selectedStarFilters.includes(level)}
                  />
                  <span className="text-sm text-gray-700">{level}</span>
                  <StarRating rating={level} starSize="text-md" />
                </label>
              ))}
            </div>

            <div className="bg-blue-50 text-blue-700 p-3.5 rounded-lg text-sm flex items-start space-x-2 mb-6">
              <CheckIcon />
              <span>
                Các review đều đến từ khách hàng đã thực sự mua hàng của Coolmate
              </span>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Lọc phản hồi</h3>
              <label className="flex items-center space-x-2.5 mb-2 cursor-pointer hover:bg-gray-100 p-1.5 rounded-md transition-colors">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                  checked={filterReplied}
                  onChange={() => setFilterReplied(!filterReplied)}
                />
                <span className="text-sm text-gray-700">Đã phản hồi</span>
              </label>
              <label className="flex items-center space-x-2.5 cursor-pointer hover:bg-gray-100 p-1.5 rounded-md transition-colors">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={filterHasImages}
                  onChange={() => setFilterHasImages(!filterHasImages)}
                />
                <span className="text-sm text-gray-700">Có hình ảnh</span>
              </label>
            </div>
          </div>

          {/* --- Right Review List --- */}
          <div className="w-full md:w-2/3 lg:w-3/4 p-4">
            <div className="flex flex-col sm:flex-row sm:items-end mb-6">
              <div className="flex items-end mr-4 mb-2 sm:mb-0">
                <span className="text-5xl lg:text-6xl font-bold text-gray-800 mr-2">{averageRating.toFixed(1)}</span>
                {/* Use isOverallRating for the main score */}
                <StarRating rating={averageRating} starSize="text-3xl lg:text-4xl" isOverallRating={true} />
              </div>
              <p className="text-sm text-gray-600">Dựa trên {totalReviews} đánh giá đến từ khách hàng</p>
            </div>

            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-600">Hiển thị đánh giá 1-{Math.min(10, displayedReviews.length)}</p>
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-400 focus:ring-1 focus:ring-blue-500 text-sm"
                >
                  <option>Sắp xếp</option>
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="highest_rating">Đánh giá cao</option>
                  <option value="lowest_rating">Đánh giá thấp</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <DownArrowIcon />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {displayedReviews.map(review => (
                <div key={review.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-1.5">
                    <h4 className="font-semibold text-gray-800">{review.authorName}</h4>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                  <div className="mb-2.5">
                    <StarRating rating={review.rating} starSize="text-lg" />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">{review.comment}</p>
                  
                  {review.images && review.images.length > 0 && (
                    <div className="flex space-x-2 mt-2 mb-2">
                      {review.images.map((imgSrc, index) => (
                        <img 
                          key={index} 
                          src={imgSrc} 
                          alt={`Review image ${index + 1}`} 
                          className="w-16 h-16 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                          // onClick={() => handleOpenImageModal(imgSrc)} // Optional: for image zoom
                        />
                      ))}
                    </div>
                  )}

                  {review.hasReply && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500 flex items-center">
                        <ReplyIcon /> Phản hồi từ Coolmate (Click để xem)
                      </p>
                      {/* Placeholder for actual reply content */}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* TODO: Pagination could go here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;