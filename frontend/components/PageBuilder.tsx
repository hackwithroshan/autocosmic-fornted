import React, { useState, useEffect } from 'react';
import { HomepageSection, SectionType } from '../types';
import ComponentLibrary from './ComponentLibrary';
import PropertyInspector from './PropertyInspector';
import StructurePanel from './StructurePanel';
import GridIcon from './icons/GridIcon';
import LayersIcon from './icons/LayersIcon';
import ArrowUturnLeftIcon from './icons/ArrowUturnLeftIcon';
import ArrowUturnRightIcon from './icons/ArrowUturnRightIcon';

interface PageBuilderProps {
  children: React.ReactNode; // The canvas content
  layout: HomepageSection[];
  setLayout: (updater: (prev: HomepageSection[]) => HomepageSection[]) => void;
  selectedComponentId: string | null;
  setSelectedComponentId: (id: string | null) => void;
  onClose: () => void;
  onSave: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onStructureDrop: (targetIndex: number) => void;
  onStructureDragStart: (index: number) => void;
  setDraggedItem: (item: HomepageSection | { type: SectionType; [key: string]: any } | null) => void;
  setDraggedFrom: (from: 'library' | { parentId: string | null; index: number } | null) => void;
  onDragEnd: () => void;
}

const PageBuilder: React.FC<PageBuilderProps> = ({
  children,
  layout,
  setLayout,
  selectedComponentId,
  setSelectedComponentId,
  onClose,
  onSave,
  undo,
  redo,
  canUndo,
  canRedo,
  onStructureDrop,
  onStructureDragStart,
  setDraggedItem,
  setDraggedFrom,
  onDragEnd,
}) => {
  const [activeTab, setActiveTab] = useState<'components' | 'structure'>('components');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          undo();
        }
        if (e.key === 'y' || (e.shiftKey && e.key === 'z')) {
          e.preventDefault();
          redo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo]);

  return (
    <div className="fixed inset-0 bg-gray-100 dark:bg-gray-900 flex flex-col font-sans">
      {/* Header */}
      <header className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
            &larr; Exit Editor
          </button>
        </div>

        <div className="flex items-center gap-2">
            <button onClick={undo} disabled={!canUndo} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed" title="Undo (Ctrl+Z)">
              <ArrowUturnLeftIcon className="w-5 h-5"/>
            </button>
             <button onClick={redo} disabled={!canRedo} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed" title="Redo (Ctrl+Y)">
              <ArrowUturnRightIcon className="w-5 h-5"/>
            </button>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => alert("Preview Mode Toggled (simulated)")} className="text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
            Preview
          </button>
          <button onClick={onSave} className="text-sm font-medium text-white bg-blue-600 px-4 py-1.5 rounded-md hover:bg-blue-700">
            Publish
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Component Library & Structure */}
        <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-1 p-1">
                    <button 
                        onClick={() => setActiveTab('components')}
                        className={`flex-1 flex justify-center items-center gap-2 p-2 text-sm rounded-md ${activeTab === 'components' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                    >
                        <GridIcon className="w-4 h-4" />
                        Components
                    </button>
                     <button 
                        onClick={() => setActiveTab('structure')}
                        className={`flex-1 flex justify-center items-center gap-2 p-2 text-sm rounded-md ${activeTab === 'structure' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                    >
                        <LayersIcon className="w-4 h-4" />
                        Structure
                    </button>
                </nav>
            </div>
            <div className="overflow-y-auto">
                {activeTab === 'components' && <ComponentLibrary setDraggedItem={setDraggedItem} setDraggedFrom={setDraggedFrom} onDragEnd={onDragEnd} />}
                {activeTab === 'structure' && (
                    <StructurePanel 
                        layout={layout} 
                        selectedId={selectedComponentId} 
                        onSelect={setSelectedComponentId}
                        onDragStart={onStructureDragStart}
                        onDrop={onStructureDrop}
                    />
                )}
            </div>
        </aside>

        {/* Center Panel: Canvas */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900/50" onClick={() => setSelectedComponentId(null)} onDragEnd={onDragEnd}>
          <div className="max-w-7xl mx-auto my-4 p-2">
            {children}
          </div>
        </main>

        {/* Right Panel: Property Inspector */}
        <aside className="w-72 flex-shrink-0 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
          <PropertyInspector
            layout={layout}
            setLayout={setLayout}
            selectedComponentId={selectedComponentId}
          />
        </aside>
      </div>
    </div>
  );
};

export default PageBuilder;