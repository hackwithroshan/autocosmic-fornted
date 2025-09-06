import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Scrollbar, Navigation } from 'swiper/modules';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface TrendingProductStripProps {
  title: string;
  products: Product[];
  onProductQuickView: (product: Product) => void;
  onProductQuickShop: (product: Product) => void;
  onProductCardClick?: (product: Product) => void; 
  onToggleWishlist?: (product: Product) => void;
  isProductInWishlist?: (productId: string) => boolean;
}

const TrendingProductStrip: React.FC<TrendingProductStripProps> = ({ 
  title, 
  products, 
  onProductQuickView, 
  onProductQuickShop,
  onProductCardClick,
  onToggleWishlist,
  isProductInWishlist,
}) => {
  if (!products || products.length === 0) return null;

  return (
    <section 
      className="py-10 md:py-12 bg-zaina-sky-blue-light dark:bg-dark-zaina-sky-blue-light" 
      id="trending-strip"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-heading-cinzel font-bold text-center text-zaina-text-primary dark:text-dark-zaina-text-primary mb-8 md:mb-10">
          {title}
        </h2>
        <div className="relative group">
          <Swiper
            modules={[Autoplay, Scrollbar, Navigation]}
            spaceBetween={16}
            slidesPerView={2.2}
            loop={products.length > 5} 
            scrollbar={{
                draggable: true,
                hide: false,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true, 
            }}
            navigation={{
                nextEl: '.trending-strip-next',
                prevEl: '.trending-strip-prev',
            }}
            breakpoints={{
              640: { slidesPerView: 3, spaceBetween: 20 },
              768: { slidesPerView: 4, spaceBetween: 24 },
              1024: { slidesPerView: 5, spaceBetween: 24 },
              1280: { slidesPerView: 5, spaceBetween: 30 },
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
          {/* Navigation Buttons */}
          <button className="trending-strip-prev swiper-button-prev !-left-2 md:!-left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></button>
          <button className="trending-strip-next swiper-button-next !-right-2 md:!-right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></button>
        </div>
      </div>
    </section>
  );
};

export default TrendingProductStrip;