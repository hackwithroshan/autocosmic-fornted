
import React from 'react';

interface StarIconProps {
  className?: string; // Expects size and color for the filled part (e.g., "h-5 w-5 text-zaina-primary")
  filled: boolean;
  halfFilled?: boolean; 
  emptyStarColor?: string; // e.g. "text-zaina-silver-accent", used for half-star background
}

const starPolygonPoints = "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2";
const leftHalfStarPath = "M12 2 V17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 Z";

const StarIcon: React.FC<StarIconProps> = ({ 
  className, 
  filled, 
  halfFilled, 
  emptyStarColor = 'text-zaina-silver-accent'
}) => {
  if (halfFilled) {
    return (
      <svg 
        viewBox="0 0 24 24" 
        className={className} // This has the size and fill color class
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Background empty star (outline) */}
        <g className={emptyStarColor}>
          <polygon points={starPolygonPoints} fill="none" stroke="currentColor" strokeWidth="1.5" />
        </g>
        {/* Foreground filled half star */}
        <path d={leftHalfStarPath} fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    );
  }

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill={filled ? "currentColor" : "none"} 
      stroke="currentColor"
      strokeWidth="1.5" 
      className={className}
      aria-hidden="true" 
    >
      <polygon points={starPolygonPoints}></polygon>
    </svg>
  );
};

export default StarIcon;