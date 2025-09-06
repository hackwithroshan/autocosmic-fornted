

import React, { useState } from 'react';

interface CategoryGridProps {
  children?: React.ReactNode[];
  onDrop?: (targetParentId: string | null, targetIndex: number) => void;
  setDropTarget?: (target: { parentId: string | null, index: number } | null) => void;
  parentId?: string;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ children, onDrop, setDropTarget, parentId }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const items = React.Children.toArray(children);

  const handleDragOver = (e: React.DragEvent) => {
      if (!onDrop) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(true);
      setDropTarget?.({ parentId: parentId || null, index: items.length });
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
      if (!onDrop) return;
      e.stopPropagation();
      setIsDragOver(false);
      setDropTarget?.(null);
  };
  
  const handleDrop = (e: React.DragEvent) => {
      if (!onDrop) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      onDrop(parentId || null, items.length);
  };

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-dark-zaina-neutral-light">
      <div 
        className={`container mx-auto px-4 transition-all duration-200 ${isDragOver ? 'outline-2 outline-dashed outline-blue-500 p-6' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.length > 0 ? items : (
             <div className="lg:col-span-4 text-center py-10 text-gray-400">
                <p>Drop a 'Grid Card' here from the component library.</p>
             </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
