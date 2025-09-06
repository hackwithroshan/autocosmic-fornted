
import React from 'react';
import AdminCmsPagesSection from './AdminCmsPagesSection';
import { CmsPage, MediaFile } from '../../../types';

interface AdminBlogSectionProps {
    pages: CmsPage[];
    onSavePage: (page: CmsPage) => void;
    onDeletePage: (pageId: string) => void;
    mediaLibrary: MediaFile[];
    onUploadMedia: (files: File[]) => void;
}

const AdminBlogSection: React.FC<AdminBlogSectionProps> = (props) => {
  return (
    <div className="bg-admin-light-card dark:bg-admin-dark-card p-6 md:p-8 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-admin-light-text dark:text-admin-dark-text">Blog Manager</h1>
      <p className="mt-2 text-admin-light-text-secondary dark:text-admin-dark-text-secondary mb-6">
        Create, edit, and manage your blog posts here.
      </p>
      {/* Re-using the CmsPageSection for a consistent blog management UI */}
      <AdminCmsPagesSection 
        initialPages={props.pages}
        onSavePage={props.onSavePage}
        onDeletePage={props.onDeletePage}
        pageType="post"
        mediaLibrary={props.mediaLibrary}
        onUploadMedia={props.onUploadMedia}
      />
    </div>
  );
};

export default AdminBlogSection;
