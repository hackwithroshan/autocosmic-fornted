
import React from 'react';

interface ScaleIconProps {
  className?: string;
}

const ScaleIcon: React.FC<ScaleIconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    aria-hidden="true"
  >
    <path d="M16 16.5l4-4-4-4"/>
    <path d="M8 7.5l-4 4 4 4"/>
    <path d="M20 12.5H4"/>
  </svg>
);

export default ScaleIcon;
