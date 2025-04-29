import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from './ProductCard'; // Reuse the card component

// --- Data specific to Running Products ---
const carouselData = {
  title: "SẢN PHẨM CHẠY BỘ",
  seeMoreLink: "/chay-bo",
  products: [
    { id: 'run1', name: 'Quần Shorts Chạy Bộ Economy II', imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85/uploads/November2024/QSCBEII_Xanh_ngoc_3.jpg', link: '#', rating: { score: 4.8, count: 119 }, isNew: false, colors: ['#849187', '#6b7280', '#000000', '#adb5bd', '#8f9a9e', '#3b5980'], price: 149000, originalPrice: null, discountPercent: null },
    { id: 'run2', name: 'Quần Lót Nam chạy bộ Fast & Free', imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85/uploads/May2023/trunkcafelot-cao-9.jpg', link: '#', rating: { score: 4.8, count: 154 }, isNew: false, colors: ['#000000', '#212e48', '#495057'], price: 129000, originalPrice: null, discountPercent: null },
    { id: 'run3', name: 'Găng tay đa năng chống tia UV', imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85/uploads/July2023/DSCF9828_24.jpg', link: '#', rating: { score: 4.8, count: 61 }, isNew: false, colors: ['#000000', '#e5e7eb'], price: 99000, originalPrice: null, discountPercent: null },
    { id: 'run4', name: 'Áo Singlet chạy bộ Advanced Vent Tech Graphic Camo', imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85/uploads/April2025/ao-singlet-chay-bo-advanced-vent-techgraphic-camo-412do-nau_50.jpg', link: '#', rating: null, isNew: true, colors: ['#b9a599', '#576c88', '#0077cc'], price: 219000, originalPrice: null, discountPercent: null },
    { id: 'run5', name: 'Áo Singlet chạy bộ Advanced Vent Tech Graphic Pixel', imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85/uploads/April2025/ao-singlet-chay-bo-advanced-vent-techgraphic-pixel-379-vang_87.jpg', link: '#', rating: null, isNew: true, colors: ['#dde5b1', '#0077cc'], price: 219000, originalPrice: null, discountPercent: null },
    // Add more running products if available
     { id: 'p6_copy', name: 'Áo Polo thể thao nam Promax S1 (Example)', imageUrl: 'https://gympassion.vn/upload/store/2022-01-18/ao-polo-the-thao-nam-a638-xanh.jpg', link: '#', rating: { score: 4.7, count: 12 }, isNew: false, colors: [{hex:'#4b5563'},{hex:'#f3f4f6'}], price: 239000, originalPrice: 299000, discountPercent: 20 },
  ]
};
// --- End Sample Data ---

const RunningProductCarousel = () => {
  const { title, products, seeMoreLink } = carouselData;
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);
  const [itemWidth, setItemWidth] = useState(240);

  const calculateLayout = useCallback(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (track && container && products.length > 0) {
        const firstItem = track.children[0];
        const style = firstItem ? window.getComputedStyle(firstItem) : null;
        const marginRight = style ? parseFloat(style.marginRight) : 16;
        const calculatedItemWidth = firstItem ? firstItem.offsetWidth + marginRight : 240 + 16;
        setItemWidth(calculatedItemWidth);

        const trackWidth = track.scrollWidth;
        const containerWidth = container.clientWidth;
        const newMaxOffset = Math.max(0, trackWidth - containerWidth);
        setMaxOffset(newMaxOffset);

        // Adjust current offset if it exceeds the new max offset after recalc
         setCurrentOffset(prevOffset => Math.min(prevOffset, newMaxOffset));

    } else {
        setMaxOffset(0);
    }

  }, [products]); // Only products is a real dependency here

  useEffect(() => {
    // Debounce resize handler
    let timeoutId = null;
    const debouncedCalculateLayout = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            calculateLayout();
        }, 150); // Adjust debounce delay as needed
    };

    calculateLayout(); // Initial calculation
    window.addEventListener('resize', debouncedCalculateLayout);

    // Recalculate after a short delay for potential image loading shifts
     const imageLoadTimeoutId = setTimeout(calculateLayout, 500);

    return () => {
        window.removeEventListener('resize', debouncedCalculateLayout);
        clearTimeout(timeoutId);
        clearTimeout(imageLoadTimeoutId);
    };
  }, [calculateLayout]); // Include calculateLayout here

  const scroll = (direction) => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;

    setCurrentOffset(prevOffset => {
      let newOffset = direction === 'left'
        ? prevOffset - scrollAmount
        : prevOffset + scrollAmount;
      newOffset = Math.max(0, Math.min(newOffset, maxOffset));
      return newOffset;
    });
  };

  if (!products || products.length === 0) {
    return null;
  }

  const isAtStart = currentOffset <= 1; // Add small tolerance
  const isAtEnd = currentOffset >= maxOffset - 1; // Add small tolerance

  return (
    <div className="container mx-auto px-8 py-8 sm:py-12">
      <div className="flex justify-between items-center mb-5 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h2>
        <Link
          to={seeMoreLink}
          className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
        >
          Xem Thêm
        </Link>
      </div>

      <div ref={containerRef} className="relative overflow-hidden">
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll Left"
          disabled={isAtStart}
          className={`absolute -left-3 sm:-left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-md border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity duration-300 ${isAtStart ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <FiChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        <div
          ref={trackRef}
          className="flex pb-4 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentOffset}px)` }}
        >
          {products.map((product) => (
             <div key={product.id} className="mr-4 md:mr-5 lg:mr-6 last:mr-0">
                 <ProductCard product={product} />
             </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          aria-label="Scroll Right"
          disabled={isAtEnd}
          className={`absolute -right-3 sm:-right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-md border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity duration-300 ${isAtEnd ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <FiChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default RunningProductCarousel;