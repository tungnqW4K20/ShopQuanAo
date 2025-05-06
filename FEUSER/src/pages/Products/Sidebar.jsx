import React from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

// FilterGroup can remain mostly the same, maybe add defaultOpen={false} for some
const FilterGroup = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  // ... rest of FilterGroup from previous example
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


const ColorSwatch = ({ colorStyle, name, selected, onClick }) => (
   <button
    onClick={onClick}
    title={name}
    className={`h-6 w-6 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${colorStyle} ${selected ? 'ring-2 ring-offset-1 ring-indigo-500' : ''}`}
  />
);

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

const Sidebar = ({
  categories,
  sizes,
  colorsData,
  selectedCategory, // From parent state
  selectedSizes,    // From parent state
  selectedColors,   // From parent state
  onCategoryChange, // Handler from parent
  onSizeChange,     // Handler from parent
  onColorChange,    // Handler from parent
  onClearFilters    // Handler from parent
}) => {

  const handleCategoryClick = (categoryId) => {
      // Allow unselecting by clicking the selected radio again
      onCategoryChange(selectedCategory === categoryId ? null : categoryId);
  }

  return (
    <aside className="w-full lg:w-64 xl:w-72 pr-6 mb-8 lg:mb-0">
      {/* Clear Filters Button - Added */}
       <div className="mb-4 text-right">
           <button
             onClick={onClearFilters}
             className="text-xs text-gray-500 hover:text-indigo-600 underline"
             disabled={!selectedCategory && selectedSizes.length === 0 && selectedColors.length === 0} // Disable if no filters active
           >
             Xóa bộ lọc
           </button>
       </div>


      <FilterGroup title="Nhóm sản phẩm">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center cursor-pointer" onClick={() => handleCategoryClick(category.id)}>
            <input
              id={`category-${category.id}`}
              name="category" // Keep name for grouping, but manage state via parent
              type="radio"
              value={category.id}
              checked={selectedCategory === category.id}
              onChange={() => handleCategoryClick(category.id)} // Still useful for accessibility/keyboard nav
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
      </FilterGroup>

      <FilterGroup title="Kích cỡ">
         <div className="flex flex-wrap gap-2">
             {sizes.map((size) => (
                <SizeButton
                    key={size}
                    size={size}
                    selected={selectedSizes.includes(size)}
                    onClick={() => onSizeChange(size)} // Call parent handler directly
                />
             ))}
         </div>
      </FilterGroup>

      <FilterGroup title="Màu sắc" defaultOpen={false}> {/* Start closed */}
          <div className="flex flex-wrap gap-3">
              {colorsData.map((color) => (
                <ColorSwatch
                    key={color.hex}
                    colorStyle={color.style}
                    name={color.name}
                    selected={selectedColors.includes(color.hex)}
                    onClick={() => onColorChange(color.hex)} // Call parent handler directly
                 />
              ))}
          </div>
      </FilterGroup>

    </aside>
  );
};

export default Sidebar;