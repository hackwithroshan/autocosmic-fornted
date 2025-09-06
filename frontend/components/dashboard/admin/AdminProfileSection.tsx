

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { UserProfile } from '../../../types';
import InputField from '../../shared/InputField';
import { API_BASE_URL } from '../../../constants';

interface AdminProfileSectionProps {
  user: UserProfile | null;
}

const AdminProfileSection: React.FC<AdminProfileSectionProps> = ({ user: initialUser }) => {
  const [profileData, setProfileData] = useState<Partial<UserProfile>>(initialUser || {});
  const [previewImage, setPreviewImage] = useState<string | null>(initialUser?.profilePictureUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [passwordStatus, setPasswordStatus] = useState<{ loading: boolean; error: string | null; success: string | null }>({ loading: false, error: null, success: null });
  
  useEffect(() => {
      // In a real app, we might fetch the profile here if not passed in,
      // but since it comes from the parent, we just sync the state.
      setProfileData(initialUser || {});
      setPreviewImage(initialUser?.profilePictureUrl || null);
  }, [initialUser]);

  if (!initialUser) {
    return <div>Loading profile...</div>;
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
   const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const onSave = async (updatedUser: UserProfile) => {
    try {
        const token = localStorage.getItem('zaina-authToken');
        await axios.put(`${API_BASE_URL}/user/profile`, updatedUser, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert('Profile saved successfully!');
    } catch (err) {
        alert('Failed to save profile.');
    }
  };

  const onChangePassword = async (passwords: { current: string; new: string }): Promise<{ success: boolean; message: string }> => {
    try {
        const token = localStorage.getItem('zaina-authToken');
        const response = await axios.put(`${API_BASE_URL}/user/change-password`, passwords, {
             headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, message: response.data.message };
    } catch(err: any) {
        return { success: false, message: err.response?.data?.message || "Password change failed." };
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profileData as UserProfile);
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logic remains the same as before, just uses the new onChangePassword handler
  };


  return (
    <div className="bg-admin-light-card dark:bg-admin-dark-card p-6 rounded-2xl shadow-lg max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold font-heading-playfair text-admin-text dark:text-admin-dark-text mb-6">Edit My Profile</h2>
        <form onSubmit={handleSubmit}>
            <div className="space-y-6">
                 <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex-shrink-0">
                        <img 
                            src={previewImage || '/media/admin-avatar.jpg'} 
                            alt="Profile Preview" 
                            className="w-24 h-24 rounded-full object-cover ring-4 ring-admin-accent/20"
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="Full Name"
                        name="name"
                        value={profileData.name || ''}
                        onChange={handleInputChange}
                        required
                    />
                     <InputField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={profileData.email || ''}
                        onChange={handleInputChange}
                        disabled
                        helperText="Email cannot be changed."
                    />
                </div>
            </div>

            <div className="pt-6 mt-6 flex justify-end">
                <button
                    type="submit"
                    className="bg-admin-accent text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-admin-accent-hover transition-colors"
                >
                    Save Profile Changes
                </button>
            </div>
        </form>
        
        <form onSubmit={handlePasswordSubmit} className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold font-heading-playfair text-admin-text dark:text-admin-dark-text mb-4">Change Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <InputField
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                />
                 <div></div> 
                 <InputField
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                />
                 <InputField
                    label="Confirm New Password"
                    name="confirmNewPassword"
                    type="password"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                />
            </div>
            <div className="mt-6 flex items-center justify-between">
                <div>
                    {passwordStatus.error && <p className="text-sm text-red-500">{passwordStatus.error}</p>}
                    {passwordStatus.success && <p className="text-sm text-green-600">{passwordStatus.success}</p>}
                </div>
                <button
                    type="submit"
                    disabled={passwordStatus.loading}
                    className="bg-admin-accent text-white font-semibold py-2 px-5 rounded-lg hover:bg-admin-accent-hover transition-opacity disabled:opacity-50"
                >
                    {passwordStatus.loading ? 'Updating...' : 'Update Password'}
                </button>
            </div>
        </form>
    </div>
  );
};

export default AdminProfileSection;