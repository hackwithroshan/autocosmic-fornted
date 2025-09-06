

import React from 'react';

interface ElementImageProps {
  src: string;
  alt: string;
}

const ElementImage: React.FC<ElementImageProps> = ({ src, alt }) => {
  return (
    <img src={src} alt={alt} className="max-w-full h-auto mx-auto rounded-md" />
  );
};

export default ElementImage;