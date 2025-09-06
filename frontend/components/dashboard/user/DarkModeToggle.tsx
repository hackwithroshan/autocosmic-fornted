
import React, { useState } from 'react';
import { ZainaColor } from '../../../types';
import SunIcon from '../../icons/SunIcon'; // Create this icon
import MoonIcon from '../../icons/MoonIcon'; // Create this icon


const DarkModeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you would also save this preference and apply theme changes
    alert(`Dark mode ${!isDarkMode ? 'enabled' : 'disabled'} (UI toggle only).`);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={`p-2 rounded-full transition-colors duration-200
                  ${isDarkMode ? 'bg-zaina-deep-navy hover:bg-gray-700' : 'bg-zaina-sky-blue-light hover:bg-zaina-cool-gray-medium'}`}
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-pressed={isDarkMode}
    >
      {isDarkMode ? (
        <SunIcon className="w-5 h-5 text-yellow-400" />
      ) : (
        <MoonIcon className="w-5 h-5 text-zaina-primary" />
      )}
    </button>
  );
};

export default DarkModeToggle;
