
import React, { useState, useEffect, useRef } from 'react';
import { CmsPage, MediaFile } from '../../../types';
import InputField from '../../shared/InputField';
import BoldIcon from '../../icons/BoldIcon';
import ItalicIcon from '../../icons/ItalicIcon';
import LinkIcon from '../../icons/LinkIcon';
import ListIcon from '../../icons/ListIcon';
import MediaManagerModal from './MediaManagerModal';

interface CmsPageEditorProps {
  page: CmsPage | null; // null for a new page
  pageType: 'page' | 'post';
  onSave: (pageData: CmsPage) => void;
  onCancel: () => void;
  mediaLibrary: MediaFile[];
  onUploadMedia: (files: File[]) => void;
}

const generateSlug = (title: string) => 
  title
    .toLowerCase()
    .trim()
    .replace(/<[^>]*>?/gm, '') // remove html tags
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

const CmsPageEditor: React.FC<CmsPageEditorProps> = ({ page, pageType, onSave, onCancel, mediaLibrary, onUploadMedia }) => {
  const [formData, setFormData] = useState<Partial<CmsPage>>({});
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaModalTarget, setMediaModalTarget] = useState<'content' | 'featured' | null>(null);

  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (page) {
      setFormData(page);
      setIsSlugManuallyEdited(true);
    } else {
        setFormData({
            type: pageType,
            title: '',
            slug: '',
            content: '',
            metaTitle: '',
            metaDescription: '',
            status: 'Draft',
            featuredImageUrl: '',
        });
        setIsSlugManuallyEdited(false);
    }
  }, [page, pageType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newFormData = { ...prev, [name]: value };
      
      if (name === 'title' && !isSlugManuallyEdited) {
        newFormData.slug = generateSlug(value);
      }
      return newFormData;
    });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true);
    setFormData(prev => ({...prev, slug: generateSlug(e.target.value)}));
  };

  const handleStatusToggle = () => {
    setFormData(prev => ({ ...prev, status: prev.status === 'Published' ? 'Draft' : 'Published' }));
  };
  
  const handleSelectFromMedia = (selectedUrls: string[]) => {
    if (selectedUrls.length > 0) {
      const firstUrl = selectedUrls[0];
      if (mediaModalTarget === 'featured') {
        setFormData(prev => ({ ...prev, featuredImageUrl: firstUrl }));
      } else if (mediaModalTarget === 'content' && contentRef.current) {
        const imageMarkdown = `\n<img src="${firstUrl}" alt="" style="max-width:100%;height:auto;border-radius:8px;margin-top:1rem;margin-bottom:1rem;" />\n`;
        const { selectionStart, selectionEnd } = contentRef.current;
        const currentContent = formData.content || '';
        const newContent = currentContent.slice(0, selectionStart) + imageMarkdown + currentContent.slice(selectionEnd);
        setFormData(prev => ({ ...prev, content: newContent }));
      }
    }
    setIsMediaModalOpen(false);
    setMediaModalTarget(null);
  };

  const handleSaveClick = () => {
    if (!formData.title) {
        alert("Page Title is required.");
        return;
    }
    const finalPageData: CmsPage = {
        id: page?.id || `page_${Date.now()}`,
        type: formData.type || pageType,
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        content: formData.content || '',
        metaTitle: formData.metaTitle || '',
        metaDescription: formData.metaDescription || '',
        status: formData.status || 'Draft',
        featuredImageUrl: formData.featuredImageUrl,
        lastUpdated: new Date().toISOString(),
        lastUpdatedBy: 'R. K.', // Mocked admin name
    };
    onSave(finalPageData);
  };

  const FakeWysiwygToolbar = () => (
    <div className="flex items-center p-2 border border-b-0 border-gray-300 dark:border-gray-600 rounded-t-md bg-gray-50 dark:bg-gray-800/50 space-x-1">
      <button type="button" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><BoldIcon className="w-4 h-4"/></button>
      <button type="button" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><ItalicIcon className="w-4 h-4"/></button>
      <button type="button" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><LinkIcon className="w-4 h-4"/></button>
      <button type="button" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><ListIcon className="w-4 h-4"/></button>
      <button type="button" onClick={() => { setMediaModalTarget('content'); setIsMediaModalOpen(true); }} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm font-semibold ml-auto">Insert Image</button>
    </div>
  );

  return (
    <>
      <div className="relative pb-24">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold font-heading-playfair text-admin-text-primary dark:text-dark-zaina-text-primary capitalize">
            {page ? `Edit ${pageType}` : `Create New ${pageType}`}
          </h2>
          <button onClick={onCancel} className="text-sm text-admin-accent hover:underline">&larr; Back to List</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <InputField label={`${pageType.charAt(0).toUpperCase() + pageType.slice(1)} Title`} name="title" value={formData.title || ''} onChange={handleInputChange} placeholder={`e.g., About Our Brand`} required />
            <div>
              <label className="block text-sm font-medium text-admin-text dark:text-admin-dark-text mb-1.5">Content</label>
              <FakeWysiwygToolbar />
              <textarea
                ref={contentRef}
                name="content"
                value={formData.content || ''}
                onChange={handleInputChange}
                rows={15}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-b-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-admin-accent focus:border-admin-accent bg-admin-light-card dark:bg-admin-dark-card"
                placeholder="Start writing your page content here... Supports HTML."
              ></textarea>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-admin-card dark:bg-dark-admin-card p-4 rounded-lg shadow-admin-soft">
              <h3 className="text-base font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Publish Settings</h3>
              <InputField label="URL Slug" name="slug" value={formData.slug || ''} onChange={handleSlugChange} required helperText="Auto-generated from title. Edit carefully." />
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-medium text-admin-text dark:text-admin-dark-text">{formData.status}</span>
                <button type="button" onClick={handleStatusToggle} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${formData.status === 'Published' ? 'bg-admin-accent' : 'bg-gray-300'}`}>
                  <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${formData.status === 'Published' ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              {formData.lastUpdated && <p className="text-xs text-admin-text-secondary dark:text-dark-admin-text-secondary mt-3">Last updated by {formData.lastUpdatedBy} on {new Date(formData.lastUpdated).toLocaleDateString()}</p>}
            </div>
            
            {pageType === 'post' && (
              <div className="bg-admin-card dark:bg-dark-admin-card p-4 rounded-lg shadow-admin-soft">
                <h3 className="text-base font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Featured Image</h3>
                {formData.featuredImageUrl && <img src={formData.featuredImageUrl} alt="Featured" className="w-full h-auto rounded-md mb-2"/>}
                <button type="button" onClick={() => { setMediaModalTarget('featured'); setIsMediaModalOpen(true); }} className="w-full text-sm py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
                  {formData.featuredImageUrl ? 'Change Image' : 'Set Featured Image'}
                </button>
              </div>
            )}

            <div className="bg-admin-card dark:bg-dark-admin-card p-4 rounded-lg shadow-admin-soft">
              <h3 className="text-base font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">SEO Settings</h3>
              <InputField label="Meta Title" name="metaTitle" value={formData.metaTitle || ''} onChange={handleInputChange} placeholder="Title for search engines" />
              <div className="mt-4">
                <label className="block text-sm font-medium text-admin-text dark:text-admin-dark-text mb-1.5">Meta Description</label>
                <textarea name="metaDescription" value={formData.metaDescription || ''} onChange={handleInputChange} rows={4} className="w-full p-2 border rounded-md dark:bg-admin-dark border-gray-300 dark:border-gray-600 text-sm"></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white/80 dark:bg-admin-dark-card/80 backdrop-blur-sm p-4 border-t border-gray-200 dark:border-gray-700 shadow-top-strong flex justify-end items-center gap-4 z-40">
          <button type="button" onClick={onCancel} className="text-sm font-semibold text-admin-text dark:text-admin-dark-text hover:underline">Cancel</button>
          <button type="button" onClick={handleSaveClick} className="bg-admin-accent text-white font-semibold py-2 px-6 rounded-lg hover:bg-admin-accent-hover transition">
            Save {formData.status}
          </button>
        </div>
      </div>
      <MediaManagerModal 
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        mediaLibrary={mediaLibrary}
        onSelect={handleSelectFromMedia}
        onUpload={onUploadMedia}
      />
    </>
  );
};

export default CmsPageEditor;
