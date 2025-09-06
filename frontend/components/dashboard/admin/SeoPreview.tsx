import React from 'react';

interface SeoPreviewProps {
  title: string;
  slug: string;
  description: string;
}

const SeoPreview: React.FC<SeoPreviewProps> = ({ title, slug, description }) => {
  const siteUrl = 'https://zaina-collection.com/products/';
  
  // Truncate for realistic preview
  const truncatedTitle = title.length > 60 ? `${title.substring(0, 57)}...` : title;
  const truncatedDesc = description.length > 160 ? `${description.substring(0, 157)}...` : description;

  return (
    <div>
        <h4 className="text-sm font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary mb-2">Search Engine Preview</h4>
        <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-admin-dark">
            <div>
                <span className="text-sm text-gray-800 dark:text-gray-200">{siteUrl}{slug}</span>
                <h3 className="text-lg text-blue-800 dark:text-blue-400 group-hover:underline truncate">{truncatedTitle}</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {truncatedDesc}
            </p>
        </div>
    </div>
  );
};

export default SeoPreview;