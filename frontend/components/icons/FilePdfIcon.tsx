
import React from 'react';

interface FilePdfIconProps { className?: string; }
const FilePdfIcon: React.FC<FilePdfIconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <path d="M8.5 15.5H10v-3H8.5v.75A1.25 1.25 0 0 0 9.75 14h0A1.25 1.25 0 0 0 8.5 15.25V15.5z"></path>
    <path d="M12.5 12.5h1v6h-1Z"></path>
    <path d="M15.5 12.5H17a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-1.5v2H17a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1.5Z"></path>
  </svg>
);
export default FilePdfIcon;
