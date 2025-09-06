import React from 'react';

const TabbedContentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="4" fill="#E5E7EB"/>
    <rect x="6" y="8" width="8" height="4" rx="1" fill="#60A5FA"/>
    <rect x="16" y="8" width="8" height="4" rx="1" fill="#9CA3AF"/>
    <rect x="26" y="8" width="8" height="4" rx="1" fill="#9CA3AF"/>
    <rect x="6" y="16" width="36" height="24" rx="2" fill="#9CA3AF"/>
  </svg>
);

export default TabbedContentIcon;