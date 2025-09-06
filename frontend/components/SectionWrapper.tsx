import React from 'react';
import ArrowUpIcon from './icons/ArrowUpIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';
import TrashIcon from './icons/TrashIcon';

interface SectionWrapperProps {
  children: React.ReactNode;
  isEditMode: boolean;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ children, isEditMode, onRemove, onMoveUp, onMoveDown }) => {
  if (!isEditMode) {
    return <>{children}</>;
  }

  return (
    <div className="relative border-2 border-dashed border-zaina-primary/50 my-2 p-1">
      <div className="absolute top-2 right-2 z-40 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-lg shadow-lg flex items-center gap-1 p-1.5">
        <button onClick={onMoveUp} title="Move Up" className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-gray-700 dark:text-gray-200">
          <ArrowUpIcon className="w-5 h-5" />
        </button>
        <button onClick={onMoveDown} title="Move Down" className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-gray-700 dark:text-gray-200">
          <ArrowDownIcon className="w-5 h-5" />
        </button>
        <button onClick={onRemove} title="Remove Section" className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md text-red-500">
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="opacity-75 pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default SectionWrapper;