
import React from 'react';
import { Product, ZainaColor, PageName } from '../../../types';
import ProductCard from '../../ProductCard'; 

interface UserWishlistSectionProps {
  wishlistItems: Product[];
  navigateToPage: (page: PageName, data?: any) => void;
  onToggleWishlist: (product: Product) => void;
}

const UserWishlistSection: React.FC<UserWishlistSectionProps> = ({ wishlistItems, navigateToPage, onToggleWishlist }) => {
  const handleQuickView = (product: Product) => {
    // This should open a QuickViewModal, which needs to be handled at App level
    // For now, let's navigate to product detail page as a fallback
    alert(`Quick View for ${product.name} (not fully implemented in dashboard view)`);
    // Example: navigateToPage('productDetail', product) if QuickViewModal isn't easily accessible here
  };

  const handleQuickShop = (product: Product) => {
    alert(`Quick Shop for ${product.name} (simulated add to cart)`);
  };
  
  const handleProductCardClick = (product: Product) => {
    navigateToPage('productDetail', product);
  };


  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold font-heading-playfair text-zaina-deep-navy mb-4">My Wishlist</h2>
        <p className="text-zaina-slate-gray">Your wishlist is empty. Start adding your favorite styles!</p>
         <button 
            onClick={() => navigateToPage('shop')}
            className="mt-4 bg-zaina-primary text-zaina-white font-medium py-2 px-5 rounded-md hover:bg-zaina-secondary-blue transition-colors"
        >
            Discover Products
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold font-heading-playfair text-zaina-deep-navy mb-6">My Wishlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={handleQuickView}
            onQuickShop={handleQuickShop}
            onProductCardClick={handleProductCardClick}
            onToggleWishlist={onToggleWishlist}
            isWishlisted={true}
          />
        ))}
      </div>
    </div>
  );
};

export default UserWishlistSection;