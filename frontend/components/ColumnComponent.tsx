
import React, { useState } from 'react';
import { HomepageSection } from '../types';
import PlusCircleIcon from './icons/PlusCircleIcon';

interface ColumnComponentProps {
  children?: React.ReactNode[];
  // Props passed by the editor for drag & drop
  parentId?: string;
  onDrop?: (targetParentId: string | null, targetIndex: number) => void;
  setDropTarget?: (target: { parentId: string | null, index: number } | null) => void;
}

const ColumnComponent: React.FC<ColumnComponentProps> = ({ children, parentId, onDrop, setDropTarget }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const items = React.Children.toArray(children);
  const hasChildren = items.length > 0;
  
  const handleDragOver = (e: React.DragEvent) => {
      if (!onDrop) return;
      e.preventDefault();
      e.stopPropagation();
      if(parentId && setDropTarget) {
        setIsDragOver(true);
        // We drop at the end of the list of children in this column
        setDropTarget({ parentId, index: items.length });
      }
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
      if(parentId) {
        onDrop(parentId, items.length);
      }
      setIsDragOver(false);
      setDropTarget?.(null);
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center h-full p-4 border border-dashed rounded-lg min-h-[150px] transition-all duration-200
        ${isDragOver ? 'border-blue-500 bg-blue-500/10' : 'border-gray-300 dark:border-gray-600'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {hasChildren ? (
        <div className="w-full space-y-4">
            {children}
        </div>
      ) : (
        <div className="text-center text-gray-400 pointer-events-none">
           <div className="flex flex-col items-center gap-2 text-sm">
             <PlusCircleIcon className="w-6 h-6" />
             Drop Elements Here
           </div>
        </div>
      )}
    </div>
  );
};

export default ColumnComponent;
