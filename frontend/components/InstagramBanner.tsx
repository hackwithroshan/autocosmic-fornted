

import React from 'react';
import { ZainaColor } from '../types';
import { MEDIA_BASE_URL } from '../constants';

interface InstagramBannerProps {
    storeName: string;
}

const InstagramBanner: React.FC<InstagramBannerProps> = ({ storeName }) => {
  const backgroundImageUrl = `${MEDIA_BASE_URL}/media/instagram-banner.jpg`;
  const instagramHandle = storeName.replace(/\s+/g, '').toLowerCase();

  return (
    <section 
      className="py-20 md:py-32 bg-cover bg-center relative" 
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-heading-cinzel font-bold text-zaina-white mb-4">
          {storeName.toUpperCase()} ON INSTAGRAM
        </h2>
        <p className="text-xl md:text-2xl font-body-jost text-zaina-neutral-light mb-8">
          Follow <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-zaina-gold underline">@{instagramHandle}</a> to Know More
        </p>
        <a
          href="https://instagram.com" target="_blank" rel="noopener noreferrer"
          className="bg-zaina-cta-peach text-zaina-white font-body-jost font-semibold py-3 px-8 rounded-md hover:opacity-90 transition duration-300 transform hover:scale-105"
        >
          Follow Us
        </a>
      </div>
    </section>
  );
};

export default InstagramBanner;