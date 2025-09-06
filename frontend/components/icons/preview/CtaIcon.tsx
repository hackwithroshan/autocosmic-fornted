
import React from 'react';

const CtaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="4" fill="#E5E7EB"/>
    <rect x="6" y="12" width="36" height="24" rx="2" fill="#9CA3AF"/>
    <rect x="18" y="26" width="12" height="6" rx="2" fill="#60A5FA"/>
    <rect x="10" y="16" width="28" height="2" rx="1" fill="#F9FAFB" fillOpacity="0.7"/>
    <rect x="14" y="20" width="20" height="2" rx="1" fill="#F9FAFB" fillOpacity="0.7"/>
  </svg>
);

export default CtaIcon;