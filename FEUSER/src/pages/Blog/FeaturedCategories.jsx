import React from 'react';

const categories = ["Phối đồ", "Xu hướng - phong cách", "Chăm sóc nam giới", "Giải trí"];

const FeaturedCategories = () => {
  return (
    <section className="my-8 sm:my-12 p-6 sm:p-8 border border-gray-200 rounded-lg">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center sm:text-left">
        Chuyên mục nổi bật
      </h2>
      <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-4">
        {categories.map((category) => (
          <button
            key={category}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-full text-sm"
          >
            {category}
          </button>
        ))}
      </div>
      <p className="text-gray-600 text-sm sm:text-base text-center sm:text-left leading-relaxed">
        Coolmate Blog cung cấp những nội dung liên quan đến thế giới thời trang, làm đẹp. Ngoài ra, trang blog luôn cập nhật những chia sẻ ngắn, bí quyết về thời trang, làm đẹp cùng những trang phục đẹp hàng ngày.
      </p>
    </section>
  );
};

export default FeaturedCategories;