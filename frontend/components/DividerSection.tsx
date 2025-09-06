
import React from 'react';

interface DividerSectionProps {
  space?: number;
  showLine?: boolean;
  lineColor?: string;
}

const DividerSection: React.FC<DividerSectionProps> = ({
  space = 50,
  showLine = true,
  lineColor = '#E5E7EB'
}) => {
  return (
    <div style={{ padding: `${space / 2}px 0` }}>
      {showLine && (
        <div
          className="container mx-auto"
          style={{
            borderTop: `1px solid ${lineColor}`
          }}
        ></div>
      )}
    </div>
  );
};

export default DividerSection;