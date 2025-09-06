import React from 'react';
import { StatItem } from '../types';
import PackageIcon from './icons/PackageIcon';
import UsersIcon from './icons/UsersIcon';
import StarIcon from './icons/StarIcon';
import GlobeIcon from './icons/GlobeIcon';

interface StatsCounterSectionProps {
  stats: StatItem[];
  backgroundColor?: string;
  textColor?: string;
}

const iconMap: { [key: string]: React.FC<{className?: string}> } = {
  package: PackageIcon,
  smile: UsersIcon,
  award: StarIcon,
  globe: GlobeIcon
};

const StatsCounterSection: React.FC<StatsCounterSectionProps> = ({
  stats = [],
  backgroundColor = '#2C3E50',
  textColor = '#FFFFFF'
}) => {
  return (
    <section className="py-12 md:py-16" style={{ backgroundColor }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center" style={{ color: textColor }}>
          {stats.map(stat => {
            const Icon = iconMap[stat.icon] || PackageIcon;
            return (
              <div key={stat.id}>
                <Icon className="w-10 h-10 mx-auto mb-3 text-zaina-gold" />
                <p className="text-4xl font-bold">{stat.value.toLocaleString()}+</p>
                <p className="text-sm text-current/80">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsCounterSection;