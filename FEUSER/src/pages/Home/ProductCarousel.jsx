import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from './ProductCard';

// --- Updated Sample Data ---
const carouselData = {
  title: "SẢN PHẨM MẶC HẰNG NGÀY", // Updated title
  seeMoreLink: "/care-share",      // Updated link
  products: [
    { id: 'cs1', name: 'Áo thun nam Excool logo Coolmate', imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85/uploads/July2024/24CMCW.AT004.1_25.jpg', link: '#', rating: { score: 5, count: 1 }, isNew: true, colors: [{hex:'#fff'}, {hex:'#1d4ed8'}, {hex:'#000'}], price: 199000, originalPrice: null, discountPercent: null, careAndSharePercent: 10 },
    { id: 'cs2', name: 'Pack 3 Quần Shorts Nam kẻ sọc Basics  ', imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85/uploads/May2024/23cmhubx019mix27.jpg', link: '#', rating: { score: 5, count: 1 }, isNew: false, colors: [{hex:'#fff'}, {hex:'#1d4ed8'}, {hex:'#000'}], price: 159000, originalPrice: 199000, discountPercent: 20, careAndSharePercent: 10 },
    { id: 'cs3', name: 'Quần Travel Short', imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85/uploads/March2025/quan-nam-travel-short-7-inch-Xam_2.jpg', link: '#', rating: null, isNew: true, colors: [{hex:'#fff'}, {hex:'#1d4ed8'}, {hex:'#000'}], price: 199000, originalPrice: null, discountPercent: null, careAndSharePercent: 10 },
    { id: 'cs4', name: 'Quần short summer', imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85/uploads/March2025/quan-shorts-summer-cool-7-inch-2-lop-__-_Xanh_nhat_6.jpg', link: '#', rating: null, isNew: true, colors: [{hex:'#fff'}, {hex:'#1d4ed8'}, {hex:'#000'}], price: 199000, originalPrice: null, discountPercent: null, careAndSharePercent: 10 },
    { id: 'cs5', name: 'Quần Chino nam', imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85/uploads/March2025/quan-chino-nam-7-inch-492-den_26.jpg', link: '#', rating: { score: 5, count: 2 }, isNew: true, colors: [{hex:'#fff'}, {hex:'#1d4ed8'}, {hex:'#000'}], price: 199000, originalPrice: null, discountPercent: null, careAndSharePercent: 100 },
    // Add more Care & Share products if available to make scrolling meaningful
    { id: 'p1_copy', name: 'Áo thun nam Excool logo Coolmate (Example)', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR61Leh7YANbzJIBE-fIC9I6Cavr0G15nyakA&s', link: '#', rating: { score: 5, count: 6 }, isNew: false, colors: [{hex:'#333'}], price: 99000, originalPrice: 199000, discountPercent: 50 },
    { id: 'p2_copy', name: 'Pack 3 Quần Shorts Nam kẻ sọc Basics (Example)', imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=80,format=auto/uploads/April2024/short.ke.basic3.7.jpg', link: '#', rating: { score: 4.8, count: 19 }, isNew: false, colors: [{hex:'#9cb6d3'}, {hex:'#a8a29e'}, {hex:'#6082b6'}, {hex:'#6b7280'}, {hex:'#3a5878'}, {hex:'#2c4362'}], price: 249000, originalPrice: null, discountPercent: null },
    { id: 'p3_copy', name: 'Quần nam Travel Shorts 7inch (Example)', imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=80,format=auto/uploads/May2024/quan.shorts.nam.dui.travel.7inch.xam.dam1.jpg', link: '#', rating: { score: 4, count: 2 }, isNew: true, colors: [{hex:'#b7ae9f'}, {hex:'#333'}, {hex:'#2563eb'}], price: 299000, originalPrice: 349000, discountPercent: 14 },

  ]
};
// --- End Sample Data ---

const ProductCarousel = () => {
  const { title, products, seeMoreLink } = carouselData;
  const trackRef = useRef(null); // Ref for the inner track holding products
  const containerRef = useRef(null); // Ref for the outer container to calculate widths
  const [currentOffset, setCurrentOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);
  const [itemWidth, setItemWidth] = useState(240); // Estimate initial item width + gap

  // Calculate max scroll offset and potentially item width
  const calculateLayout = useCallback(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (track && container && products.length > 0) {
        // Calculate item width more dynamically (incl gap) if needed
        const firstItem = track.children[0];
        const style = firstItem ? window.getComputedStyle(firstItem) : null;
        const marginRight = style ? parseFloat(style.marginRight) : 16; // Default gap
        const calculatedItemWidth = firstItem ? firstItem.offsetWidth + marginRight : 240 + 16;
        setItemWidth(calculatedItemWidth);

        const trackWidth = track.scrollWidth;
        const containerWidth = container.clientWidth;
        setMaxOffset(Math.max(0, trackWidth - containerWidth));
    } else {
        setMaxOffset(0);
    }
     // Ensure currentOffset doesn't exceed new maxOffset
     setCurrentOffset(prevOffset => Math.min(prevOffset, maxOffset));

  }, [products, maxOffset]); // Recalculate if products change or maxOffset changes


  useEffect(() => {
    calculateLayout();
    // Recalculate on window resize
    window.addEventListener('resize', calculateLayout);
    return () => window.removeEventListener('resize', calculateLayout);
  }, [calculateLayout]); // Dependency array ensures calculateLayout is stable


  const scroll = (direction) => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8; // Scroll by 80% of visible width

    setCurrentOffset(prevOffset => {
      let newOffset = direction === 'left'
        ? prevOffset - scrollAmount
        : prevOffset + scrollAmount;

      // Clamp the offset between 0 and maxOffset
      newOffset = Math.max(0, Math.min(newOffset, maxOffset));
      return newOffset;
    });
  };

  if (!products || products.length === 0) {
    return null;
  }

  const isAtStart = currentOffset <= 0;
  const isAtEnd = currentOffset >= maxOffset;


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

      <div ref={containerRef} className="relative overflow-hidden"> {/* Outer container for clipping */}
        {/* Left Arrow */}
         <button
          onClick={() => scroll('left')}
          aria-label="Scroll Left"
          disabled={isAtStart}
          className={`absolute -left-3 sm:-left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black p-2 rounded-full shadow-md border border-gray-200 hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-opacity duration-300 ${isAtStart ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <FiChevronLeft className="w-5 h-5 text-white" />
        </button>

        {/* Product Track - This moves */}
        <div
          ref={trackRef}
          className="flex pb-4 transition-transform duration-500 ease-in-out" // Added transition
          style={{ transform: `translateX(-${currentOffset}px)` }} // Apply transform
        >
          {/* Add space/gap using margin on the ProductCard or here */}
          {products.map((product, index) => (
             <div key={product.id} className="mr-4 md:mr-5 lg:mr-6 last:mr-0"> {/* Add margin right for spacing */}
                 <ProductCard product={product} />
             </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll Right"
          disabled={isAtEnd}
          className={`absolute -right-3 sm:-right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black p-2 rounded-full shadow-md border border-gray-200 hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-opacity duration-300 ${isAtEnd ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <FiChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default ProductCarousel;