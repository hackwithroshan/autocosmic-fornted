
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Scrollbar, FreeMode } from 'swiper/modules';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface RecentlyViewedProductsProps {
  products: Product[];
  onProductQuickView: (product: Product) => void;
  onProductQuickShop: (product: Product) => void;
  onProductCardClick?: (product: Product) => void; 
  onToggleWishlist?: (product: Product) => void;
  isProductInWishlist?: (productId: string) => boolean;
}

const RecentlyViewedProducts: React.FC<RecentlyViewedProductsProps> = ({ 
  products, 
  onProductQuickView, 
  onProductQuickShop,
  onProductCardClick,
  onToggleWishlist,
  isProductInWishlist,
}) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-10 md:py-12 bg-zaina-neutral-light dark:bg-dark-zaina-neutral-light" id="recently-viewed">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-heading-cinzel font-bold text-center text-zaina-text-primary dark:text-dark-zaina-text-primary mb-8 md:mb-10">
          Recently Viewed
        </h2>
        <Swiper
          modules={[Mousewheel, Scrollbar, FreeMode]}
          spaceBetween={20}
          slidesPerView={2}
          freeMode={true}
          mousewheel={{
              forceToAxis: true,
          }}
          scrollbar={{
              draggable: true,
              hide: false,
          }}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 20 },
            768: { slidesPerView: 4, spaceBetween: 25 },
            1024: { slidesPerView: 5, spaceBetween: 30 },
          }}
          className="pb-8" 
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="h-auto">
              <ProductCard 
                product={product} 
                onQuickView={onProductQuickView} 
                onQuickShop={onProductQuickShop}
                onProductCardClick={onProductCardClick}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={isProductInWishlist ? isProductInWishlist(product.id!) : false}
                compact
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default RecentlyViewedProducts;