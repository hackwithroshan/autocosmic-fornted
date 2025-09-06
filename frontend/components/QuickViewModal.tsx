



import React from 'react';
import { Product, ZainaColor } from '../types';
import RatingStars from './RatingStars';
import { PLACEHOLDER_IMAGE_URL } from '../constants';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4 transition-opacity duration-300 ease-in-out" onClick={onClose}>
      <div 
        className="bg-zaina-white dark:bg-dark-zaina-bg-card rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative transform scale-95 group-hover:scale-100 transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-zaina-text-secondary dark:text-dark-zaina-text-secondary hover:text-zaina-primary dark:hover:text-dark-zaina-primary z-10"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="w-full md:w-1/2 p-2 md:p-0">
          <img 
            src={product.imageUrl || PLACEHOLDER_IMAGE_URL} 
            alt={product.name} 
            className="w-full h-auto md:h-full object-contain md:object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none" 
            loading="lazy"
          />
        </div>

        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center text-zaina-text-primary dark:text-dark-zaina-text-primary">
          <h2 className="text-3xl font-heading-playfair font-bold text-zaina-text-primary dark:text-dark-zaina-text-primary mb-3">{product.name}</h2>
          <p className="text-zaina-text-secondary dark:text-dark-zaina-text-secondary mb-4">{product.category}</p>
          
          {product.rating && (
            <div className="mb-4 flex items-center">
              <RatingStars rating={product.rating} color="text-zaina-gold dark:text-zaina-gold" /> 
              <span className="ml-2 text-sm text-zaina-text-secondary dark:text-dark-zaina-text-secondary">({product.rating.toFixed(1)} stars)</span>
            </div>
          )}

          <div className="mb-4">
            <span className="text-3xl font-bold text-zaina-gold dark:text-zaina-gold">₹{product.price.toFixed(2)}</span>
            {product.mrp > product.price && (
              <span className="text-lg text-zaina-text-secondary/70 dark:text-dark-zaina-text-secondary/70 line-through ml-3">₹{product.mrp.toFixed(2)}</span>
            )}
          </div>
          
          <p className="text-zaina-text-primary dark:text-dark-zaina-text-primary font-body-jost mb-6 leading-relaxed">{product.description}</p>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button 
              className="w-full sm:w-auto bg-zaina-gold text-zaina-white dark:text-dark-zaina-text-primary font-semibold py-3 px-6 rounded-md hover:opacity-90 transition duration-300 font-body-jost"
            >
              Add to Cart
            </button>
            <button 
              className="w-full sm:w-auto border border-zaina-primary dark:border-dark-zaina-primary text-zaina-primary dark:text-dark-zaina-primary font-semibold py-3 px-6 rounded-md hover:bg-zaina-primary hover:text-zaina-white dark:hover:bg-dark-zaina-primary dark:hover:text-dark-zaina-text-primary transition duration-300 font-body-jost"
            >
              View Full Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
