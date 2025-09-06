
import React from 'react';

interface IndiaFlagIconProps {
  className?: string;
}

const IndiaFlagIcon: React.FC<IndiaFlagIconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    className={className}
    aria-hidden="true"
  >
    <rect x="2" y="5" width="20" height="14" rx="1" fill="#FFF"/>
    <rect x="2" y="5" width="20" height="4.66" fill="#FF9933"/>
    <rect x="2" y="14.33" width="20" height="4.67" fill="#138808"/>
    <circle cx="12" cy="12" r="1.8" fill="none" stroke="#000080" strokeWidth="0.5"/>
    <g stroke="#000080" strokeWidth="0.2">
      {[...Array(24)].map((_, i) => (
        <line
          key={i}
          x1="12"
          y1="12"
          x2={12 + 1.8 * Math.cos(i * (Math.PI / 12))}
          y2={12 + 1.8 * Math.sin(i * (Math.PI / 12))}
        />
      ))}
    </g>
  </svg>
);

export default IndiaFlagIcon;
