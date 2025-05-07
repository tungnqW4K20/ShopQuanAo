import React from 'react';

const FaqArticleCard = ({ title, snippet }) => {
  return (
    <a href="#" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
      <h4 className="font-semibold text-base md:text-lg mb-2 text-coolmate-dark">{title}</h4>
      <p className="text-sm text-gray-600 leading-relaxed">{snippet}</p>
    </a>
  );
};

export default FaqArticleCard;