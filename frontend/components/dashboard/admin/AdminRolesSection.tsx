

import React, { useState } from 'react';
import { AdminUser, AdminRole } from '../../../types';
import InputField from '../../shared/InputField';
import PlusCircleIcon from '../../icons/PlusCircleIcon';
import EditIcon from '../../icons/EditIcon';
import TrashIcon from '../../icons/TrashIcon';

interface AdminRolesSectionProps {
  initialAdminUsers: AdminUser[];
  onSaveAdminUser: (user: AdminUser) => Promise<boolean>;
  onDeleteAdminUser: (userId: string) => Promise<boolean>;
}

const ALL_ROLES: AdminRole[] = ['Super Admin', 'Product Manager', 'Order Manager', 'Support Manager', 'Content Editor', 'Analytics Viewer'];

type AdminUserFormData = Partial<AdminUser> & { password?: string };

const inputFieldClasses = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-admin-accent focus:border-admin-accent bg-admin-light-card dark:bg-admin-dark-card";
const primaryButtonSmClasses = "bg-admin-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-admin-accent-hover transition-colors";
const secondaryButtonSmClasses = "bg-gray-200 dark:bg-gray-600 text-admin-text dark:text-admin-dark-text font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors";
const thCellClasses = "px-4 py-3 text-left text-xs font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary uppercase tracking-wider";
const tdCellClasses = "px-4 py-3 whitespace-nowrap text-sm text-admin-text dark:text-admin-dark-text";


const AdminRolesSection: React.FC<AdminRolesSectionProps> = ({ initialAdminUsers, onSaveAdminUser, onDeleteAdminUser }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  
  const [formData, setFormData] = useState<AdminUserFormData>({
    role: 'Product Manager',
    isActive: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const resetForm = () => {
    setFormData({ role: 'Product Manager', isActive: true, password: '' });
    setIsAdding(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) {
      alert("Name, email, and role are required.");
      return;
    }
    if (!editingUser && !formData.password) {
        alert("Password is required for new admin users.");
        return;
    }

    const userToSave: AdminUser = {
      id: editingUser ? editingUser.id : `admin_${Date.now()}`,
      name: formData.name!,
      email: formData.email!,
      role: formData.role!,
      isActive: formData.isActive !== undefined ? formData.isActive : true,
      lastLogin: editingUser ? editingUser.lastLogin : undefined,
    };
    
    // Include password only for new users
    const payload: any = { ...userToSave };
    if (!editingUser) {
        payload.password = formData.password;
    }

    const success = await onSaveAdminUser(payload);
    if (success) {
        resetForm();
    }
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormData(user);
    setIsAdding(true);
  };

  const handleDelete = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this admin user?")) {
        onDeleteAdminUser(userId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold font-heading-playfair text-admin-text dark:text-admin-dark-text">Users & Roles</h2>
        {!isAdding && (
          <button
            onClick={() => { setIsAdding(true); setEditingUser(null); setFormData({ role: 'Product Manager', isActive: true, password: '' }); }}
            className={`${primaryButtonSmClasses} flex items-center`}
          >
            <PlusCircleIcon className="w-4 h-4 mr-2" /> Add Admin User
          </button>
        )}
      </div>

      {isAdding && (
        <div className="mb-8 p-6 bg-admin-light dark:bg-admin-dark rounded-lg shadow-inner">
          <h3 className="text-lg font-semibold text-admin-text dark:text-admin-dark-text mb-4">{editingUser ? 'Edit Admin User' : 'Create New Admin User'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Full Name" name="name" value={formData.name || ''} onChange={handleInputChange} required />
              <InputField label="Email Address" name="email" type="email" value={formData.email || ''} onChange={handleInputChange} required />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-admin-text dark:text-admin-dark-text mb-1">Role</label>
              <select id="role" name="role" value={formData.role} onChange={handleInputChange} className={inputFieldClasses}>
                {ALL_ROLES.map(roleName => <option key={roleName} value={roleName}>{roleName}</option>)}
              </select>
            </div>
            
            {!editingUser && <InputField label="Password (for new user)" name="password" type="password" value={formData.password || ''} onChange={handleInputChange} required={!editingUser}/>}
             <div className="flex items-center">
              <input type="checkbox" id="userIsActive" name="isActive" checked={!!formData.isActive} onChange={handleInputChange} className="h-4 w-4 text-admin-accent focus:ring-admin-accent border-gray-300 dark:border-gray-500 rounded mr-2" />
              <label htmlFor="userIsActive" className="text-sm text-admin-text dark:text-admin-dark-text">Active</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" className={primaryButtonSmClasses}>
                {editingUser ? 'Update User' : 'Save User'}
              </button>
              <button type="button" onClick={resetForm} className={secondaryButtonSmClasses}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto bg-admin-light-card dark:bg-admin-dark-card p-4 rounded-xl">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className={thCellClasses}>Name</th>
              <th className={thCellClasses}>Email</th>
              <th className={thCellClasses}>Role</th>
              <th className={thCellClasses}>Status</th>
              <th className={thCellClasses}>Last Login</th>
              <th className={thCellClasses}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {initialAdminUsers.map(user => (
              <tr key={user.id} className="hover:bg-admin-light dark:hover:bg-admin-dark-card-hover">
                <td className={`${tdCellClasses} font-medium`}>{user.name}</td>
                <td className={tdCellClasses}>{user.email}</td>
                <td className={tdCellClasses}>{user.role}</td>
                <td className={tdCellClasses}>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className={tdCellClasses}>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}</td>
                <td className={`${tdCellClasses} space-x-1`}>
                  <button onClick={() => handleEdit(user)} className="text-admin-accent hover:opacity-80 p-1" title="Edit"><EditIcon className="w-4 h-4"/></button>
                  <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:opacity-80 p-1" title="Delete"><TrashIcon className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {initialAdminUsers.length === 0 && !isAdding && (
         <p className="text-center py-8 text-admin-text-secondary dark:text-dark-admin-text-secondary">No admin users configured.</p>
      )}
    </div>
  );
};

export default AdminRolesSection;