
import React, { useState } from 'react';
import { EmotionCategory, MediaFile } from '../../../types';
import InputField from '../../shared/InputField';
import PlusCircleIcon from '../../icons/PlusCircleIcon';
import EditIcon from '../../icons/EditIcon';
import TrashIcon from '../../icons/TrashIcon';
import MediaManagerModal from './MediaManagerModal';

interface AdminEmotionsSectionProps {
  emotions: EmotionCategory[];
  onSave: (emotion: EmotionCategory) => void;
  onDelete: (emotionId: string) => void;
  mediaLibrary: MediaFile[];
  onUploadMedia: (files: File[]) => void;
}

const AdminEmotionsSection: React.FC<AdminEmotionsSectionProps> = ({ emotions, onSave, onDelete, mediaLibrary, onUploadMedia }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<EmotionCategory | null>(null);
  const [formData, setFormData] = useState<Partial<EmotionCategory>>({});
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const resetForm = () => {
    setFormData({});
    setIsFormVisible(false);
    setEditingItem(null);
  };

  const handleEdit = (item: EmotionCategory) => {
    setEditingItem(item);
    setFormData(item);
    setIsFormVisible(true);
  };
  
  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({ id: `emotion_${Date.now()}` });
    setIsFormVisible(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.emotionTag || !formData.imageUrl) {
      alert("Name, Emotion Tag, and Image URL are required.");
      return;
    }
    onSave(formData as EmotionCategory);
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
        <h2 className="text-xl font-semibold font-heading-playfair text-admin-text dark:text-admin-dark-text">Shop by Emotion</h2>
        {!isFormVisible && (
          <button onClick={handleAddNew} className="bg-admin-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-admin-accent-hover flex items-center">
            <PlusCircleIcon className="w-4 h-4 mr-2" /> Add New Emotion
          </button>
        )}
      </div>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-admin-light dark:bg-admin-dark rounded-lg shadow-inner space-y-4">
          <h3 className="text-lg font-semibold">{editingItem ? 'Edit Emotion' : 'Add New Emotion'}</h3>
          <InputField label="Emotion Name" name="name" value={formData.name || ''} onChange={e => setFormData(p => ({...p, name: e.target.value}))} required />
          <InputField label="Emotion Tag (for filtering)" name="emotionTag" value={formData.emotionTag || ''} onChange={e => setFormData(p => ({...p, emotionTag: e.target.value}))} required />
          <InputField label="Description" name="description" as="textarea" value={formData.description || ''} onChange={e => setFormData(p => ({...p, description: e.target.value}))} />
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {emotions.map(item => (
          <div key={item.id} className="group relative bg-admin-card dark:bg-dark-admin-card rounded-lg shadow-md overflow-hidden">
            <img src={item.imageUrl} alt={item.name} className="h-40 w-full object-cover"/>
            <div className="p-3">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-xs text-gray-500">Tag: {item.emotionTag}</p>
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

export default AdminEmotionsSection;
