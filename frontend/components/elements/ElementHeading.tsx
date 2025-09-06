

import React from 'react';

interface ElementHeadingProps {
  text: string;
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  color?: string;
}

const ElementHeading: React.FC<ElementHeadingProps> = ({ text, level, color }) => {
  const Tag = level || 'h2';
  const sizeClasses = {
    h1: 'text-4xl',
    h2: 'text-3xl',
    h3: 'text-2xl',
    h4: 'text-xl',
    h5: 'text-lg',
    h6: 'text-base',
  };

  return (
    <Tag
      className={`${sizeClasses[Tag]} font-bold text-center`}
      style={{ color }}
    >
      {text}
    </Tag>
  );
};

export default ElementHeading;