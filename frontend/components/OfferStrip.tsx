
import React from 'react';
import { ZainaColor } from '../types';

interface OfferStripProps {
  message: string;
  backgroundColor?: string; 
  textColor?: string;     
}

const OfferStrip: React.FC<OfferStripProps> = ({ 
  message, 
  backgroundColor = 'bg-zaina-cta-peach', 
  textColor = 'text-zaina-white' 
}) => {
  return (
    <div 
      className={`${backgroundColor} ${textColor} py-2.5 px-4 text-center font-body-jost text-sm font-medium`}
      role="alert"
    >
      {message}
    </div>
  );
};

export default OfferStrip;
