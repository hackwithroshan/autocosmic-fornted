
import React, { useState } from 'react';
import { StatItem } from '../../../types';
import InputField from '../../shared/InputField';
import Modal from '../../shared/Modal';
import PlusCircleIcon from '../../icons/PlusCircleIcon';
import EditIcon from '../../icons/EditIcon';
import TrashIcon from '../../icons/TrashIcon';

interface AdminStatsSectionProps {
  stats: StatItem[];
  onSave: (stat: StatItem) => void;
  onDelete: (statId: string) => void;
}

const AdminStatsSection: React.FC<AdminStatsSectionProps> = ({ stats, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<Partial<StatItem> | null>(null);

  const handleEdit = (stat: StatItem) => {
    setEditingStat(stat);
    setIsModalOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingStat({ 
        id: `stat_${Date.now()}`, 
        icon: 'package',
        label: '',
        value: 0,
        order: (stats?.length || 0) + 1 
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingStat && editingStat.label && editingStat.value !== undefined) {
      onSave(editingStat as StatItem);
      setIsModalOpen(false);
      setEditingStat(null);
    } else {
      alert("Label and Value are required.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Stats Counters</h2>
        <button onClick={handleAddNew} className="bg-admin-accent text-white py-2 px-4 rounded-lg flex items-center">
          <PlusCircleIcon className="w-4 h-4 mr-2"/> Add Stat
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.id} className="p-4 bg-white rounded-lg shadow text-center">
            <p className="text-2xl font-bold">{stat.value.toLocaleString()}+</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <div className="mt-2 space-x-2">
              <button onClick={() => handleEdit(stat)}><EditIcon className="w-4 h-4 text-blue-500"/></button>
              <button onClick={() => onDelete(stat.id)}><TrashIcon className="w-4 h-4 text-red-500"/></button>
            </div>
          </div>
        ))}
      </div>
      
      {isModalOpen && editingStat && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStat.label ? 'Edit Stat' : 'Add Stat'}>
          <div className="space-y-4">
            <InputField label="Label" name="label" value={editingStat.label || ''} onChange={e => setEditingStat(p => ({...p, label: e.target.value}))} />
            <InputField label="Value" name="value" type="number" value={editingStat.value || 0} onChange={e => setEditingStat(p => ({...p, value: Number(e.target.value)}))} />
            <InputField label="Icon Name" name="icon" value={editingStat.icon || ''} onChange={e => setEditingStat(p => ({...p, icon: e.target.value}))} helperText="e.g., package, smile, award, globe" />
            <InputField label="Order" name="order" type="number" value={editingStat.order || 0} onChange={e => setEditingStat(p => ({...p, order: Number(e.target.value)}))} />
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

export default AdminStatsSection;
