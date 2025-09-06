
import React, { useState, useMemo } from 'react';
import { CmsPage, MediaFile } from '../../../types';
import CmsPageEditor from './CmsPageEditor';
import PlusCircleIcon from '../../icons/PlusCircleIcon';
import EditIcon from '../../icons/EditIcon';
import TrashIcon from '../../icons/TrashIcon';
import InputField from '../../shared/InputField';
import AdminCmsPagesSection from './AdminCmsPagesSection';


interface AdminCustomPagesSectionProps {
  initialPages: CmsPage[];
  onSavePage: (page: CmsPage) => void;
  onDeletePage: (pageId: string) => void;
  pageType?: 'page' | 'post';
  mediaLibrary: MediaFile[];
  onUploadMedia: (files: File[]) => void;
}

const AdminCustomPagesSection: React.FC<AdminCustomPagesSectionProps> = (props) => {
  return (
    <div className="bg-admin-light-card dark:bg-admin-dark-card p-6 md:p-8 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-admin-light-text dark:text-admin-dark-text">Custom Pages</h1>
       <p className="mt-2 text-admin-light-text-secondary dark:text-admin-dark-text-secondary mb-6">
        Manage custom informational pages like 'About Us' or 'Contact'.
      </p>
      <AdminCmsPagesSection 
        initialPages={props.initialPages}
        onSavePage={props.onSavePage}
        onDeletePage={props.onDeletePage}
        pageType="page"
        mediaLibrary={props.mediaLibrary}
        onUploadMedia={props.onUploadMedia}
      />
    </div>
  );
};

export default AdminCustomPagesSection;
