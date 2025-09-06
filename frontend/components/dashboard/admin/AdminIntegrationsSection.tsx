import React, { useState, useEffect } from 'react';
import PlugIcon from '../../icons/PlugIcon';
import InputField from '../../shared/InputField';
import { Integration, SiteSettingsBundle } from '../../../types';

interface AdminIntegrationsSectionProps {
  integrations: Integration[];
  onSaveIntegration: (integration: Integration) => Promise<boolean>;
  siteSettings: SiteSettingsBundle | null;
  onSaveSiteSettings: (settings: SiteSettingsBundle) => Promise<boolean>;
}

const AdminIntegrationsSection: React.FC<AdminIntegrationsSectionProps> = ({ integrations, onSaveIntegration, siteSettings, onSaveSiteSettings }) => {
  const [localIntegrations, setLocalIntegrations] = useState<Integration[]>([]);
  const [gaId, setGaId] = useState('');
  const [expandedIntegrationId, setExpandedIntegrationId] = useState<string | null>(null);

  useEffect(() => {
    // Deep copy to avoid direct mutation of props
    setLocalIntegrations(JSON.parse(JSON.stringify(integrations)));
  }, [integrations]);

  useEffect(() => {
    if (siteSettings) {
      setGaId(siteSettings.integrations.googleAnalyticsId || '');
    }
  }, [siteSettings]);
  
  const handleSaveGaSettings = async () => {
    if (siteSettings) {
      const newSettings = { 
        ...siteSettings, 
        integrations: { ...siteSettings.integrations, googleAnalyticsId: gaId }
      };
      const success = await onSaveSiteSettings(newSettings);
      if (success) {
        alert('Google Analytics settings saved!');
      }
    }
  };

  const handleSettingChange = (id: string, field: string, value: string | boolean) => {
    setLocalIntegrations(prev =>
      prev.map(integ => {
        if (integ.id === id) {
          if (field === 'enabled') {
            return { ...integ, enabled: value as boolean };
          }
          return {
            ...integ,
            settings: { ...integ.settings, [field]: value },
          };
        }
        return integ;
      })
    );
  };
  
  const handleSave = async (id: string) => {
    const integrationToSave = localIntegrations.find(i => i.id === id);
    if (integrationToSave) {
      await onSaveIntegration(integrationToSave);
      setExpandedIntegrationId(null); // Collapse on save
    }
  };

  const renderFields = (integration: Integration) => {
    switch(integration.name) {
      case 'Facebook Pixel':
        return <InputField label="Pixel ID" name="pixelId" value={integration.settings.pixelId || ''} onChange={(e) => handleSettingChange(integration.id, 'pixelId', e.target.value)} placeholder="e.g., 123456789012345" />;
      case 'Razorpay':
        return (
            <>
                <InputField label="Key ID" name="apiKey" value={integration.settings.apiKey || ''} onChange={(e) => handleSettingChange(integration.id, 'apiKey', e.target.value)} placeholder="e.g., rzp_test_..." />
                <InputField label="Key Secret" name="apiSecret" type="password" value={integration.settings.apiSecret || ''} onChange={(e) => handleSettingChange(integration.id, 'apiSecret', e.target.value)} placeholder="e.g., ... "/>
            </>
        );
       case 'Shiprocket':
        return (
            <>
                <InputField label="API Key" name="apiKey" value={integration.settings.apiKey || ''} onChange={(e) => handleSettingChange(integration.id, 'apiKey', e.target.value)} />
                <InputField label="API Secret" name="apiSecret" type="password" value={integration.settings.apiSecret || ''} onChange={(e) => handleSettingChange(integration.id, 'apiSecret', e.target.value)} />
            </>
        );
      case 'Mailchimp':
        return (
            <>
                <InputField label="API Key" name="apiKey" value={integration.settings.apiKey || ''} onChange={(e) => handleSettingChange(integration.id, 'apiKey', e.target.value)} />
                <InputField label="Audience ID" name="apiSecret" value={integration.settings.apiSecret || ''} onChange={(e) => handleSettingChange(integration.id, 'apiSecret', e.target.value)} />
            </>
        );
      default:
        return <p className="text-sm text-gray-500">No configurable settings.</p>
    }
  };
  
  const getIntegrationIcon = (name: string) => {
      // Placeholder for specific icons if available
      return <PlugIcon className="w-6 h-6 text-gray-400" />;
  };

  return (
    <div className="space-y-8">
      {/* Google Analytics Section */}
      <div className="bg-admin-light-card dark:bg-admin-dark-card p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <span className="p-2 bg-orange-100 rounded-full">
            <PlugIcon className="w-6 h-6 text-orange-500" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Google Analytics</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Connect your Google Analytics 4 property to track live visitors and view analytics directly on your dashboard.</p>
          </div>
        </div>
        <div className="space-y-4">
          <InputField label="GA4 Property ID (e.g., G-XXXXXXXXXX)" name="gaId" value={gaId} onChange={e => setGaId(e.target.value)} placeholder="G-XXXXXXXXXX" />
          <div className="text-right">
            <button onClick={handleSaveGaSettings} className="bg-orange-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-orange-600 transition">
              Save GA Settings
            </button>
          </div>
          <p className="text-xs text-gray-400">Note: A secure backend is required for the final OAuth connection. This is a UI simulation.</p>
        </div>
      </div>

      {/* Other Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {localIntegrations.map(integ => {
          const isExpanded = expandedIntegrationId === integ.id;
          return (
            <div key={integ.id} className="bg-admin-light-card dark:bg-admin-dark-card p-5 rounded-lg shadow-md flex flex-col transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">{getIntegrationIcon(integ.name)}</div>
                <div className="flex-grow">
                  <h3 className="font-semibold">{integ.name}</h3>
                  <p className="text-sm text-gray-500">{integ.category}</p>
                </div>
              </div>
              <div className="mt-4 flex-grow flex flex-col justify-end">
                <button
                  onClick={() => setExpandedIntegrationId(isExpanded ? null : integ.id)}
                  className={`w-full py-2 rounded-md font-semibold text-sm transition ${
                    integ.enabled
                      ? 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  {integ.enabled ? 'Manage' : 'Connect'}
                </button>
              </div>
              {/* Collapsible content */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <label htmlFor={`enable-${integ.id}`} className="text-sm font-medium">Enable {integ.name}</label>
                    <button onClick={() => handleSettingChange(integ.id, 'enabled', !integ.enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${integ.enabled ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${integ.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  {renderFields(integ)}
                  <button onClick={() => handleSave(integ.id)} className="w-full text-sm py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition-opacity">
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminIntegrationsSection;