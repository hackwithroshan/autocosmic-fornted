
import React from 'react';

interface HeadingSectionProps {
  text: string;
  level: 'h1' | 'h2' | 'h3';
  align: 'left' | 'center' | 'right';
  color?: string;
}

const HeadingSection: React.FC<HeadingSectionProps> = ({
  text,
  level,
  align,
  color = '#000000',
}) => {
  const Tag = level;
  const textSize = {
    h1: 'text-4xl md:text-5xl',
    h2: 'text-3xl md:text-4xl',
    h3: 'text-2xl md:text-3xl',
  }[level];

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <Tag
          className={`font-bold font-heading-playfair ${textSize}`}
          style={{ color, textAlign: align }}
        >
          {text}
        </Tag>
      </div>
    </section>
  );
};

export default HeadingSection;