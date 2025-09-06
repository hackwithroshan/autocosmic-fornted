
import React from 'react';

const DividerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="4" fill="#E5E7EB"/>
    <line x1="8" y1="24" x2="40" y2="24" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="4 4"/>
  </svg>
);

export default DividerIcon;