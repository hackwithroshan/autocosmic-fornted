
import React, { useState, useEffect } from 'react';
import { ZainaColor } from '../types';
import WhatsAppIcon from './icons/WhatsAppIcon'; 

interface FeedbackPopupProps {
  message: string;
  ctaText?: string;
  onClose: () => void;
  onCtaClick?: () => void;
  delay?: number; 
}

const FeedbackPopup: React.FC<FeedbackPopupProps> = ({ 
  message, 
  ctaText, 
  onClose, 
  onCtaClick,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100); 
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-zaina-white text-zaina-text-primary p-5 rounded-lg shadow-xl z-[100] w-72 md:w-80 transition-all duration-500 ease-in-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      role="dialog"
      aria-labelledby="feedback-popup-title"
      aria-describedby="feedback-popup-description"
    >
      <button 
        onClick={onClose} 
        className="absolute top-2 right-2 text-zaina-slate-gray hover:text-zaina-primary"
        aria-label="Close feedback popup"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
      
      <div className="flex items-start">
        <div className="mr-3 mt-1 text-zaina-primary">
            <WhatsAppIcon className="w-6 h-6" /> 
        </div>
        <div>
            <h4 id="feedback-popup-title" className="font-body-jost font-semibold mb-1">Need Help?</h4>
            <p id="feedback-popup-description" className="text-sm text-zaina-slate-gray mb-3 font-body-jost">
            {message}
            </p>
            {ctaText && onCtaClick && (
            <button
                onClick={onCtaClick}
                className="w-full bg-zaina-primary text-zaina-white font-body-jost text-sm font-semibold py-2 px-4 rounded-md hover:opacity-90 transition duration-300"
            >
                {ctaText}
            </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPopup;
