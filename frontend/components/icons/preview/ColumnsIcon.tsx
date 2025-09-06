
import React from 'react';

const ColumnsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="4" fill="#E5E7EB"/>
    <rect x="4" y="6" width="18" height="36" rx="2" fill="#9CA3AF"/>
    <rect x="26" y="6" width="18" height="36" rx="2" fill="#9CA3AF"/>
  </svg>
);

export default ColumnsIcon;