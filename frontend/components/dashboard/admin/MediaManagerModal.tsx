import React, { useState, useEffect, useCallback } from 'react';
import { MediaFile } from '../../../types';
import Modal from '../../shared/Modal';
import CheckCircleIcon from '../../icons/CheckCircleIcon';
import UploadCloudIcon from '../../icons/UploadCloudIcon';
import VideoIcon from '../../icons/VideoIcon';

interface MediaManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaLibrary: MediaFile[];
  onSelect: (urls: string[]) => void;
  onUpload: (files: File[]) => void;
  filter?: 'image' | 'video';
  allowMultiple?: boolean;
}

const MediaManagerModal: React.FC<MediaManagerModalProps> = ({
  isOpen,
  onClose,
  mediaLibrary,
  onSelect,
  onUpload,
  filter,
  allowMultiple = false,
}) => {
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const filteredLibrary = filter ? mediaLibrary.filter(m => m.type === filter) : mediaLibrary;
  const acceptTypes = filter === 'video' ? 'video/*' : filter === 'image' ? 'image/*' : 'image/*,video/*';

  const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    setError(null);
    const validFiles = Array.from(newFiles).filter(file => {
      const fileType = file.type.split('/')[0];
      if (filter && fileType !== filter) {
        setError(`Please upload only ${filter} files.`);
        return false;
      }
      if (!['image', 'video'].includes(fileType)) {
        setError(`Unsupported file type: ${file.name}`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onUpload(validFiles);
    }
  }, [onUpload, filter]);
  
  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (e.target) {
        e.target.value = '';
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedUrls(new Set());
      setError(null);
    }
  }, [isOpen]);

  const toggleSelection = (url: string) => {
    setSelectedUrls(prev => {
      const newSet = new Set(prev);
      if (allowMultiple) {
        if (newSet.has(url)) {
          newSet.delete(url);
        } else {
          newSet.add(url);
        }
      } else {
        // Single selection mode
        newSet.clear();
        newSet.add(url);
      }
      return newSet;
    });
  };

  const handleConfirm = () => {
    onSelect(Array.from(selectedUrls));
    setSelectedUrls(new Set());
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose from Media Manager" size="xl">
      <div className="max-h-[70vh] flex flex-col">
        
        <div className="mb-4 p-4 border rounded-lg bg-admin-light dark:bg-admin-dark/50 flex-shrink-0">
          <div 
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-center cursor-pointer hover:border-admin-accent transition-colors"
            onDragOver={e => e.preventDefault()}
            onDrop={handleFileDrop}
          >
            <UploadCloudIcon className="w-10 h-10 mx-auto text-gray-400" />
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              <label htmlFor="modal-media-upload" className="font-medium text-admin-accent hover:underline cursor-pointer">
                Upload new files
              </label>
              {' '}or drag and drop
            </p>
            <input id="modal-media-upload" name="modal-media-upload" type="file" className="sr-only" onChange={handleFileChange} accept={acceptTypes} multiple />
            <p className="text-xs text-gray-500 capitalize">{filter || 'Images & Videos'}</p>
          </div>
          {error && <p className="text-xs text-red-500 mt-2 text-center">{error}</p>}
        </div>

        <div className="flex-grow overflow-y-auto pr-2">
            {filteredLibrary.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {filteredLibrary.map(item => {
                        const isSelected = selectedUrls.has(item.url);
                        return (
                            <div
                            key={item.id}
                            onClick={() => toggleSelection(item.url)}
                            className={`relative group aspect-square border-2 rounded-lg overflow-hidden cursor-pointer transition-all bg-gray-200 dark:bg-gray-800
                                        ${isSelected ? 'border-admin-accent ring-2 ring-admin-accent' : 'border-gray-300 dark:border-gray-600 hover:border-admin-accent/50'}`}
                            >
                            {item.type === 'image' ? (
                                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <VideoIcon className="w-12 h-12 text-gray-500"/>
                                </div>
                            )}
                            {isSelected && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <CheckCircleIcon className="w-8 h-8 text-white" />
                                </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                                {item.name}
                            </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-center py-10 text-gray-500">Your Media Manager is empty. Upload some files to get started.</p>
            )}
        </div>
        <div className="flex-shrink-0 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button onClick={onClose} className="bg-gray-200 dark:bg-gray-600 text-admin-text dark:text-admin-dark-text font-semibold py-2 px-4 rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedUrls.size === 0}
            className="bg-admin-accent text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add {selectedUrls.size > 0 ? selectedUrls.size : ''} item(s)
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MediaManagerModal;