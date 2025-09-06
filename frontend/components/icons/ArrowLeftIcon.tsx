
import React from 'react';

interface ArrowLeftIconProps {
  className?: string;
}

const ArrowLeftIcon: React.FC<ArrowLeftIconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h12" />
  </svg>
);

export default ArrowLeftIcon;
