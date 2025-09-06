
import React from 'react';

interface PlugIconProps { className?: string; }
const PlugIcon: React.FC<PlugIconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22v-5"></path>
    <path d="M9 8V2"></path>
    <path d="M15 8V2"></path>
    <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"></path>
    <path d="M6 2h12v6H6Z"></path>
  </svg>
);
export default PlugIcon;
