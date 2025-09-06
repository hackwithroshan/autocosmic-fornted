import React from 'react';
import { PromoGrid2CardData } from '../types';

interface PromoGrid2Props {
  card1: PromoGrid2CardData;
  card2: PromoGrid2CardData;
  card3: PromoGrid2CardData;
  card4: PromoGrid2CardData;
}

const PromoCard: React.FC<{ card: PromoGrid2CardData, className?: string }> = ({ card, className = '' }) => {
  if (!card) {
      return (
          <div className={`relative p-6 flex flex-col justify-center items-center text-center bg-gray-200 rounded-lg text-red-500 ${className}`}>
              Missing Card Data. Please configure in the editor.
          </div>
      );
  }
  const bgStyle = card.backgroundImage
    ? { backgroundImage: `url(${card.backgroundImage})` }
    : { backgroundColor: card.backgroundColor || '#f0f0f0' };
    
  return (
    <div
      className={`relative p-6 flex flex-col justify-center items-start text-left bg-cover bg-center rounded-lg overflow-hidden group ${className}`}
      style={bgStyle}
    >
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
      <div className="relative z-10" style={{ color: card.textColor }}>
        {card.tag && <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: card.tag.includes('OFF') ? '#34D399' : card.textColor }}>{card.tag}</p>}
        {card.title && <h3 className="text-2xl font-bold font-heading-cormorant mt-1">{card.title}</h3>}
        {card.subtitle && <p className="text-sm mt-1">{card.subtitle}</p>}
        {card.buttonText && (
          <a
            href={card.buttonLink}
            style={{ backgroundColor: card.buttonColor, color: card.buttonTextColor }}
            className="mt-4 inline-block text-sm font-semibold py-2 px-5 rounded-full transition-transform transform group-hover:scale-105"
          >
            {card.buttonText}
          </a>
        )}
      </div>
    </div>
  );
};

const PromoGrid2: React.FC<PromoGrid2Props> = ({ card1, card2, card3, card4 }) => {
  return (
    <section className="py-12 md:py-16 bg-white dark:bg-dark-zaina-neutral-light">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Large Card */}
          <PromoCard card={card1} className="min-h-[400px] lg:min-h-full" />
          
          {/* Right Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <PromoCard card={card2} className="min-h-[250px]" />
            <PromoCard card={card3} className="min-h-[250px]" />
            <PromoCard card={card4} className="sm:col-span-2 min-h-[250px]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoGrid2;