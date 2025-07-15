import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const FullWidthBanner1 = () => {
  const bannerData = {
    imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/April2025/Running_-_Desktopz1.jpg',
    title: 'RUNNING\nCOLLECTION',
    subtitle: 'Giảm 40k đơn từ 299k dành cho khách hàng mua lần đầu tại website!',
    buttonText: 'MUA NGAY',
    buttonLink: '/collection/casualwear',
    marqueeText: 'CoolMÁTe mọi LOOK',
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] overflow-hidden"> {/* Removed my-8 sm:my-12 */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerData.imageUrl})` }}
        aria-hidden="true"
      />

      <div className="relative z-10 h-full flex flex-col justify-center items-start container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 sm:mb-4 leading-tight text-shadow">
            {bannerData.title.split('\n').map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h1>
          <p className="text-sm sm:text-base text-white mb-5 sm:mb-6 text-shadow-sm">
            {bannerData.subtitle}
          </p>
          <Link
            to={bannerData.buttonLink}
            className="inline-flex items-center bg-white text-blue-600 font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500"
          >
            {bannerData.buttonText}
            <FiArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-8 sm:h-9 bg-blue-600 overflow-hidden z-10">
        <div className="marquee-content flex h-full items-center whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center mx-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-white text-xs sm:text-sm font-medium mr-1">{bannerData.marqueeText.split(' ')[0]}</span>
              <span className="text-black bg-white px-1.5 py-0.5 rounded text-xs sm:text-sm font-bold">{bannerData.marqueeText.split(' ')[1]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- SỬA LỖI Ở ĐÂY --- */}
      <style>{`
        .text-shadow { text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); }
        .text-shadow-sm { text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4); }

        .marquee-content {
          animation: marquee 40s linear infinite;
        }

        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default FullWidthBanner1;