import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import axios from 'axios'; // Sử dụng axios để nhất quán với các component khác

// FilterGroup không thay đổi
const FilterGroup = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        )}
      </button>
      {isOpen && <div className="mt-4 space-y-2">{children}</div>}
    </div>
  );
};

// ColorSwatch không thay đổi
const ColorSwatch = ({ colorStyle, name, selected, onClick }) => (
   <button
    onClick={onClick}
    title={name}
    className={`h-6 w-6 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${colorStyle} ${selected ? 'ring-2 ring-offset-1 ring-indigo-500' : ''}`}
  />
);

// SizeButton không thay đổi
const SizeButton = ({ size, selected, onClick }) => (
   <button
    onClick={onClick}
    className={`px-3 py-1 border rounded text-xs transition-colors duration-150 ${
      selected
        ? 'bg-gray-800 text-white border-gray-800 hover:bg-gray-700'
        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
    }`}
  >
    {size}
  </button>
);


// COMPONENT SIDEBAR ĐÃ ĐƯỢC CẬP NHẬT API ENDPOINT
const Sidebar = ({
  sizes,
  colorsData,
  selectedCategory,
  selectedSizes,
  selectedColors,
  onCategoryChange,
  onSizeChange,
  onColorChange,
  onClearFilters
}) => {
  // 1. State để lưu danh sách danh mục, trạng thái tải và lỗi
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. useEffect để gọi API khi component được mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // *** THAY ĐỔI DUY NHẤT: Cập nhật URL của API ***
        const response = await axios.get('https://benodejs-9.onrender.com/api/categories');
        
        // Dựa trên cấu trúc JSON, dữ liệu nằm trong `response.data.data`
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
           throw new Error('Định dạng dữ liệu API không đúng');
        }

      } catch (err) {
        console.error("Không thể tải danh mục:", err);
        // Lưu thông báo lỗi để hiển thị cho người dùng
        setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy một lần

  // Hàm xử lý khi người dùng chọn một danh mục
  const handleCategoryClick = (categoryId) => {
      // Nếu danh mục đã được chọn, bỏ chọn nó (truyền null). Nếu không, chọn nó.
      onCategoryChange(selectedCategory === categoryId ? null : categoryId);
  }

  return (
    <aside className="w-full lg:w-64 xl:w-72 pr-6 mb-8 lg:mb-0">
       <div className="mb-4 text-right">
           <button
             onClick={onClearFilters}
             className="text-xs text-gray-500 hover:text-indigo-600 underline disabled:text-gray-300 disabled:cursor-not-allowed"
             disabled={!selectedCategory && selectedSizes.length === 0 && selectedColors.length === 0}
           >
             Xóa bộ lọc
           </button>
       </div>


      <FilterGroup title="Nhóm sản phẩm">
        {/* 3. Hiển thị có điều kiện dựa trên trạng thái tải và lỗi */}
        {isLoading && <p className="text-sm text-gray-500">Đang tải danh mục...</p>}
        {error && <p className="text-sm text-red-600">Lỗi: {error}</p>}
        {!isLoading && !error && categories.map((category) => (
          <div key={category.id} className="flex items-center cursor-pointer" onClick={() => handleCategoryClick(category.id)}>
            <input
              id={`category-${category.id}`}
              name="category"
              type="radio"
              value={category.id}
              checked={selectedCategory === category.id}
              onChange={() => handleCategoryClick(category.id)}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer"
            />
            <label
              htmlFor={`category-${category.id}`}
              className="ml-3 text-sm text-gray-600 cursor-pointer"
            >
              {category.name}
            </label>
          </div>
        ))}
        {/* Hiển thị thông báo nếu không có danh mục nào */}
        {!isLoading && !error && categories.length === 0 && (
          <p className="text-sm text-gray-500">Không tìm thấy danh mục nào.</p>
        )}
      </FilterGroup>

      <FilterGroup title="Kích cỡ">
         <div className="flex flex-wrap gap-2">
             {sizes.map((size) => (
                <SizeButton
                    key={size}
                    size={size}
                    selected={selectedSizes.includes(size)}
                    onClick={() => onSizeChange(size)}
                />
             ))}
         </div>
      </FilterGroup>

      <FilterGroup title="Màu sắc" defaultOpen={false}>
          <div className="flex flex-wrap gap-3">
              {colorsData.map((color) => (
                <ColorSwatch
                    key={color.hex}
                    colorStyle={color.style}
                    name={color.name}
                    selected={selectedColors.includes(color.hex)}
                    onClick={() => onColorChange(color.hex)}
                 />
              ))}
          </div>
      </FilterGroup>
    </aside>
  );
};

export default Sidebar;