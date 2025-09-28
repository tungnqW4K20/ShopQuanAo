// src/components/Sidebar.js

import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import axios from 'axios';

// Component con không thay đổi
const FilterGroup = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 py-4">
      <button className="flex justify-between items-center w-full text-left" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        {isOpen ? <ChevronUpIcon className="h-5 w-5 text-gray-400" /> : <ChevronDownIcon className="h-5 w-5 text-gray-400" />}
      </button>
      {isOpen && <div className="mt-4 space-y-2">{children}</div>}
    </div>
  );
};

const ColorSwatch = ({ colorStyle, name, selected, onClick }) => (
   <button onClick={onClick} title={name} className={`h-6 w-6 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${colorStyle} ${selected ? 'ring-2 ring-offset-1 ring-indigo-500' : ''}`} />
);

const SizeButton = ({ size, selected, onClick }) => (
   <button onClick={onClick} className={`px-3 py-1 border rounded text-xs transition-colors duration-150 ${selected ? 'bg-gray-800 text-white border-gray-800 hover:bg-gray-700' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'}`}>
    {size}
  </button>
);

// Component Sidebar chính
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
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://benodejs-9.onrender.com/api/categories');
        if (response.data?.success && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
           throw new Error('Định dạng dữ liệu API không đúng');
        }
      } catch (err) {
        console.error("Không thể tải danh mục:", err);
        setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Hàm xử lý đã được đơn giản hóa: chỉ gọi callback lên component cha
  const handleCategoryClick = (categoryId) => {
      const newCategoryId = Number(selectedCategory) === categoryId ? null : categoryId;
      onCategoryChange(newCategoryId);
  }

  return (
    <aside className="w-full lg:w-64 xl:w-72 pr-6 mb-8 lg:mb-0">
       <div className="mb-4 text-right">
           <button
             onClick={onClearFilters} // Chỉ cần gọi callback
             className="text-xs text-gray-500 hover:text-indigo-600 underline disabled:text-gray-300 disabled:cursor-not-allowed"
             disabled={!selectedCategory && selectedSizes.length === 0 && selectedColors.length === 0}
           >
             Xóa bộ lọc
           </button>
       </div>

      <FilterGroup title="Nhóm sản phẩm">
        {isLoading && <p className="text-sm text-gray-500">Đang tải danh mục...</p>}
        {error && <p className="text-sm text-red-600">Lỗi: {error}</p>}
        {!isLoading && !error && categories.map((category) => (
          <div key={category.id} className="flex items-center cursor-pointer" onClick={() => handleCategoryClick(category.id)}>
            <input
              id={`category-${category.id}`}
              name="category"
              type="radio"
              value={category.id}
              checked={Number(selectedCategory) === category.id}
              onChange={() => handleCategoryClick(category.id)}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor={`category-${category.id}`} className="ml-3 text-sm text-gray-600 cursor-pointer">
              {category.name}
            </label>
          </div>
        ))}
        {!isLoading && !error && categories.length === 0 && (
          <p className="text-sm text-gray-500">Không tìm thấy danh mục nào.</p>
        )}
      </FilterGroup>

      <FilterGroup title="Kích cỡ">
         <div className="flex flex-wrap gap-2">
             {sizes.map((size) => ( <SizeButton key={size} size={size} selected={selectedSizes.includes(size)} onClick={() => onSizeChange(size)} /> ))}
         </div>
      </FilterGroup>

      <FilterGroup title="Màu sắc" defaultOpen={false}>
          <div className="flex flex-wrap gap-3">
              {colorsData.map((color) => ( <ColorSwatch key={color.hex} colorStyle={color.style} name={color.name} selected={selectedColors.includes(color.hex)} onClick={() => onColorChange(color.hex)} /> ))}
          </div>
      </FilterGroup>
    </aside>
  );
};

export default Sidebar;