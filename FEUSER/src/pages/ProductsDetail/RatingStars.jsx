import React from 'react';
import { StarIcon as StarSolid } from '@heroicons/react/20/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline'; // Optional for outline style

const RatingStars = ({ rating, maxRating = 5, starClassName = "h-5 w-5", inactiveClassName="text-gray-300", activeClassName="text-yellow-400" }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0; // Not used in the solid star design, but could be added
  const emptyStars = maxRating - Math.ceil(rating);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <StarSolid key={`full-${i}`} className={`${starClassName} ${activeClassName}`} aria-hidden="true" />
      ))}
      {/* Placeholder for potential half-star logic if needed later */}
      {[...Array(emptyStars)].map((_, i) => (
        // Using Solid star but with inactive color to match design
        <StarSolid key={`empty-${i}`} className={`${starClassName} ${inactiveClassName}`} aria-hidden="true" />
        // Or use Outline star:
        // <StarOutline key={`empty-${i}`} className={`${starClassName} ${inactiveClassName}`} aria-hidden="true" />
      ))}
    </div>
  );
};

export default RatingStars;