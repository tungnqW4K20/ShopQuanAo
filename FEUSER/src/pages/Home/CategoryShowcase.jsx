import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // If cards should link somewhere

// --- Sample Data (Replace with your actual data and image paths) ---
const maleCategories = [
  { id: 'm-ao-thun', name: 'ÁO THUN', imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/April2025/Thun_Nam.jpg', link: '/nam/ao-thun' },
  { id: 'm-ao-polo', name: 'ÁO POLO', imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/April2025/Polo_(1).jpg', link: '/nam/ao-polo' },
  { id: 'm-quan-short', name: 'QUẦN SHORT', imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/April2025/Short_(1).jpg', link: '/nam/quan-short' },
  { id: 'm-quan-lot', name: 'QUẦN LÓT', imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/April2025/Do_lotss.jpg', link: '/nam/quan-lot' },
  { id: 'm-do-boi', name: 'ĐỒ BƠI', imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/April2025/Do_boiss.jpg', link: '/nam/do-boi' },
  { id: 'm-phu-kien', name: 'PHỤ KIỆN', imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/April2025/Phu_Kien-1.jpg', link: '/nam/phu-kien' },
];

const femaleCategories = [
  // Add female category data here - examples below
  { id: 'f-ao-bra', name: 'ÁO BRA', imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/April2025/Bra_-_Leggingzz.jpg', link: '/nu/ao-bra' },
  { id: 'f-quan-legging', name: 'QUẦN LEGGING', imageUrl: 'https://static.sonkimfashion.vn/static/file/image/4678f582093646d9ad1d8d2054967c58/quan-legging-nu-vera-by-chipu-nylon-tron-c0036-den-c0036-p1s400_grande.jpg', link: '/nu/quan-legging' },
  { id: 'f-ao-thun', name: 'ÁO THUN NỮ', imageUrl: 'https://product.hstatic.net/1000402464/product/fwts24ss13g__1__22de0fbc0a8e432fa360a9083379cad5_master.jpg', link: '/nu/ao-thun' },
  { id: 'f-ao-croptop', name: 'ÁO CROPTOP', imageUrl: 'https://dosi-in.com/file/detailed/471/dosiin-cinder-club-ao-croptop-nu-om-body-kieu-day-sexyao-croptop-local-brand-cinder-mau-tre-vai-471475.jpg?w=670&h=670&fit=fill&fm=webp', link: '/nu/ao-croptop' },
  { id: 'f-quan-short', name: 'QUẦN SHORT NỮ', imageUrl: 'https://ruza.vn/wp-content/uploads/2024/07/DSC01569.jpg', link: '/nu/quan-short' },
  { id: 'f-phu-kien', name: 'PHỤ KIỆN NỮ', imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/April2025/Phu_kienzz.jpg', link: '/nu/phu-kien' },
];
// --- End Sample Data ---


const CategoryShowcase = () => {
  const [activeCategory, setActiveCategory] = useState('nam'); // 'nam' or 'nu'

  const categoriesToShow = activeCategory === 'nam' ? maleCategories : femaleCategories;

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
      {/* Category Toggle Buttons */}
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

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {categoriesToShow.map((category) => (
          <Link
            key={category.id}
            to={category.link}
            className="group block text-center transition-opacity hover:opacity-90"
            aria-label={`Xem ${category.name}`}
           >
            <div className="overflow-hidden rounded-lg shadow-sm border border-gray-100">
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-auto object-cover aspect-[3/4] transition-transform duration-300 ease-in-out group-hover:scale-105"
                loading="lazy" // Add lazy loading for images below the fold
              />
               {/* Optional: Add the blue banner if needed, requires more complex styling/data */}
               {/* <div className="absolute bottom-0 left-0 right-0 bg-blue-500 bg-opacity-80 text-white text-[10px] px-2 py-0.5 overflow-hidden whitespace-nowrap text-ellipsis">
                 ⚡ CoolMÁTe mới LōōK ⚡ CoolMÁTe mới LōōK ⚡
               </div> */}
            </div>
            <p className="mt-2 text-sm font-medium text-gray-800 group-hover:text-blue-600">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryShowcase;