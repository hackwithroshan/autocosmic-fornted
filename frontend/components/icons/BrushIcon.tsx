
import React from 'react';

interface BrushIconProps { className?: string; }
const BrushIcon: React.FC<BrushIconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9.06 11.9L2 22l8.37-8.37M14 8l-1.4-1.4c-1-1-1-2.5 0-3.4l.6-.6c1-1 2.5-1 3.4 0l1.4 1.4c1 1 1 2.5 0 3.4l-.6.6c-1 1-2.5 1-3.4 0Z"></path>
    <path d="m18 12 1-1"></path>
  </svg>
);
export default BrushIcon;
