
import React from 'react';
import { OccasionContent } from '../types';

interface ShopByOccasionProps {
  occasions: OccasionContent[];
  onOccasionSelect: (occasionName: string) => void;
}

const ShopByOccasion: React.FC<ShopByOccasionProps> = ({ occasions, onOccasionSelect }) => {
  if (!occasions || occasions.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-zaina-white dark:bg-dark-zaina-bg-card" id="shop-by-occasion">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading-cinzel font-bold text-center text-zaina-text-primary dark:text-dark-zaina-text-primary mb-3">
          Shop by Occasion
        </h2>
        <p className="text-center text-lg text-zaina-text-secondary dark:text-dark-zaina-text-secondary font-body-jost mb-10 md:mb-12">
          Find the perfect ensemble for every event on your calendar.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {occasions.map((occasion) => (
            <div
              key={occasion.id}
              onClick={() => onOccasionSelect(occasion.name)}
              className="group relative rounded-xl overflow-hidden shadow-lg cursor-pointer aspect-w-16 aspect-h-9
                         transition-all duration-300 hover:shadow-2xl hover:scale-105 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-zaina-primary"
              role="button"
              tabIndex={0}
              aria-label={`Shop for ${occasion.name}`}
              onKeyDown={(e) => e.key === 'Enter' && onOccasionSelect(occasion.name)}
            >
              <img
                src={occasion.imageUrl}
                alt={occasion.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-8">
                <div className="text-white">
                  <h3 className="text-2xl md:text-3xl font-heading-playfair font-semibold transition-colors">
                    {occasion.title}
                  </h3>
                  <p className="text-sm md:text-base text-zaina-white/90 transition-colors mt-2 max-w-sm">
                    {occasion.description}
                  </p>
                   <span className="mt-4 inline-block bg-zaina-white text-zaina-text-primary px-4 py-2 rounded-md text-sm font-semibold transform group-hover:scale-105 group-hover:bg-zaina-gold transition-all duration-300">
                      Explore {occasion.name}
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByOccasion;
