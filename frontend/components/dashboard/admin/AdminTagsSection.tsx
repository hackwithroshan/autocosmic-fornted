


import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { Product } from '../../../types';
import InputField from '../../shared/InputField';
import PlusCircleIcon from '../../icons/PlusCircleIcon';
import TrashIcon from '../../icons/TrashIcon';
import { API_BASE_URL } from '../../../constants';

interface TagData {
    name: string;
    count: number;
}

interface AdminTagsSectionProps {
    products: Product[];
}

const AdminTagsSection: React.FC<AdminTagsSectionProps> = ({ products: initialProducts }) => {
  const [tags, setTags] = useState<TagData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTag, setNewTag] = useState('');

  const fetchTags = async () => {
    setIsLoading(true);
    try {
        const token = localStorage.getItem('zaina-authToken');
        const response = await axios.get(`${API_BASE_URL}/admin/tags`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setTags(response.data);
    } catch (err) {
        console.error("Failed to fetch tags", err);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [initialProducts]);


  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag && !tags.some(t => t.name.toLowerCase() === newTag.toLowerCase())) {
        // This is a local update. For persistence, an API call is needed.
        setTags([...tags, { name: newTag, count: 0 }]);
        setNewTag('');
        alert(`Tag "${newTag}" added locally. Assign it to a product to save it permanently.`);
    } else {
        alert("Tag already exists or is empty.");
    }
  };
  
  const handleDeleteTag = async (tagName: string) => {
      if(window.confirm(`Are you sure you want to delete the tag "${tagName}"? This will remove it from all products.`)) {
          try {
              const token = localStorage.getItem('zaina-authToken');
              await axios.delete(`${API_BASE_URL}/admin/tags/${encodeURIComponent(tagName)}`, {
                  headers: { Authorization: `Bearer ${token}` }
              });
              alert(`Tag "${tagName}" deleted successfully.`);
              fetchTags(); // Refresh the list
          } catch (error) {
              alert(`Failed to delete tag "${tagName}".`);
          }
      }
  };

  if (isLoading) {
    return (
        <div className="bg-admin-light-card dark:bg-admin-dark-card p-6 md:p-8 rounded-2xl shadow-lg">
             <h1 className="text-2xl font-bold text-admin-light-text dark:text-admin-dark-text mb-2">Tags & Collections</h1>
             <p className="text-center py-8">Loading tags...</p>
        </div>
    );
  }

  return (
    <div className="bg-admin-light-card dark:bg-admin-dark-card p-6 md:p-8 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-admin-light-text dark:text-admin-dark-text mb-2">Tags & Collections</h1>
      <p className="mt-2 text-admin-light-text-secondary dark:text-admin-dark-text-secondary mb-6">
        Manage product tags used for filtering and organization.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
            <h3 className="font-semibold mb-2">Existing Tags</h3>
            <div className="overflow-x-auto border rounded-lg">
                 <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tag Name</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product Count</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-admin-dark-card divide-y divide-gray-200 dark:divide-gray-700">
                       {tags.map(tag => (
                           <tr key={tag.name}>
                               <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">{tag.name}</td>
                               <td className="px-4 py-2 whitespace-nowrap text-sm">{tag.count}</td>
                               <td className="px-4 py-2 whitespace-nowrap text-sm">
                                   <button onClick={() => handleDeleteTag(tag.name)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-4 h-4" /></button>
                               </td>
                           </tr>
                       ))}
                    </tbody>
                 </table>
            </div>
        </div>
        <div>
            <h3 className="font-semibold mb-2">Add New Tag</h3>
            <form onSubmit={handleAddTag} className="space-y-3">
                 <InputField label="" name="newTag" value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="e.g., #SummerVibes" />
                 <button type="submit" className="w-full bg-admin-accent text-white font-semibold py-2 rounded-lg hover:bg-admin-accent-hover flex items-center justify-center">
                    <PlusCircleIcon className="w-5 h-5 mr-2"/> Add Tag
                 </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AdminTagsSection;