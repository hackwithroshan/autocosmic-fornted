

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperCore } from 'swiper/types';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { HeroSlide as HeroSlideType } from '../types';

interface HeroSliderProps {
  slides: HeroSlideType[];
  storeName: string;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ slides, storeName }) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperCore | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeSlides = slides
    .filter(s => s.isActive && s.device === (isMobile ? 'mobile' : 'desktop'))
    .sort((a, b) => a.order - b.order);
  
  const aspectRatio = (845 / 2000) * 100; // = 42.25%

  if (activeSlides.length === 0) {
    return (
      <section className="w-full bg-zaina-sky-blue-light dark:bg-dark-zaina-neutral-light pt-[100px] lg:pt-[var(--header-height)]">
        <div className="relative w-full" style={{ paddingTop: `${aspectRatio}%` }}>
            <div className="absolute inset-0 flex items-center justify-center">
                 <p className="text-zaina-text-secondary dark:text-dark-zaina-text-secondary">No active slides for this view. Please add them in the admin panel.</p>
            </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-zaina-neutral-light dark:bg-dark-zaina-bg-card group/hero pt-[100px] lg:pt-[var(--header-height)]" aria-label="Hero Showcase">
      <div className="relative w-full" style={{ paddingTop: `${aspectRatio}%` }}>
        <Swiper
            modules={[Autoplay, EffectFade, Navigation, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            loop={activeSlides.length > 1}
            autoplay={{ delay: 7000, disableOnInteraction: false }}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            navigation={{
                nextEl: '.hero-swiper-button-next',
                prevEl: '.hero-swiper-button-prev',
            }}
            pagination={{ 
              el: '.hero-slider-pagination',
              clickable: true 
            }}
            onSwiper={(swiper) => setSwiperInstance(swiper)}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="absolute inset-0 h-full w-full"
        >
            {activeSlides.map((slide, index) => (
            <SwiperSlide key={slide.id} className="relative">
                {/* Background Image */}
                <div className="absolute inset-0">
                <img
                    src={slide.imageUrl}
                    alt={slide.title || `${storeName} Collection Showcase Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                />
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20"></div>

                {/* Content Container */}
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
                    
                    {/* Main Text Content */}
                    <div className={`max-w-2xl transition-all duration-1000 ease-out ${activeIndex === index ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-8'}`}>
                        {slide.supertitle && <p className="text-base md:text-lg font-body-jost tracking-wider text-white/90 mb-2">{slide.supertitle}</p>}
                        {slide.title && <h2 className="text-4xl md:text-6xl font-heading-cinzel font-bold my-2 md:my-4 text-white" style={{color: slide.titleColor || '#FFFFFF'}}>{slide.title}</h2>}
                        {slide.offerText && <p className="text-5xl md:text-7xl font-bold font-heading-cinzel text-zaina-gold tracking-tight my-2 md:my-4">{slide.offerText}</p>}
                        {slide.subtitle && <p className="text-sm md:text-base font-body-jost text-white/80 leading-relaxed">{slide.subtitle}</p>}
                        
                        {slide.buttons && slide.buttons.length > 0 && (
                            <div className={`mt-8 flex flex-wrap items-center justify-center gap-3`}>
                                {slide.buttons.map((button, btnIndex) => (
                                    <a key={btnIndex} href={button.link} className="bg-white text-zaina-text-primary font-semibold text-xs md:text-sm py-3 px-6 rounded-full hover:bg-gray-200 transition-colors shadow-lg transform hover:scale-105">
                                        {button.text}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </SwiperSlide>
            ))}
        </Swiper>
        <style>{`
            .hero-slider-pagination {
                position: absolute;
                bottom: 25px !important;
                left: 50% !important;
                transform: translateX(-50%);
                width: auto !important;
                display: flex;
                gap: 8px;
            }
            .hero-slider-pagination .swiper-pagination-bullet {
                width: 30px;
                height: 4px;
                border-radius: 2px;
                background-color: rgba(255, 255, 255, 0.4);
                opacity: 1;
                transition: all 0.3s ease;
            }
            .hero-slider-pagination .swiper-pagination-bullet-active {
                background-color: #FFFFFF;
                width: 45px;
            }
            .hero-swiper-button-prev, .hero-swiper-button-next {
                opacity: 0;
                transition: opacity 0.3s ease;
                color: #FFFFFF !important;
                --swiper-navigation-size: 28px;
                background-color: rgba(0,0,0,0.2);
                width: 44px !important;
                height: 44px !important;
                border-radius: 50%;
            }
            .group\\/hero:hover .hero-swiper-button-prev,
            .group\\/hero:hover .hero-swiper-button-next {
                opacity: 0.7;
            }
            .group\\/hero .hero-swiper-button-prev:hover,
            .group\\/hero .hero-swiper-button-next:hover {
                background-color: rgba(0,0,0,0.4);
                opacity: 1;
            }
        `}</style>
        <div className="hero-slider-pagination"></div>
        <button className="hero-swiper-button-prev swiper-button-prev !left-4 md:!left-8"></button>
        <button className="hero-swiper-button-next swiper-button-next !right-4 md:!right-8"></button>
      </div>
    </section>
  );
};

export default HeroSlider;