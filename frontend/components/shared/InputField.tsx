

import React from 'react';

interface InputFieldProps {
  label: string;
  type?: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  maxLength?: number;
  icon?: React.ReactNode;
  helperText?: string;
  as?: 'input' | 'select' | 'textarea';
  children?: React.ReactNode;
  rows?: number;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onKeyDown,
  placeholder,
  required = false,
  disabled = false,
  error,
  className = '',
  maxLength,
  icon,
  helperText,
  as = 'input',
  children,
  rows,
}) => {
  const commonClasses = `w-full px-3 py-2.5 border rounded-lg shadow-sm 
                      text-sm text-admin-text dark:text-admin-dark-text placeholder-admin-text-secondary dark:placeholder-dark-admin-text-secondary
                      transition-colors duration-200 ease-in-out
                      focus:ring-1 focus:outline-none 
                      ${icon ? 'pl-10' : ''} 
                      ${error ? `border-zaina-deep-red-accent dark:border-red-500 focus:ring-zaina-deep-red-accent dark:focus:ring-red-500 focus:border-zaina-deep-red-accent dark:focus:border-red-500`
                            : `border-gray-300 dark:border-gray-600 focus:ring-admin-accent dark:focus:ring-admin-accent focus:border-admin-accent dark:focus:border-admin-accent`}
                      ${disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-admin-light-card dark:bg-admin-dark-card'}`;
  
  const renderInput = () => {
    switch(as) {
      case 'textarea':
        return (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            maxLength={maxLength}
            rows={rows}
            className={commonClasses}
          />
        );
      case 'select':
        return (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
            disabled={disabled}
            required={required}
            className={commonClasses}
          >
            {children}
          </select>
        );
      case 'input':
      default:
        return (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            maxLength={maxLength}
            className={commonClasses}
          />
        );
    }
  };
  
  return (
    <div className={`${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-admin-text dark:text-admin-dark-text mb-1.5">
          {label} {required && <span className="text-zaina-deep-red-accent dark:text-red-400">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        {renderInput()}
      </div>
      {error && <p className="text-xs text-zaina-deep-red-accent dark:text-red-400 mt-1">{error}</p>}
      {helperText && <p className="text-xs text-admin-text-secondary dark:text-dark-admin-text-secondary mt-1">{helperText}</p>}
    </div>
  );
};

export default InputField;
