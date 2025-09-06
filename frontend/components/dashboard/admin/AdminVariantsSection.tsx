

import React, { useState } from 'react';
import InputField from '../../shared/InputField';
import PlusCircleIcon from '../../icons/PlusCircleIcon';
import TrashIcon from '../../icons/TrashIcon';
import { VariantAttribute } from '../../../types';

interface AdminVariantsSectionProps {
    attributes: VariantAttribute[];
    onSaveAttribute: (attribute: Partial<VariantAttribute>) => Promise<boolean>;
    onDeleteAttribute: (attributeId: string) => void;
    onAddValue: (attributeId: string, value: string) => void;
    onDeleteValue: (attributeId: string, value: string) => void;
}


const AdminVariantsSection: React.FC<AdminVariantsSectionProps> = ({ attributes, onSaveAttribute, onDeleteAttribute, onAddValue, onDeleteValue }) => {
    const [newAttrName, setNewAttrName] = useState('');
    const [newAttrValues, setNewAttrValues] = useState('');
    const [valueInputs, setValueInputs] = useState<Record<string, string>>({});

    const handleAddAttribute = (e: React.FormEvent) => {
        e.preventDefault();
        if (newAttrName && newAttrValues) {
            const newAttr: Partial<VariantAttribute> = {
                id: `attr_${Date.now()}`,
                name: newAttrName,
                values: newAttrValues.split(',').map(v => v.trim()).filter(Boolean)
            };
            onSaveAttribute(newAttr);
            setNewAttrName('');
            setNewAttrValues('');
        } else {
            alert("Attribute name and comma-separated values are required.");
        }
    };
    
    const handleAddValue = (attributeId: string) => {
        const valueToAdd = valueInputs[attributeId]?.trim();
        if (valueToAdd) {
            onAddValue(attributeId, valueToAdd);
            setValueInputs(prev => ({...prev, [attributeId]: ''}));
        }
    };
    
    const handleDeleteAttribute = (attributeId: string) => {
        if(window.confirm("Are you sure you want to delete this entire attribute? This will remove it from all product variant configurations.")) {
            onDeleteAttribute(attributeId);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, attrId: string) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddValue(attrId);
        }
    };

  return (
    <div className="bg-admin-light-card dark:bg-admin-dark-card p-6 md:p-8 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-admin-light-text dark:text-admin-dark-text">Product Variant Attributes</h1>
      <p className="mt-2 text-admin-light-text-secondary dark:text-admin-dark-text-secondary mb-6">
        Manage global attributes like Size, Color, etc. These will be available when creating products.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
                <h3 className="font-semibold text-lg">Existing Attributes</h3>
                {attributes.map(attr => (
                    <div key={attr.id} className="p-4 border dark:border-gray-700 rounded-lg bg-admin-light dark:bg-admin-dark">
                        <div className="flex justify-between items-center mb-3">
                            <p className="font-semibold capitalize">{attr.name}</p>
                            <button onClick={() => handleDeleteAttribute(attr.id)} className="text-red-500 hover:text-red-700" title={`Delete ${attr.name} attribute`}>
                                <TrashIcon className="w-4 h-4"/>
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {attr.values.map(val => (
                                <div key={val} className="flex items-center gap-1 text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                                    <span>{val}</span>
                                    <button onClick={() => onDeleteValue(attr.id, val)} className="text-gray-500 hover:text-black dark:hover:text-white" title={`Remove ${val}`}>
                                        <TrashIcon className="w-3 h-3"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                         <div className="mt-4 flex gap-2">
                            <InputField 
                                label=""
                                name={`new_value_${attr.id}`}
                                value={valueInputs[attr.id] || ''}
                                onChange={(e) => setValueInputs(prev => ({...prev, [attr.id]: e.target.value}))}
                                onKeyDown={(e) => handleKeyDown(e, attr.id)}
                                placeholder="Add new value"
                                className="flex-grow"
                            />
                            <button onClick={() => handleAddValue(attr.id)} className="bg-admin-accent text-white font-semibold px-4 rounded-lg text-sm">Add</button>
                        </div>
                    </div>
                ))}
                 {attributes.length === 0 && <p className="text-gray-500">No attributes defined.</p>}
            </div>
             <div>
                <h3 className="font-semibold text-lg mb-2">Add New Attribute</h3>
                <form onSubmit={handleAddAttribute} className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg sticky top-24">
                     <InputField label="Attribute Name" name="newAttrName" value={newAttrName} onChange={e => setNewAttrName(e.target.value)} placeholder="e.g., Material" />
                     <div>
                        <label className="block text-sm font-medium mb-1">Initial Values</label>
                        <textarea value={newAttrValues} onChange={e => setNewAttrValues(e.target.value)} rows={3} placeholder="Enter values, separated by commas (e.g., Silk, Cotton, Velvet)" className="w-full text-sm p-2 border rounded-md bg-white dark:bg-admin-dark-card" />
                     </div>
                     <button type="submit" className="w-full bg-admin-accent text-white font-semibold py-2 rounded-lg hover:bg-admin-accent-hover flex items-center justify-center">
                        <PlusCircleIcon className="w-5 h-5 mr-2"/> Add Attribute
                     </button>
                </form>
            </div>
      </div>
    </div>
  );
};

export default AdminVariantsSection;