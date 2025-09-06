
import React from 'react';

interface ImageWithTextSectionProps {
  title: string;
  text: string;
  imageUrl: string;
  imageSide: 'left' | 'right';
}

const ImageWithTextSection: React.FC<ImageWithTextSectionProps> = ({
  title,
  text,
  imageUrl,
  imageSide,
}) => {
  const imageOrder = imageSide === 'left' ? 'md:order-first' : 'md:order-last';

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-dark-zaina-bg-card">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className={`order-last ${imageOrder}`}>
            <img src={imageUrl} alt={title} className="w-full h-auto rounded-lg shadow-md" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold font-heading-playfair mb-4">{title}</h2>
            <p className="text-zaina-text-secondary leading-relaxed">{text}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageWithTextSection;