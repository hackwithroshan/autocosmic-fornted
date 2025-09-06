
import React from 'react';
import { sanitizeHTML } from './utils/sanitizer';

interface RichTextSectionProps {
  html: string;
}

const RichTextSection: React.FC<RichTextSectionProps> = ({ html }) => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizeHTML(html) }}
        />
      </div>
    </section>
  );
};

export default RichTextSection;