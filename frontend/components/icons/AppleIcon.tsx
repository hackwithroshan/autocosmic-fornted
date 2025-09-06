
import React from 'react';

interface AppleIconProps {
  className?: string;
}

const AppleIcon: React.FC<AppleIconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path d="M19.33,12.25c0,1.75-1.33,3-3.33,3s-3.25-1.12-3.25-2.88c0-1.83,1.42-3.08,3.25-3.08S19.33,10.42,19.33,12.25z M14.58,6.5c-1.5-1.58-3.83-1.67-5.33-0.08c-1.5,1.58-2.5,3.92-2.17,6.17c0.5,3.25,2,6.5,4.67,6.5c0.5,0,1-0.17,1.5-0.17c0.5,0,1.08,0.25,1.5,0.25c2.67,0,3.92-3.25,4.42-6.33C19.5,10.25,17.42,7.67,14.58,6.5z"></path>
  </svg>
);

export default AppleIcon;
