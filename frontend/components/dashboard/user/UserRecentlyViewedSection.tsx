
import React from 'react';
import { Product, ZainaColor, PageName } from '../../../types';
import ProductCard from '../../ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';


interface UserRecentlyViewedSectionProps {
  products: Product[];
  navigateToPage: (page: PageName, data?: any) => void;
}

const UserRecentlyViewedSection: React.FC<UserRecentlyViewedSectionProps> = ({ products, navigateToPage }) => {
  
  const handleQuickView = (product: Product) => {
    alert(`Quick View for ${product.name} (not fully implemented in dashboard view)`);
  };

  const handleQuickShop = (product: Product) => {
    alert(`Quick Shop for ${product.name} (simulated add to cart)`);
  };
  
  const handleProductCardClick = (product: Product) => {
    navigateToPage('productDetail', product);
  };

  if (!products || products.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold font-heading-playfair text-zaina-deep-navy mb-4">Recently Viewed</h2>
        <p className="text-zaina-slate-gray">You haven't viewed any products recently.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold font-heading-playfair text-zaina-deep-navy mb-6">Recently Viewed</h2>
       <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1.5}
        navigation
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 25 },
          1024: { slidesPerView: 4, spaceBetween: 30 },
        }}
        className="pb-2 -mx-2 px-2" // Negative margin to allow shadow visibility, padding to compensate
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="h-auto pb-4"> {/* Padding bottom for shadow space */}
            <ProductCard
              product={product}
              onQuickView={handleQuickView}
              onQuickShop={handleQuickShop}
              onProductCardClick={handleProductCardClick}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default UserRecentlyViewedSection;
