
import React, { useState, useCallback } from 'react';
import UploadCloudIcon from '../../icons/UploadCloudIcon';
import CloseIcon from '../../icons/CloseIcon';

interface ImageUploaderProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMb?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFilesChange, maxFiles = 5, maxSizeMb = 20 }) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validateAndSetFiles = (newFiles: File[]) => {
    setError(null);
    let validFiles: File[] = [];
    for (const file of newFiles) {
      if (files.length + validFiles.length >= maxFiles) {
        setError(`Cannot upload more than ${maxFiles} images.`);
        break;
      }
      if (file.size > maxSizeMb * 1024 * 1024) {
        setError(`File ${file.name} is too large (max ${maxSizeMb}MB).`);
        continue;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError(`File type for ${file.name} is not supported.`);
        continue;
      }
      validFiles.push(file);
    }

    const updatedFiles = [...files, ...validFiles];
    setFiles(updatedFiles);
    
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    
    onFilesChange(updatedFiles);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) {
      validateAndSetFiles(Array.from(e.dataTransfer.files));
    }
  }, [files, maxFiles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      validateAndSetFiles(Array.from(e.target.files));
    }
  };

  const removeImage = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
    onFilesChange(newFiles);
  };

  return (
    <div>
        <div 
            className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-center cursor-pointer hover:border-admin-accent transition-colors"
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
        >
            <UploadCloudIcon className="w-10 h-10 mx-auto text-gray-400" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <label htmlFor="image-upload" className="font-medium text-admin-accent hover:underline cursor-pointer">
                Click to upload
            </label>
            {' '}or drag and drop
            </p>
            <input id="image-upload" name="image-upload" type="file" className="sr-only" onChange={handleChange} accept=".jpg,.jpeg,.png,.webp" multiple />
            <p className="text-xs text-gray-500">JPG, PNG, WEBP up to {maxSizeMb}MB each. Max {maxFiles} images.</p>
        </div>

        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        
        {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {previews.map((src, index) => (
                    <div key={index} className="relative group aspect-square">
                        <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-lg shadow-md" />
                        <button 
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove image"
                        >
                            <CloseIcon className="w-4 h-4"/>
                        </button>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};

export default ImageUploader;
