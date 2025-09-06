import React, { useState, useEffect, useCallback } from 'react';
import { MediaFile } from '../../../types';
import UploadCloudIcon from '../../icons/UploadCloudIcon';
import TrashIcon from '../../icons/TrashIcon';
import StarIcon from '../../icons/StarIcon';
import MediaManagerModal from './MediaManagerModal';

interface ProductImageManagerProps {
  initialImageUrls: string[];
  onImageChange: (urls: string[]) => void;
  onUploadMedia: (files: File[]) => void;
  mediaLibrary: MediaFile[];
}

const ProductImageManager: React.FC<ProductImageManagerProps> = ({
  initialImageUrls,
  onImageChange,
  onUploadMedia,
  mediaLibrary,
}) => {
  const [imageUrls, setImageUrls] = useState<string[]>(initialImageUrls);
  const [error, setError] = useState<string | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  useEffect(() => {
    setImageUrls(initialImageUrls);
  }, [initialImageUrls]);

  const handleFiles = (newFiles: File[]) => {
    setError(null);
    if (imageUrls.length + newFiles.length > 8) {
      setError("You can upload a maximum of 8 images per product.");
      return;
    }

    onUploadMedia(newFiles);

    const newUrlPromises = Array.from(newFiles).map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newUrlPromises).then(newUrls => {
      const updatedUrls = [...imageUrls, ...newUrls];
      setImageUrls(updatedUrls);
      onImageChange(updatedUrls);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
      e.target.value = ''; // Reset file input
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeImage = (indexToRemove: number) => {
    const updatedUrls = imageUrls.filter((_, index) => index !== indexToRemove);
    setImageUrls(updatedUrls);
    onImageChange(updatedUrls);
  };

  const handleSelectFromMedia = (selectedUrls: string[]) => {
    const combinedUrls = [...imageUrls, ...selectedUrls];
    const uniqueUrls = Array.from(new Set(combinedUrls));
    
    if (uniqueUrls.length > 8) {
        setError(`Cannot add more than 8 images in total. Only ${8 - imageUrls.length} more can be selected.`);
        const spaceLeft = 8 - imageUrls.length;
        if (spaceLeft > 0) {
            const urlsToAdd = selectedUrls.slice(0, spaceLeft);
            const finalUrls = [...imageUrls, ...urlsToAdd];
            setImageUrls(finalUrls);
            onImageChange(finalUrls);
        }
    } else {
        setImageUrls(uniqueUrls);
        onImageChange(uniqueUrls);
    }
    setIsMediaModalOpen(false);
  };


  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
        {imageUrls.map((url, index) => (
          <div key={url.slice(-20) + index} className="relative group aspect-square border-2 rounded-lg overflow-hidden transition-all border-transparent">
            <img src={url} alt={`Product image ${index + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
              <button
                type="button"
                onClick={() => removeImage(index)}
                title="Remove image"
                className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full"
              >
                <TrashIcon className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
       <div 
          className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-center cursor-pointer hover:border-admin-accent transition-colors"
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
      >
        <UploadCloudIcon className="w-10 h-10 mx-auto text-gray-400" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          <label htmlFor="product-image-upload" className="font-medium text-admin-accent hover:underline cursor-pointer">
              Upload new images
          </label>
          {' '}or drag and drop
        </p>
        <input id="product-image-upload" name="product-image-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" multiple />
        <p className="text-xs text-gray-500">You can add up to {8 - imageUrls.length} more images.</p>
      </div>
      
      <div className="text-center my-4">
        <span className="text-xs text-gray-400">OR</span>
      </div>

      <button
        type="button"
        onClick={() => setIsMediaModalOpen(true)}
        className="w-full text-center py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors font-semibold"
      >
        Choose from Media Manager
      </button>

       {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

       <MediaManagerModal
         isOpen={isMediaModalOpen}
         onClose={() => setIsMediaModalOpen(false)}
         mediaLibrary={mediaLibrary}
         onSelect={handleSelectFromMedia}
         onUpload={onUploadMedia}
       />
    </div>
  );
};

export default ProductImageManager;