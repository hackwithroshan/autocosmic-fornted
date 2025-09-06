import React, { useState, useEffect, useRef } from 'react';
import SearchIcon from './icons/SearchIcon';
import CameraIcon from './icons/CameraIcon';
import { PageName } from '../types';

interface AnimatedSearchBarProps {
  categories: string[];
  popularChoices: string[];
  navigateToPage: (page: PageName, data?: any) => void;
}

const AnimatedSearchBar: React.FC<AnimatedSearchBarProps> = ({ categories, popularChoices, navigateToPage }) => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!categories || categories.length === 0) return;
    const interval = setInterval(() => {
      setCurrentCategoryIndex(prevIndex => (prevIndex + 1) % categories.length);
    }, 3000); // Change every 3 seconds
    return () => clearInterval(interval);
  }, [categories]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalQuery = searchTerm;
    if (finalQuery.trim()) {
      navigateToPage('shop', { searchTerm: finalQuery.trim() });
      setSearchTerm('');
      setIsFocused(false);
    }
  };

  const handlePopularChoiceClick = (choice: string) => {
    navigateToPage('shop', { category: choice });
    setIsFocused(false);
  }

  return (
    <div className="relative w-full max-w-xl mx-auto" ref={containerRef}>
      <form onSubmit={handleSearchSubmit} role="search" className="relative">
        <div className="flex items-center w-full bg-gray-100 dark:bg-dark-zaina-neutral-medium border border-gray-200 dark:border-dark-zaina-neutral-medium rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-zaina-primary dark:focus-within:ring-dark-zaina-primary transition-shadow">
          <div className="pl-4 pr-2 text-gray-500">
            <SearchIcon className="w-5 h-5" />
          </div>
          <div className="flex-grow flex items-center h-12 text-sm text-gray-500 cursor-text relative" onClick={() => inputRef.current?.focus()}>
            <input
              ref={inputRef}
              type="text"
              className="w-full h-full bg-transparent focus:outline-none text-zaina-text-primary dark:text-dark-zaina-text-primary placeholder:text-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Search..."
            />
            {(!searchTerm && categories.length > 0) && (
              <div className="absolute left-0 flex items-center pointer-events-none">
                <span>Search for&nbsp;</span>
                <div className="relative h-5 overflow-hidden w-32 text-left">
                  <span
                    key={currentCategoryIndex}
                    className="absolute inset-0 animate-text-slide-up text-zaina-text-primary dark:text-dark-zaina-text-primary font-medium"
                  >
                    {categories[currentCategoryIndex]}
                  </span>
                </div>
              </div>
            )}
          </div>
          <button type="button" className="p-3 text-gray-600 dark:text-gray-400 hover:text-zaina-primary dark:hover:text-dark-zaina-primary">
            <CameraIcon className="w-6 h-6" />
          </button>
        </div>
      </form>
      
      {isFocused && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-dark-zaina-bg-card rounded-lg shadow-lg z-50 overflow-hidden border border-gray-200 dark:border-dark-zaina-neutral-medium p-4">
          <h4 className="font-semibold text-sm text-zaina-text-primary dark:text-dark-zaina-text-primary mb-3">Popular Choices</h4>
          <ul className="flex flex-wrap gap-2">
            {popularChoices.map(choice => (
              <li key={choice}>
                <button 
                  onClick={() => handlePopularChoiceClick(choice)}
                  className="px-3 py-1.5 bg-zaina-sky-blue-light/50 dark:bg-dark-zaina-sky-blue-light/20 text-zaina-text-secondary dark:text-dark-zaina-text-secondary text-xs font-medium rounded-full hover:bg-zaina-sky-blue-light dark:hover:bg-dark-zaina-sky-blue-light hover:text-zaina-primary dark:hover:text-dark-zaina-primary transition-colors"
                >
                  {choice}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default AnimatedSearchBar;
