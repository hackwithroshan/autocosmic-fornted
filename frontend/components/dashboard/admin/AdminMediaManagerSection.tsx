

import React, { useState, useCallback } from 'react';
import { MediaFile } from '../../../types';
import InputField from '../../shared/InputField';
import UploadCloudIcon from '../../icons/UploadCloudIcon';
import LinkIcon from '../../icons/LinkIcon';
import TrashIcon from '../../icons/TrashIcon';

interface AdminMediaManagerSectionProps {
  media: MediaFile[];
  onUpload: (files: File[]) => void;
  onDelete: (fileId: string) => void;
}

const AdminMediaManagerSection: React.FC<AdminMediaManagerSectionProps> = ({ media, onUpload, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const filteredMedia = media.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleFiles = useCallback((newFiles: File[]) => {
    setError(null);
    let validFiles: File[] = [];
    for (const file of newFiles) {
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        setError(`Unsupported file type: ${file.name}`);
        continue;
      }
      validFiles.push(file);
    }
    setFilesToUpload(prev => [...prev, ...validFiles]);
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  }, []);
  
  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, [handleFiles]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleUploadClick = () => {
      if(filesToUpload.length > 0) {
          onUpload(filesToUpload);
          setFilesToUpload([]);
          setPreviews([]);
      }
  };

  const handleCopyUrl = (url: string) => {
    // If it's a local path, construct the full URL. Blob and data URLs are already full.
    const fullUrl = (url.startsWith('data:') || url.startsWith('blob:')) ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    alert(`URL copied to clipboard.`);
  };

  const handleDelete = (fileId: string, fileName: string) => {
      if (window.confirm(`Are you sure you want to delete ${fileName}? This action cannot be undone.`)) {
          onDelete(fileId);
      }
  }

  return (
    <div className="bg-admin-light-card dark:bg-admin-dark-card p-6 rounded-2xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-admin-light-text dark:text-admin-dark-text">Media Manager</h1>
          <p className="mt-1 text-admin-light-text-secondary dark:text-admin-dark-text-secondary">
            Manage all your uploaded images and videos.
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="mb-8 p-4 border rounded-lg bg-admin-light dark:bg-admin-dark">
        <div 
          className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-center cursor-pointer hover:border-admin-accent transition-colors"
          onDragOver={e => e.preventDefault()}
          onDrop={handleFileDrop}
        >
          <UploadCloudIcon className="w-12 h-12 mx-auto text-gray-400" />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <label htmlFor="media-upload" className="font-medium text-admin-accent hover:underline cursor-pointer">
              Click to upload
            </label>
            {' '}or drag and drop
          </p>
          <input id="media-upload" name="media-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" multiple />
          <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP</p>
        </div>
        
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

        {previews.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Ready to upload:</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {previews.map((src, index) => (
                <div key={index} className="relative group aspect-square">
                  <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-lg" />
                </div>
              ))}
            </div>
            <button onClick={handleUploadClick} className="mt-4 bg-admin-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-admin-accent-hover w-full sm:w-auto">
              Upload {filesToUpload.length} file(s)
            </button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <InputField 
          label=""
          name="mediaSearch"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search media by name..."
        />
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredMedia.map(item => (
          <div key={item.id} className="group relative aspect-square border dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
            <img src={item.url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 text-white">
              <p className="text-xs font-semibold line-clamp-2">{item.name}</p>
              <div className="text-center">
                <p className="text-[10px] opacity-80">{(item.size / 1024).toFixed(1)} KB</p>
                <p className="text-[10px] opacity-80">{new Date(item.createdAt).toLocaleDateString()}</p>
                <div className="flex justify-center items-center gap-2 mt-1">
                  <button onClick={() => handleCopyUrl(item.url)} className="p-1.5 bg-white/20 rounded-full hover:bg-white/40" title="Copy URL">
                    <LinkIcon className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(item.id, item.name)} className="p-1.5 bg-red-500/50 rounded-full hover:bg-red-500/80" title="Delete">
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredMedia.length === 0 && (
        <p className="text-center py-10 text-gray-500">No media found matching your search.</p>
      )}
    </div>
  );
};

export default AdminMediaManagerSection;