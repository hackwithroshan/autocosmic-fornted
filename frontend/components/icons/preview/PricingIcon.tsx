
import React from 'react';

const PricingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="4" fill="#E5E7EB"/>
    <rect x="4" y="8" width="12" height="32" rx="2" fill="#9CA3AF"/>
    <rect x="18" y="8" width="12" height="32" rx="2" fill="#60A5FA"/>
    <rect x="32" y="8" width="12" height="32" rx="2" fill="#9CA3AF"/>
    <rect x="7" y="12" width="6" height="2" rx="1" fill="white" fillOpacity="0.7"/>
    <rect x="21" y="12" width="6" height="2" rx="1" fill="white" fillOpacity="0.7"/>
    <rect x="35" y="12" width="6" height="2" rx="1" fill="white" fillOpacity="0.7"/>
  </svg>
);

export default PricingIcon;