
import React, { useState } from 'react';
import { HomepageBanner, ZainaColor } from '../../../types';
import InputField from '../../shared/InputField';
import EditIcon from '../../icons/EditIcon';
import TrashIcon from '../../icons/TrashIcon';
import PlusCircleIcon from '../../icons/PlusCircleIcon';
import UploadCloudIcon from '../../icons/UploadCloudIcon';
import ListIcon from '../../icons/ListIcon'; // For reorder

interface AdminContentManagementSectionProps {
  initialBanners: HomepageBanner[];
  initialCmsContent: { aboutUs: string; footerText: string };
}

const inputFieldClasses = "w-full px-3 py-2 border border-zaina-cool-gray-dark rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-zaina-primary focus:border-zaina-primary";
const primaryButtonSmClasses = "bg-zaina-primary text-zaina-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-zaina-secondary-blue transition-colors";
const primaryButtonXsClasses = "bg-zaina-primary text-zaina-white text-xs font-semibold py-1.5 px-3 rounded-md hover:bg-zaina-secondary-blue transition-colors";
const secondaryButtonSmClasses = "bg-zaina-cool-gray-medium text-zaina-deep-navy text-sm font-semibold py-2 px-4 rounded-md hover:bg-zaina-cool-gray-dark transition-colors";


