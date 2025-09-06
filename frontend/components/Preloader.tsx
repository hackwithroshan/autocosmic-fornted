
import React from 'react';

const Preloader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-zaina-sky-blue-light dark:bg-dark-zaina-neutral-light flex flex-col items-center justify-center z-[200]">
      <div className="flex items-center gap-4">
        {/* Using the default logo SVG from Header.tsx and adding animation */}
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-zaina-primary dark:text-dark-zaina-primary animate-pulse">
            <path d="M20 7.00018L18.41 18.0602C18.2705 19.1352 17.3824 19.9602 16.304 19.9602H7.69601C6.61759 19.9602 5.72954 19.1352 5.59001 18.0602L4 7.00018" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 7.00018C8 5.00018 9 4.00018 12 4.00018C15 4.00018 16 5.00018 16 7.00018" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div>
            <span className="text-2xl font-bold font-heading-cormorant text-zaina-text-primary dark:text-dark-zaina-text-primary">Loading Store...</span>
            <p className="text-sm text-zaina-text-secondary dark:text-dark-zaina-text-secondary">Please wait a moment.</p>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
