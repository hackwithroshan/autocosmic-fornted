import React, { useState, useEffect } from 'react';
import { SiteSettingsBundle } from '../../../types';
import InputField from '../../shared/InputField';

interface AdminPoliciesSectionProps {
  siteSettings: SiteSettingsBundle & { [key: string]: any };
  onSaveSiteSettings: (settings: SiteSettingsBundle) => Promise<boolean>;
}

const AdminPoliciesSection: React.FC<AdminPoliciesSectionProps> = ({ siteSettings, onSaveSiteSettings }) => {
  const [deliveryReturns, setDeliveryReturns] = useState('');
  const [productDeclaration, setProductDeclaration] = useState('');
  const [helpContact, setHelpContact] = useState('');
  const [sizeGuide, setSizeGuide] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDeliveryReturns(siteSettings.deliveryReturnsHtml || '');
    setProductDeclaration(siteSettings.productDeclarationHtml || '');
    setHelpContact(siteSettings.helpContactHtml || '');
    setSizeGuide(siteSettings.sizeGuideHtml || '');
  }, [siteSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    const updatedSettings: any = {
      ...siteSettings,
      deliveryReturnsHtml: deliveryReturns,
      productDeclarationHtml: productDeclaration,
      helpContactHtml: helpContact,
      sizeGuideHtml: sizeGuide,
    };
    await onSaveSiteSettings(updatedSettings as SiteSettingsBundle);
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold font-heading-playfair text-admin-text dark:text-admin-dark-text">Product Page Policies</h2>
        <p className="mt-1 text-sm text-admin-text-secondary dark:text-dark-admin-text-secondary">
          Manage the content shown in the accordions on the product detail page. HTML is supported.
        </p>
      </div>
      
      <div className="space-y-4">
        <InputField
          label="🚚 Delivery & Returns Content"
          as="textarea"
          rows={8}
          name="deliveryReturns"
          value={deliveryReturns}
          onChange={(e) => setDeliveryReturns(e.target.value)}
        />
        <InputField
          label="📄 Product Declaration Content"
          as="textarea"
          rows={5}
          name="productDeclaration"
          value={productDeclaration}
          onChange={(e) => setProductDeclaration(e.target.value)}
        />
        <InputField
          label="❓ Help & Contact Content"
          as="textarea"
          rows={5}
          name="helpContact"
          value={helpContact}
          onChange={(e) => setHelpContact(e.target.value)}
        />
         <InputField
          label="📏 Size Guide Content (for Modal)"
          as="textarea"
          rows={10}
          name="sizeGuide"
          value={sizeGuide}
          onChange={(e) => setSizeGuide(e.target.value)}
          helperText="This content appears in the 'Size Guide' pop-up modal."
        />
      </div>

      <div className="text-right">
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-admin-accent text-white font-semibold py-2 px-6 rounded-lg hover:bg-admin-accent-hover transition disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Policies'}
        </button>
      </div>
    </div>
  );
};

export default AdminPoliciesSection;
