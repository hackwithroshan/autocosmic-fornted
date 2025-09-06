

import React, { useState, useEffect } from 'react';
import { FooterSettings, FooterColumn, FooterLink } from '../../../types';
import InputField from '../../shared/InputField';
import PlusCircleIcon from '../../icons/PlusCircleIcon';
import TrashIcon from '../../icons/TrashIcon';

interface AdminFooterManagerSectionProps {
  footerSettings: FooterSettings;
  onSaveFooterSettings: (settings: FooterSettings) => void;
}

const AdminFooterManagerSection: React.FC<AdminFooterManagerSectionProps> = ({ footerSettings, onSaveFooterSettings }) => {
  const [settings, setSettings] = useState(footerSettings);
  
  useEffect(() => {
    setSettings(footerSettings);
  }, [footerSettings]);

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value }
    }));
  };

  const handleCopyrightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, copyrightText: e.target.value }));
  };
  
  const handleColumnChange = (colIndex: number, value: string) => {
    setSettings(prev => ({
        ...prev,
        columns: prev.columns.map((col, i) =>
            i === colIndex ? { ...col, title: value } : col
        )
    }));
  };

  const handleLinkChange = (colIndex: number, linkIndex: number, field: 'label' | 'href', value: string) => {
    setSettings(prev => ({
      ...prev,
      columns: prev.columns.map((col, i) => {
        if (i === colIndex) {
          return {
            ...col,
            links: col.links.map((link, j) =>
              j === linkIndex ? { ...link, [field]: value } : link
            )
          };
        }
        return col;
      })
    }));
  };

  const addColumn = () => {
    const newColumn: FooterColumn = {
      id: `col_${Date.now()}`,
      title: 'New Column',
      links: []
    };
    setSettings(prev => ({ ...prev, columns: [...prev.columns, newColumn] }));
  };

  const deleteColumn = (index: number) => {
    if (window.confirm("Are you sure you want to delete this column and all its links?")) {
        setSettings(prev => ({ ...prev, columns: prev.columns.filter((_, i) => i !== index) }));
    }
  };

  const addLink = (colIndex: number) => {
    const newLink: FooterLink = {
      id: `link_${Date.now()}`,
      label: 'New Link',
      href: '#'
    };
    setSettings(prev => ({
        ...prev,
        columns: prev.columns.map((col, i) => i === colIndex ? { ...col, links: [...col.links, newLink] } : col)
    }));
  };
  
  const deleteLink = (colIndex: number, linkIndex: number) => {
    setSettings(prev => ({
        ...prev,
        columns: prev.columns.map((col, i) => {
            if (i === colIndex) {
                return { ...col, links: col.links.filter((_, j) => j !== linkIndex) };
            }
            return col;
        })
    }));
  };
  
  const handleSave = () => {
      onSaveFooterSettings(settings);
      alert('Footer settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xl font-semibold font-heading-playfair text-admin-text dark:text-admin-dark-text">Footer Settings</h2>
        <button onClick={handleSave} className="bg-admin-accent text-white font-semibold py-2 px-5 rounded-lg hover:bg-admin-accent-hover self-start sm:self-center">
            Save All Footer Changes
        </button>
      </div>

      <div className="p-4 sm:p-6 bg-admin-light-card dark:bg-admin-dark-card rounded-2xl shadow-lg">
        <h3 className="font-semibold text-lg mb-4">Footer Columns & Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settings.columns.map((col, colIndex) => (
            <div key={col.id} className="p-4 border rounded-lg bg-admin-light dark:bg-admin-dark space-y-3">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  value={col.title}
                  onChange={(e) => handleColumnChange(colIndex, e.target.value)}
                  className="font-semibold bg-transparent border-b border-gray-400 focus:border-admin-accent focus:outline-none"
                />
                <button onClick={() => deleteColumn(colIndex)} className="text-red-500"><TrashIcon className="w-4 h-4" /></button>
              </div>
              <div className="space-y-2">
                {col.links.map((link, linkIndex) => (
                  <div key={link.id} className="flex items-center gap-2">
                    <InputField label="" name={`label-${link.id}`} placeholder="Label" value={link.label} onChange={(e) => handleLinkChange(colIndex, linkIndex, 'label', e.target.value)} className="flex-1"/>
                    <InputField label="" name={`href-${link.id}`} placeholder="URL" value={link.href} onChange={(e) => handleLinkChange(colIndex, linkIndex, 'href', e.target.value)} className="flex-1"/>
                    <button onClick={() => deleteLink(colIndex, linkIndex)} className="text-red-500"><TrashIcon className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
              <button onClick={() => addLink(colIndex)} className="text-sm text-admin-accent hover:underline">+ Add Link</button>
            </div>
          ))}
          <div className="p-4 border-2 border-dashed rounded-lg flex items-center justify-center min-h-[150px]">
            <button onClick={addColumn} className="flex items-center gap-2 text-admin-accent">
                <PlusCircleIcon className="w-5 h-5"/> Add Column
            </button>
          </div>
        </div>
      </div>
      
       <div className="p-4 sm:p-6 bg-admin-light-card dark:bg-admin-dark-card rounded-2xl shadow-lg">
        <h3 className="font-semibold text-lg mb-4">Social & Copyright</h3>
        <div className="grid md:grid-cols-2 gap-6">
            <InputField label="Facebook URL" name="facebook" value={settings.socialLinks.facebook} onChange={handleSocialChange}/>
            <InputField label="Instagram URL" name="instagram" value={settings.socialLinks.instagram} onChange={handleSocialChange}/>
            <InputField label="Twitter URL" name="twitter" value={settings.socialLinks.twitter} onChange={handleSocialChange}/>
            <InputField label="Copyright Text" name="copyrightText" value={settings.copyrightText} onChange={handleCopyrightChange}/>
        </div>
      </div>
    </div>
  );
};

export default AdminFooterManagerSection;