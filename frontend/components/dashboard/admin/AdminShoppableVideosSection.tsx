
import React, { useState } from 'react';
import { ShoppableVideo, Product, MediaFile } from '../../../types';
import InputField from '../../shared/InputField';
import PlusCircleIcon from '../../icons/PlusCircleIcon';
import EditIcon from '../../icons/EditIcon';
import TrashIcon from '../../icons/TrashIcon';
import MediaManagerModal from './MediaManagerModal';

interface AdminShoppableVideosSectionProps {
  initialVideos: ShoppableVideo[];
  onSave: (video: ShoppableVideo) => void;
  onDelete: (videoId: string) => void;
  allProducts: Product[];
  mediaLibrary: MediaFile[];
  onUploadMedia: (files: File[]) => void;
}

const primaryButtonSmClasses = "bg-admin-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-admin-accent-hover transition-colors";
const secondaryButtonSmClasses = "bg-gray-200 dark:bg-gray-600 text-admin-text dark:text-admin-dark-text font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors";
const thCellClasses = "px-4 py-3 text-left text-xs font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary uppercase tracking-wider";
const tdCellClasses = "px-4 py-3 whitespace-nowrap text-sm text-admin-text dark:text-admin-dark-text";

const AdminShoppableVideosSection: React.FC<AdminShoppableVideosSectionProps> = ({ initialVideos, onSave, onDelete, allProducts, mediaLibrary, onUploadMedia }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppableVideo | null>(null);
  const [formData, setFormData] = useState<Partial<ShoppableVideo>>({});

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaModalTarget, setMediaModalTarget] = useState<'videoUrl' | 'thumbnailUrl' | null>(null);

  const resetForm = () => {
    setFormData({});
    setIsFormVisible(false);
    setEditingItem(null);
  };

  const handleEdit = (item: ShoppableVideo) => {
    setEditingItem(item);
    setFormData(item);
    setIsFormVisible(true);
  };
  
  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({ id: `svid_${Date.now()}`, featuredProductIds: [] });
    setIsFormVisible(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.videoUrl || !formData.thumbnailUrl) {
      alert("Title, Video URL, and Thumbnail URL are required.");
      return;
    }
    onSave(formData as ShoppableVideo);
    resetForm();
  };
  
  const handleOpenMediaModal = (target: 'videoUrl' | 'thumbnailUrl') => {
    setMediaModalTarget(target);
    setIsMediaModalOpen(true);
  };

  const handleSelectFromMedia = (urls: string[]) => {
      if (urls.length > 0 && mediaModalTarget) {
          setFormData(prev => ({ ...prev, [mediaModalTarget]: urls[0] }));
      }
      setIsMediaModalOpen(false);
      setMediaModalTarget(null);
  };

  const handleProductSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({...prev, featuredProductIds: selectedIds}));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold font-heading-playfair text-admin-text dark:text-admin-dark-text">Shoppable Videos (#ZainaGram)</h2>
        {!isFormVisible && (
          <button onClick={handleAddNew} className={`${primaryButtonSmClasses} flex items-center`}>
            <PlusCircleIcon className="w-4 h-4 mr-2" /> Add New Video
          </button>
        )}
      </div>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-admin-light dark:bg-admin-dark rounded-lg shadow-inner space-y-4">
          <h3 className="text-lg font-semibold">{editingItem ? 'Edit Shoppable Video' : 'Add New Shoppable Video'}</h3>
          <InputField label="Video Title" name="title" value={formData.title || ''} onChange={e => setFormData(p => ({...p, title: e.target.value}))} required />
          <InputField label="Tag (Optional)" name="tag" value={formData.tag || ''} onChange={e => setFormData(p => ({...p, tag: e.target.value}))} placeholder="e.g., #WeddingGuest" />
          <div className="flex items-end gap-3">
             <InputField label="Video URL" name="videoUrl" value={formData.videoUrl || ''} onChange={e => setFormData(p => ({...p, videoUrl: e.target.value}))} required />
             <button type="button" onClick={() => handleOpenMediaModal('videoUrl')} className={`${secondaryButtonSmClasses} h-[46px] whitespace-nowrap`}>Choose Video</button>
          </div>
           <div className="flex items-end gap-3">
             <InputField label="Thumbnail Image URL" name="thumbnailUrl" value={formData.thumbnailUrl || ''} onChange={e => setFormData(p => ({...p, thumbnailUrl: e.target.value}))} required />
             <button type="button" onClick={() => handleOpenMediaModal('thumbnailUrl')} className={`${secondaryButtonSmClasses} h-[46px] whitespace-nowrap`}>Choose Thumbnail</button>
          </div>
          <div>
            <label htmlFor="featuredProducts" className="block text-sm font-medium text-admin-text dark:text-admin-dark-text mb-1.5">Featured Products</label>
            <select
                id="featuredProducts"
                multiple
                value={formData.featuredProductIds || []}
                onChange={handleProductSelectionChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-admin-light-card dark:bg-admin-dark-card h-40"
            >
                {allProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple products.</p>
          </div>
          <div className="flex gap-3">
            <button type="submit" className={primaryButtonSmClasses}>
              {editingItem ? 'Update Video' : 'Save Video'}
            </button>
            <button type="button" onClick={resetForm} className={secondaryButtonSmClasses}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto bg-admin-light-card dark:bg-admin-dark-card p-4 rounded-xl">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className={thCellClasses}>Thumbnail</th>
              <th className={thCellClasses}>Title</th>
              <th className={thCellClasses}>Tag</th>
              <th className={thCellClasses}>Featured Products</th>
              <th className={thCellClasses}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {initialVideos.map(video => (
              <tr key={video.id} className="hover:bg-admin-light dark:hover:bg-admin-dark-card-hover">
                <td className={tdCellClasses}>
                    <img src={video.thumbnailUrl} alt={video.title} className="w-16 h-24 object-cover rounded-md"/>
                </td>
                <td className={`${tdCellClasses} font-medium`}>{video.title}</td>
                <td className={tdCellClasses}>{video.tag || 'N/A'}</td>
                <td className={tdCellClasses}>{video.featuredProductIds.length}</td>
                <td className={`${tdCellClasses} space-x-1`}>
                  <button onClick={() => handleEdit(video)} className="text-admin-accent hover:opacity-80 p-1" title="Edit"><EditIcon className="w-4 h-4"/></button>
                  <button onClick={() => onDelete(video.id)} className="text-red-500 hover:opacity-80 p-1" title="Delete"><TrashIcon className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {initialVideos.length === 0 && !isFormVisible && (
         <p className="text-center py-8 text-admin-text-secondary dark:text-dark-admin-text-secondary">No shoppable videos found.</p>
      )}
      <MediaManagerModal 
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        mediaLibrary={mediaLibrary}
        onSelect={handleSelectFromMedia}
        onUpload={onUploadMedia}
        filter={mediaModalTarget === 'videoUrl' ? 'video' : 'image'}
      />
    </div>
  );
};

export default AdminShoppableVideosSection;
