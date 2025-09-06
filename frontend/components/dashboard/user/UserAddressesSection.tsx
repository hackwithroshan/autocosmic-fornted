

import React, { useState } from 'react';
import { Address, ZainaColor } from '../../../types';
import InputField from '../../shared/InputField';
import MapPinIcon from '../../icons/MapPinIcon';
import EditIcon from '../../icons/EditIcon';
import TrashIcon from '../../icons/TrashIcon';

interface UserAddressesSectionProps {
  addresses: Address[];
  onSave: (address: Address) => void;
  onDelete: (addressId: string) => void;
  userId: string;
}

const UserAddressesSection: React.FC<UserAddressesSectionProps> = ({ addresses, onSave, onDelete, userId }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Partial<Address>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData({});
    setIsAdding(false);
    setEditingAddress(null);
  };

  const handleSaveAddress = () => {
    if (!formData.fullName || !formData.addressLine1 || !formData.city || !formData.postalCode || !formData.country) {
        alert("Please fill all required fields.");
        return;
    }
    const newAddress: Address = {
        id: editingAddress ? editingAddress.id : `addr${Date.now()}`,
        userId: userId,
        type: formData.type || 'shipping',
        ...formData,
    } as Address;

    onSave(newAddress);
    resetForm();
  };
  
  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData(address);
    setIsAdding(true); // Re-use the form for editing
  };

  const handleDelete = (addressId: string) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
        onDelete(addressId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold font-heading-playfair text-zaina-deep-navy">My Addresses</h2>
        {!isAdding && (
          <button
            onClick={() => { setIsAdding(true); setEditingAddress(null); setFormData({country: 'India', type: 'shipping'}); }}
            className="bg-zaina-primary text-zaina-white font-medium py-2 px-4 rounded-md hover:bg-zaina-secondary-blue text-sm transition-colors"
          >
            Add New Address
          </button>
        )}
      </div>

      {isAdding && (
        <div className="mb-8 p-6 bg-zaina-sky-blue-light/50 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-zaina-deep-navy mb-4">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Full Name" name="fullName" value={formData.fullName || ''} onChange={handleInputChange} required />
            <InputField label="Address Line 1" name="addressLine1" value={formData.addressLine1 || ''} onChange={handleInputChange} required />
            <InputField label="Address Line 2 (Optional)" name="addressLine2" value={formData.addressLine2 || ''} onChange={handleInputChange} />
            <InputField label="City" name="city" value={formData.city || ''} onChange={handleInputChange} required />
            <InputField label="State/Province" name="state" value={formData.state || ''} onChange={handleInputChange} required />
            <InputField label="Postal Code" name="postalCode" value={formData.postalCode || ''} onChange={handleInputChange} required />
            <InputField label="Country" name="country" value={formData.country || 'India'} onChange={handleInputChange} required />
             <div>
                <label className="block text-sm font-medium text-zaina-deep-navy mb-1">Address Type</label>
                <select name="type" value={formData.type || 'shipping'} onChange={(e) => setFormData(prev => ({...prev, type: e.target.value as 'shipping' | 'billing'}))} className="w-full px-3 py-2.5 border border-zaina-cool-gray-dark rounded-md shadow-sm focus:ring-zaina-primary focus:border-zaina-primary text-sm">
                    <option value="shipping">Shipping</option>
                    <option value="billing">Billing</option>
                </select>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={handleSaveAddress} className="bg-zaina-primary text-zaina-white font-semibold py-2 px-5 rounded-md hover:bg-zaina-secondary-blue">
              {editingAddress ? 'Update Address' : 'Save Address'}
            </button>
            <button onClick={resetForm} className="bg-zaina-cool-gray-medium text-zaina-deep-navy font-semibold py-2 px-5 rounded-md hover:bg-zaina-cool-gray-dark">
              Cancel
            </button>
          </div>
        </div>
      )}

      {addresses.length === 0 && !isAdding && (
        <p className="text-zaina-slate-gray">You have no saved addresses.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div key={addr.id} className="bg-zaina-white p-5 rounded-lg shadow-md border border-zaina-cool-gray-medium relative">
            {addr.isDefault && (
                <span className="absolute top-2 right-2 text-xs bg-zaina-primary text-zaina-white px-2 py-0.5 rounded-full">Default</span>
            )}
            <div className="flex items-start">
                <MapPinIcon className="w-6 h-6 text-zaina-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                    <h3 className="font-semibold text-zaina-deep-navy text-md">{addr.fullName} <span className="text-xs text-zaina-slate-gray capitalize">({addr.type})</span></h3>
                    <p className="text-sm text-zaina-slate-gray">{addr.addressLine1}</p>
                    {addr.addressLine2 && <p className="text-sm text-zaina-slate-gray">{addr.addressLine2}</p>}
                    <p className="text-sm text-zaina-slate-gray">{addr.city}, {addr.state} {addr.postalCode}</p>
                    <p className="text-sm text-zaina-slate-gray">{addr.country}</p>
                </div>
            </div>
            <div className="mt-4 pt-3 border-t border-zaina-cool-gray-light flex space-x-2 justify-end">
                <button onClick={() => handleEdit(addr)} className="text-zaina-secondary-blue hover:text-zaina-primary text-xs p-1" title="Edit Address"><EditIcon className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(addr.id)} className="text-zaina-deep-red-accent hover:text-red-700 text-xs p-1" title="Delete Address"><TrashIcon className="w-4 h-4" /></button>
                {!addr.isDefault && (
                    <button onClick={() => alert('Set as default functionality to be implemented')} className="text-zaina-slate-gray hover:text-zaina-deep-navy text-xs py-1 px-2 border border-zaina-cool-gray-dark rounded hover:bg-zaina-sky-blue-light">Set as Default</button>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserAddressesSection;