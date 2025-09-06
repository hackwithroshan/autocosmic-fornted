
import React, { useState } from 'react';
import { AdminUser, AdminRole, ZainaColor } from '../../../types';
import InputField from '../../shared/InputField';
import PlusCircleIcon from '../../icons/PlusCircleIcon';
import EditIcon from '../../icons/EditIcon';
import TrashIcon from '../../icons/TrashIcon';

interface AdminRolesPermissionsSectionProps {
  initialAdminUsers: AdminUser[];
}

const ALL_ROLES: AdminRole[] = ['Super Admin', 'Product Manager', 'Order Manager', 'Support Manager', 'Content Editor', 'Analytics Viewer'];

// Define a local type for form data that includes the optional password
type AdminUserFormData = Partial<AdminUser> & { password?: string };

const inputFieldClasses = "w-full px-3 py-2 border border-zaina-cool-gray-dark rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-zaina-primary focus:border-zaina-primary";
const primaryButtonSmClasses = "bg-zaina-primary text-zaina-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-zaina-secondary-blue transition-colors";
const secondaryButtonSmClasses = "bg-zaina-cool-gray-medium text-zaina-deep-navy text-sm font-semibold py-2 px-4 rounded-md hover:bg-zaina-cool-gray-dark transition-colors";
const thCellClasses = "px-4 py-3 text-left text-xs font-medium text-zaina-slate-gray uppercase tracking-wider";
const tdCellClasses = "px-4 py-3 whitespace-nowrap text-sm text-zaina-deep-navy";


const AdminRolesPermissionsSection: React.FC<AdminRolesPermissionsSectionProps> = ({ initialAdminUsers }) => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(initialAdminUsers);
  const [isAdding, setIsAdding] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  
  const [formData, setFormData] = useState<AdminUserFormData>({
    role: 'Product Manager', // Default role
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) {
      alert("Name, email, and role are required.");
      return;
    }
    if (!editingUser && !formData.password) { // Password required only for new users
        alert("Password is required for new admin users.");
        return;
    }

    const newUser: AdminUser = {
      id: editingUser ? editingUser.id : `admin${Date.now()}`,
      name: formData.name!,
      email: formData.email!,
      role: formData.role!,
      isActive: formData.isActive !== undefined ? formData.isActive : true,
      lastLogin: editingUser ? editingUser.lastLogin : undefined,
    };

    if (editingUser) {
      setAdminUsers(prev => prev.map(u => u.id === newUser.id ? newUser : u));
      alert(`Admin user ${newUser.name} updated!`);
    } else {
      // Password would be handled here, e.g., sent to backend
      console.log("New user password (would be hashed and sent to backend):", formData.password);
      setAdminUsers(prev => [newUser, ...prev]);
      alert(`Admin user ${newUser.name} created!`);
    }
    resetForm();
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormData(user); // Password field will be empty as it's not part of AdminUser type
    setIsAdding(true);
  };

  const handleDelete = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this admin user?")) {
        setAdminUsers(prev => prev.filter(u => u.id !== userId));
        alert('Admin user deleted (simulated).');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold font-heading-playfair text-zaina-deep-navy">Roles & Permissions</h2>
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
        <div className="mb-8 p-6 bg-zaina-sky-blue-light/50 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-zaina-deep-navy mb-4">{editingUser ? 'Edit Admin User' : 'Create New Admin User'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Full Name" name="name" value={formData.name || ''} onChange={handleInputChange} required />
              <InputField label="Email Address" name="email" type="email" value={formData.email || ''} onChange={handleInputChange} required />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-zaina-deep-navy mb-1">Role</label>
              <select id="role" name="role" value={formData.role} onChange={handleInputChange} className={inputFieldClasses}>
                {ALL_ROLES.map(roleName => <option key={roleName} value={roleName}>{roleName}</option>)}
              </select>
            </div>
            
            {!editingUser && <InputField label="Password (for new user)" name="password" type="password" value={formData.password || ''} onChange={handleInputChange} required={!editingUser}/>}
             <div className="flex items-center">
              <input type="checkbox" id="userIsActive" name="isActive" checked={!!formData.isActive} onChange={handleInputChange} className="h-4 w-4 text-zaina-primary focus:ring-zaina-primary border-zaina-cool-gray-dark rounded mr-2" />
              <label htmlFor="userIsActive" className="text-sm text-zaina-deep-navy">Active</label>
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

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zaina-cool-gray-medium dashboard-table">
          <thead className="bg-zaina-cool-gray-light">
            <tr>
              <th className={thCellClasses}>Name</th>
              <th className={thCellClasses}>Email</th>
              <th className={thCellClasses}>Role</th>
              <th className={thCellClasses}>Status</th>
              <th className={thCellClasses}>Last Login</th>
              <th className={thCellClasses}>Actions</th>
            </tr>
          </thead>
          <tbody className="bg-zaina-white divide-y divide-zaina-cool-gray-light">
            {adminUsers.map(user => (
              <tr key={user.id} className="hover:bg-zaina-sky-blue-light/50">
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
                  <button onClick={() => handleEdit(user)} className="text-zaina-secondary-blue hover:text-zaina-primary p-1" title="Edit"><EditIcon className="w-4 h-4"/></button>
                  <button onClick={() => handleDelete(user.id)} className="text-zaina-deep-red-accent hover:text-red-700 p-1" title="Delete"><TrashIcon className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {adminUsers.length === 0 && !isAdding && (
         <p className="text-center py-8 text-zaina-slate-gray">No admin users configured.</p>
      )}
    </div>
  );
};

export default AdminRolesPermissionsSection;
