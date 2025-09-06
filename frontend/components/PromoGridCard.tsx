import React from 'react';

interface PromoGridCardProps {
  tag?: string;
  title: string;
  subtitle: string;
  priceText: string;
  imageUrl: string;
  link: string;
  buttonText: string;
  align: 'left' | 'right';
}

const PromoGridCard: React.FC<PromoGridCardProps> = ({ 
    tag,
    title,
    subtitle,
    priceText,
    imageUrl,
    link,
    buttonText,
    align 
}) => {
  return (
    <div className="relative bg-zaina-neutral-light/50 dark:bg-dark-zaina-bg-card rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-300">
      <div className={`flex flex-col sm:flex-row items-center gap-4 ${align === 'right' ? 'sm:flex-row-reverse' : ''}`}>
          <div className="w-full sm:w-1/2 flex-shrink-0 self-stretch">
              <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
          </div>
          <div className="p-6 text-center sm:text-left w-full sm:w-1/2">
              {tag && <p className="text-xs font-bold text-zaina-primary uppercase tracking-wider">{tag}</p>}
              <h3 className="text-xl font-heading-cormorant font-bold text-zaina-text-primary dark:text-dark-zaina-text-primary mt-1">{title}</h3>
              <p className="text-lg font-heading-cormorant font-bold text-zaina-text-primary dark:text-dark-zaina-text-primary">{subtitle}</p>
              <p className="text-sm text-zaina-text-secondary dark:text-dark-zaina-text-secondary mt-2">{priceText}</p>
              <a href={link} className="mt-4 inline-block text-sm font-semibold text-zaina-primary dark:text-dark-zaina-primary hover:underline">
                  {buttonText} &rarr;
              </a>
          </div>
      </div>
    </div>
  );
};

export default PromoGridCard;