
import React, { useState } from 'react';
import { HomepageSection } from '../types';

interface StructurePanelProps {
  layout: HomepageSection[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onDragStart: (index: number) => void;
  onDrop: (targetIndex: number) => void;
}

const StructurePanel: React.FC<StructurePanelProps> = ({ layout, selectedId, onSelect, onDragStart, onDrop }) => {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  return (
    <div 
        className="p-2 space-y-1"
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => onDrop(layout.length)}
    >
      {layout.map((section, index) => (
        <button
          key={section.id}
          draggable="true"
          onDragStart={() => onDragStart(index)}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverIndex(index);
          }}
          onDragLeave={() => setDragOverIndex(null)}
          onDrop={(e) => {
            e.stopPropagation(); 
            onDrop(index);
            setDragOverIndex(null);
          }}
          onClick={() => onSelect(section.id)}
          className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-150 relative
            ${
              selectedId === section.id
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-semibold'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
            }
          `}
        >
          {section.name || section.type}
          {dragOverIndex === index && <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500" />}
        </button>
      ))}
       {layout.length === 0 && (
        <p className="text-xs text-center text-gray-400 p-4">The page is empty. Add a component to begin.</p>
       )}
    </div>
  );
};

export default StructurePanel;