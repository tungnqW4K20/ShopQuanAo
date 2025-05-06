import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'; // Import both icons

const ProductDescription = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { features = [], specs = [], proudlyMadeIn, sections: allSections = [], stylingTips } = description || {};

  let firstImageSection = null;
  let remainingSections = [...allSections];

  const firstImageIndex = allSections.findIndex(section => section.type === 'image');
  if (firstImageIndex !== -1) {
    firstImageSection = remainingSections.splice(firstImageIndex, 1)[0];
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-[#F2F2F2] pt-8 pb-16 lg:pt-12 lg:pb-24 mt-8 relative"> {/* Added relative positioning for overlay */}
      {/* Inner container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- Visible Content Always --- */}
        <div>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-10">Mô tả sản phẩm</h1>
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-12 xl:gap-x-16 items-start mb-12">
            {/* Left Column */}
            <div className="lg:col-span-2 mb-10 lg:mb-0">
              {features.length > 0 && (
                <div className="flex flex-wrap justify-start items-center gap-x-6 gap-y-4 sm:gap-x-10 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="text-center flex-shrink-0">
                      <div className="bg-blue-100 p-2 rounded-lg inline-block mb-2 border border-blue-200">
                        <img src={feature.icon} alt={feature.title} className="h-8 w-8" />
                      </div>
                      <p className="text-xs font-semibold text-gray-800">{feature.title}</p>
                    </div>
                  ))}
                </div>
              )}
              {specs.length > 0 && (
                <div className="mb-8">
                  {specs.map((spec, index) => (
                    <div key={index} className="flex justify-between text-sm py-2 border-b border-gray-300 last:border-b-0">
                      <span className="font-semibold text-gray-500 uppercase w-1/3 flex-shrink-0 pr-2">{spec.label}</span>
                      <span className="text-gray-800 text-left w-2/3 break-words">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {proudlyMadeIn && <p className="text-left text-sm text-gray-600 italic">* {proudlyMadeIn}</p>}
            </div>
            {/* Right Column */}
            {firstImageSection && firstImageSection.src && (
              <div className="lg:col-span-3">
                <img
                  src={firstImageSection.src}
                  alt={firstImageSection.alt || 'Product Description Image'}
                  className="w-full h-auto object-cover rounded-lg shadow-sm"
                />
              </div>
            )}
          </div>
        </div>
        {/* --- End of Always Visible Content --- */}


        {/* --- Conditionally Hidden Content --- */}
        {/* Use maxHeight transition for smooth collapse/expand - Requires Tailwind CSS v3+ */}
        {/* Or use a simpler conditional rendering if transitions aren't needed */}
        <div
           className={`transition-all duration-500 ease-in-out overflow-hidden ${
               isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0' // Adjust max-h if content is very long
           }`}
           style={{ transitionProperty: 'max-height, opacity' }} // Explicitly define transitions
        >
          <div className="pt-8"> {/* Add padding top only when expanded content is shown */}
            {/* Dynamic Sections */}
            {remainingSections.length > 0 && (
              <div className="prose prose-sm sm:prose lg:prose-lg">
                {remainingSections.map((section, index) => {
                  // (render logic for sections remains the same)
                  switch (section.type) {
                    case 'image':
                      return section.src ? <img key={index} src={section.src} alt={section.alt || ''} className="my-6 rounded-lg shadow-sm max-w-full h-auto"/> : null;
                    case 'heading':
                      return section.text ? <h3 key={index} className="font-bold text-xl mt-8 mb-3 break-words">{section.text}</h3> : null;
                    case 'subheading':
                      return section.text ? <h4 key={index} className="font-semibold text-lg mt-6 mb-2 break-words">{section.text}</h4> : null;
                    case 'paragraph':
                      return section.text ? <p key={index} className="mb-3">{section.text}</p> : null;
                    case 'link':
                      return section.href && section.text ? <p key={index} className="mb-3"><a href={section.href} className="text-indigo-600 hover:underline break-words">{section.text}</a></p> : null;
                    default:
                      return null;
                  }
                })}
              </div>
            )}

            {/* Styling Tips */}
            {stylingTips && stylingTips.items && stylingTips.items.length > 0 && (
              <div className="mt-12 border-t border-gray-300 pt-8 max-w-3xl">
                {stylingTips.title && <h3 className="text-lg font-semibold text-center mb-5">{stylingTips.title}</h3>}
                <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700 pl-4">
                  {stylingTips.items.map((tip, index) => (
                    tip ? <li key={index}>{tip}</li> : null
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        {/* --- End of Conditionally Hidden Content --- */}


        {/* --- Fade Overlay (Only shown when collapsed) --- */}
        {!isExpanded && (
          <div className="absolute bottom-[88px] left-0 right-0 h-24 bg-gradient-to-t from-[#F2F2F2] via-[#F2F2F2] to-transparent pointer-events-none z-10"></div>
          // Adjusted bottom offset and height slightly to better cover the transition area above the button
        )}

        {/* --- Button (Always Visible) --- */}
        <div className="mt-8 text-center relative z-20"> {/* Ensure button is above overlay */}
          <button
            onClick={toggleExpand}
            className="inline-flex items-center justify-center px-8 py-2.5 border border-gray-400 rounded-full text-sm font-medium text-gray-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
          >
            {isExpanded ? 'Thu gọn' : 'Xem thêm'}
            {isExpanded ? (
              <ChevronUpIcon className="ml-2 h-5 w-5 text-gray-500" aria-hidden="true" />
            ) : (
              <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-500" aria-hidden="true" />
            )}
          </button>
        </div>

      </div> {/* End Inner container */}
    </div> // End Outer wrapper
  );
};

export default ProductDescription;