const AdminContentManagementSection: React.FC<AdminContentManagementSectionProps> = ({ initialBanners, initialCmsContent }) => {
  const [banners, setBanners] = useState<HomepageBanner[]>(initialBanners.sort((a,b) => a.order - b.order));
  const [cmsContent, setCmsContent] = useState(initialCmsContent);
  const [isEditingBanner, setIsEditingBanner] = useState<HomepageBanner | null>(null);
  const [bannerFormData, setBannerFormData] = useState<Partial<HomepageBanner>>({});

  const handleBannerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : (name === 'order' ? Number(value) : value);
    setBannerFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSaveBanner = () => {
    if (!bannerFormData.title || !bannerFormData.imageUrl || !bannerFormData.ctaLink) {
        alert("Title, Image URL, and CTA Link are required for banners.");
        return;
    }
    const newBanner: HomepageBanner = {
        id: isEditingBanner ? isEditingBanner.id : `banner${Date.now()}`,
        title: bannerFormData.title!,
        imageUrl: bannerFormData.imageUrl!,
        ctaLink: bannerFormData.ctaLink!,
        isActive: bannerFormData.isActive !== undefined ? bannerFormData.isActive : true,
        order: bannerFormData.order || (banners.length + 1)
    };
    if (isEditingBanner) {
        setBanners(prev => prev.map(b => b.id === newBanner.id ? newBanner : b).sort((a,b) => a.order - b.order));
    } else {
        setBanners(prev => [...prev, newBanner].sort((a,b) => a.order - b.order));
    }
    setIsEditingBanner(null);
    setBannerFormData({});
    alert("Banner saved (simulated).");
  };
  
  const handleDeleteBanner = (bannerId: string) => {
    if (window.confirm("Delete this banner?")) {
        setBanners(prev => prev.filter(b => b.id !== bannerId));
        alert("Banner deleted (simulated).");
    }
  };

  const handleCmsContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCmsContent(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveCmsContent = (sectionName: keyof typeof initialCmsContent) => {
    alert(`${sectionName.replace(/([A-Z])/g, ' $1')} content updated (simulated).`);
    // In real app, API call to save cmsContent[sectionName]
  };

  return (
    <div>
      <h2 className="text-xl font-semibold font-heading-playfair text-zaina-deep-navy mb-6">Content Management</h2>

      {/* Homepage Sliders/Banners */}
      <section className="mb-8 p-4 bg-zaina-cool-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-zaina-deep-navy">Homepage Sliders/Banners</h3>
          <button onClick={() => { setIsEditingBanner(null); setBannerFormData({isActive: true, order: banners.length + 1});}} className={`${primaryButtonXsClasses} flex items-center`}>
            <PlusCircleIcon className="w-4 h-4 mr-1.5" /> Add Banner
          </button>
        </div>

        {isEditingBanner !== null && (
          <div className="mb-4 p-4 border border-zaina-primary/30 rounded-md bg-zaina-sky-blue-light/30 space-y-3">
            <h4 className="font-medium text-zaina-deep-navy">{isEditingBanner ? 'Edit Banner' : 'New Banner'}</h4>
            <InputField label="Title" name="title" value={bannerFormData.title || ''} onChange={handleBannerInputChange} required />
            <InputField label="Image URL" name="imageUrl" value={bannerFormData.imageUrl || ''} onChange={handleBannerInputChange} required />
            <InputField label="CTA Link" name="ctaLink" value={bannerFormData.ctaLink || ''} onChange={handleBannerInputChange} required />
            <InputField label="Order" name="order" type="number" value={bannerFormData.order || ''} onChange={handleBannerInputChange} />
            <div className="flex items-center">
              <input type="checkbox" id="bannerIsActive" name="isActive" checked={bannerFormData.isActive} onChange={handleBannerInputChange} className="h-4 w-4 text-zaina-primary focus:ring-zaina-primary border-zaina-cool-gray-dark rounded mr-2" />
              <label htmlFor="bannerIsActive" className="text-sm text-zaina-deep-navy">Active</label>
            </div>
            <div className="flex gap-2">
                <button onClick={handleSaveBanner} className={primaryButtonSmClasses}>Save Banner</button>
                <button onClick={() => setIsEditingBanner(null)} className={secondaryButtonSmClasses}>Cancel</button>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
            {banners.map(banner => (
                <div key={banner.id} className="flex items-center justify-between p-2 border rounded-md hover:bg-zaina-sky-blue-light/20">
                    <div className="flex items-center">
                        <ListIcon className="w-5 h-5 text-zaina-slate-gray mr-2 cursor-grab" aria-label="Drag to reorder (simulated)"/>
                        <img src={banner.imageUrl} alt={banner.title} className="w-16 h-8 object-cover rounded mr-3"/>
                        <div>
                            <p className="font-medium text-zaina-deep-navy text-sm">{banner.title} <span className="text-xs text-zaina-slate-gray">(Order: {banner.order})</span></p>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{banner.isActive ? 'Active' : 'Inactive'}</span>
                        </div>
                    </div>
                    <div className="space-x-1">
                        <button onClick={() => setIsEditingBanner(banner)} className="p-1 text-zaina-secondary-blue hover:text-zaina-primary" title="Edit"><EditIcon className="w-4 h-4"/></button>
                        <button onClick={() => handleDeleteBanner(banner.id)} className="p-1 text-zaina-deep-red-accent hover:text-red-700" title="Delete"><TrashIcon className="w-4 h-4"/></button>
                    </div>
                </div>
            ))}
        </div>
        {banners.length === 0 && !isEditingBanner && <p className="text-sm text-zaina-slate-gray text-center py-4">No banners configured.</p>}
      </section>

      {/* Promo Banner Editor - Simplified */}
      <section className="mb-8 p-4 bg-zaina-cool-white rounded-lg shadow">
        <h3 className="text-lg font-semibold text-zaina-deep-navy mb-2">Promotional Banner (e.g., Top Strip)</h3>
        <textarea defaultValue="✨ Get 10% OFF on your first order — Use code ZAINA10" rows={2} className={`${inputFieldClasses} mb-2`}></textarea>
        <button onClick={() => alert("Promo banner text saved (simulated).")} className={primaryButtonSmClasses}>Save Promo Text</button>
      </section>

      {/* CMS Sections Update */}
      <section className="p-4 bg-zaina-cool-white rounded-lg shadow space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-zaina-deep-navy mb-2">About Us Page Content</h3>
          <textarea name="aboutUs" value={cmsContent.aboutUs} onChange={handleCmsContentChange} rows={5} className={`${inputFieldClasses} mb-2`}></textarea>
          <button onClick={() => handleSaveCmsContent('aboutUs')} className={primaryButtonSmClasses}>Save About Us</button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-zaina-deep-navy mb-2">Footer Text</h3>
          <textarea name="footerText" value={cmsContent.footerText} onChange={handleCmsContentChange} rows={3} className={`${inputFieldClasses} mb-2`}></textarea>
          <button onClick={() => handleSaveCmsContent('footerText')} className={primaryButtonSmClasses}>Save Footer Text</button>
        </div>
      </section>
    </div>
  );
};

export default AdminContentManagementSection;
