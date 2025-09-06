
import React from 'react';
import { FaqItem } from '../types';
import Accordion from './shared/Accordion';

interface FaqSectionProps {
  title: string;
  items: FaqItem[];
}

const FaqSection: React.FC<FaqSectionProps> = ({ title, items = [] }) => {
  return (
    <section className="py-12 md:py-16 bg-zaina-neutral-light dark:bg-dark-zaina-neutral-light">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold font-heading-cormorant text-center mb-10">
          {title}
        </h2>
        <div className="space-y-4">
          {items.map(faq => (
            <Accordion key={faq.id} identifier={faq.id} title={faq.question}>
              <p className="text-sm text-zaina-text-secondary dark:text-dark-zaina-text-secondary leading-relaxed">
                {faq.answer}
              </p>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;