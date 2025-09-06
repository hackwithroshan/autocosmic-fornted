

import React from 'react';

interface ElementButtonProps {
  text: string;
  href: string;
  backgroundColor?: string;
  textColor?: string;
}

const ElementButton: React.FC<ElementButtonProps> = ({ text, href, backgroundColor = '#4A90E2', textColor = '#FFFFFF' }) => {
  return (
    <div className="text-center">
        <a
        href={href}
        style={{ backgroundColor, color: textColor }}
        className="inline-block py-2 px-5 rounded-md font-semibold text-sm"
        >
        {text}
        </a>
    </div>
  );
};

export default ElementButton;