import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi'; // Using react-icons for star

// Helper function to format currency (basic example)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'đ');
};

const ProductCard = ({ product }) => {
  const {
    id,
    name,
    imageUrl,
    link,
    rating, // { score: 4.8, count: 19 }
    isNew,
    colors, // [{ name: 'Beige', hex: '#f5f5dc' }, { name: 'Black', hex: '#000000' }] or just hex codes
    price,
    originalPrice,
    discountPercent, // e.g., 50 for 50%
  } = product;

  return (
    <div className="flex-shrink-0 w-48 sm:w-56 md:w-60 group">
      <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-3">
        <Link to={link || `/product/${id}`} className="block aspect-[3/4]">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        {rating && (
          <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded-full text-xs font-medium text-gray-800 flex items-center">
            {rating.score.toFixed(1)} <FiStar className="w-3 h-3 ml-0.5 text-yellow-500 fill-current" /> ({rating.count})
          </div>
        )}
        {isNew && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide">
            NEW
          </div>
        )}
      </div>

      {/* Color Swatches */}
      {colors && colors.length > 0 && (
        <div className="flex space-x-1.5 mb-2 justify-start">
          {colors.slice(0, 6).map((color, index) => ( // Limit swatches shown initially
            <button
              key={index}
              aria-label={color.name || `Color ${index + 1}`}
              className="w-4 h-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
              style={{ backgroundColor: color.hex || color }} // Allow direct hex or object
            />
          ))}
          {/* Optionally show more colors indicator */}
          {/* {colors.length > 6 && <span className="text-xs text-gray-500">+{colors.length - 6}</span>} */}
        </div>
      )}

      {/* Product Name */}
      <h3 className="text-sm font-normal text-gray-800 mb-1 group-hover:text-blue-700 transition-colors">
        <Link to={link || `/product/${id}`} className="line-clamp-2">
            {name}
        </Link>
      </h3>

      {/* Price */}
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-sm font-semibold text-gray-900">{formatCurrency(price)}</span>
        {discountPercent && (
          <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
            -{discountPercent}%
          </span>
        )}
        {originalPrice && (
          <span className="text-xs text-gray-400 line-through">{formatCurrency(originalPrice)}</span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;