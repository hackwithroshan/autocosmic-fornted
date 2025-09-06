
import React from 'react';
import { ZainaColor } from '../types';

interface OrderSuccessModalProps {
  onClose: () => void;
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[105] p-4 transition-opacity duration-300 ease-in-out"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-success-title"
    >
      <div 
        className="bg-zaina-white rounded-xl shadow-2xl w-full max-w-sm p-6 md:p-8 text-center relative"
        style={{animation: 'zoomInPopup 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards'}}
      >
        <div className="text-5xl md:text-6xl mb-4">🎉</div>
        <h2 id="order-success-title" className="text-2xl md:text-3xl font-heading-cinzel font-bold text-zaina-text-primary mb-3">
            Thanks for your order!
        </h2>
        <p className="text-zaina-slate-gray font-body-jost mb-6">
            Your order has been placed successfully. We'll send you a confirmation email shortly.
        </p>
        <button 
          onClick={onClose}
          className="w-full bg-zaina-primary text-zaina-white font-body-jost font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition duration-300 transform hover:scale-105"
        >
          OK
        </button>
      </div>
      <style>{`
        @keyframes zoomInPopup { 
            from { transform: scale(0.85) translateY(10px); opacity: 0; }
            to { transform: scale(1) translateY(0px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccessModal;
