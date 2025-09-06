

import React, { useState, useEffect } from 'react';
import InputField from '../../shared/InputField';
import UploadCloudIcon from '../../icons/UploadCloudIcon';
import { SeoSettings } from '../../../types';
import TagInput from '../../shared/TagInput';

interface AdminSeoSettingsSectionProps {
    seoSettings: SeoSettings;
    onSaveSeoSettings: (settings: SeoSettings) => void;
}

const AdminSeoSettingsSection: React.FC<AdminSeoSettingsSectionProps> = ({ seoSettings, onSaveSeoSettings }) => {
    const [settings, setSettings] = useState(seoSettings);

    useEffect(() => {
        setSettings(seoSettings);
    }, [seoSettings]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSettings(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleKeywordsChange = (keywords: string[]) => {
        setSettings(prev => ({...prev, metaKeywords: keywords}));
    }
    
    const handleSave = () => {
        onSaveSeoSettings(settings);
        alert('SEO settings saved successfully!');
    }

    return (
        <div className="bg-admin-light-card dark:bg-admin-dark-card p-8 rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold text-admin-light-text dark:text-admin-dark-text">SEO Settings</h1>
            <p className="mt-2 text-admin-light-text-secondary dark:text-admin-dark-text-secondary mb-6">
                Manage global search engine optimization settings for your store.
            </p>

            <div className="space-y-6">
                <InputField label="Homepage Meta Title" name="homepageTitle" value={settings.homepageTitle} onChange={handleInputChange} />
                <div>
                    <label className="block text-sm font-medium mb-1">Homepage Meta Description</label>
                    <textarea name="homepageDescription" value={settings.homepageDescription} onChange={handleInputChange} rows={4} className="w-full text-sm p-2 border rounded-md dark:bg-admin-dark border-gray-300 dark:border-gray-600" />
                </div>
                <TagInput 
                    label="Global Meta Keywords"
                    tags={settings.metaKeywords}
                    setTags={handleKeywordsChange}
                    placeholder="Add a keyword and press Enter..."
                />
                 <div>
                    <h3 className="font-semibold text-lg mb-3">Sitemap</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your sitemap is automatically generated at <a href="/sitemap.xml" className="text-admin-accent hover:underline" target="_blank" rel="noopener noreferrer">/sitemap.xml</a>.</p>
                </div>
                 <div className="text-right">
                    <button onClick={handleSave} className="bg-admin-accent text-white font-semibold py-2 px-5 rounded-lg hover:bg-admin-accent-hover">Save SEO Settings</button>
                 </div>
            </div>
        </div>
    );
};

export default AdminSeoSettingsSection;