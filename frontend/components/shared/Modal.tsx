
import React, { useEffect } from 'react';
import CloseIcon from '../icons/CloseIcon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscapeKey);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div 
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className={`modal-content ${sizeClasses[size]} relative w-full bg-zaina-white dark:bg-dark-zaina-bg-card text-zaina-text-primary dark:text-dark-zaina-text-primary`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-4 border-b border-zaina-neutral-medium dark:border-dark-zaina-neutral-medium rounded-t">
          {title && (
            <h3 id="modal-title" className="text-xl font-semibold font-heading-playfair">
              {title}
            </h3>
          )}
          <button
            type="button"
            className="text-zaina-slate-gray bg-transparent hover:bg-zaina-neutral-medium dark:hover:bg-dark-zaina-neutral-medium hover:text-zaina-text-primary dark:hover:text-dark-zaina-text-primary rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            onClick={onClose}
            aria-label="Close modal"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 md:p-5 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
