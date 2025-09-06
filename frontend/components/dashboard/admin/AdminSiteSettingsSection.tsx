
import React, { useState, useEffect } from 'react';
import InputField from '../../shared/InputField';
import { StoreSettings } from '../../../types';
import UploadCloudIcon from '../../icons/UploadCloudIcon';

interface AdminSiteSettingsSectionProps {
  storeSettings: StoreSettings;
  onSaveStoreSettings: (settings: StoreSettings) => void;
}

const AdminSiteSettingsSection: React.FC<AdminSiteSettingsSectionProps> = ({ storeSettings, onSaveStoreSettings }) => {
  const [settings, setSettings] = useState(storeSettings);

  useEffect(() => {
    setSettings(storeSettings);
  }, [storeSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'logoUrl' | 'faviconUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) { // 1MB limit
        alert(`File is too large. Please upload files under 1MB.`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const newSettings = { ...settings, [target]: result };
        setSettings(newSettings);
        onSaveStoreSettings(newSettings);
        alert(`${target === 'logoUrl' ? 'Logo' : 'Favicon'} updated successfully!`);
      };
      reader.onerror = () => {
        alert("There was an error reading the file.");
      }
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (section: 'info' | 'social') => {
    onSaveStoreSettings(settings);
    alert(`Store ${section === 'info' ? 'Details' : 'Social Links'} saved successfully!`);
  };

  return (
    <div className="space-y-8">
      {/* Site Identity & Info */}
      <div className="bg-admin-card dark:bg-dark-admin-card p-6 rounded-2xl shadow-admin-soft">
        <h3 className="text-lg font-semibold text-admin-text-primary dark:text-dark-admin-text-primary border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
          Store Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Store Name" name="name" value={settings.name} onChange={handleInputChange} />
          <InputField label="Tagline" name="tagline" value={settings.tagline} onChange={handleInputChange} />
          <InputField label="Support Email" name="supportEmail" type="email" value={settings.supportEmail} onChange={handleInputChange} />
          <InputField label="Support Phone" name="supportPhone" type="tel" value={settings.supportPhone} onChange={handleInputChange} />
        </div>
        <div className="mt-6 text-right">
          <button onClick={() => handleSave('info')} className="bg-admin-accent text-white font-semibold py-2 px-5 rounded-lg hover:bg-admin-accent-hover transition">
            Save Store Info
          </button>
        </div>
      </div>
      
       {/* Logos & Favicon */}
      <div className="bg-admin-card dark:bg-dark-admin-card p-6 rounded-2xl shadow-admin-soft">
        <h3 className="text-lg font-semibold text-admin-text-primary dark:text-dark-admin-text-primary border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
          Logos & Favicon
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Logo Uploader */}
          <div>
            <label className="block text-sm font-medium text-admin-text-primary dark:text-dark-admin-text-primary mb-2">
              Site Logo
            </label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-16 flex items-center justify-center bg-admin-light dark:bg-admin-dark rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                {settings.logoUrl ? <img src={settings.logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain p-1"/> : <span className="text-xs text-gray-400">Preview</span>}
              </div>
              <label htmlFor="logo-upload" className="cursor-pointer text-sm bg-gray-200 dark:bg-gray-600 text-admin-text dark:text-admin-dark-text font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                Upload Logo
              </label>
              <input id="logo-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/svg+xml" onChange={(e) => handleFileChange(e, 'logoUrl')} />
            </div>
            <p className="text-xs text-gray-400 mt-2">Recommended: PNG, JPG, or SVG. Max 1MB.</p>
          </div>
          {/* Favicon Uploader */}
          <div>
            <label className="block text-sm font-medium text-admin-text-primary dark:text-dark-admin-text-primary mb-2">
              Favicon
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center bg-admin-light dark:bg-admin-dark rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                {settings.faviconUrl ? <img src={settings.faviconUrl} alt="Favicon Preview" className="max-w-full max-h-full object-contain p-1"/> : <span className="text-xs text-gray-400">Preview</span>}
              </div>
              <label htmlFor="favicon-upload" className="cursor-pointer text-sm bg-gray-200 dark:bg-gray-600 text-admin-text dark:text-admin-dark-text font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                Upload Favicon
              </label>
              <input id="favicon-upload" type="file" className="sr-only" accept="image/x-icon, image/png, image/svg+xml" onChange={(e) => handleFileChange(e, 'faviconUrl')} />
            </div>
            <p className="text-xs text-gray-400 mt-2">Recommended: .ico or .png, 32x32px.</p>
          </div>
        </div>
      </div>


       {/* Social Media Links */}
       <div className="bg-admin-card dark:bg-dark-admin-card p-6 rounded-2xl shadow-admin-soft">
        <h3 className="text-lg font-semibold text-admin-text-primary dark:text-dark-admin-text-primary border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
          Social Media Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Instagram URL" name="instagramUrl" value={settings.instagramUrl} onChange={handleInputChange} />
          <InputField label="Facebook URL" name="facebookUrl" value={settings.facebookUrl} onChange={handleInputChange} />
          <InputField label="Twitter (X) URL" name="twitterUrl" value={settings.twitterUrl} onChange={handleInputChange} />
        </div>
        <div className="mt-6 text-right">
          <button onClick={() => handleSave('social')} className="bg-admin-accent text-white font-semibold py-2 px-5 rounded-lg hover:bg-admin-accent-hover transition">
            Save Social Links
          </button>
        </div>
      </div>
    </div>
  );
};
export default AdminSiteSettingsSection;
