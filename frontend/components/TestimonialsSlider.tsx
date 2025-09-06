
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Testimonial, ZainaColor } from '../types'; 
import StarIcon from './icons/StarIcon'; 
import QuoteIcon from './icons/QuoteIcon';

interface TestimonialsSliderProps {
  testimonials: Testimonial[];
  storeName: string;
}

const TestimonialsSlider: React.FC<TestimonialsSliderProps> = ({ testimonials, storeName }) => {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-zaina-sky-blue-light dark:bg-dark-zaina-sky-blue-light" id="testimonials">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-heading-cormorant font-semibold text-center text-zaina-text-primary dark:text-dark-zaina-text-primary mb-2">
          Loved By Our Patrons
        </h2>
        <p className="text-center text-lg text-zaina-primary dark:text-dark-zaina-primary font-medium mb-10 md:mb-12 font-heading-playfair italic">
          Echoes of Elegance from the {storeName} Community
        </p>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          loop={testimonials.length > 1}
          breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: testimonials.length > 2 ? 3 : testimonials.length, spaceBetween: 40 },
          }}
          className="pb-12" 
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id} className="h-full">
              <div className="bg-zaina-white dark:bg-dark-zaina-bg-card rounded-lg shadow-lg p-8 md:p-10 flex flex-col items-center text-center h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl relative">
                <QuoteIcon className="absolute top-6 left-6 w-8 h-8 text-zaina-gold dark:text-zaina-gold opacity-70" /> 
                <img 
                  src={testimonial.userImage} 
                  alt={testimonial.userName} 
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover mb-4 border-2 border-zaina-primary dark:border-dark-zaina-primary"
                  loading="lazy"
                />
                <h4 className="text-xl font-heading-playfair font-medium text-zaina-text-primary dark:text-dark-zaina-text-primary">
                  {testimonial.userName}
                </h4>
                {testimonial.userHandle && (
                  <p className="text-xs text-zaina-text-secondary dark:text-dark-zaina-text-secondary mb-3 font-body-inter">{testimonial.userHandle}</p>
                )}
                <div className="flex my-2">
                    {[...Array(5)].map((_, i) => ( 
                        <StarIcon key={i} filled className="w-4 h-4 text-zaina-gold dark:text-zaina-gold" />
                    ))}
                </div>
                <p className="text-sm text-zaina-text-primary/80 dark:text-dark-zaina-text-primary/80 leading-relaxed font-body-inter italic flex-grow relative z-10">
                  "{testimonial.quote}"
                </p>
                {testimonial.productImageUrl && (
                  <img 
                    src={testimonial.productImageUrl} 
                    alt="Reviewed product" 
                    className="w-16 h-16 object-contain mt-4 rounded-md border border-zaina-neutral-medium dark:border-dark-zaina-neutral-medium"
                    loading="lazy"
                  />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialsSlider;