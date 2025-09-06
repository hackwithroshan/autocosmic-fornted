

import React, { useState } from 'react';
import { UserProfile, ZainaColor } from '../../../types';
import InputField from '../../shared/InputField'; 

interface UserProfileSectionProps {
  user: UserProfile;
  onSave: (updatedUser: UserProfile) => Promise<void>;
  onChangePassword: (passwords: { current: string; new: string }) => Promise<{ success: boolean; message: string }>;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({ user, onSave, onChangePassword }) => {
  const [profileData, setProfileData] = useState<UserProfile>(user);
  const [isEditing, setIsEditing] = useState(false);
  
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [passwordStatus, setPasswordStatus] = useState<{ loading: boolean; error: string | null; success: string | null }>({ loading: false, error: null, success: null });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    await onSave(profileData);
    setIsEditing(false);
  };
  
  const handlePasswordSubmit = async () => {
    setPasswordStatus({ loading: true, error: null, success: null });

    if (!passwordData.newPassword || !passwordData.currentPassword) {
      setPasswordStatus({ loading: false, error: 'All password fields are required.', success: null });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordStatus({ loading: false, error: 'New passwords do not match.', success: null });
      return;
    }
    
    const result = await onChangePassword({ current: passwordData.currentPassword, new: passwordData.newPassword });

    if (result.success) {
      setPasswordStatus({ loading: false, success: result.message, error: null });
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); // Clear fields
      setTimeout(() => setPasswordStatus({ loading: false, error: null, success: null }), 5000); // Clear message after 5s
    } else {
      setPasswordStatus({ loading: false, error: result.message, success: null });
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold font-heading-playfair text-zaina-text-primary">My Profile</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className={`bg-zaina-primary text-zaina-white font-medium py-2 px-4 rounded-md hover:opacity-90 text-sm transition-opacity`}
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Full Name"
          name="name"
          value={profileData.name}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <InputField
          label="Email Address"
          name="email"
          type="email"
          value={profileData.email}
          onChange={handleChange}
          disabled 
        />
        <InputField
          label="Phone Number"
          name="phone"
          type="tel"
          value={profileData.phone || ''}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <InputField
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={profileData.dateOfBirth || ''}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>

      {isEditing && (
        <div className="mt-8 flex gap-4">
          <button
            onClick={handleSave}
            className="bg-zaina-primary text-zaina-white font-semibold py-2.5 px-6 rounded-md hover:opacity-90 transition-opacity"
          >
            Save Changes
          </button>
          <button
            onClick={() => { setIsEditing(false); setProfileData(user); }}
            className="bg-zaina-neutral-medium text-zaina-text-primary font-semibold py-2.5 px-6 rounded-md hover:bg-zaina-cool-gray-dark transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

        <div className="mt-8 pt-6 border-t border-zaina-neutral-medium dark:border-dark-zaina-border-strong">
            <h3 className="text-lg font-semibold font-heading-playfair text-zaina-text-primary dark:text-dark-zaina-text-primary mb-4">Change Password</h3>
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
            <div className="mt-6">
                <button
                    onClick={handlePasswordSubmit}
                    disabled={passwordStatus.loading}
                    className="bg-zaina-primary text-zaina-white font-semibold py-2 px-5 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {passwordStatus.loading ? 'Updating...' : 'Update Password'}
                </button>
                {passwordStatus.error && <p className="text-sm text-red-500 mt-2">{passwordStatus.error}</p>}
                {passwordStatus.success && <p className="text-sm text-green-600 mt-2">{passwordStatus.success}</p>}
            </div>
        </div>
    </div>
  );
};

export default UserProfileSection;