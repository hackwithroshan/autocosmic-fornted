import React, { useState } from 'react';
import { Product } from '../types'; 
import EyeIcon from './icons/EyeIcon';
import HeartIcon from './icons/HeartIcon';
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import { PLACEHOLDER_IMAGE_URL } from '../constants';
import ScaleIcon from './icons/ScaleIcon';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onQuickShop: (product: Product) => void; 
  onProductCardClick?: (product: Product) => void; 
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleCompare?: (product: Product) => void;
  isCompared?: boolean;
  compact?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onQuickView, 
  onQuickShop, 
  onProductCardClick,
  onToggleWishlist,
  isWishlisted = false,
  onToggleCompare,
  isCompared = false,
  compact = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const currentImageUrl = (isHovered && product.hoverImageUrl ? product.hoverImageUrl : product.imageUrl) || PLACEHOLDER_IMAGE_URL;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    if (onProductCardClick) {
      onProductCardClick(product);
    }
  };

  // --- NEW COMPACT CARD DESIGN FOR "NEW ARRIVALS" ---
  if (compact) {
    return (
        <div
            className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-200 dark:bg-dark-zaina-bg-card shadow-md h-full flex flex-col justify-end text-white cursor-pointer"
            onClick={handleCardClick}
            role="group"
            aria-label={`Product: ${product.name}`}
        >
            {/* Background Image */}
            <img
                src={product.imageUrl || PLACEHOLDER_IMAGE_URL}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                loading="lazy"
            />

            {/* Wishlist Button */}
            {onToggleWishlist && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product);
                    }}
                    className="absolute top-2.5 right-2.5 z-20 p-2 bg-black/20 rounded-full backdrop-blur-sm hover:bg-black/40 transition-colors"
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <HeartIcon
                        className={`w-5 h-5 ${isWishlisted ? 'text-red-500' : 'text-white'}`}
                        isFilled={isWishlisted}
                    />
                </button>
            )}

            {/* New Badge */}
            {(product.isNew || product.isBestSeller) && (
                <span className={`absolute top-2.5 left-2.5 text-xs font-semibold px-2 py-1 rounded-sm z-10 
                                ${product.isBestSeller ? 'bg-zaina-gold text-zaina-text-primary' : 'bg-zaina-primary text-white'}`}>
                {product.isBestSeller ? 'Best Seller' : 'New'}
                </span>
            )}

            {/* Bottom Gradient Overlay (for initial text visibility) */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none"></div>

            {/* Content Container */}
            <div className="relative p-4 transition-transform duration-300 ease-in-out group-hover:-translate-y-12">
                {/* Initially visible content */}
                <h3 className="font-heading-cormorant text-lg font-semibold truncate" title={product.name}>
                {product.name}
                </h3>
                <div className="flex items-baseline mt-1">
                <p className="text-xl font-bold text-zaina-gold">₹{product.price.toFixed(2)}</p>
                {product.mrp > product.price && (
                    <p className="text-sm line-through ml-2 opacity-70">₹{product.mrp.toFixed(2)}</p>
                )}
                </div>
            </div>

            {/* Hover-reveal actions */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-black/80 backdrop-blur-sm p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                <div className="flex justify-around items-center">
                <button
                    onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
                    className="flex items-center gap-2 text-xs font-semibold text-zaina-text-primary dark:text-dark-zaina-text-primary hover:text-zaina-primary dark:hover:text-dark-zaina-primary"
                    aria-label="Quick view"
                >
                    <EyeIcon className="w-4 h-4" />
                    Quick View
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onQuickShop(product); }}
                    className="flex items-center gap-2 text-xs font-semibold text-zaina-text-primary dark:text-dark-zaina-text-primary hover:text-zaina-primary dark:hover:text-dark-zaina-primary"
                    aria-label="Add to cart"
                >
                    <ShoppingCartIcon className="w-4 h-4" />
                    Add to Cart
                </button>
                </div>
            </div>
        </div>
    );
  }

  // --- ORIGINAL, FULL-SIZE CARD ---
  return (
    <div 
      className="bg-zaina-white dark:bg-dark-zaina-bg-card rounded-md overflow-hidden group relative transition-all duration-300 ease-out flex flex-col h-full product-card-hover-cursor shadow-sm hover:shadow-xl dark:shadow-md dark:hover:shadow-black/20 transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="group"
      aria-label={`Product: ${product.name}`}
      onClick={handleCardClick} 
      style={{ cursor: onProductCardClick ? 'pointer' : 'default' }}
    >
      <div className={`relative aspect-[3/4] overflow-hidden`}>
        <img 
          src={currentImageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" 
          loading="lazy" 
        />
        
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-2 z-20">
            {onToggleWishlist && (
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
                    className="p-2 bg-zaina-white/80 dark:bg-dark-zaina-bg-card/80 rounded-full shadow-md hover:scale-110 transition-all duration-200"
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <HeartIcon 
                        className={`w-5 h-5 ${isWishlisted ? 'text-zaina-deep-red-accent' : 'text-zaina-text-secondary/80 dark:text-dark-zaina-text-secondary/80'}`} 
                        isFilled={isWishlisted} 
                    />
                </button>
            )}
             {onToggleCompare && (
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleCompare(product); }}
                    className="p-2 bg-zaina-white/80 dark:bg-dark-zaina-bg-card/80 rounded-full shadow-md hover:scale-110 transition-all duration-200"
                    aria-label={isCompared ? "Remove from compare" : "Add to compare"}
                    title={isCompared ? "Remove from compare" : "Add to compare"}
                >
                    <ScaleIcon className={`w-5 h-5 ${isCompared ? 'text-zaina-primary' : 'text-zaina-text-secondary/80 dark:text-dark-zaina-text-secondary/80'}`} />
                </button>
            )}
        </div>
        
        {(product.isNew || product.isBestSeller) && (
           <span className={`absolute top-2.5 left-2.5 text-xs font-semibold px-2 py-1 rounded-sm z-10 
                            ${product.isBestSeller ? 'bg-zaina-gold text-zaina-text-primary dark:bg-zaina-gold dark:text-dark-zaina-bg-card' : `bg-zaina-primary text-zaina-white dark:bg-dark-zaina-primary dark:text-dark-zaina-text-primary`}`}>
            {product.isBestSeller ? 'Best Seller' : 'New'}
          </span>
        )}
        
        {/* Quick View Icon - appears on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <button
                onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
                className="p-3 bg-white/20 text-white rounded-full backdrop-blur-sm hover:bg-white/30 hover:scale-110 transition-all"
                aria-label="Quick view product"
                title="Quick View"
            >
                <EyeIcon className="w-6 h-6" />
            </button>
        </div>

        {/* Add to Cart button - slides up on hover */}
        <div className="absolute inset-x-0 bottom-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-20">
            <button 
                onClick={(e) => { e.stopPropagation(); onQuickShop(product); }}
                className="w-full bg-zaina-gold text-zaina-text-primary dark:text-dark-zaina-text-primary font-semibold py-3 text-sm hover:opacity-90"
            >
                Add to Cart
            </button>
        </div>
      </div>
      
      <div className={`p-4 text-left flex-grow flex flex-col justify-between`}>
        <div>
          <p className={`text-sm mb-1 text-zaina-text-secondary dark:text-dark-zaina-text-secondary font-body-inter`}>{product.category}</p>
          <h3 className={`text-lg font-heading-cormorant font-medium text-zaina-text-primary dark:text-dark-zaina-text-primary mb-1 truncate`} title={product.name}>
            {product.name}
          </h3>
          <div className={`flex items-center mt-2`}>
            <p className={`text-xl font-semibold text-zaina-gold dark:text-zaina-gold font-body-jost`}>₹{product.price.toFixed(2)}</p>
            {product.mrp > product.price && (
              <p className="text-sm text-zaina-text-secondary/70 dark:text-dark-zaina-text-secondary/70 line-through ml-2 font-body-jost">₹{product.mrp.toFixed(2)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;