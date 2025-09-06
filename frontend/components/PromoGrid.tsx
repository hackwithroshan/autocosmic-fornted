import React, { useState } from 'react';
import { HomepageSection, SectionType } from '../types';

interface PromoGridProps {
  children?: React.ReactNode[];
  onDrop: (targetParentId: string | null, targetIndex: number) => void;
  setDropTarget: (target: { parentId: string | null, index: number } | null) => void;
  parentId: string;
  title: string;
  titleColor?: string;
  titleFontSize?: string;
  titleFontFamily?: string;
}

const PromoGrid: React.FC<PromoGridProps> = ({ 
  children,
  onDrop,
  setDropTarget,
  parentId,
  title, 
  titleColor = '#2C3E50', 
  titleFontSize, 
  titleFontFamily 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const items = React.Children.toArray(children);

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(true);
      setDropTarget({ parentId, index: items.length });
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
      e.stopPropagation();
      setIsDragOver(false);
      setDropTarget(null);
  };
  
  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      onDrop(parentId, items.length);
  };

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-dark-zaina-neutral-light">
      <div className="container mx-auto px-4">
        <h2 
          className="text-3xl md:text-4xl font-heading-cormorant font-semibold text-center mb-10 md:mb-12" 
          style={{ 
            color: titleColor,
            fontSize: titleFontSize ? `${titleFontSize}px` : undefined,
            fontFamily: titleFontFamily ? `'${titleFontFamily}', serif` : undefined
          }}
        >
          {title}
        </h2>
        <div 
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-200 ${isDragOver ? 'outline-2 outline-dashed outline-blue-500 p-4' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {items.length > 0 ? items : (
            <div className="lg:col-span-3 text-center py-10 text-gray-400">
                <p>Drop a 'Promo Card' here from the component library.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PromoGrid;