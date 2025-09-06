
import React from 'react';
import { EmotionCategory, ZainaColor } from '../types';

interface ShopByEmotionProps {
  emotions: EmotionCategory[];
  onEmotionSelect: (emotionTag: string) => void;
}

const ShopByEmotion: React.FC<ShopByEmotionProps> = ({ emotions, onEmotionSelect }) => {
  if (!emotions || emotions.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-zaina-neutral-light" id="shop-by-emotion">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading-cinzel font-bold text-center text-zaina-text-primary mb-3">
          Shop by Emotion
        </h2>
        <p className="text-center text-lg text-zaina-slate-gray font-body-jost mb-10 md:mb-12">
          Dress How You Feel, Express Your Inner Radiance.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {emotions.map((emotion) => (
            <div 
              key={emotion.id}
              onClick={() => onEmotionSelect(emotion.emotionTag)}
              className="group relative rounded-xl overflow-hidden shadow-lg cursor-pointer aspect-square md:aspect-[4/3] 
                         transition-all duration-300 hover:shadow-2xl hover:scale-105 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-zaina-primary"
              role="button"
              tabIndex={0}
              aria-label={`Shop for products that make you ${emotion.name.toLowerCase()}`}
              onKeyDown={(e) => e.key === 'Enter' && onEmotionSelect(emotion.emotionTag)}
            >
              <img 
                src={emotion.imageUrl} 
                alt={emotion.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent 
                              group-hover:from-black/70 group-hover:via-black/50 
                              transition-all duration-300 flex flex-col items-center justify-end text-center p-4 pb-6">
                <h3 className="text-xl md:text-2xl font-heading-playfair font-semibold text-zaina-white transition-colors">
                  {emotion.name}
                </h3>
                <p className="text-xs md:text-sm text-zaina-white transition-colors mt-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300 ease-out line-clamp-2">
                  {emotion.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByEmotion;
