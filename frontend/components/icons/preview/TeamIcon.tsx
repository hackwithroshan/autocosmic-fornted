
import React from 'react';

const TeamIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="4" fill="#E5E7EB"/>
    <circle cx="12" cy="18" r="5" fill="#9CA3AF"/>
    <rect x="7" y="25" width="10" height="12" rx="2" fill="#9CA3AF"/>
    <circle cx="36" cy="18" r="5" fill="#9CA3AF"/>
    <rect x="31" y="25" width="10" height="12" rx="2" fill="#9CA3AF"/>
    <circle cx="24" cy="12" r="6" fill="#B0B0B0"/>
    <rect x="18" y="20" width="12" height="16" rx="2" fill="#B0B0B0"/>
  </svg>
);

export default TeamIcon;