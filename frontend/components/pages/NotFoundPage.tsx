
import React from 'react';
import { PageName } from '../../types';
import ShoppingBagIcon from '../icons/ShoppingBagIcon';
import SparkleIcon from '../icons/SparkleIcon';

interface NotFoundPageProps {
  navigateToPage: (page: PageName, data?: any) => void;
}

const floatingItems = [
  { name: 'Kurta', style: { top: '10%', left: '15%', animationDuration: '15s' } },
  { name: 'Saree', style: { top: '20%', left: '80%', animationDuration: '12s' } },
  { name: 'Anarkali', style: { top: '50%', left: '5%', animationDuration: '18s' } },
  { name: 'Jhumkas', style: { top: '80%', left: '20%', animationDuration: '10s' } },
  { name: 'Lehenga', style: { top: '70%', left: '90%', animationDuration: '16s' } },
  { name: 'Dupatta', style: { top: '90%', left: '50%', animationDuration: '14s' } },
  { name: 'Mojari', style: { top: '5%', left: '45%', animationDuration: '19s' } },
  { name: 'Sherwani', style: { top: '40%', left: '70%', animationDuration: '11s' } },
];

const NotFoundPage: React.FC<NotFoundPageProps> = ({ navigateToPage }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-zaina-sky-blue-light dark:bg-dark-zaina-neutral-light flex items-center justify-center p-4 font-body-jost">
      <div className="style-verse-bg absolute inset-0 z-0">
        {floatingItems.map(item => (
          <span
            key={item.name}
            className="floating-item font-heading-cormorant"
            style={item.style}
          >
            {item.name}
          </span>
        ))}
      </div>

      <div className="relative z-10 text-center bg-white/70 dark:bg-black/50 backdrop-blur-md p-8 sm:p-12 rounded-2xl shadow-2xl max-w-lg mx-auto">
        <h1 className="text-4xl sm:text-5xl font-heading-playfair font-bold text-zaina-text-primary dark:text-dark-zaina-text-primary mb-4">
          Lost in the Style-Verse?
        </h1>
        <p className="text-base sm:text-lg text-zaina-text-secondary dark:text-dark-zaina-text-secondary mb-8">
          Oops! Looks like you’ve taken a wrong turn on the runway of the internet. 👠✨<br />
          But no worries, fashion always finds a way.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigateToPage('shop')}
            className="w-full sm:w-auto bg-zaina-cta-blue text-zaina-white font-semibold py-3 px-6 rounded-md hover:opacity-90 transition duration-300 flex items-center justify-center gap-2"
          >
            <ShoppingBagIcon className="w-5 h-5" />
            Return to Shop
          </button>
          <button
            onClick={() => navigateToPage('shop', { category: 'NEW ARRIVAL' })}
            className="w-full sm:w-auto bg-transparent border-2 border-zaina-primary text-zaina-primary font-semibold py-3 px-6 rounded-md hover:bg-zaina-primary hover:text-white transition duration-300 flex items-center justify-center gap-2"
          >
            <SparkleIcon className="w-5 h-5" />
            Explore New Arrivals
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
            opacity: 1;
          }
          100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.7;
          }
        }

        .floating-item {
          position: absolute;
          color: rgba(74, 144, 226, 0.2);
          font-size: 2rem;
          font-weight: 700;
          animation-name: float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          user-select: none;
        }

        .dark .floating-item {
            color: rgba(212, 175, 55, 0.1);
        }

        .floating-item:nth-child(odd) {
          animation-direction: alternate;
        }
        .floating-item:nth-child(even) {
          animation-direction: alternate-reverse;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
