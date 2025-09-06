import React, { useState } from 'react';
import { TabbedProductGrid_Tab } from '../types';

interface TabbedProductGridProps {
  title: string;
  tabs: TabbedProductGrid_Tab[];
}

const TabbedProductGrid: React.FC<TabbedProductGridProps> = ({ title, tabs = [] }) => {
  const [activeTab, setActiveTab] = useState(0);

  const activeTabData = tabs[activeTab];

  return (
    <section className="pb-12 md:pb-16 bg-white dark:bg-dark-zaina-bg-card">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl font-bold font-heading-cormorant text-zaina-text-primary dark:text-dark-zaina-text-primary mb-4 sm:mb-0">
            {title}
          </h2>
          <div className="w-full sm:w-auto">
            <div className="flex overflow-x-auto justify-start sm:justify-center gap-x-4 gap-y-2 border-b border-gray-200 dark:border-gray-700 pb-2 custom-scrollbar-hide">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(index)}
                  className={`text-sm font-semibold pb-2 border-b-2 transition-colors whitespace-nowrap px-2 ${
                    activeTab === index
                      ? 'border-zaina-primary text-zaina-primary'
                      : 'border-transparent text-zaina-text-secondary hover:text-zaina-text-primary'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {activeTabData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {activeTabData.banners.map(banner => (
              <a key={banner.id} href={banner.link} className="block group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <img
                  src={banner.imageUrl}
                  alt={`Banner for ${activeTabData.name}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TabbedProductGrid;