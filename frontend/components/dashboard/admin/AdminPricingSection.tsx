
import React, { useState } from 'react';
import { PricingPlan } from '../../../types';
import InputField from '../../shared/InputField';
import Modal from '../../shared/Modal';
import TagInput from '../../shared/TagInput';
import PlusCircleIcon from '../../icons/PlusCircleIcon';
import EditIcon from '../../icons/EditIcon';
import TrashIcon from '../../icons/TrashIcon';

interface AdminPricingSectionProps {
  plans: PricingPlan[];
  onSave: (plan: PricingPlan) => void;
  onDelete: (planId: string) => void;
}

const AdminPricingSection: React.FC<AdminPricingSectionProps> = ({ plans, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Partial<PricingPlan> | null>(null);

  const handleEdit = (plan: PricingPlan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingPlan({ 
        id: `plan_${Date.now()}`, 
        name: '', 
        price: '0', 
        frequency: '/ month',
        features: [],
        isFeatured: false,
        buttonText: 'Choose Plan',
        buttonLink: '#',
        order: (plans?.length || 0) + 1 
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingPlan && editingPlan.name && editingPlan.price) {
      onSave(editingPlan as PricingPlan);
      setIsModalOpen(false);
      setEditingPlan(null);
    } else {
      alert("Name and Price are required.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Pricing Plans</h2>
        <button onClick={handleAddNew} className="bg-admin-accent text-white py-2 px-4 rounded-lg flex items-center">
          <PlusCircleIcon className="w-4 h-4 mr-2"/> Add Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className={`p-4 border rounded-lg ${plan.isFeatured ? 'border-admin-accent' : 'bg-white'}`}>
            <h3 className="font-bold">{plan.name}</h3>
            <p className="text-xl font-bold">₹{plan.price}<span className="text-sm">{plan.frequency}</span></p>
            <ul className="text-xs my-2">
                {plan.features.map((f, i) => <li key={i}>• {f}</li>)}
            </ul>
            <div className="mt-2 space-x-2">
              <button onClick={() => handleEdit(plan)}><EditIcon className="w-4 h-4 text-blue-500"/></button>
              <button onClick={() => onDelete(plan.id)}><TrashIcon className="w-4 h-4 text-red-500"/></button>
            </div>
          </div>
        ))}
      </div>
      
      {isModalOpen && editingPlan && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingPlan.name ? 'Edit Plan' : 'Add Plan'}>
          <div className="space-y-4">
            <InputField label="Plan Name" name="name" value={editingPlan.name || ''} onChange={e => setEditingPlan(p => ({...p, name: e.target.value}))} />
            <InputField label="Price" name="price" value={editingPlan.price || '0'} onChange={e => setEditingPlan(p => ({...p, price: e.target.value}))} />
            <InputField label="Frequency" name="frequency" value={editingPlan.frequency || '/ month'} onChange={e => setEditingPlan(p => ({...p, frequency: e.target.value}))} />
            <TagInput label="Features" tags={editingPlan.features || []} setTags={tags => setEditingPlan(p => ({...p, features: tags}))} placeholder="Add feature..."/>
            <InputField label="Button Text" name="buttonText" value={editingPlan.buttonText || 'Choose Plan'} onChange={e => setEditingPlan(p => ({...p, buttonText: e.target.value}))} />
            <InputField label="Button Link" name="buttonLink" value={editingPlan.buttonLink || '#'} onChange={e => setEditingPlan(p => ({...p, buttonLink: e.target.value}))} />
            <InputField label="Order" name="order" type="number" value={editingPlan.order || 0} onChange={e => setEditingPlan(p => ({...p, order: Number(e.target.value)}))} />
            <label className="flex items-center">
                <input type="checkbox" checked={!!editingPlan.isFeatured} onChange={e => setEditingPlan(p => ({...p, isFeatured: e.target.checked}))} className="mr-2" />
                Featured Plan
            </label>

            <div className="flex justify-end gap-3 pt-3">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-200 px-4 py-2 rounded-lg">Cancel</button>
              <button onClick={handleSave} className="bg-admin-accent text-white px-4 py-2 rounded-lg">Save</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminPricingSection;
