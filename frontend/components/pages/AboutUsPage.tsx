

import React from 'react';
import { MEDIA_BASE_URL } from '../../constants';
import { ZainaColor } from '../../types';

interface AboutUsPageProps {
    storeName: string;
}

const AboutUsPage: React.FC<AboutUsPageProps> = ({ storeName }) => {
  const founderImageUrl = `${MEDIA_BASE_URL}/media/founder.jpg`; 
  const backgroundTextureUrl = 'https://www.transparenttextures.com/patterns/soft-wallpaper.png'; 

  return (
    <div 
        className="bg-zaina-neutral-light dark:bg-dark-zaina-bg-card min-h-screen py-12 md:py-16 font-body-jost"
        style={{ backgroundImage: `url(${backgroundTextureUrl})`}}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <section className="text-center mb-16 md:mb-20">
          <h1 className="text-4xl md:text-6xl font-heading-playfair font-bold text-zaina-text-primary dark:text-dark-zaina-text-primary mb-4">
            About <span className="text-zaina-primary dark:text-dark-zaina-primary">{storeName}</span>
          </h1>
          <p className="text-lg md:text-xl text-zaina-text-secondary dark:text-dark-zaina-text-secondary max-w-3xl mx-auto leading-relaxed">
            Born out of tradition, styled for the now — {storeName} brings India's elegance to the modern woman, weaving stories of heritage into every thread.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-16 md:mb-20">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-heading-playfair font-semibold text-zaina-text-primary dark:text-dark-zaina-text-primary mb-5">
              Our Founder's Vision
            </h2>
            <p className="text-zaina-text-secondary dark:text-dark-zaina-text-secondary mb-4 leading-relaxed">
              "My journey with {storeName} began with a deep love for India's rich textile heritage and a desire to see its timeless beauty embraced by contemporary women globally. I envisioned a brand that wasn't just about clothing, but about identity, confidence, and the celebration of femininity."
            </p>
            <p className="text-zaina-text-secondary dark:text-dark-zaina-text-secondary mb-4 leading-relaxed">
              "We strive to create pieces that are not only aesthetically stunning but also tell a story of craftsmanship, quality, and sustainable practices. {storeName} is for the woman who values elegance, understands artistry, and carries her heritage with pride."
            </p>
            <p className="font-semibold text-zaina-primary font-heading-playfair text-lg">- Aanya Sharma, Founder</p>
          </div>
          <div className="order-1 md:order-2">
            <img 
              src={founderImageUrl} 
              alt={`Aanya Sharma, Founder of ${storeName}`} 
              className="rounded-lg shadow-xl w-full max-w-md mx-auto aspect-[4/5] object-cover" 
            />
          </div>
        </section>

        <section className="mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-heading-playfair font-semibold text-zaina-text-primary dark:text-dark-zaina-text-primary text-center mb-10">
            Our Core Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {[
              { title: "Artisanal Craftsmanship", description: "Celebrating traditional techniques and skilled artisans behind every creation." },
              { title: "Timeless Elegance", description: "Designing pieces that transcend trends, offering enduring style and sophistication." },
              { title: "Quality & Comfort", description: "Using premium fabrics and meticulous construction for luxurious feel and wearability." },
              { title: "Empowering Women", description: "Creating fashion that instills confidence and celebrates the strength of femininity." },
              { title: "Ethical Practices", description: "Committing to responsible sourcing and mindful production for a sustainable future." },
              { title: "Customer Delight", description: "Ensuring every experience is as beautiful as our garments." },
            ].map(value => (
              <div key={value.title} className="bg-zaina-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-heading-cormorant font-semibold text-zaina-primary mb-2">{value.title}</h3>
                <p className="text-sm text-zaina-text-secondary leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </section>
        
         <section className="text-center">
            <h2 className="text-3xl md:text-4xl font-heading-playfair font-semibold text-zaina-text-primary dark:text-dark-zaina-text-primary mb-12">
                Our Journey
            </h2>
            <div className="relative max-w-2xl mx-auto before:content-[''] before:absolute before:left-1/2 before:-ml-px before:h-full before:w-0.5 before:bg-zaina-neutral-medium dark:before:bg-dark-zaina-neutral-medium">
                <div className="mb-10 flex w-full items-center" >
                    <div className="w-1/2 flex justify-end pr-8">
                        <div className="bg-zaina-white p-4 rounded-lg shadow-lg text-right">
                            <h3 className="font-semibold text-zaina-text-primary text-md">Brand Inception</h3>
                            <p className="text-xs text-zaina-text-secondary">{storeName} was born with a vision.</p>
                        </div>
                    </div>
                    <div className="z-10 bg-zaina-primary text-zaina-white w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm shadow-xl">2021</div>
                    <div className="w-1/2"></div>
                </div>
                 <div className="mb-10 flex w-full items-center">
                    <div className="w-1/2"></div>
                    <div className="z-10 bg-zaina-primary text-zaina-white w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm shadow-xl">2022</div>
                    <div className="w-1/2 flex justify-start pl-8">
                        <div className="bg-zaina-white p-4 rounded-lg shadow-lg text-left">
                            <h3 className="font-semibold text-zaina-text-primary text-md">First Flagship Store</h3>
                            <p className="text-xs text-zaina-text-secondary">Opened doors to our first customers.</p>
                        </div>
                    </div>
                </div>
                 <div className="flex w-full items-center">
                    <div className="w-1/2 flex justify-end pr-8">
                        <div className="bg-zaina-white p-4 rounded-lg shadow-lg text-right">
                            <h3 className="font-semibold text-zaina-text-primary text-md">Expanding Online</h3>
                            <p className="text-xs text-zaina-text-secondary">Bringing {storeName} to the world, digitally.</p>
                        </div>
                    </div>
                    <div className="z-10 bg-zaina-primary text-zaina-white w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm shadow-xl">2024</div>
                    <div className="w-1/2"></div>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
};

export default AboutUsPage;