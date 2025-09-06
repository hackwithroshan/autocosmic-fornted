
import React from 'react';
import { CategoryGridItem } from '../types';

interface CategoryGridCardProps {
  supertitle?: string;
  title?: string;
  subtitle?: string;
  callToAction?: string;
  imageUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  link?: string;
  gridSpan?: number;
}

const CategoryGridCard: React.FC<CategoryGridCardProps> = ({
  supertitle,
  title,
  subtitle,
  callToAction,
  imageUrl,
  backgroundColor = '#cccccc',
  textColor = 'text-black',
  link = '#',
  gridSpan = 1
}) => {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden p-6 md:p-8 flex flex-col justify-between min-h-[250px] group ${gridSpan === 2 ? 'lg:col-span-2' : ''}`}
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="relative z-10">
        <p className={`font-medium ${textColor}`}>{supertitle}</p>
        <h3 className={`text-2xl md:text-3xl font-bold mt-1 ${textColor} uppercase`}>{title}</h3>
        <h4 className={`text-2xl md:text-3xl font-bold ${textColor} opacity-40 uppercase`}>{subtitle}</h4>
        <a href={link} className="mt-4 inline-block bg-white text-black text-sm font-semibold py-2 px-5 rounded-lg hover:opacity-90 transition-opacity">
          {callToAction}
        </a>
      </div>
      {imageUrl && <img src={imageUrl} alt={title} className="absolute right-0 bottom-0 h-4/5 w-auto max-w-[80%] object-contain z-0 transform group-hover:scale-105 transition-transform duration-300" />}
    </div>
  );
};

export default CategoryGridCard;
