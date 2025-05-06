import React, { useState } from 'react'; // Import useState
import { StarIcon, ShareIcon, CheckCircleIcon, ChatBubbleLeftRightIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
// Adjust path for QuantitySelector and SizeGuideModal as needed
import QuantitySelector from './QuantitySelector';
import SizeGuideModal from './SizeGuideModal'; // Import the modal

// Helper function (same as before)
const formatPrice = (value) => {
  if (value === null || value === undefined) return '';
  return value.toLocaleString('vi-VN') + 'đ';
}

const ProductInfo = ({
  product,
  selectedColor,
  onColorSelect,
  selectedSize,
  onSizeSelect,
  quantity,
  onQuantityChange,
  onAddToCart
}) => {
  const {
    name,
    subTitle,
    rating,
    reviewCount,
    price,
    originalPrice,
    freeship,
    vouchers = [],
    colors = [],
    availableSizes = [],
    policies = [],
    detailedPolicies = [],
    // Add sizeChart if needed by the modal, or manage data within the modal
  } = product;

  // --- State for Size Guide Modal ---
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const openSizeGuide = () => setIsSizeGuideOpen(true);
  const closeSizeGuide = () => setIsSizeGuideOpen(false);
  // --- End State ---


  const discountPercent = originalPrice && price < originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="w-full lg:w-1/2 lg:pl-8 xl:pl-12 mt-6 lg:mt-0">
      {/* ... (Title, Rating, Price, Freeship, Vouchers, Color Selection - unchanged) ... */}
        {/* Title & Subtitle */}
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{name}</h1>
        {subTitle && <p className="text-sm text-gray-500 mt-1">{subTitle}</p>}

        {/* Rating & Share */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center">
            <StarIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            <span className="ml-1 text-sm font-medium text-gray-800">{rating}</span>
            <span className="ml-1 text-sm text-gray-500">({reviewCount} đánh giá)</span>
          </div>
          <button className="flex items-center text-sm text-indigo-600 hover:text-indigo-800">
            <ShareIcon className="h-4 w-4 mr-1" /> Chia sẻ
          </button>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-baseline space-x-2">
          <p className="text-2xl font-bold text-gray-900">{formatPrice(price)}</p>
          {originalPrice && price < originalPrice && (
            <p className="text-lg text-gray-500 line-through">{formatPrice(originalPrice)}</p>
          )}
          {discountPercent > 0 && (
            <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-0.5 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Freeship */}
        {freeship && (
          <div className="mt-2 flex items-center text-sm text-green-600">
            {/* Truck Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.08a1 1 0 01.92.62l1.28 2.14a1 1 0 01.1.29l1.6 6A1 1 0 0118.08 17H17m-5-5h2" />
            </svg>
            Freeship
          </div>
        )}

        {/* Vouchers */}
        <div className="mt-4">
          <span className="text-sm font-medium text-gray-900 mr-3">Mã giảm giá</span>
          <div className="inline-flex flex-wrap gap-2">
              {vouchers.map((voucher, index) => (
                <button key={index} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded border border-orange-200 hover:bg-orange-200">
                  {voucher}
                </button>
              ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900">
            Màu sắc: <span className="font-normal text-gray-700">{selectedColor?.name}</span>
          </h3>
          <div className="mt-2 flex flex-wrap gap-2 relative">
            {colors.slice(0, 9).map((color) => (
              <button
                key={color.name}
                title={color.name}
                onClick={() => onColorSelect(color)}
                className={`relative h-8 w-8 rounded-full border flex items-center justify-center focus:outline-none focus:ring-offset-1 ${
                  selectedColor?.hex === color.hex
                    ? 'ring-2 ring-indigo-500 border-indigo-500'
                    : 'border-gray-300 hover:border-gray-500 hover:ring-1 hover:ring-gray-400'
                }`}
                style={color.hex === '#FFFFFF' ? { boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.1)' } : {}}
              >
                <span
                    style={{ backgroundColor: color.hex }}
                    className="h-full w-full block rounded-full"
                    aria-hidden="true"
                ></span>
                {selectedColor?.hex === color.hex && (
                  <span className="absolute inset-0 flex items-center justify-center">
                      <CheckCircleIcon className="h-4 w-4 text-white mix-blend-difference pointer-events-none" />
                  </span>
                )}
              </button>
            ))}
            {colors.length > 9 && (
                <button className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-500 hover:text-gray-600">
                    <ChevronDownIcon className="h-5 w-5"/>
                </button>
            )}
          </div>
        </div>
        {/* End of Color Selection */}

       {/* Size Selection */}
      <div className="mt-6">
         <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Kích thước áo:</h3>
            {/* --- UPDATED LINK TO BUTTON --- */}
            <button
                onClick={openSizeGuide}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline focus:outline-none"
            >
              Hướng dẫn chọn size
            </button>
            {/* --- END UPDATE --- */}
          </div>
          <div className="mt-2 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2">
             {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => onSizeSelect(size)}
                  className={`py-2 px-3 border rounded text-sm font-medium flex items-center justify-center transition-colors duration-150 ${
                     selectedSize === size
                       ? 'bg-gray-800 text-white border-gray-800 hover:bg-gray-700'
                       : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:border-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400`}
                >
                   {size}
                </button>
             ))}
          </div>
      </div>

      {/* ... (Quantity, Add to Cart, Policies - unchanged) ... */}
       {/* Quantity & Add to Cart */}
      <div className="mt-8 flex items-center gap-4">
         <QuantitySelector
           quantity={quantity}
           onDecrease={() => onQuantityChange(quantity - 1)}
           onIncrease={() => onQuantityChange(quantity + 1)}
         />
         <button
           type="button"
           onClick={onAddToCart}
           disabled={!selectedSize || !selectedColor}
           className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-md text-base font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
         >
           {!selectedColor || !selectedSize ? 'Chọn màu & kích thước' : `Thêm vào giỏ hàng`}
         </button>
      </div>

      {/* Policy Snippets */}
       <div className="mt-6 space-y-3">
          {policies.map((policy, index) => (
             <div key={index} className="flex items-center text-sm text-gray-700 bg-blue-50 p-3 rounded-md border border-blue-100">
               {policy.icon === 'box' && <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />}
               {policy.icon === 'chat' && <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />}
               <span className="flex-1">{policy.text}</span>
               {policy.detailsLink && <a href={policy.detailsLink} className="ml-1 font-medium text-blue-600 hover:text-blue-800">Chi tiết</a>}
               {policy.link && <a href={policy.link} className="ml-1 font-medium text-blue-600 hover:text-blue-800">→</a>}
             </div>
          ))}
       </div>

        {/* Detailed Policies */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 border-t border-gray-200 pt-6">
           {detailedPolicies.map((policy, index) => (
              <div key={index} className="flex items-center">
                 <img src={policy.icon} alt="" className="h-8 w-8 mr-3 flex-shrink-0"/>
                 <p className="text-xs text-gray-600">{policy.text}</p>
              </div>
           ))}
        </div>


      {/* --- Render Modal Conditionally --- */}
      {isSizeGuideOpen && (
        <SizeGuideModal
          onClose={closeSizeGuide}
          // Pass size chart data if needed: sizeChart={product.sizeChart}
        />
      )}
      {/* --- End Modal --- */}

    </div> // End ProductInfo container
  );
};

export default ProductInfo;