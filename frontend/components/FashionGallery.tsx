
import React from 'react';

interface FashionGalleryProps {
    images: string[];
    storeName: string;
}

const FashionGallery: React.FC<FashionGalleryProps> = ({ images, storeName }) => {
  if (!images || images.length === 0) {
    return null; // Don't render if there are no images
  }
  
  return (
    <section className="py-12 md:py-20 bg-zaina-neutral-light dark:bg-dark-zaina-neutral-light">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading-cinzel font-bold text-center text-zaina-text-primary dark:text-dark-zaina-text-primary mb-10 md:mb-12">
          The <span className="text-zaina-primary dark:text-dark-zaina-primary">{storeName}</span> Look
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {images.map((src, index) => (
            <div 
              key={index} 
              className="aspect-[2/3] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-1"
            >
              <img 
                src={src} 
                alt={`Fashion Gallery Image ${index + 1}`} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FashionGallery;