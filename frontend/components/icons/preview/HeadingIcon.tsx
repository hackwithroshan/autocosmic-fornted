
import React from 'react';

const HeadingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="4" fill="#E5E7EB"/>
    <rect x="8" y="14" width="32" height="6" rx="2" fill="#9CA3AF"/>
    <rect x="12" y="26" width="24" height="4" rx="2" fill="#B0B0B0"/>
  </svg>
);

export default HeadingIcon;