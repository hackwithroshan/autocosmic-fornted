
import React from 'react';

interface PackageIconProps {
  className?: string;
}

const PackageIcon: React.FC<PackageIconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10.5 8.25h3M12 3v5.25" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5h16.5M12 3c-2.091 0-3.852.734-5.25 1.909A8.995 8.995 0 003.75 7.5M12 3c2.091 0 3.852.734 5.25 1.909A8.995 8.995 0 0120.25 7.5" />
  </svg>
);

export default PackageIcon;
