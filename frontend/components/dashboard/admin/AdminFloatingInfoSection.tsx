

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FloatingInfo } from '../../../types';
import InputField from '../../shared/InputField';
import PlusCircleIcon from '../../icons/PlusCircleIcon';
import EditIcon from '../../icons/EditIcon';
import TrashIcon from '../../icons/TrashIcon';
import { API_BASE_URL } from '../../../constants';

interface AdminFloatingInfoSectionProps {
  items: FloatingInfo[];
  onSave: (item: FloatingInfo) => void;
  onDelete: (itemId: string) => void;
}

const AdminFloatingInfoSection: React.FC<AdminFloatingInfoSectionProps> = ({ items, onSave, onDelete }) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<FloatingInfo | null>(null);
    const [formData, setFormData] = useState<Partial<FloatingInfo>>({});

    const resetForm = () => {
        setFormData({});
        setEditingItem(null);
        setIsFormVisible(false);
    };

    const handleEdit = (item: FloatingInfo) => {
        setEditingItem(item);
        setFormData(item);
        setIsFormVisible(true);
    };
    
    const handleAddNew = () => {
        setEditingItem(null);
        setFormData({ id: `float_${Date.now()}`, corner: 'bottomLeft' });
        setIsFormVisible(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.text || !formData.corner) {
            alert('Text and Corner are required.');
            return;
        }
        onSave(formData as FloatingInfo);
        resetForm();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this info bubble?")) {
            onDelete(id);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Floating Info Bubbles</h2>
                {!isFormVisible && (
                    <button onClick={handleAddNew} className="bg-admin-accent text-white py-2 px-4 rounded-lg flex items-center">
                        <PlusCircleIcon className="w-4 h-4 mr-2"/> Add New
                    </button>
                )}
            </div>

            {isFormVisible && (
                <form onSubmit={handleSubmit} className="mb-8 p-6 bg-admin-light rounded-lg space-y-4">
                    <h3 className="text-lg font-semibold">{editingItem ? 'Edit Info Bubble' : 'Add New Info Bubble'}</h3>
                    <InputField label="Text" name="text" value={formData.text || ''} onChange={e => setFormData(p => ({...p, text: e.target.value}))} required />
                    <InputField label="Trigger Section ID" name="triggerSectionId" value={formData.triggerSectionId || ''} onChange={e => setFormData(p => ({...p, triggerSectionId: e.target.value}))} helperText="e.g., new-arrivals. Leave empty to show always." />
                    <div>
                        <label className="block text-sm font-medium mb-1">Corner Position</label>
                        <select name="corner" value={formData.corner || 'bottomLeft'} onChange={e => setFormData(p => ({...p, corner: e.target.value as any}))} className="w-full p-2 border rounded-md">
                            <option value="bottomLeft">Bottom Left</option>
                            <option value="bottomRight">Bottom Right</option>
                            <option value="topLeft">Top Left</option>
                            <option value="topRight">Top Right</option>
                        </select>
                    </div>
                     <div className="flex gap-3">
                        <button type="submit" className="bg-admin-accent text-white px-4 py-2 rounded-lg">Save</button>
                        <button type="button" onClick={resetForm} className="bg-gray-200 px-4 py-2 rounded-lg">Cancel</button>
                    </div>
                </form>
            )}

            <div className="space-y-3">
                {items.map(item => (
                    <div key={item.id} className="p-3 border rounded-lg flex justify-between items-center bg-white">
                        <div>
                            <p className="font-medium">{item.text}</p>
                            <p className="text-xs text-gray-500">Corner: {item.corner} | Trigger: {item.triggerSectionId || 'Always on'}</p>
                        </div>
                        <div className="space-x-2">
                            <button onClick={() => handleEdit(item)}><EditIcon className="w-4 h-4"/></button>
                            <button onClick={() => handleDelete(item.id)}><TrashIcon className="w-4 h-4 text-red-500"/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminFloatingInfoSection;