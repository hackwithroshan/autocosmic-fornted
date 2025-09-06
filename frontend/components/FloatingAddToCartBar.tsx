

import React from 'react';
import { Product } from '../types';
import CloseIcon from './icons/CloseIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import { PLACEHOLDER_IMAGE_URL } from '../constants';

interface FloatingAddToCartBarProps {
  product: Product;
  selectedSize?: string;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  onAddToCart: () => void;
  onClose: () => void;
  isVisible: boolean;
  availableSizes: string[];
  onSizeSelect: (size: string) => void;
  isAddToCartDisabled: boolean;
}

const FloatingAddToCartBar: React.FC<FloatingAddToCartBarProps> = ({
  product,
  selectedSize,
  quantity,
  onQuantityChange,
  onAddToCart,
  onClose,
  isVisible,
  availableSizes,
  onSizeSelect,
  isAddToCartDisabled,
}) => {
  if (!product) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-zaina-white dark:bg-dark-zaina-bg-card text-zaina-text-primary dark:text-dark-zaina-text-primary 
                  p-3 md:p-4 shadow-floating-bar dark:shadow-dark-floating-bar z-[90] 
                  transition-transform duration-300 ease-out rounded-t-lg
                  ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
      role="toolbar"
      aria-label="Sticky Add to Cart Bar"
    >
      <div className="container mx-auto px-2 sm:px-4 flex items-center justify-between gap-2 md:gap-4">
        {/* Left Section: Thumb, Title, Price */}
        <div className="flex items-center gap-2 md:gap-3 flex-grow min-w-0">
          <img
            src={product.imageUrl || PLACEHOLDER_IMAGE_URL}
            alt={product.name}
            className="w-10 h-12 md:w-12 md:h-16 object-cover rounded-md flex-shrink-0"
          />
          <div className="flex-grow min-w-0">
            <h3 className="text-xs md:text-sm font-semibold text-zaina-text-primary dark:text-dark-zaina-text-primary line-clamp-2" title={product.name}>
              {product.name}
            </h3>
            <p className="text-sm md:text-base font-bold text-zaina-gold dark:text-zaina-gold">
              ₹{product.price.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Right Section: Size, Quantity, Add to Cart, Close */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
           {/* Size Selector Dropdown */}
          {availableSizes.length > 0 && (
             <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex text-xs md:text-sm font-semibold text-zaina-text-secondary dark:text-dark-zaina-text-secondary whitespace-nowrap">
                    Select Size:
                </span>
                <div className="relative">
                <select
                    value={selectedSize || ''}
                    onChange={(e) => onSizeSelect(e.target.value)}
                    className="text-xs md:text-sm appearance-none bg-zaina-neutral-light dark:bg-dark-zaina-bg-input border border-zaina-neutral-medium dark:border-dark-zaina-neutral-medium rounded-md py-2 pl-3 pr-7 hover:border-zaina-primary dark:hover:border-dark-zaina-primary focus:outline-none focus:ring-1 focus:ring-zaina-primary"
                    aria-label="Select size"
                >
                    {!selectedSize && <option value="" disabled>Size</option>}
                    {availableSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zaina-text-secondary">
                    <ChevronDownIcon className="w-4 h-4" />
                </div>
                </div>
            </div>
          )}

          {/* Quantity Selector - Compact */}
          <div className="hidden sm:flex items-center border border-zaina-neutral-medium dark:border-dark-zaina-neutral-medium rounded-md bg-zaina-white dark:bg-dark-zaina-bg-input">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="px-2 py-1 text-zaina-primary dark:text-dark-zaina-primary hover:bg-zaina-sky-blue-light/50 dark:hover:bg-dark-zaina-sky-blue-light/30 rounded-l-md text-sm md:text-base"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="px-2 md:px-3 py-1 text-xs md:text-sm text-zaina-text-primary dark:text-dark-zaina-text-primary">{quantity}</span>
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="px-2 py-1 text-zaina-primary dark:text-dark-zaina-primary hover:bg-zaina-sky-blue-light/50 dark:hover:bg-dark-zaina-sky-blue-light/30 rounded-r-md text-sm md:text-base"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={onAddToCart}
            disabled={isAddToCartDisabled}
            className="bg-zaina-cta-blue dark:bg-dark-zaina-cta-blue text-zaina-white font-semibold py-2 px-3 md:px-4 rounded-md hover:opacity-90 transition-opacity text-xs md:text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 text-zaina-text-secondary dark:text-dark-zaina-text-secondary hover:text-zaina-text-primary dark:hover:text-dark-zaina-text-primary"
            aria-label="Close sticky add to cart bar"
          >
            <CloseIcon className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingAddToCartBar;
