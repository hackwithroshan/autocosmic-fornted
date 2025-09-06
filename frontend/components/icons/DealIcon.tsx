import React from 'react';

interface DealIconProps {
  className?: string;
}

const DealIcon: React.FC<DealIconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
    <path d="M12 7v6l3 1.5"></path>
  </svg>
);

// A better icon for deals
const DealIcon2: React.FC<DealIconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 13.25a8.95 8.95 0 0 1-1.63 5.25L12 22l-7.37-3.5A9 9 0 0 1 2.25 12a9 9 0 0 1 8.13-8.86" />
    <path d="M12 2v5" />
    <path d="M16.24 7.76l-3.53 3.53" />
    <path d="M22 12h-5" />
  </svg>
);

const DealIcon3: React.FC<DealIconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
    <circle cx="12" cy="16" r="2" />
  </svg>
);


export default DealIcon3;
