
import React from 'react';

const HeroIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="4" fill="#E5E7EB"/>
    <rect x="4" y="4" width="40" height="28" rx="2" fill="#9CA3AF"/>
    <rect x="15" y="10" width="18" height="4" rx="1" fill="#F9FAFB" fillOpacity="0.5"/>
    <rect x="12" y="18" width="24" height="2" rx="1" fill="#F9FAFB" fillOpacity="0.5"/>
    <rect x="4" y="36" width="12" height="6" rx="2" fill="#60A5FA"/>
  </svg>
);

export default HeroIcon;