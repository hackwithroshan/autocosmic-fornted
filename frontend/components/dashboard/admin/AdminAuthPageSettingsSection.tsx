
import React, { useState, useEffect } from 'react';
import { AuthPageSettings } from '../../../types';
import InputField from '../../shared/InputField';

interface AdminAuthPageSettingsSectionProps {
  settings: AuthPageSettings;
  onSave: (settings: AuthPageSettings) => void;
}

const AdminAuthPageSettingsSection: React.FC<AdminAuthPageSettingsSectionProps> = ({ settings: initialSettings, onSave }) => {
  const [settings, setSettings] = useState(initialSettings);

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSave = () => {
    onSave(settings);
    alert('Auth Page settings saved!');
  };

  return (
    <div className="bg-admin-light-card dark:bg-admin-dark-card p-6 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-admin-light-text dark:text-admin-dark-text">Auth Page Settings</h1>
      <p className="mt-2 text-admin-light-text-secondary dark:text-admin-dark-text-secondary mb-6">
        Customize the appearance of your Login and Registration page.
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Left Panel Background Color</label>
          <input 
            type="color" 
            name="backgroundColor"
            value={settings.backgroundColor}
            onChange={handleInputChange}
            className="w-full h-12 p-1 border rounded-md"
          />
        </div>
        <InputField 
            label="Image URL" 
            name="imageUrl" 
            value={settings.imageUrl} 
            onChange={handleInputChange} 
            helperText="This image appears on the left panel."
        />
        <InputField 
            label="Title Text" 
            name="title" 
            value={settings.title} 
            onChange={handleInputChange} 
            helperText="The main text below the image."
        />
        <InputField 
            label="Subtitle Text" 
            name="subtitle" 
            as="textarea"
            rows={3}
            value={settings.subtitle} 
            onChange={handleInputChange} 
            helperText="The smaller text below the title."
        />
        <div className="text-right">
            <button onClick={handleSave} className="bg-admin-accent text-white font-semibold py-2 px-5 rounded-lg hover:bg-admin-accent-hover">
                Save Settings
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthPageSettingsSection;
