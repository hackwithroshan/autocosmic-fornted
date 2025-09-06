

import React from 'react';

interface ColumnsSectionProps {
  children: React.ReactNode[];
  columnCount: 2 | 3 | 4;
}

const ColumnsSection: React.FC<ColumnsSectionProps> = ({
  children = [],
  columnCount = 2,
}) => {
  const gridClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-dark-zaina-bg-card">
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 ${gridClasses[columnCount]} gap-8`}>
          {React.Children.toArray(children).slice(0, columnCount)}
        </div>
      </div>
    </section>
  );
};

export default ColumnsSection;