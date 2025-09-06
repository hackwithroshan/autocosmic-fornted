
import React from 'react';

const MapIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="4" fill="#E5E7EB"/>
    <path d="M4 10L16 4L28 10L40 4V34L28 40L16 34L4 40V10Z" fill="#9CA3AF"/>
    <path d="M16 4V34" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M28 10V40" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default MapIcon;