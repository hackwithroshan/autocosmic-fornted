import React from 'react';
import { PLACEHOLDER_IMAGE_URL } from '../constants';

interface ColumnContent {
  type: 'text' | 'image';
  title?: string;
  text?: string;
  buttonText?: string;
  buttonLink?: string;
  imageUrl?: string;
  altText?: string;
}

interface TwoColumnSectionProps {
  backgroundColor?: string;
  textColor?: string;
  leftColumn: ColumnContent;
  rightColumn: ColumnContent;
  gap?: number;
  reverseOnMobile?: boolean;
}

const Column: React.FC<{ content: ColumnContent; textColor?: string }> = ({ content, textColor }) => {
  if (content.type === 'image') {
    return (
      <div className="flex items-center justify-center h-full">
        <img
          src={content.imageUrl || PLACEHOLDER_IMAGE_URL}
          alt={content.altText || content.title || 'Column image'}
          className="w-full h-full object-cover rounded-lg max-h-[450px]"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center h-full p-4 md:p-8" style={{ color: textColor }}>
      {content.title && <h2 className="text-3xl md:text-4xl font-heading-cormorant font-semibold mb-4">{content.title}</h2>}
      {content.text && <p className="mb-6 leading-relaxed text-current/80">{content.text}</p>}
      {content.buttonText && (
        <a
          href={content.buttonLink || '#'}
          className="inline-block bg-zaina-gold text-zaina-white dark:text-dark-zaina-bg-card font-body-jost font-semibold py-2.5 px-6 rounded-md hover:opacity-90 transition duration-300 transform hover:scale-105"
        >
          {content.buttonText}
        </a>
      )}
    </div>
  );
};

const TwoColumnSection: React.FC<TwoColumnSectionProps> = ({
  backgroundColor = '#FFFFFF',
  textColor = '#2C3E50',
  leftColumn,
  rightColumn,
  gap = 8,
  reverseOnMobile = false,
}) => {
  return (
    <section style={{ backgroundColor }}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 items-center`}
          style={{ gap: `${gap}px` }}
        >
          <div className={reverseOnMobile ? 'order-last md:order-first' : ''}>
            <Column content={leftColumn} textColor={textColor} />
          </div>
          <div>
            <Column content={rightColumn} textColor={textColor} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TwoColumnSection;