
import React from 'react';

interface QuoteIconProps {
  className?: string;
}

const QuoteIcon: React.FC<QuoteIconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path d="M13 14.725c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.668-4.163 5.713 0 3.107 2.472 5.757 5.179 5.757v2.268c-4.478 0-7.999-2.921-7.999-8.14zM0 14.725c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.668-4.163 5.713 0 3.107 2.472 5.757 5.179 5.757v2.268c-4.478 0-7.999-2.921-7.999-8.14z"/>
  </svg>
);

export default QuoteIcon;
