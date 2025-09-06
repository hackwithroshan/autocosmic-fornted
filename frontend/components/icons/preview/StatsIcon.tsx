
import React from 'react';

const StatsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="4" fill="#E5E7EB"/>
    <rect x="8" y="28" width="8" height="12" rx="1" fill="#9CA3AF"/>
    <rect x="20" y="20" width="8" height="20" rx="1" fill="#9CA3AF"/>
    <rect x="32" y="12" width="8" height="28" rx="1" fill="#9CA3AF"/>
    <path d="M8 8H40" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default StatsIcon;