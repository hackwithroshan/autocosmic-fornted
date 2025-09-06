
import React, { useState } from 'react';
import { ZainaColor } from '../types';

interface GamifiedOfferModalProps {
  onClose: () => void;
  title?: string;
  description?: string;
}

const GamifiedOfferModal: React.FC<GamifiedOfferModalProps> = ({ 
    onClose,
    title = "Spin & Win!",
    description = "Try your luck to get an exclusive discount."
}) => {
  const [isSpun, setIsSpun] = useState(false);
  const [coupon, setCoupon] = useState<string | null>(null);

  const handleSpin = () => {
    setIsSpun(true);
    const coupons = ["ZAINA10", "ZAINA15", "FREESHIP"];
    const randomCoupon = coupons[Math.floor(Math.random() * coupons.length)];
    setCoupon(randomCoupon);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4 transition-opacity duration-300 ease-in-out" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gamified-offer-title"
    >
      <div 
        className="bg-zaina-white rounded-xl shadow-2xl w-full max-w-md p-6 md:p-8 text-center relative transform scale-95 group-hover:scale-100 transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-zaina-slate-gray hover:text-zaina-primary z-10"
          aria-label="Close offer modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <h2 id="gamified-offer-title" className="text-2xl md:text-3xl font-heading-cinzel font-bold text-zaina-primary mb-3">
            {title}
        </h2>
        <p className="text-zaina-slate-gray font-body-jost mb-6">{description}</p>

        {!isSpun && (
          <div className="my-8">
            <div className="w-40 h-40 md:w-48 md:h-48 bg-zaina-sky-blue-light rounded-full mx-auto flex items-center justify-center text-lg font-semibold text-zaina-primary animate-pulse">
              Spin Wheel Graphic
            </div>
          </div>
        )}

        {isSpun && coupon && (
          <div className="my-8 p-4 bg-zaina-sky-blue-light rounded-lg border-2 border-dashed border-zaina-primary">
            <p className="text-lg font-body-jost text-zaina-text-primary">Congratulations! Your coupon code is:</p>
            <p className="text-2xl font-bold text-green-500 my-2">{coupon}</p>
            <p className="text-xs text-zaina-slate-gray">(Use this at checkout)</p>
          </div>
        )}
        
        {!isSpun && (
            <button 
            onClick={handleSpin}
            className="w-full bg-zaina-cta-peach text-zaina-white font-body-jost font-bold py-3 px-8 rounded-lg hover:opacity-90 transition duration-300 transform hover:scale-105 text-lg"
            >
            SPIN NOW!
            </button>
        )}
         {isSpun && (
            <button 
            onClick={onClose}
            className="w-full bg-zaina-primary text-zaina-white font-body-jost font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition duration-300 mt-4"
            >
            Continue Shopping
            </button>
        )}

      </div>
    </div>
  );
};

export default GamifiedOfferModal;
