

import React from 'react';
import { MEDIA_BASE_URL } from '../constants';

interface WhyZainaSectionProps {
    storeName: string;
}

const WhyZainaSection: React.FC<WhyZainaSectionProps> = ({ storeName }) => {
  const artisanImageUrl = `${MEDIA_BASE_URL}/media/artisan.jpg`; 

  return (
    <section className="py-16 md:py-24 bg-zaina-sky-blue-light dark:bg-dark-zaina-sky-blue-light overflow-hidden" id="why-us">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          {/* Text Content */}
          <div className="md:w-1/2 text-center md:text-left animate-on-scroll">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zaina-primary dark:text-dark-zaina-primary mb-2 font-['Poppins']">
              Our Philosophy
            </h2>
            <div className="h-0.5 w-16 bg-zaina-primary/50 dark:bg-dark-zaina-primary/50 mb-4 mx-auto md:mx-0"></div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading-cinzel font-bold text-zaina-text-primary dark:text-dark-zaina-text-primary mb-5">
              We don’t make clothes, <br className="hidden md:block" />we design <span className="text-zaina-gold dark:text-zaina-gold">grace.</span>
            </h3>
            <p className="text-zaina-text-secondary dark:text-dark-zaina-text-secondary font-['Poppins'] text-base md:text-lg leading-relaxed mb-6">
              At {storeName}, every piece is a testament to timeless elegance and meticulous craftsmanship. We believe in fashion that not only adorns but also empowers, weaving stories of tradition into contemporary designs. 
            </p>
            <p className="text-zaina-text-secondary dark:text-dark-zaina-text-secondary font-['Poppins'] text-base md:text-lg leading-relaxed mb-8">
              Our commitment is to quality, artistry, and the unique spirit of the woman who chooses {storeName}. Experience the feeling of luxury, comfort, and unparalleled style.
            </p>
            <a 
              href="#about" 
              className="inline-block bg-zaina-gold text-zaina-white dark:text-dark-zaina-text-primary font-['Poppins'] font-semibold py-3 px-8 rounded-md hover:opacity-90 transition duration-300 transform hover:scale-105"
            >
              Discover Our Story
            </a>
          </div>

          {/* Image Content */}
          <div className="md:w-1/2 animate-on-scroll" style={{animationDelay: '0.2s'}}>
            <div className="relative aspect-[4/3] rounded-xl shadow-2xl overflow-hidden group">
              <img 
                src={artisanImageUrl} 
                alt={`${storeName} Artisan Craftsmanship`} 
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyZainaSection;