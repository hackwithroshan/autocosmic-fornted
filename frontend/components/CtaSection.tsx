
import React from 'react';

interface CtaSectionProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor?: string;
  textColor?: string;
}

const CtaSection: React.FC<CtaSectionProps> = ({
  title,
  subtitle,
  buttonText,
  buttonLink,
  backgroundColor = '#4A90E2',
  textColor = '#FFFFFF'
}) => {
  return (
    <section className="py-12 md:py-16" style={{ backgroundColor }}>
      <div className="container mx-auto px-4 text-center" style={{ color: textColor }}>
        <h2 className="text-3xl md:text-4xl font-bold font-heading-cormorant mb-3">
          {title}
        </h2>
        <p className="max-w-2xl mx-auto mb-6 text-current/90">
          {subtitle}
        </p>
        <a
          href={buttonLink}
          className="inline-block bg-white text-black font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition transform hover:scale-105"
        >
          {buttonText}
        </a>
      </div>
    </section>
  );
};

export default CtaSection;