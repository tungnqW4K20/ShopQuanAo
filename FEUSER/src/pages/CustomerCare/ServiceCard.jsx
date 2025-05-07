import React from 'react';

const ServiceCard = ({ icon: Icon, title, description, bgColor = 'bg-white', textColor = 'text-gray-800', iconColor = 'text-coolmate-blue' }) => {
  return (
    <div className={`${bgColor} ${textColor} rounded-lg p-5 md:p-6 flex items-start space-x-4 shadow-md hover:shadow-lg transition duration-300 ease-in-out cursor-pointer`}>
      <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${iconColor} ${bgColor === 'bg-white' ? 'bg-blue-100' : 'bg-white/20'}`}>
        <Icon className="text-2xl md:text-3xl" />
      </div>
      <div>
        <h3 className="font-semibold text-base md:text-lg mb-1">{title}</h3>
        <p className={`text-xs md:text-sm ${bgColor === 'bg-white' ? 'text-gray-600' : 'text-white/80'}`}>{description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;