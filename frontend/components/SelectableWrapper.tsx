import React, { useState } from 'react';
import { HomepageSection, SectionType } from '../types';
import ArrowUpIcon from './icons/ArrowUpIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';
import TrashIcon from './icons/TrashIcon';


interface SelectableWrapperProps {
  children: React.ReactNode;
  id: string;
  isSelected: boolean;
  onClick: (id: string) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  styles?: React.CSSProperties;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDrop: (targetParentId: string | null, targetIndex: number) => void;
  setDropTarget: (target: { parentId: string | null, index: number } | null) => void;
  dropTarget: { parentId: string | null, index: number } | null;
  path: string; // e.g., "layout[0].children[1]"
  draggedItem: HomepageSection | { type: SectionType } | null;
}

const SelectableWrapper: React.FC<SelectableWrapperProps> = ({
  children,
  id,
  isSelected,
  onClick,
  onRemove,
  onMoveUp,
  onMoveDown,
  styles,
  onDragStart,
  onDragEnd,
  onDrop,
  setDropTarget,
  dropTarget,
  path,
  draggedItem
}) => {
  const [dragOverPosition, setDragOverPosition] = useState<'top' | 'bottom' | null>(null);

  const getPathInfo = (p: string) => {
      const parts = p.split('.children[');
      const index = parseInt(parts.pop()?.replace(']', '') || '0', 10);
      
      let parentId: string | null = null;
      // This is a simplified way to get parentId, a more robust solution would be needed for deep nesting
      if (parts.length > 0) {
        // A more complex parser would be needed here, for now we rely on the parent component
      }
      return { parentId, index };
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    onClick(id);
  };

  const handleDragStart = (e: React.DragEvent) => {
      e.stopPropagation();
      e.dataTransfer.setData('application/json', JSON.stringify({ type: 'reorder-item', id }));
      onDragStart();
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedItem) return;
    if ('id' in draggedItem && draggedItem.id === id) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const isOverTopHalf = e.clientY < rect.top + rect.height / 2;
    const { parentId: currentParentId, index } = getPathInfo(path);

    if (isOverTopHalf) {
        setDragOverPosition('top');
        setDropTarget({ parentId: currentParentId, index });
    } else {
        setDragOverPosition('bottom');
        setDropTarget({ parentId: currentParentId, index: index + 1 });
    }
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    setDragOverPosition(null);
    setDropTarget(null);
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if(dropTarget) {
      onDrop(dropTarget.parentId, dropTarget.index);
    }
    setDragOverPosition(null);
    setDropTarget(null);
  }
  
  return (
    <div 
        className={`relative my-1 transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-900' : 'hover:ring-2 hover:ring-blue-500/50'}`}
        style={styles}
        onClick={handleClick}
        draggable="true"
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDragEnd={onDragEnd}
    >
      {isSelected && (
          <div className="absolute top-2 right-2 z-40 bg-white/80 dark:bg-black/70 backdrop-blur-sm rounded-lg shadow-lg flex items-center gap-1 p-1.5">
              <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} title="Move Up" className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-gray-700 dark:text-gray-200">
                  <ArrowUpIcon className="w-5 h-5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} title="Move Down" className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-gray-700 dark:text-gray-200">
                  <ArrowDownIcon className="w-5 h-5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onRemove(); }} title="Remove Section" className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md text-red-500">
                  <TrashIcon className="w-5 h-5" />
              </button>
          </div>
      )}
      {draggedItem && 'id' in draggedItem && draggedItem.id !== id && dropTarget?.index === getPathInfo(path).index && dropTarget?.parentId === getPathInfo(path).parentId && dragOverPosition === 'top' && <div className="absolute -top-1 left-0 right-0 h-1 bg-blue-500 z-50"></div>}
      {children}
      {draggedItem && 'id' in draggedItem && draggedItem.id !== id && dropTarget?.index === getPathInfo(path).index + 1 && dropTarget?.parentId === getPathInfo(path).parentId && dragOverPosition === 'bottom' && <div className="absolute -bottom-1 left-0 right-0 h-1 bg-blue-500 z-50"></div>}
    </div>
  );
};

export default SelectableWrapper;