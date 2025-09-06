
import React, { useState, useMemo, useEffect } from 'react';
import { Product, ProductVariant } from '../types';
import CloseIcon from './icons/CloseIcon';
import { PLACEHOLDER_IMAGE_URL } from '../constants';

interface QuickShopModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedVariant: ProductVariant) => void;
}

const QuickShopModal: React.FC<QuickShopModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    
    // Determine the available variant attributes for the product
    const variantAttributes = useMemo(() => {
        if (!product?.variants) return [];
        const attributes = new Set<string>();
        product.variants.forEach(variant => {
            Object.keys(variant.attributes).forEach(attr => attributes.add(attr));
        });
        return Array.from(attributes);
    }, [product]);

    // Reset state when product changes
    useEffect(() => {
        if (product) {
            // Pre-select the first option for each attribute if available
            const initialSelection: Record<string, string> = {};
            variantAttributes.forEach(attr => {
                const firstValue = product.variants?.[0]?.attributes[attr];
                if(firstValue) {
                   // This part is tricky without more complex logic.
                   // For simplicity, we just clear selections.
                }
            });
            setSelectedOptions({});
        }
    }, [product, variantAttributes]);

    const getAvailableOptions = (attributeName: string) => {
        if (!product?.variants) return [];
        
        // Filter variants that match other selected options
        const partiallyMatchingVariants = product.variants.filter(variant => {
            return Object.entries(selectedOptions).every(([key, value]) => {
                // Ignore the current attribute being populated
                if (key === attributeName) return true;
                return variant.attributes[key] === value;
            });
        });

        // Get unique, available values for the current attribute from the filtered variants
        const options = new Map<string, boolean>(); // value -> isAvailable
        partiallyMatchingVariants.forEach(variant => {
            const value = variant.attributes[attributeName];
            if (value) {
                const isStockAvailable = variant.stockQuantity > 0;
                if (!options.has(value) || isStockAvailable) {
                    options.set(value, isStockAvailable);
                }
            }
        });
        
        return Array.from(options.entries());
    };

    const handleOptionSelect = (attributeName: string, value: string) => {
        setSelectedOptions(prev => {
            const newSelection = { ...prev };
            if (newSelection[attributeName] === value) {
                delete newSelection[attributeName];
            } else {
                newSelection[attributeName] = value;
            }
            // This is a simplified logic. A real implementation might need to
            // reset dependent selections when a higher-level one changes.
            return newSelection;
        });
    };
    
    const currentVariant = useMemo(() => {
        if (!product?.variants || Object.keys(selectedOptions).length !== variantAttributes.length) {
            return undefined;
        }
        return product.variants.find(variant => 
            variantAttributes.every(attr => variant.attributes[attr] === selectedOptions[attr])
        );
    }, [product, selectedOptions, variantAttributes]);


  const handleAddToCartClick = () => {
    if (product && currentVariant) {
        if (currentVariant.stockQuantity > 0) {
            onAddToCart(product, 1, currentVariant);
            onClose();
        } else {
            alert("This variant is out of stock.");
        }
    } else {
      alert("Please select all variant options.");
    }
  };

  const priceToShow = currentVariant?.price ?? product?.price ?? 0;
  const mrpToShow = product?.mrp ?? 0;
  const isAddToCartDisabled = !currentVariant;
  const imageToShow = currentVariant?.imageUrl || product?.imageUrl || PLACEHOLDER_IMAGE_URL;


  if (!isOpen || !product) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="quick-shop-title">
      <div className="modal-content w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-zaina-slate-gray p-1.5 rounded-full hover:bg-zaina-neutral-medium dark:hover:bg-dark-zaina-neutral-medium transition-colors"><CloseIcon className="w-5 h-5"/></button>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/3 flex-shrink-0">
            <img src={imageToShow} alt={product.name} className="w-full aspect-[3/4] object-cover rounded-md shadow-lg"/>
          </div>
          <div className="flex-grow">
            <h2 id="quick-shop-title" className="text-xl font-heading-playfair font-semibold mb-1">{product.name}</h2>
            <div className="flex items-baseline mb-3">
              <p className="text-xl font-bold text-zaina-gold">₹{priceToShow.toFixed(2)}</p>
              {mrpToShow > priceToShow && (
                  <span className="ml-2 text-sm text-zaina-text-secondary line-through">₹{mrpToShow.toFixed(2)}</span>
              )}
            </div>

            {variantAttributes.map(attributeName => {
                const options = getAvailableOptions(attributeName);
                if (options.length === 0) return null;

                return (
                    <div key={attributeName} className="mb-3">
                        <span className="text-sm font-semibold capitalize">{attributeName}: <span className="font-normal">{selectedOptions[attributeName]}</span></span>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {options.map(([value, isAvailable]) => {
                                const isSelected = selectedOptions[attributeName] === value;
                                return (
                                    <button 
                                        key={value}
                                        onClick={() => handleOptionSelect(attributeName, value)}
                                        disabled={!isAvailable}
                                        className={`relative px-3 py-1 text-xs font-medium rounded-md border-2 transition-all
                                        ${isSelected ? 'bg-zaina-primary border-zaina-primary text-white' : 'border-zaina-neutral-medium bg-zaina-white dark:bg-dark-zaina-bg-card'}
                                        ${!isAvailable ? 'text-gray-400 border-gray-300 bg-gray-100 cursor-not-allowed' : ''}`}
                                    >
                                        {value}
                                        {!isAvailable && <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center"><div className="w-[80%] h-px bg-gray-400 transform rotate-[-20deg]"></div></span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )
            })}
             
             <button onClick={handleAddToCartClick} disabled={isAddToCartDisabled} className="w-full bg-zaina-gold text-white font-semibold py-3 rounded-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4">
                {isAddToCartDisabled ? 'Select Options' : 'Add to Cart'}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickShopModal;
