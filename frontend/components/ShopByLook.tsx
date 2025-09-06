
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { CuratedLook, Product } from '../types';

interface ShopByLookProps {
  looks: CuratedLook[];
  onGetTheLook: (lookTitle: string, productIds: string[]) => void;
}

const ShopByLook: React.FC<ShopByLookProps> = ({ looks, onGetTheLook }) => {
  if (!looks || looks.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-zaina-neutral-light" id="shop-by-look">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading-cinzel font-bold text-center text-zaina-text-primary mb-10 md:mb-12">
          Shop By Look
        </h2>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
          className="pb-10" 
        >
          {looks.map((look) => (
            <SwiperSlide key={look.id} className="group">
              <div className="bg-zaina-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl transform hover:-translate-y-1 h-full flex flex-col">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img 
                    src={look.imageUrl} 
                    alt={look.title} 
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 text-center flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-heading-cinzel font-semibold text-zaina-text-primary mb-2 truncate" title={look.title}>
                      {look.title}
                    </h3>
                    <p className="text-sm text-zaina-slate-gray mb-4 line-clamp-3">
                      {look.description}
                    </p>
                  </div>
                  <button
                    onClick={() => onGetTheLook(look.title, look.productIds)}
                    className="mt-auto w-full bg-zaina-cta-peach text-zaina-white font-body-jost font-semibold py-2.5 px-6 rounded-md hover:opacity-90 transition duration-300 transform hover:scale-105"
                  >
                    Get The Look
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ShopByLook;
