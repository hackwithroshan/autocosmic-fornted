
import React from 'react';

interface PercentIconProps {
  className?: string;
}

const PercentIcon: React.FC<PercentIconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v.75c0 .414.168.79.44 1.06l4.72 4.72a.75.75 0 001.06 0l4.72-4.72a1.5 1.5 0 00.44-1.06v-.75A2.25 2.25 0 0015.75 7.5h-.75M19.5 19.5l-15-15" />
    <circle cx="8.625" cy="16.875" r="1.125" fill="currentColor" />
    <circle cx="15.375" cy="10.125" r="1.125" fill="currentColor" />
  </svg>
);

export default PercentIcon;
