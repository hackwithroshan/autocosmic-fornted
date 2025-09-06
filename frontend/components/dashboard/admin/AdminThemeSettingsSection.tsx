

import React, { useState, useEffect } from 'react';
import { ThemeSettings } from '../../../types';

interface AdminThemeSettingsSectionProps {
    themeSettings: ThemeSettings;
    onSaveThemeSettings: (settings: ThemeSettings) => void;
}

const fontOptions = ['Poppins', 'Playfair Display', 'Inter', 'Cormorant Garamond', 'Cinzel', 'Work Sans', 'Jost'];

const AdminThemeSettingsSection: React.FC<AdminThemeSettingsSectionProps> = ({ themeSettings, onSaveThemeSettings }) => {
  const [settings, setSettings] = useState(themeSettings);

  useEffect(() => {
    setSettings(themeSettings);
  }, [themeSettings]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({...prev, [e.target.name]: e.target.value}));
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings(prev => ({...prev, [e.target.name]: e.target.value}));
  };
  
  const handleSave = () => {
    onSaveThemeSettings(settings);
    alert('Theme settings saved successfully!');
  };

  return (
    <div className="bg-admin-light-card dark:bg-admin-dark-card p-6 md:p-8 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-admin-light-text dark:text-admin-dark-text">Theme & Appearance</h1>
      <p className="mt-2 text-admin-light-text-secondary dark:text-admin-dark-text-secondary mb-6">
        Customize the look and feel of your storefront. Changes are applied in real-time.
      </p>

      <div className="space-y-8">
        {/* Color Scheme */}
        <div>
            <h3 className="font-semibold text-lg mb-4">Color Scheme</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="capitalize block text-sm font-medium">Primary Color</label>
                    <input type="color" name="colorPrimary" value={settings.colorPrimary} onChange={handleColorChange} className="w-full h-12 border-none cursor-pointer rounded-md"/>
                </div>
                 <div className="space-y-2">
                    <label className="capitalize block text-sm font-medium">Gold Accent</label>
                    <input type="color" name="colorGold" value={settings.colorGold} onChange={handleColorChange} className="w-full h-12 border-none cursor-pointer rounded-md"/>
                </div>
                 <div className="space-y-2">
                    <label className="capitalize block text-sm font-medium">CTA Button Blue</label>
                    <input type="color" name="colorCtaBlue" value={settings.colorCtaBlue} onChange={handleColorChange} className="w-full h-12 border-none cursor-pointer rounded-md"/>
                </div>
            </div>
        </div>
        
        {/* Typography */}
        <div>
            <h3 className="font-semibold text-lg mb-4">Typography</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div className="space-y-2">
                     <label className="block text-sm font-medium">Body Font</label>
                     <select name="fontBody" value={settings.fontBody} onChange={handleFontChange} className="w-full p-3 border rounded-md dark:bg-admin-dark border-gray-300 dark:border-gray-600">
                         {fontOptions.map(font => <option key={font} value={font}>{font}</option>)}
                     </select>
                </div>
                <div className="space-y-2">
                     <label className="block text-sm font-medium">Main Heading Font</label>
                     <select name="fontHeadingDisplay" value={settings.fontHeadingDisplay} onChange={handleFontChange} className="w-full p-3 border rounded-md dark:bg-admin-dark border-gray-300 dark:border-gray-600">
                         {fontOptions.map(font => <option key={font} value={font}>{font}</option>)}
                     </select>
                </div>
                 <div className="space-y-2">
                     <label className="block text-sm font-medium">Sub-Heading Font</label>
                     <select name="fontHeadingCormorant" value={settings.fontHeadingCormorant} onChange={handleFontChange} className="w-full p-3 border rounded-md dark:bg-admin-dark border-gray-300 dark:border-gray-600">
                         {fontOptions.map(font => <option key={font} value={font}>{font}</option>)}
                     </select>
                </div>
            </div>
        </div>

         <div className="mt-6 text-right">
                <button onClick={handleSave} className="bg-admin-accent text-white font-semibold py-2 px-5 rounded-lg hover:bg-admin-accent-hover">Save Theme</button>
         </div>
      </div>
    </div>
  );
};

export default AdminThemeSettingsSection;