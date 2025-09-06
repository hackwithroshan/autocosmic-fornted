

import React from 'react';

interface TopCategoriesProps {
  title: string;
  children?: React.ReactNode[];
  onCategoryClick?: (link: string) => void;
  titleColor?: string;
  titleFontSize?: string;
  titleFontFamily?: string;
}

const TopCategories: React.FC<TopCategoriesProps> = ({ 
  title, 
  children, 
  onCategoryClick, 
  titleColor = '#2C3E50', // zaina-text-primary
  titleFontSize, 
  titleFontFamily,
}) => {
  const items = React.Children.toArray(children);

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-dark-zaina-bg-card">
      <div className="container mx-auto px-4">
        <h2 
            className="text-3xl md:text-4xl font-heading-cormorant font-bold text-center mb-10 md:mb-12" 
            style={{ 
                color: titleColor,
                fontSize: titleFontSize ? `${titleFontSize}px` : undefined,
                fontFamily: titleFontFamily ? `'${titleFontFamily}', serif` : undefined
            }}
        >
            {title}
        </h2>
        
        {items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
            {items.map((child, index) => (
              <div key={index}>
                {React.cloneElement(child as React.ReactElement<any>, { onCategoryClick })}
              </div>
            ))}
          </div>
        ) : (
          <div className="lg:col-span-4 text-center py-10 text-gray-400">
            <p>Drop a 'Top Category Card' here from the component library.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TopCategories;