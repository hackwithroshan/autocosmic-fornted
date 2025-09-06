
import React from 'react';
import { GuidedDiscoveryPath, ZainaColor } from '../types';

interface GuidedDiscoveryProps {
  paths: GuidedDiscoveryPath[];
  onPathSelect: (filters: GuidedDiscoveryPath['targetFilters'], promptText: string) => void;
}

const GuidedDiscovery: React.FC<GuidedDiscoveryProps> = ({ paths, onPathSelect }) => {
  if (!paths || paths.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-zaina-sky-blue-light" id="guided-discovery">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-heading-cinzel font-bold text-zaina-text-primary mb-4">
          Find Your Perfect Style
        </h2>
        <p className="text-lg text-zaina-slate-gray font-body-jost mb-8 md:mb-10 max-w-2xl mx-auto">
          Tell us what you're looking for, and we'll help you discover the perfect Zaina outfit.
        </p>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {paths.map((path) => (
            <button
              key={path.id}
              onClick={() => onPathSelect(path.targetFilters, path.prompt)}
              className="bg-zaina-white text-zaina-cta-peach border-2 border-zaina-cta-peach font-body-jost font-medium py-3 px-6 rounded-lg shadow-sm 
                         hover:bg-zaina-cta-peach hover:text-zaina-white hover:shadow-lg 
                         transition-all duration-300 transform hover:scale-105 
                         focus:outline-none focus:ring-2 focus:ring-zaina-cta-peach focus:ring-opacity-50 focus:ring-offset-2"
            >
              {path.prompt}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuidedDiscovery;
