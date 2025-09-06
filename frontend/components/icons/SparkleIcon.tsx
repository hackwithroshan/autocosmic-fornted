
import React from 'react';

interface SparkleIconProps {
  className?: string;
}

const SparkleIcon: React.FC<SparkleIconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17.437 14.846a4.5 4.5 0 01-3.09 3.09L11.5 18.75l2.846.813a4.5 4.5 0 013.09 3.09L18.25 21.75l.813-2.846a4.5 4.5 0 013.09-3.09L23 14.846l-2.846-.813a4.5 4.5 0 01-3.09-3.09L18.25 9l-.813 2.846z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25L11.187 5.096a4.5 4.5 0 01-3.09 3.09L5.25 9l2.846.813a4.5 4.5 0 013.09 3.09L12 15.75l.813-2.846a4.5 4.5 0 013.09-3.09L18.75 9l-2.846-.813a4.5 4.5 0 01-3.09-3.09L12 2.25z" />
  </svg>
);

export default SparkleIcon;
