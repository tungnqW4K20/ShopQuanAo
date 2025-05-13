import React from 'react';

// Single placeholder image for the entire banner.
const heroBannerImageUrl = "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/December2023/mceclip0_75.png"; // Example: Replace with your actual image

const HeroBanner = () => {
  return (
    <div 
      className="relative w-full h-[200px] sm:h-[200px] md:h-[250px] bg-cover bg-center text-white mb-6 sm:mb-8 mt-4"
      style={{ backgroundImage: `url('${heroBannerImageUrl}')` }}
    >
      {/* Optional: Add a semi-transparent overlay for better text readability */}
      {/* <div className="absolute inset-0 bg-black opacity-30 z-0"></div> */}

      {/* COOLMATE Logo - Positioned at top-left */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-black text-white px-3 py-1 text-sm sm:text-lg font-bold z-20">
        COOLMATE
      </div>
      
      {/* COOLBLOG Text - Centered horizontally and positioned vertically */}
      <div className="absolute inset-0 flex items-center justify-center z-10"> 
        {/* 
          This outer div with `inset-0 flex items-center justify-center` will center its child vertically and horizontally.
          If you want "COOLBLOG" to be slightly lower than true center (e.g. to account for the logo),
          you can add padding-top to this div or margin-top to the h1.
        */}
        <div className="text-center pt-0 sm:pt-2 md:pt-4"> {/* Adjust pt-* (padding-top) as needed */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider z-100 text-black">
            COOLBLOG
          </h1>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;