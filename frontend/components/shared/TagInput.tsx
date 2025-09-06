
import React, { useState } from 'react';
import CloseIcon from '../icons/CloseIcon';

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder: string;
  label: string;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags, placeholder, label }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.some(tag => tag.toLowerCase() === newTag.toLowerCase())) {
        setTags([...tags, newTag]);
      }
      setInputValue('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
        <label className="block text-sm font-medium text-admin-text dark:text-admin-dark-text mb-1.5">{label}</label>
        <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-admin-light-card dark:bg-admin-dark-card">
        {tags.map((tag, index) => (
            <div key={index} className="flex items-center gap-1 bg-admin-accent text-white text-xs font-semibold px-2 py-1 rounded-full">
            <span>{tag}</span>
            <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-white hover:bg-white/20 rounded-full"
                aria-label={`Remove ${tag}`}
            >
                <CloseIcon className="w-3 h-3" />
            </button>
            </div>
        ))}
        <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-grow bg-transparent outline-none text-sm p-1"
        />
        </div>
    </div>
  );
};

export default TagInput;
