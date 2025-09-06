

import React from 'react';
import { ZainaColor } from '../types';

interface FirstOrderOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  couponCode: string;
  storeName: string;
}

const FirstOrderOfferModal: React.FC<FirstOrderOfferModalProps> = ({ isOpen, onClose, couponCode, storeName }) => {
  if (!isOpen) return null;
  
  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(couponCode).then(() => {
      alert(`Coupon "${couponCode}" copied to clipboard!`);
    }).catch(err => {
      console.error('Failed to copy coupon: ', err);
      alert('Failed to copy coupon. Please copy it manually.');
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[102] p-4 transition-opacity duration-300 ease-in-out" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="first-order-offer-title"
    >
      <div 
        className="bg-zaina-white rounded-xl shadow-2xl w-full max-w-md p-6 md:p-8 text-center relative transform transition-transform duration-300 ease-out"
        style={{animation: 'zoomInPopup 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards'}}
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-zaina-slate-gray hover:text-zaina-primary z-10 p-1.5 bg-zaina-neutral-light hover:bg-zaina-neutral-medium rounded-full transition-colors"
          aria-label="Close offer modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="text-3xl text-zaina-primary mb-3">🎉</div>
        <h2 id="first-order-offer-title" className="text-2xl md:text-3xl font-heading-cinzel font-bold text-zaina-primary mb-2">
            Welcome to {storeName}!
        </h2>
        <p className="text-zaina-text-primary font-body-jost mb-2">Thank you for spending time with us! Enjoy</p>
        <p className="text-4xl md:text-5xl font-bold text-green-500 my-2">₹100 OFF</p>
        <p className="text-zaina-text-primary font-body-jost mb-5">Your First Order!</p>
        
        <div 
            className="my-6 p-3.5 bg-zaina-sky-blue-light rounded-lg border-2 border-dashed border-zaina-primary cursor-pointer hover:border-solid transition-all"
            onClick={handleCopyCoupon}
            title="Click to copy coupon code"
        >
            <p className="text-sm font-body-jost text-zaina-text-primary">Use coupon code at checkout:</p>
            <p 
              className="text-2xl font-bold text-zaina-primary my-1 tracking-wider"
            >
              {couponCode}
            </p>
            <p className="text-xs text-zaina-slate-gray">(Click to copy)</p>
        </div>
            
        <button 
        onClick={onClose}
        className="w-full bg-zaina-cta-peach text-zaina-white font-body-jost font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition duration-300 transform hover:scale-105"
        >
        Start Shopping & Save!
        </button>
         <style>{`
            @keyframes zoomInPopup { 
                from { transform: scale(0.85) translateY(10px); opacity: 0; }
                to { transform: scale(1) translateY(0px); opacity: 1; }
            }
        `}</style>
      </div>
    </div>
  );
};

export default FirstOrderOfferModal;