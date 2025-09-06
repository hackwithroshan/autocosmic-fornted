
import React from 'react';
import StarIcon from './icons/StarIcon';
import { ZainaColor } from '../types'; 

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  starSize?: string; // e.g., 'h-5 w-5'
  color?: string; // Expects a Tailwind color class like 'text-zaina-gold'
  emptyStarColor?: string; // Expects a Tailwind color class like 'text-zaina-neutral-medium'
}

const RatingStars: React.FC<RatingStarsProps> = ({ 
  rating, 
  maxStars = 5, 
  starSize = 'h-5 w-5',
  color = 'text-zaina-gold dark:text-zaina-gold', // Default to gold Tailwind class
  emptyStarColor = 'text-zaina-neutral-medium dark:text-dark-zaina-neutral-medium', 
}) => {
  const stars = [];
  for (let i = 1; i <= maxStars; i++) {
    const filled = i <= rating;
    const halfFilled = !filled && i - 0.5 <= rating;
    
    stars.push(
      <StarIcon 
        key={i} 
        className={`${starSize} ${filled || halfFilled ? color : emptyStarColor}`} 
        filled={filled || halfFilled} 
        halfFilled={halfFilled && !filled} 
        emptyStarColor={emptyStarColor} 
      />
    );
  }
  return <div className="flex items-center">{stars}</div>;
};

export default RatingStars;