
import React from 'react';

const AccordionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="4" fill="#E5E7EB"/>
    <rect x="6" y="8" width="36" height="8" rx="2" fill="#9CA3AF"/>
    <rect x="6" y="20" width="36" height="8" rx="2" fill="#9CA3AF"/>
    <rect x="6" y="32" width="36" height="8" rx="2" fill="#9CA3AF"/>
    <path d="M35 12L38 12" stroke="#F9FAFB" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M35 24L38 24" stroke="#F9FAFB" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M35 36L38 36" stroke="#F9FAFB" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default AccordionIcon;