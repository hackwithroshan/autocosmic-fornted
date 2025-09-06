

import React, { useState, useEffect } from 'react';
import ChevronDownIcon from '../icons/ChevronDownIcon'; 
import { ZainaColor } from '../../types';

interface AccordionProps {
  title: React.ReactNode;
  identifier: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  disabled?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ title, identifier, children, defaultOpen = false, onToggle, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    setIsOpen(defaultOpen);
  }, [defaultOpen]);

  const toggleAccordion = () => {
    if (disabled) return;
    const newState = !isOpen;
    setIsOpen(newState);
    if(onToggle) {
        onToggle(newState);
    }
  };

  const buttonId = `accordion-title-${identifier}`;
  const contentId = `accordion-content-${identifier}`;

  return (
    <div className={`border border-zaina-neutral-medium dark:border-dark-zaina-neutral-medium rounded-lg overflow-hidden bg-zaina-white dark:bg-dark-zaina-bg-card shadow-sm ${disabled ? 'opacity-60 bg-zaina-neutral-light dark:bg-dark-zaina-neutral-medium' : ''}`}>
      <button
        id={buttonId}
        onClick={toggleAccordion}
        className="flex justify-between items-center w-full p-4 text-left font-semibold text-zaina-text-primary dark:text-dark-zaina-text-primary hover:bg-zaina-sky-blue-light/50 dark:hover:bg-dark-zaina-sky-blue-light/30 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-zaina-primary dark:focus-visible:ring-dark-zaina-primary"
        aria-expanded={isOpen}
        aria-controls={contentId}
        disabled={disabled}
      >
        <span className="font-heading-cormorant text-lg">{title}</span>
        <ChevronDownIcon 
          className={`w-5 h-5 text-zaina-primary dark:text-dark-zaina-primary transform transition-transform duration-300 ${isOpen && !disabled ? 'rotate-180' : ''}`} 
        />
      </button>
      {isOpen && !disabled && (
        <div 
            id={contentId}
            className="p-4 border-t border-zaina-cool-gray-light dark:border-dark-zaina-neutral-medium bg-zaina-white dark:bg-dark-zaina-bg-card" 
            role="region"
            aria-labelledby={buttonId}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;