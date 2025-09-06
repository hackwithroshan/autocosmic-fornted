
import React from 'react';

const ImageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="4" fill="#E5E7EB"/>
    <rect x="6" y="10" width="18" height="28" rx="2" fill="#9CA3AF"/>
    <rect x="28" y="14" width="14" height="2" rx="1" fill="#9CA3AF"/>
    <rect x="28" y="20" width="14" height="2" rx="1" fill="#9CA3AF"/>
    <rect x="28" y="26" width="10" height="2" rx="1" fill="#9CA3AF"/>
    <path d="M10 28L14 24L18 28" stroke="#F9FAFB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="16" cy="18" r="2" fill="#F9FAFB"/>
  </svg>
);

export default ImageIcon;