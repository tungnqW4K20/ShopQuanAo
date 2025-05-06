import React, { useState } from 'react';
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

const ImageGallery = ({ images = [], offerBanner }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="w-full lg:w-1/2 bg-gray-200 h-[500px] flex items-center justify-center text-gray-500">No Images</div>; // Placeholder
  }

  const activeImage = images[activeIndex];

  return (
    <div className="w-full lg:w-1/2 lg:sticky lg:top-4 self-start flex flex-col"> {/* Sticky for scroll */}
      <div className="flex flex-col-reverse lg:flex-row gap-4">
        {/* Thumbnails */}
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-hidden lg:h-[500px] lg:overflow-y-auto pb-2 lg:pb-0 lg:pr-2 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-md overflow-hidden border-2 ${
                activeIndex === index ? 'border-indigo-500' : 'border-transparent hover:border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover object-center"
              />
            </button>
          ))}
        </div>

        {/* Main Image */}
        <div className="relative flex-1 aspect-w-1 aspect-h-1 lg:aspect-none lg:h-[500px] rounded-lg overflow-hidden bg-gray-100">
           <img
             src={activeImage.src}
             alt={activeImage.alt}
             className="h-full w-full object-cover object-center"
           />
           <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 bg-white/70 p-1.5 rounded-full">
              <ArrowsPointingOutIcon className="w-5 h-5" />
              {/* Add zoom functionality later */}
           </button>
        </div>
      </div>

      {/* Offer Banner */}
      {offerBanner && (
        <div className="mt-4 rounded-md overflow-hidden">
          <img src={offerBanner} alt="Offer Banner" className="w-full object-contain"/>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;