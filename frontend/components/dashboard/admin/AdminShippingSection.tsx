

import React, { useState, useEffect } from 'react';
import { ShippingZone, ShippingRate, ShippingProvider } from '../../../types';
import InputField from '../../shared/InputField';
import TagInput from '../../shared/TagInput';
import Modal from '../../shared/Modal';
import PlusCircleIcon from '../../icons/PlusCircleIcon';
import EditIcon from '../../icons/EditIcon';
import TrashIcon from '../../icons/TrashIcon';

interface AdminShippingSectionProps {
    shippingZones: ShippingZone[];
    shippingProviders: ShippingProvider[];
    onSaveZone: (zone: ShippingZone) => Promise<boolean>;
    onSaveProvider: (provider: ShippingProvider) => Promise<boolean>;
}

const AdminShippingSection: React.FC<AdminShippingSectionProps> = ({ shippingZones, shippingProviders, onSaveZone, onSaveProvider }) => {
    const [activeTab, setActiveTab] = useState<'zones' | 'integrations'>('zones');
    
    // State for Zone Form/Modal
    const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
    const [editingZone, setEditingZone] = useState<Partial<ShippingZone> | null>(null);

    // State for Rate Form/Modal
    const [isRateModalOpen, setIsRateModalOpen] = useState(false);
    const [editingRate, setEditingRate] = useState<Partial<ShippingRate> | null>(null);
    const [currentZoneId, setCurrentZoneId] = useState<string | null>(null);

    // State for Provider Form
    const [providerApiKeys, setProviderApiKeys] = useState<Record<string, string>>({});

    const handleOpenZoneModal = (zone?: ShippingZone) => {
        setEditingZone(zone || { id: `zone_${Date.now()}`, name: '', countries: [], states: [], postcodes: [], rates: [] });
        setIsZoneModalOpen(true);
    };

    const handleSaveZone = async () => {
        if (editingZone && editingZone.name) {
            const success = await onSaveZone(editingZone as ShippingZone);
            if (success) {
                setIsZoneModalOpen(false);
                setEditingZone(null);
            } else {
                alert('Failed to save shipping zone.');
            }
        }
    };

    const handleSaveProvider = async (provider: ShippingProvider) => {
        const updatedProvider = {
            ...provider,
            apiKey: providerApiKeys[provider.id] || provider.apiKey,
        };
        const success = await onSaveProvider(updatedProvider);
        if(success) alert(`Settings for ${provider.name} saved!`);
        else alert(`Failed to save settings for ${provider.name}.`);
    }

    return (
        <div className="bg-admin-light-card dark:bg-admin-dark-card p-6 md:p-8 rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold text-admin-light-text dark:text-admin-dark-text">Shipping & Delivery</h1>
            <p className="mt-2 text-admin-light-text-secondary dark:text-admin-dark-text-secondary mb-6">
                Configure shipping zones, rates, and integrations with carriers like Shiprocket.
            </p>
            
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-6">
                    <button onClick={() => setActiveTab('zones')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'zones' ? 'border-admin-accent text-admin-accent' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Shipping Zones
                    </button>
                    <button onClick={() => setActiveTab('integrations')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'integrations' ? 'border-admin-accent text-admin-accent' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Integrations
                    </button>
                </nav>
            </div>

            {activeTab === 'zones' && (
                <div>
                    <div className="flex justify-end mb-4">
                        <button onClick={() => handleOpenZoneModal()} className="bg-admin-accent text-white font-semibold py-2 px-4 rounded-lg flex items-center">
                            <PlusCircleIcon className="w-5 h-5 mr-2"/> Add Shipping Zone
                        </button>
                    </div>
                    <div className="space-y-4">
                        {shippingZones.map(zone => (
                            <div key={zone.id} className="p-4 border dark:border-gray-700 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-lg">{zone.name}</h3>
                                    <div>
                                        <button onClick={() => handleOpenZoneModal(zone)} className="p-1 text-blue-500"><EditIcon className="w-4 h-4"/></button>
                                        <button className="p-1 text-red-500"><TrashIcon className="w-4 h-4"/></button>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500">
                                    {zone.countries.length > 0 && <p>Countries: {zone.countries.join(', ')}</p>}
                                    {zone.states.length > 0 && <p>States: {zone.states.join(', ')}</p>}
                                </div>
                                {/* Rates section would go here */}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {activeTab === 'integrations' && (
                 <div>
                    <h3 className="font-semibold text-lg mb-3">Shipping Providers</h3>
                    <div className="space-y-4">
                        {shippingProviders.map(provider => (
                            <div key={provider.id} className="p-4 border rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{provider.name}</p>
                                    <InputField 
                                        label="API Key" 
                                        name={`apiKey-${provider.id}`} 
                                        value={providerApiKeys[provider.id] || provider.apiKey || ''}
                                        onChange={(e) => setProviderApiKeys(p => ({...p, [provider.id]: e.target.value}))}
                                        className="mt-2"
                                    />
                                </div>
                                <button onClick={() => handleSaveProvider(provider)} className="bg-admin-accent text-white py-2 px-4 rounded-lg">Save</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <Modal isOpen={isZoneModalOpen} onClose={() => setIsZoneModalOpen(false)} title={editingZone?.id?.startsWith('zone_') ? "Add Shipping Zone" : "Edit Shipping Zone"}>
                <div className="space-y-4">
                    <InputField 
                        label="Zone Name" 
                        name="name" 
                        value={editingZone?.name || ''}
                        onChange={e => setEditingZone(p => ({...p, name: e.target.value}))}
                    />
                    <TagInput label="Countries" tags={editingZone?.countries || []} setTags={tags => setEditingZone(p => ({...p, countries: tags}))} placeholder="Add country code (e.g., IN)"/>
                    <TagInput label="States" tags={editingZone?.states || []} setTags={tags => setEditingZone(p => ({...p, states: tags}))} placeholder="Add state name"/>
                    <TagInput label="Postcodes" tags={editingZone?.postcodes || []} setTags={tags => setEditingZone(p => ({...p, postcodes: tags}))} placeholder="Add postcodes"/>
                     <div className="flex justify-end gap-3 pt-3">
                        <button onClick={() => setIsZoneModalOpen(false)} className="bg-gray-200 px-4 py-2 rounded-lg">Cancel</button>
                        <button onClick={handleSaveZone} className="bg-admin-accent text-white px-4 py-2 rounded-lg">Save Zone</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminShippingSection;
