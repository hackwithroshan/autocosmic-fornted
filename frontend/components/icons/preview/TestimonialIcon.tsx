
import React from 'react';

const TestimonialIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="4" fill="#E5E7EB"/>
    <circle cx="24" cy="14" r="6" fill="#9CA3AF"/>
    <rect x="10" y="24" width="28" height="2" rx="1" fill="#9CA3AF"/>
    <rect x="12" y="30" width="24" height="2" rx="1" fill="#9CA3AF"/>
    <rect x="16" y="36" width="16" height="2" rx="1" fill="#9CA3AF"/>
  </svg>
);

export default TestimonialIcon;