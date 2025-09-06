import React from 'react';
import { ZainaColor } from '../types'; 
import { MEDIA_BASE_URL } from '../constants';

interface ImageBannerProps {
  imageUrl: string;
  altText: string;
  sectionId?: string;
  linkUrl?: string; 
  linkAriaLabel?: string;
  onClick?: () => void; 
}

const ImageBanner: React.FC<ImageBannerProps> = ({
  imageUrl,
  altText,
  sectionId,
  linkUrl,
  linkAriaLabel,
  onClick
}) => {
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${MEDIA_BASE_URL}${imageUrl}`;
  
  const imageElement = (
    <img
      src={fullImageUrl}
      alt={altText}
      className="w-full h-auto object-contain rounded-lg shadow-lg mx-auto"
      loading="lazy"
      style={{ maxHeight: '600px' }} 
    />
  );

  const content = onClick ? (
    <button
        onClick={onClick}
        aria-label={linkAriaLabel || altText}
        className="block w-full hover:opacity-90 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zaina-primary rounded-lg"
    >
        {imageElement}
    </button>
  ) : linkUrl ? (
    <a 
      href={linkUrl} 
      target={linkUrl.startsWith('http') ? '_blank' : '_self'}
      rel={linkUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
      aria-label={linkAriaLabel || altText}
      className="block hover:opacity-90 transition-opacity duration-300"
    >
      {imageElement}
    </a>
  ) : (
    imageElement
  );


  return (
    <section id={sectionId} className={`py-8 md:py-12 animate-on-scroll`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {content}
      </div>
    </section>
  );
};

export default ImageBanner;
