import React from 'react';
import { Link } from 'react-router-dom';

const bannerData = [
  {
    id: 'men-wear',
    imageUrl: 'https://www.sportsworldngr.com/wp-content/uploads/2023/08/H9637e143f7b64e1c994064ec63c12e5c6.jpg_960x960.webp',
    title: 'MEN WEAR',
    subtitle: 'Giảm 40k đơn đầu tiên từ 299k | Freeship',
    buttonText: 'MUA NGAY',
    buttonLink: '/nam',
  },
  {
    id: 'women-active',
    imageUrl: 'https://5.imimg.com/data5/AA/SW/MY-52076364/girls-sports-wear-500x500.jpg',
    title: 'WOMEN ACTIVE',
    subtitle: 'Mua 2 giảm thêm 10% | Voucher quà đơn 299k',
    buttonText: 'MUA NGAY',
    buttonLink: '/nu',
  },
];

const DualBanner = () => {
  return (
    // Removed py-* and added pb-* to remove top padding/margin
    <div className="container mx-auto px-8 pb-8 sm:pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {bannerData.map((banner) => (
          <div
            key={banner.id}
            className="relative rounded-xl overflow-hidden h-80 sm:h-96 shadow-lg group"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-105"
              style={{ backgroundImage: `url(${banner.imageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 text-shadow">
                {banner.title}
              </h2>
              <p className="text-xs sm:text-sm mb-4 sm:mb-5 text-shadow-sm">
                {banner.subtitle}
              </p>
              <Link
                to={banner.buttonLink}
                className="self-start bg-white text-gray-900 font-semibold text-xs sm:text-sm px-5 py-2 sm:px-6 sm:py-2.5 rounded-full hover:bg-gray-200 transition-colors duration-200"
              >
                {banner.buttonText}
              </Link>
            </div>
             <div className="absolute top-4 left-4 bg-black/50 text-white rounded p-1.5 hidden sm:block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v4m0 0h-4m4 0l-5-5" />
                </svg>
             </div>
          </div>
        ))}
      </div>
      <style jsx global>{`
        .text-shadow { text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); }
        .text-shadow-sm { text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6); }
      `}</style>
    </div>
  );
};

export default DualBanner;