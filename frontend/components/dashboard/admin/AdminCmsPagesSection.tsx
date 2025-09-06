
import React, { useState, useMemo } from 'react';
import { CmsPage, MediaFile } from '../../../types';
import CmsPageEditor from './CmsPageEditor';
import PlusCircleIcon from '../../icons/PlusCircleIcon';
import EditIcon from '../../icons/EditIcon';
import TrashIcon from '../../icons/TrashIcon';
import InputField from '../../shared/InputField';

interface AdminCmsPagesSectionProps {
  initialPages: CmsPage[];
  onSavePage: (page: CmsPage) => void;
  onDeletePage: (pageId: string) => void;
  pageType: 'page' | 'post';
  mediaLibrary: MediaFile[];
  onUploadMedia: (files: File[]) => void;
}

const thCellClasses = "px-4 py-3 text-left text-xs font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary uppercase tracking-wider";
const tdCellClasses = "px-4 py-3 whitespace-nowrap text-sm text-admin-text dark:text-admin-dark-text";
const primaryButtonSmClasses = "bg-admin-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-admin-accent-hover transition-colors";

const AdminCmsPagesSection: React.FC<AdminCmsPagesSectionProps> = ({ initialPages, onSavePage, onDeletePage, pageType, mediaLibrary, onUploadMedia }) => {
  const [editingPage, setEditingPage] = useState<CmsPage | null | 'new'>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPages = useMemo(() =>
    initialPages.filter(page =>
            page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            page.slug.toLowerCase().includes(searchTerm.toLowerCase())
    ), [initialPages, searchTerm]);

  const handleSavePage = (pageData: CmsPage) => {
    onSavePage(pageData);
    setEditingPage(null);
  };
  
  const handleDeletePage = (page: CmsPage) => {
    if (window.confirm(`Are you sure you want to delete this ${pageType}: "${page.title}"? This action cannot be undone.`)) {
      onDeletePage(page.id);
    }
  };

  const handleAddNew = () => {
    setEditingPage('new');
  };

  const handleEdit = (page: CmsPage) => {
    setEditingPage(page);
  };
  
  if (editingPage) {
    return (
      <CmsPageEditor
        page={editingPage === 'new' ? null : editingPage}
        pageType={pageType}
        onSave={handleSavePage}
        onCancel={() => setEditingPage(null)}
        mediaLibrary={mediaLibrary}
        onUploadMedia={onUploadMedia}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <InputField
          label=""
          name="searchPages"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search by ${pageType} title or slug...`}
        />
        <button onClick={handleAddNew} className={`${primaryButtonSmClasses} flex items-center flex-shrink-0`}>
          <PlusCircleIcon className="w-4 h-4 mr-2" /> Add New {pageType}
        </button>
      </div>

      <div className="overflow-x-auto bg-admin-light-card dark:bg-admin-dark-card p-4 rounded-xl">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className={thCellClasses}>Title</th>
              <th className={thCellClasses}>URL Slug</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary uppercase tracking-wider">Last Updated</th>
              <th className={thCellClasses}>Status</th>
              <th className={thCellClasses}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredPages.map(page => (
              <tr key={page.id} className="hover:bg-admin-light dark:hover:bg-admin-dark-card-hover">
                <td className={`${tdCellClasses} font-medium`}>{page.title}</td>
                <td className={tdCellClasses}>{page.slug}</td>
                <td className={tdCellClasses}>{new Date(page.lastUpdated).toLocaleDateString()} by {page.lastUpdatedBy}</td>
                <td className={tdCellClasses}>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${page.status === 'Published' ? 'bg-green-100 dark:bg-green-800/50 text-green-800 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-800/50 text-yellow-800 dark:text-yellow-300'}`}>
                    {page.status}
                  </span>
                </td>
                <td className={`${tdCellClasses} space-x-1`}>
                  <button onClick={() => handleEdit(page)} className="text-admin-accent hover:opacity-80 p-1" title="Edit"><EditIcon className="w-4 h-4"/></button>
                  <button onClick={() => handleDeletePage(page)} className="text-red-500 hover:opacity-80 p-1" title="Delete"><TrashIcon className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredPages.length === 0 && (
        <p className="text-center py-8 text-admin-text-secondary dark:text-dark-admin-text-secondary">No {pageType}s found matching your search.</p>
      )}
    </div>
  );
};

export default AdminCmsPagesSection;
