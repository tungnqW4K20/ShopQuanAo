import React from 'react';
import { FiArrowRight } from 'react-icons/fi'; // Or another arrow icon

const FaqCategoryLink = ({ icon: Icon, label }) => {
  return (
    <a
      href="#" // Replace with actual links later
      className="flex items-center justify-between p-3 rounded-md hover:bg-gray-200 transition duration-200"
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-coolmate-blue">
          <Icon className="text-lg" />
        </div>
        <span className="font-medium text-sm">{label}</span>
      </div>
      <FiArrowRight className="text-gray-400" />
    </a>
  );
};

export default FaqCategoryLink;