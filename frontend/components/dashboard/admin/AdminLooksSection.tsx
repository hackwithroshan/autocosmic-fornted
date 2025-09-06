
import React, { useState } from 'react';
import { CuratedLook, MediaFile } from '../../../types';
import InputField from '../../shared/InputField';
import TagInput from '../../shared/TagInput';
import PlusCircleIcon from '../../icons/PlusCircleIcon';
import EditIcon from '../../icons/EditIcon';
import TrashIcon from '../../icons/TrashIcon';
import MediaManagerModal from './MediaManagerModal';

interface AdminLooksSectionProps {
  looks: CuratedLook[];
  onSave: (look: CuratedLook) => void;
  onDelete: (lookId: string) => void;
  mediaLibrary: MediaFile[];
  onUploadMedia: (files: File[]) => void;
}

const AdminLooksSection: React.FC<AdminLooksSectionProps> = ({ looks, onSave, onDelete, mediaLibrary, onUploadMedia }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<CuratedLook | null>(null);
  const [formData, setFormData] = useState<Partial<CuratedLook>>({});
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const resetForm = () => {
    setFormData({});
    setIsFormVisible(false);
    setEditingItem(null);
  };

  const handleEdit = (item: CuratedLook) => {
    setEditingItem(item);
    setFormData(item);
    setIsFormVisible(true);
  };
  
  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({ id: `look_${Date.now()}`, productIds: [] });
    setIsFormVisible(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl || !formData.productIds) {
      alert("Title, Image URL, and Product IDs are required.");
      return;
    }
    onSave(formData as CuratedLook);
    resetForm();
  };
  
  const handleSelectImage = (urls: string[]) => {
      if (urls.length > 0) {
          setFormData(prev => ({ ...prev, imageUrl: urls[0] }));
      }
      setIsMediaModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold font-heading-playfair text-admin-text dark:text-admin-dark-text">Shop by Look</h2>
        {!isFormVisible && (
          <button onClick={handleAddNew} className="bg-admin-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-admin-accent-hover flex items-center">
            <PlusCircleIcon className="w-4 h-4 mr-2" /> Add New Look
          </button>
        )}
      </div>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-admin-light dark:bg-admin-dark rounded-lg shadow-inner space-y-4">
          <h3 className="text-lg font-semibold">{editingItem ? 'Edit Look' : 'Add New Look'}</h3>
          <InputField label="Look Title" name="title" value={formData.title || ''} onChange={e => setFormData(p => ({...p, title: e.target.value}))} required />
          <InputField label="Description" name="description" as="textarea" value={formData.description || ''} onChange={e => setFormData(p => ({...p, description: e.target.value}))} />
           <TagInput label="Product IDs" placeholder="Add product IDs..." tags={formData.productIds || []} setTags={(tags) => setFormData(p => ({...p, productIds: tags}))} />
          <div className="flex items-end gap-3">
             <InputField label="Image URL" name="imageUrl" value={formData.imageUrl || ''} onChange={e => setFormData(p => ({...p, imageUrl: e.target.value}))} required />
             <button type="button" onClick={() => setIsMediaModalOpen(true)} className="bg-gray-200 text-black h-[46px] px-4 rounded-lg">Choose Image</button>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-admin-accent text-white px-4 py-2 rounded-lg">Save</button>
            <button type="button" onClick={resetForm} className="bg-gray-200 px-4 py-2 rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {looks.map(item => (
          <div key={item.id} className="group relative bg-admin-card dark:bg-dark-admin-card rounded-lg shadow-md overflow-hidden">
            <img src={item.imageUrl} alt={item.title} className="h-48 w-full object-cover"/>
            <div className="p-4">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
              <p className="text-xs mt-2 text-gray-400">Products: {item.productIds.join(', ')}</p>
            </div>
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(item)} className="p-2 bg-white/80 rounded-full shadow"><EditIcon className="w-4 h-4"/></button>
              <button onClick={() => onDelete(item.id)} className="p-2 bg-white/80 rounded-full shadow"><TrashIcon className="w-4 h-4 text-red-500"/></button>
            </div>
          </div>
        ))}
      </div>
      <MediaManagerModal isOpen={isMediaModalOpen} onClose={() => setIsMediaModalOpen(false)} mediaLibrary={mediaLibrary} onSelect={handleSelectImage} onUpload={onUploadMedia}/>
    </div>
  );
};

export default AdminLooksSection;
