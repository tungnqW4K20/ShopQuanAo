import React, { useState, useRef, useEffect } from 'react';

// Data remains the same (no ID prefixes in titles)
const allWhatsNewItems = [
  { id: 1, image: "https://media3.coolmate.me/cdn-cgi/image/width=550,height=623,quality=80,format=auto/uploads/March2025/7_ly_do_nang_nen_chon.jpg", category: "Sự kiện MỚI", date: "21.03.2025", title: "7 lý do vì sao nàng nên sở hữu các item trong BST mới của coolmate", tag: "7 LÝ DO NÀNG NÊN CHỌN", tagBg: "bg-pink-500" },
  { id: 2, image: "https://media3.coolmate.me/cdn-cgi/image/width=550,height=623,quality=80,format=auto/uploads/March2025/coolmate-dong-hanh-cung-giai-chay-women-ekiden-2025.jpg", category: "Sự kiện MỚI", date: "21.03.2025", title: "Coolmate Women Activewear đồng hành cùng Women Ekiden 2025", tag: "COOLMATE WOMEN ACTIVEWEAR", tagBg: "bg-sky-500" },
  { id: 3, image: "https://media3.coolmate.me/cdn-cgi/image/width=550,height=623,quality=80,format=auto/uploads/March2025/BST_Coolmate_Yog__pilates.jpg", category: "Sự kiện MỚI", date: "21.03.2025", title: "5 lý do mà các nàng không thể bỏ lỡ BST Coolmate Yoga & Pilates n?", tag: "TOP 5 LÝ DO", tagBg: "bg-purple-500" },
  { id: 4, image: "https://via.placeholder.com/550x623/FFC0CB/000000?text=New+Item+4", category: "Ưu đãi", date: "22.03.2025", title: "Khám phá ưu đãi mới nhất tháng 3 này", tag: "SALE ALERT", tagBg: "bg-red-500" },
  { id: 5, image: "https://via.placeholder.com/550x623/ADD8E6/000000?text=New+Item+5", category: "Phong cách", date: "23.03.2025", title: "Xu hướng thời trang Xuân Hè 2025 bạn cần biết", tag: "TRENDING", tagBg: "bg-green-500" },
  { id: 6, image: "https://via.placeholder.com/550x623/90EE90/000000?text=New+Item+6", category: "Sự kiện MỚI", date: "24.03.2025", title: "Coolmate ra mắt dòng sản phẩm thân thiện môi trường", tag: "ECO FRIENDLY", tagBg: "bg-teal-500" },
  { id: 7, image: "https://via.placeholder.com/550x623/FFFFE0/000000?text=New+Item+7", category: "Tips hay", date: "25.03.2025", title: "Mẹo bảo quản quần áo thể thao luôn như mới", tag: "LIFE HACK", tagBg: "bg-orange-500" },
];

const LightningIcon = () => <span className="text-sm">⚡</span>;

// Card component remains mostly the same, but its width will be important
const WhatsNewCard = ({ item }) => (
  // Each card will take up 1/3 of the container on large screens due to the parent grid
  // For a sliding carousel, we'd often set a fixed width or flex-shrink: 0
  <div className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] flex-shrink-0"> {/* Adjusted for gap */}
    <div className="bg-white rounded-lg overflow-hidden group w-full flex flex-col h-full">
        <div className="relative">
        <div className="w-full aspect-[550/623]">
            <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
            />
        </div>
        {item.tag && (
            <div className={`absolute top-2 left-2 ${item.tagBg} text-white text-xs font-semibold px-2 py-1 rounded`}>
            {item.tag}
            </div>
        )}
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center">
            <LightningIcon />
        </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 mb-1">
            {item.category} | {item.date}
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-blue-600 cursor-pointer leading-tight h-12 md:h-14 lg:h-16 line-clamp-2 md:line-clamp-3">
            {item.title}
        </h3>
        </div>
    </div>
  </div>
);

const WhatsNewSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // Index of the first visible item
  const [translateX, setTranslateX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const itemsContainerRef = useRef(null);
  const cardWidthRef = useRef(0); // To store the calculated width of a card + gap

  const itemsPerPageLargeScreen = 3; // Number of items visible on lg screens
  const itemsPerPageMediumScreen = 2; // Number of items visible on md screens
  const gap = 24; // Corresponds to gap-6 (1.5rem = 24px)

  // Calculate card width (including gap)
  useEffect(() => {
    if (itemsContainerRef.current && itemsContainerRef.current.children.length > 0) {
      const firstCard = itemsContainerRef.current.children[0];
      if (firstCard) {
        // Get the actual width of a card
        const cardActualWidth = firstCard.offsetWidth;
        cardWidthRef.current = cardActualWidth + gap; // Width of card + gap
      }
    }
    // Add resize listener to recalculate on window resize
    const handleResize = () => {
        if (itemsContainerRef.current && itemsContainerRef.current.children.length > 0) {
            const firstCard = itemsContainerRef.current.children[0];
            if (firstCard) {
                const cardActualWidth = firstCard.offsetWidth;
                cardWidthRef.current = cardActualWidth + gap;
                // Recalculate translateX based on new currentIndex and cardWidth
                setTranslateX(-currentIndex * cardWidthRef.current);
            }
        }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, [allWhatsNewItems]); // Re-calculate if items change


  const handleNext = () => {
    if (isTransitioning) return;
    // Determine how many items are effectively visible based on screen size for slide calculation
    let effectiveItemsPerPage = 1;
    if (window.innerWidth >= 1024) { // lg breakpoint
        effectiveItemsPerPage = itemsPerPageLargeScreen;
    } else if (window.innerWidth >= 768) { // md breakpoint
        effectiveItemsPerPage = itemsPerPageMediumScreen;
    }

    if (currentIndex < allWhatsNewItems.length - effectiveItemsPerPage) {
      setIsTransitioning(true);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    if (currentIndex > 0) {
      setIsTransitioning(true);
      setCurrentIndex(prev => prev - 1);
    }
  };
  
  // Update translateX when currentIndex changes
  useEffect(() => {
    if (cardWidthRef.current > 0) {
      setTranslateX(-currentIndex * cardWidthRef.current);
      // Simulate transition end
      const timer = setTimeout(() => setIsTransitioning(false), 500); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);


  const canGoPrev = currentIndex > 0;
  // Adjust canGoNext based on screen size
  let maxIndex;
  if (typeof window !== 'undefined') { // Ensure window is defined (for SSR or build time)
    if (window.innerWidth >= 1024) { // lg
        maxIndex = allWhatsNewItems.length - itemsPerPageLargeScreen;
    } else if (window.innerWidth >= 768) { // md
        maxIndex = allWhatsNewItems.length - itemsPerPageMediumScreen;
    } else { // sm and xs
        maxIndex = allWhatsNewItems.length - 1;
    }
  } else {
    maxIndex = allWhatsNewItems.length - itemsPerPageLargeScreen; // Default for SSR/build
  }
  const canGoNext = currentIndex < maxIndex;


  return (
    <section className="bg-yellow-200 py-8 sm:py-12 mb-8 sm:mb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Coolmate Có Gì Mới</h2>
          <div className="flex space-x-2">
            <button
              onClick={handlePrev}
              disabled={!canGoPrev || isTransitioning}
              className="bg-white p-2 rounded-full shadow hover:bg-gray-100 text-gray-600 w-8 h-8 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-lg">←</span>
            </button>
            <button
              onClick={handleNext}
              disabled={!canGoNext || isTransitioning}
              className="bg-white p-2 rounded-full shadow hover:bg-gray-100 text-gray-600 w-8 h-8 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-lg">→</span>
            </button>
          </div>
        </div>
        
        {/* Carousel container with overflow hidden */}
        <div className="overflow-hidden relative">
          {/* Inner container that slides. It needs to be a flex container. */}
          <div
            ref={itemsContainerRef}
            className="flex gap-6 transition-transform duration-500 ease-in-out" // Apply transition to transform
            style={{ transform: `translateX(${translateX}px)` }}
          >
            {allWhatsNewItems.map((item) => (
              <WhatsNewCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsNewSection;