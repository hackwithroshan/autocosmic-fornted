

import React from 'react';

interface ElementTextProps {
  text: string;
  color?: string;
}

const ElementText: React.FC<ElementTextProps> = ({ text, color }) => {
  return (
    <p style={{ color }} className="text-center">
      {text}
    </p>
  );
};

export default ElementText;