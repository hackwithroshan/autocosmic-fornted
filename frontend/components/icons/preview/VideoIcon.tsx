
import React from 'react';

const VideoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="4" fill="#E5E7EB"/>
    <rect x="6" y="10" width="36" height="28" rx="2" fill="#9CA3AF"/>
    <path d="M21 20V28L28 24L21 20Z" fill="#F9FAFB"/>
  </svg>
);

export default VideoIcon;