

import React from 'react';

interface TopCategoryCardProps {
  name: string;
  imageUrl: string;
  link: string;
  onCategoryClick?: (link: string) => void;
}

const TopCategoryCard: React.FC<TopCategoryCardProps> = ({ 
  name, 
  imageUrl, 
  link,
  onCategoryClick,
}) => {
  const handleClick = () => {
    if (onCategoryClick) {
        onCategoryClick(link);
    }
  };

  return (
    <a
      href={link}
      onClick={(e) => { e.preventDefault(); handleClick(); }}
      className="block relative aspect-[4/5] rounded-lg overflow-hidden group shadow-lg"
      aria-label={`Shop ${name}`}
    >
      <img 
        src={imageUrl} 
        alt={name} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent transition-all duration-300 group-hover:from-black/70"></div>
      <div className="relative h-full flex flex-col justify-end p-4 text-white">
        <h3 className="font-heading-cormorant text-xl font-bold transition-transform duration-300 group-hover:-translate-y-1">
          {name}
        </h3>
      </div>
    </a>
  );
};

export default TopCategoryCard;