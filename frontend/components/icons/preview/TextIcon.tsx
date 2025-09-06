
import React from 'react';

const TextIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="4" fill="#E5E7EB"/>
    <rect x="8" y="12" width="32" height="2" rx="1" fill="#9CA3AF"/>
    <rect x="8" y="18" width="32" height="2" rx="1" fill="#9CA3AF"/>
    <rect x="8" y="24" width="24" height="2" rx="1" fill="#9CA3AF"/>
    <rect x="8" y="30" width="32" height="2" rx="1" fill="#9CA3AF"/>
    <rect x="8" y="36" width="18" height="2" rx="1" fill="#9CA3AF"/>
  </svg>
);

export default TextIcon;