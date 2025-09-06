
import React, { useState } from 'react';
import { ZainaColor } from '../../../types';
import InputField from '../../shared/InputField'; // Reusing InputField

type SettingsSectionType = 'roles' | 'banners' | 'coupons';

interface AdminSettingsSectionProps {
  sectionType: SettingsSectionType; // This could be passed as a prop or managed by internal tabs
}

const AdminSettingsSection: React.FC<AdminSettingsSectionProps> = ({ sectionType: initialSectionType }) => {
  const [currentSection, setCurrentSection] = useState<SettingsSectionType>(initialSectionType);

  // Example state for coupons
  const [couponCode, setCouponCode] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');

  const renderRolesManagement = () => (
    <div>
      <h3 className="text-lg font-semibold text-zaina-deep-navy mb-4">Manage Admin Roles</h3>
      <p className="text-zaina-slate-gray">Admin roles and permissions management functionality will be implemented here. (e.g., Add new admin, assign roles like 'Editor', 'Manager').</p>
      {/* Placeholder for roles table and forms */}
    </div>
  );

  const renderBannerManagement = () => (
    <div>
      <h3 className="text-lg font-semibold text-zaina-deep-navy mb-4">Manage Homepage Banners/Hero Slides</h3>
      <p className="text-zaina-slate-gray">Functionality to upload, edit, and reorder hero slides and promotional banners will be here.</p>
      {/* Placeholder for banner list and upload/edit forms */}
    </div>
  );

  const renderCouponManagement = () => (
    <div>
      <h3 className="text-lg font-semibold text-zaina-deep-navy mb-4">Manage Coupon Codes</h3>
      <form className="space-y-4 max-w-lg" onSubmit={(e) => { e.preventDefault(); alert('Coupon saved (simulated)'); }}>
        <InputField label="Coupon Code" name="couponCode" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="e.g., ZAINA20" required />
        <div className="flex gap-4">
            <InputField label="Discount Value" name="discountValue" type="number" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder={discountType === 'percentage' ? 'e.g., 20 for 20%' : 'e.g., 100 for $100 off'} required />
            <div className="flex-shrink-0">
                <label htmlFor="discountType" className="block text-sm font-medium text-zaina-deep-navy mb-1">Type</label>
                <select id="discountType" value={discountType} onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')} className="w-full px-3 py-2.5 border border-zaina-cool-gray-dark rounded-md shadow-sm focus:ring-zaina-primary focus:border-zaina-primary text-sm bg-zaina-white h-[46px]">
                    <option value="percentage">% Percentage</option>
                    <option value="fixed">$ Fixed Amount</option>
                </select>
            </div>
        </div>
         <InputField label="Expiry Date (Optional)" name="expiryDate" type="date" value={''} onChange={() => {}} />
        <button type="submit" className="bg-zaina-primary text-zaina-white font-semibold py-2 px-5 rounded-md hover:bg-zaina-secondary-blue">Create Coupon</button>
      </form>
      <p className="text-zaina-slate-gray mt-6">Existing coupons list and editing functionality will appear here.</p>
    </div>
  );
  
  const settingsTabs: {id: SettingsSectionType, label: string}[] = [
      {id: 'roles', label: 'Admin Roles'},
      {id: 'banners', label: 'Banners'},
      {id: 'coupons', label: 'Coupons'},
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold font-heading-playfair text-zaina-deep-navy mb-6">Settings</h2>
      
      <div className="mb-6 border-b border-zaina-cool-gray-medium">
          {settingsTabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setCurrentSection(tab.id)}
                className={`py-2 px-4 text-sm font-medium transition-colors ${currentSection === tab.id ? 'border-b-2 border-zaina-primary text-zaina-primary' : 'text-zaina-slate-gray hover:text-zaina-deep-navy'}`}
              >
                  {tab.label}
              </button>
          ))}
      </div>

      {currentSection === 'roles' && renderRolesManagement()}
      {currentSection === 'banners' && renderBannerManagement()}
      {currentSection === 'coupons' && renderCouponManagement()}
    </div>
  );
};

export default AdminSettingsSection;
