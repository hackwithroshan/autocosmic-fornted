

import React from 'react';
import { Product } from '../types'; 
import ProductCard from './ProductCard';

interface ProductGridProps {
  title: string;
  products: Product[];
  onProductQuickView: (product: Product) => void;
  onProductQuickShop: (product: Product) => void;
  onProductCardClick?: (product: Product) => void; 
  sectionBgColor?: string; 
  titleColor?: string; 
  titleFontSize?: string;
  titleFontFamily?: string;
  onToggleWishlist?: (product: Product) => void;
  isProductInWishlist?: (productId: string) => boolean;
  onToggleCompare?: (product: Product) => void;
  isProductInCompare?: (productId: string) => boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  title, 
  products, 
  onProductQuickView, 
  onProductQuickShop,
  onProductCardClick,
  sectionBgColor = 'bg-zaina-neutral-light dark:bg-dark-zaina-neutral-light', 
  titleColor = '#2C3E50',
  titleFontSize,
  titleFontFamily,
  onToggleWishlist,
  isProductInWishlist,
  onToggleCompare,
  isProductInCompare,
}) => {
  if (!products) {
    return (
      <section className={`py-12 md:py-16 ${sectionBgColor}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            className={`text-3xl md:text-4xl font-heading-cormorant font-semibold mb-4`} 
            style={{ 
              color: titleColor,
              fontSize: titleFontSize ? `${titleFontSize}px` : undefined,
              fontFamily: titleFontFamily ? `'${titleFontFamily}', serif` : undefined
            }}
          >
            {title}
          </h2>
          <p className={`text-current/70 font-body-inter`}>Loading products...</p>
        </div>
      </section>
    );
  }
  
  return (
    <section className={`py-12 md:py-16 ${sectionBgColor}`} id={title.toLowerCase().replace(/\s+/g, '-')}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {title && 
          <h2 
            className={`text-3xl md:text-4xl font-heading-cormorant font-semibold text-center mb-10 md:mb-12`} 
            style={{ 
              color: titleColor,
              fontSize: titleFontSize ? `${titleFontSize}px` : undefined,
              fontFamily: titleFontFamily ? `'${titleFontFamily}', serif` : undefined
            }}
          >
            {title}
          </h2>
        }
        
        {products.length === 0 && (
             <p className={`text-current/70 text-center font-body-inter`}>No products currently available in this collection.</p>
        )}

        {products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onQuickView={onProductQuickView}
                  onQuickShop={onProductQuickShop}
                  onProductCardClick={onProductCardClick}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={isProductInWishlist ? isProductInWishlist(product.id!) : false}
                  onToggleCompare={onToggleCompare}
                  isCompared={isProductInCompare ? isProductInCompare(product.id!) : false}
                />
            ))}
            </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;