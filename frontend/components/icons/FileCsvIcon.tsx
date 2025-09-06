
import React from 'react';

interface FileCsvIconProps { className?: string; }
const FileCsvIcon: React.FC<FileCsvIconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="10" y1="12" x2="10" y2="18"></line>
    <line x1="7" y1="15" x2="10" y2="15"></line>
    <path d="M16.5 12H15v6h1.5"></path>
    <path d="M18.5 12H17v6h1.5"></path>
    <path d="M17.75 12v3h-1.5"></path>
  </svg>
);
export default FileCsvIcon;
