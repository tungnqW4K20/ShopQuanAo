import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { findColorClass } from './data'; 
import { Link } from 'react-router-dom';




const ProductCard = ({ product }) => {
  const {
    imageUrl,
    name,
    rating,
    reviews,
    price,
    originalPrice,
    colors = [],
    availableColorCount = 0,
    badge,
    voucher,
    offerText,
  } = product;

  const displayedColors = colors.slice(0, 4);
  const remainingColors = availableColorCount > displayedColors.length ? availableColorCount - displayedColors.length : 0;

  const formatPrice = (value) => {
    if (value === null || value === undefined) return '';
    return value.toLocaleString('vi-VN') + 'đ';
  }

  

  const getBadgeStyle = () => {
     switch (badge) {
      case 'ĐANG MUA':
      case 'BÁN CHẠY':
      case 'COMBO 3':
        return 'bg-red-100 text-red-700 ring-1 ring-inset ring-red-600/10';
      case 'TẶNG QUÀ':
        return 'bg-green-100 text-green-700 ring-1 ring-inset ring-green-600/10';
      case 'NEW':
        return 'bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-600/10';
      default:
        if (badge?.startsWith('VOUCHER') || badge === 'GIẢM GIÁ') {
           return 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-600/20';
        }
        return 'bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-500/10';
    }
  };

  const getBadgeText = () => {
     if (badge?.startsWith('VOUCHER') || badge === 'GIẢM GIÁ') return 'GIẢM GIÁ';
     if (badge === 'TẶNG QUÀ') return 'QUÀ TẶNG';
     return badge;
  }

  const colorSwatchSectionHeight = colors.length > 0 ? 'min-h-[28px]' : 'min-h-[0px]';
  const ratingSectionHeight = rating ? 'min-h-[32px]' : 'min-h-[0px]';


  return (
    <div className="group relative flex flex-col h-full border border-transparent hover:border-gray-200 hover:shadow-md transition duration-200 ease-in-out rounded-lg overflow-hidden">
      
      <div className="relative w-full overflow-hidden bg-gray-100 h-72"> 
        {/* Badge */}
        {badge && (
          <span className={`absolute top-2 left-2 z-10 inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-medium ${getBadgeStyle()}`}>
            {getBadgeText()}
          </span>
        )}
        <Link to={`/products/${product.id}`}>
          <img
            src={imageUrl || 'https://via.placeholder.com/300x400'}
            alt={name}
            className="h-full w-full object-cover object-center group-hover:opacity-85 transition-opacity duration-200" // Will cover the fixed height container
          />
        </Link>
        {/* Offer/Voucher Banner */}
        {(offerText || voucher) && (
           <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end justify-center pb-1 px-2">
            {offerText ? (
              <p className="text-xs font-semibold text-white uppercase tracking-wider truncate text-center bg-green-600/80 px-2 py-0.5 rounded-sm">
                 {offerText}
              </p>
            ) : voucher && (
              <div className="flex items-center justify-center space-x-1 bg-orange-500/95 text-white px-2 py-0.5 rounded-sm shadow">
                <span className="text-xs font-medium uppercase">{voucher}</span>
                 <img src="/images/ticket-icon.svg" alt="voucher" className="h-4 w-4 inline-block ml-1" />
              </div>
            )}
          </div>
        )}
      </div> {/* End Image Container */}

      {/* Details Container */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Color Swatches */}
        <div className={`mb-2 flex items-center space-x-1.5 ${colorSwatchSectionHeight}`}>
          {colors.length > 0 && (
            <>
              {displayedColors.map((hex, index) => (
                <span key={index} className={`block h-4 w-4 rounded-full border border-gray-300 ${findColorClass(hex)}`} title={`Color ${index + 1}`}></span>
              ))}
              {remainingColors > 0 && <span className="text-xs text-gray-500">+{remainingColors}</span>}
            </>
          )}
        </div>

        {/* Product Name */}
       <h3 className="text-sm text-gray-800 font-medium hover:text-indigo-600 h-10 mb-1 line-clamp-2">
        <Link to={`/products/${product.id}`} title={name}>
          <span aria-hidden="true" className="absolute inset-0 z-0" />
          {name}
        </Link>
      </h3>

        {/* Rating */}
        <div className={`flex items-center ${ratingSectionHeight}`}>
          {rating && (
            <>
              <StarIcon className="h-4 w-4 text-yellow-400" aria-hidden="true" />
              <span className="ml-1 text-xs text-gray-600">{rating}</span>
              <span className="ml-1 text-xs text-gray-400">({reviews})</span>
            </>
          )}
        </div>

        {/* Price */}
        <div className="mt-auto pt-2 flex items-baseline space-x-2">
          <p className="text-sm font-semibold text-gray-900">{formatPrice(price)}</p>
          {originalPrice && price < originalPrice && (
            <p className="text-xs text-gray-500 line-through">{formatPrice(originalPrice)}</p>
          )}
          {originalPrice && price < originalPrice && (
            <p className="text-xs font-semibold text-red-600 bg-red-100 px-1 rounded">
              -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
            </p>
          )}
        </div>
      </div> 
    </div> 
  );
};

export default ProductCard;