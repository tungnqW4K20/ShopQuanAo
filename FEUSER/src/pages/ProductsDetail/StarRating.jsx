// src/components/StarRating.jsx
import React from 'react';

const StarRating = ({
  rating,
  totalStars = 5,
  starSize = "text-xl", // e.g., text-sm, text-md, text-xl, text-2xl
  filledColor = "text-yellow-400",
  emptyColor = "text-gray-300",
  isOverallRating = false // Special handling for the main 4.9-style rating
}) => {
  const stars = [];

  for (let i = 1; i <= totalStars; i++) {
    if (isOverallRating && rating > (i - 1) && rating < i) {
      // Handle partial star for overall rating (like 4.9)
      // This creates a star that is mostly filled using a clip-path.
      // Adjust the percentage for the clip-path as needed.
      const percentage = (rating - (i - 1)) * 100;
      stars.push(
        <span key={i} className={`${starSize} relative inline-block`}>
          <span className={`${emptyColor} absolute`}>★</span>
          <span
            className={`${filledColor} absolute overflow-hidden`}
            style={{ width: `${percentage}%` }}
          >
            ★
          </span>
           {/* Fallback content for screen readers or if CSS clip-path is not supported */}
          <span className="sr-only">{rating} out of {totalStars} stars</span>
        </span>
      );
    } else if (i <= rating) {
      stars.push(<span key={i} className={`${filledColor} ${starSize}`}>★</span>);
    } else {
      stars.push(<span key={i} className={`${emptyColor} ${starSize}`}>★</span>);
    }
  }

  return <div className="flex items-center">{stars}</div>;
};

export default StarRating;