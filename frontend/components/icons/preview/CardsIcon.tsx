
import React from 'react';

const CardsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="4" fill="#E5E7EB"/>
    <rect x="4" y="8" width="12" height="14" rx="2" fill="#9CA3AF"/>
    <rect x="18" y="8" width="12" height="14" rx="2" fill="#9CA3AF"/>
    <rect x="32" y="8" width="12" height="14" rx="2" fill="#9CA3AF"/>
    <rect x="4" y="26" width="12" height="14" rx="2" fill="#9CA3AF"/>
    <rect x="18" y="26" width="12" height="14" rx="2" fill="#9CA3AF"/>
    <rect x="32" y="26" width="12" height="14" rx="2" fill="#9CA3AF"/>
  </svg>
);

export default CardsIcon;