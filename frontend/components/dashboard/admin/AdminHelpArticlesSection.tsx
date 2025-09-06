

import React from 'react';
import AdminCmsPagesSection from './AdminCmsPagesSection';
import { CmsPage, MediaFile } from '../../../types';

interface AdminHelpArticlesSectionProps {
    pages: CmsPage[];
    onSavePage: (page: CmsPage) => void;
    onDeletePage: (pageId: string) => void;
    mediaLibrary: MediaFile[];
    onUploadMedia: (files: File[]) => void;
}

const AdminHelpArticlesSection: React.FC<AdminHelpArticlesSectionProps> = (props) => {
  return (
    <div className="bg-admin-light-card dark:bg-admin-dark-card p-8 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-admin-light-text dark:text-admin-dark-text">Help Articles / Knowledge Base</h1>
      <p className="mt-2 text-admin-light-text-secondary dark:text-admin-dark-text-secondary mb-6">
        Create and manage help articles for your customers' self-service support.
      </p>
      {/* Re-using the CmsPageSection for a consistent UI */}
      <AdminCmsPagesSection 
        initialPages={props.pages}
        onSavePage={props.onSavePage}
        onDeletePage={props.onDeletePage}
        pageType="page"
        mediaLibrary={props.mediaLibrary}
        onUploadMedia={props.onUploadMedia}
      />
    </div>
  );
};

export default AdminHelpArticlesSection;