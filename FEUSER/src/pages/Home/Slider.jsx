import React, { useState, useEffect, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';

const slidesData = [
  {
    id: 1,
    imageUrl: 'https://icado.vn/wp-content/uploads/2023/07/Tom-Tat-Nhung-Dieu-Ban-Can-Biet-Ve-Quan-Ao-The-Thao-1.webp',
    title: 'PROMAX\nCOLLECTION',
    subtitle: 'Bộ sưu tập quốc dân phù hợp với mọi môn thể thao',
    buttonText: 'KHÁM PHÁ NGAY',
    buttonLink: '/promax-collection',
    buttonStyle: 'light',
    textColor: 'dark',
  },
  {
    id: 2,
    imageUrl: 'https://bizweb.dktcdn.net/100/399/392/files/ao-so-mi-phoi-quan-short-mua-he.jpg?v=1682045991761',
    title: 'SUMMER READY',
    subtitle: 'Giảm 40k đơn từ 299k\nDành cho khách hàng mua lần đầu tại website',
    buttonText: 'MUA NGAY',
    buttonLink: '/khuyen-mai-he',
    buttonStyle: 'dark',
    textColor: 'dark',
  },
    {
    id: 3,
    imageUrl: 'https://dongphucso1.com/wp-content/uploads/2020/11/cvn_3399_915433a048a841a3b2f7f36ce6daa192_master-1.jpg',
    badgeText: 'Quà tặng khách hàng mới',
    badgeStyle: 'red',
    title: 'TẶNG ÁO THUN 249K\nTỰ HÀO VIỆT NAM',
    subtitle: 'Áp dụng cho đơn đầu tiên từ 499k',
    buttonText: 'MUA NGAY',
    buttonLink: '/qua-tang-khach-hang-moi',
    buttonStyle: 'dark',
    textColor: 'dark',
  },
  {
    id: 4,
    imageUrl: 'https://media.vietnamplus.vn/images/7255a701687d11cb8c6bbc58a6c807853cbed793f3c29555e90e0aaa06df9c8edc867ed57930f9ac3d451bfaa64df8f2/0U5A3871.jpg',
    badgeText: 'Mừng đại lễ ra mắt bộ sưu tập',
    badgeStyle: 'flag',
    title: 'TỰ HÀO VIỆT NAM',
    subtitle: '',
    buttonText: 'KHÁM PHÁ NGAY',
    buttonLink: '/tu-hao-viet-nam-collection',
    buttonStyle: 'dark',
    textColor: 'dark',
  },
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayInterval = 6000; // Define interval directly here
  const slides = slidesData; // Use the data defined above

  const goToPrevious = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides.length]);

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides.length]);

  useEffect(() => {
    if (autoPlayInterval && slides.length > 1) {
      const intervalId = setInterval(() => {
        goToNext();
      }, autoPlayInterval);
      return () => clearInterval(intervalId);
    }
  }, [autoPlayInterval, slides.length, goToNext]);

  if (!slides || slides.length === 0) {
    return <div className="h-64 flex items-center justify-center bg-gray-200">No slides available.</div>;
  }

  const currentSlide = slides[currentIndex];
  const textClass = currentSlide.textColor === 'dark' ? 'text-gray-800' : 'text-white';
  const textShadowClass = currentSlide.textColor !== 'dark' ? 'text-shadow' : '';

  const getButtonStyle = (style) => {
    switch (style) {
      case 'dark': return 'bg-black text-white hover:bg-gray-800';
      case 'light': return 'bg-white text-gray-800 hover:bg-gray-200';
      case 'red': return 'bg-red-700 text-white hover:bg-red-800';
      default: return 'bg-black text-white hover:bg-gray-800';
    }
  };

   const getBadgeStyle = (style) => {
    switch (style) {
      case 'red': return 'bg-red-700 text-white';
      case 'flag': return 'bg-red-600 text-white inline-flex items-center';
      default: return 'bg-gray-800 text-white';
    }
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] md:h-[550px] lg:h-[600px] overflow-hidden">
      <div
        className="w-full h-full flex transition-transform ease-out duration-700"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id || index}
            className="w-full h-full flex-shrink-0 relative bg-gray-100"
          >
            <img
              src={slide.imageUrl}
              alt={slide.title || `Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 flex flex-col justify-center items-start p-6 sm:p-12 md:p-20 lg:p-24 ${textClass} ${textShadowClass}`}>
              {slide.badgeText && (
                <span className={`px-3 py-1 text-xs sm:text-sm font-semibold mb-2 rounded ${getBadgeStyle(slide.badgeStyle)}`}>
                  {slide.badgeStyle === 'flag' && <span className="mr-2 text-base">🇻🇳</span>}
                  {slide.badgeText}
                </span>
              )}
               <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 sm:mb-3 leading-tight max-w-xl">
                 {slide.title.split('\n').map((line, i) => (
                    <span key={i} className="block">{line}</span>
                 ))}
               </h1>
              {slide.subtitle && (
                <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 max-w-md">{slide.subtitle.split('\n').map((line, i) => (<span key={i} className="block">{line}</span>))}</p>
              )}
              {slide.buttonText && slide.buttonLink && (
                <a
                  href={slide.buttonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center px-5 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-full transition-colors duration-200 ${getButtonStyle(slide.buttonStyle)}`}
                >
                  {slide.buttonText}
                  <FiArrowRight className="ml-2 w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 focus:outline-none transition-opacity z-10"
            aria-label="Previous Slide"
          >
            <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 focus:outline-none transition-opacity z-10"
            aria-label="Next Slide"
          >
            <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      <style jsx global>{`
        .text-shadow {
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Slider;