import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// HÀM TIỆN ÍCH
// Chuyển đổi chuỗi thành dạng slug URL thân thiện (ví dụ: "Áo Hoodie Nam" -> "ao-hoodie-nam")
const slugify = (str) => {
  if (!str) return '';
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // Bỏ dấu tiếng Việt
  const from = "àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ·/_,:;";
  const to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd------";
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // Xóa các ký tự không hợp lệ
    .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng gạch nối
    .replace(/-+/g, '-'); // Xóa các gạch nối liền kề

  return str;
};

const CategoryShowcase = () => {
  // State cũ để quản lý tab đang hoạt động
  const [activeCategory, setActiveCategory] = useState('nam'); // 'nam' or 'nu'

  // State mới để lưu dữ liệu từ API và trạng thái tải
  const [maleCategoriesApi, setMaleCategoriesApi] = useState([]);
  const [femaleCategoriesApi, setFemaleCategoriesApi] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Gọi API khi component được render lần đầu
  useEffect(() => {
    const fetchAndCategorize = async () => {
      setIsLoading(true); // Bắt đầu tải
      try {
        const response = await axios.get('https://benodejs-9.onrender.com/api/categories');
        if (response.data && response.data.success) {
          const allCategories = response.data.data;

          // Tự động lọc và phân loại danh mục
          const males = allCategories.filter(cat => cat.name.toLowerCase().includes('nam'));
          const females = allCategories.filter(cat => cat.name.toLowerCase().includes('nữ'));

          setMaleCategoriesApi(males);
          setFemaleCategoriesApi(females);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
        // Bạn có thể thêm state để xử lý lỗi và hiển thị thông báo cho người dùng ở đây
      } finally {
        setIsLoading(false); // Kết thúc tải, dù thành công hay thất bại
      }
    };

    fetchAndCategorize();
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy một lần

  // Logic cũ: chọn mảng danh mục để hiển thị dựa trên tab đang hoạt động
  const categoriesToShow = activeCategory === 'nam' ? maleCategoriesApi : femaleCategoriesApi;

  // Logic cũ: xác định class cho button
  const getButtonClass = (category) => {
    const baseClass = "px-8 py-2 rounded-full font-semibold text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1";
    if (activeCategory === category) {
      return `${baseClass} bg-red-600 text-white focus:ring-red-400`;
    } else {
      return `${baseClass} bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400`;
    }
  };

  return (
    <div className="container mx-auto px-8 py-8 sm:py-12">
      {/* Các nút chuyển tab (giữ nguyên) */}
      <div className="flex justify-center mb-6 sm:mb-8 space-x-3">
        <button
          onClick={() => setActiveCategory('nam')}
          className={getButtonClass('nam')}
        >
          ĐỒ NAM
        </button>
        <button
          onClick={() => setActiveCategory('nu')}
          className={getButtonClass('nu')}
        >
          ĐỒ NỮ
        </button>
      </div>

      {/* Lưới danh mục */}
      {isLoading ? (
        <div className="text-center text-gray-500">Đang tải danh mục...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {categoriesToShow.map((category) => (
            <Link
              key={category.id}
              to={`/category/${slugify(category.name)}`} // Tạo link động
              className="group block text-center transition-opacity hover:opacity-90"
              aria-label={`Xem ${category.name}`}
            >
              <div className="overflow-hidden rounded-lg shadow-sm border border-gray-100">
                <img
                  src={category.image_url} // Dữ liệu từ API
                  alt={category.name} // Dữ liệu từ API
                  className="w-full h-auto object-cover aspect-[3/4] transition-transform duration-300 ease-in-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <p className="mt-2 text-sm font-medium text-gray-800 group-hover:text-blue-600">
                {category.name} {/* Dữ liệu từ API */}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryShowcase;