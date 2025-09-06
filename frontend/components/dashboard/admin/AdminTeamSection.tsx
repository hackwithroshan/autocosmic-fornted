
import React, { useState } from 'react';
import { TeamMember } from '../../../types';
import InputField from '../../shared/InputField';
import Modal from '../../shared/Modal';
import PlusCircleIcon from '../../icons/PlusCircleIcon';
import EditIcon from '../../icons/EditIcon';
import TrashIcon from '../../icons/TrashIcon';

interface AdminTeamSectionProps {
  teamMembers: TeamMember[];
  onSave: (member: TeamMember) => void;
  onDelete: (memberId: string) => void;
}

const AdminTeamSection: React.FC<AdminTeamSectionProps> = ({ teamMembers, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingMember({ 
        id: `tm_${Date.now()}`, 
        name: '', 
        title: '', 
        imageUrl: '',
        socials: {},
        order: (teamMembers?.length || 0) + 1 
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingMember && editingMember.name && editingMember.title && editingMember.imageUrl) {
      onSave(editingMember as TeamMember);
      setIsModalOpen(false);
      setEditingMember(null);
    } else {
      alert("Name, Title, and Image URL are required.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Team Members</h2>
        <button onClick={handleAddNew} className="bg-admin-accent text-white py-2 px-4 rounded-lg flex items-center">
          <PlusCircleIcon className="w-4 h-4 mr-2"/> Add Member
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase">Order</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase">Image</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase">Title</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {teamMembers.map(member => (
              <tr key={member.id}>
                <td className="px-4 py-2">{member.order}</td>
                <td className="px-4 py-2"><img src={member.imageUrl} alt={member.name} className="w-10 h-10 rounded-full object-cover"/></td>
                <td className="px-4 py-2 font-medium">{member.name}</td>
                <td className="px-4 py-2 text-sm text-gray-500">{member.title}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => handleEdit(member)}><EditIcon className="w-4 h-4 text-blue-500"/></button>
                  <button onClick={() => onDelete(member.id)}><TrashIcon className="w-4 h-4 text-red-500"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isModalOpen && editingMember && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMember.name ? 'Edit Team Member' : 'Add Team Member'}>
          <div className="space-y-4">
            <InputField label="Name" name="name" value={editingMember.name || ''} onChange={e => setEditingMember(p => ({...p, name: e.target.value}))} />
            <InputField label="Title" name="title" value={editingMember.title || ''} onChange={e => setEditingMember(p => ({...p, title: e.target.value}))} />
            <InputField label="Image URL" name="imageUrl" value={editingMember.imageUrl || ''} onChange={e => setEditingMember(p => ({...p, imageUrl: e.target.value}))} />
            <InputField label="Order" name="order" type="number" value={editingMember.order || 0} onChange={e => setEditingMember(p => ({...p, order: Number(e.target.value)}))} />
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

export default AdminTeamSection;
