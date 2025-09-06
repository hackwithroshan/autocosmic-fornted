import React from 'react';
import { ZainaColor } from '../../types';

interface TrustBadgeProps {
  Icon: React.FC<{ className?: string }>;
  text: string;
  iconColor?: string; 
}

const TrustBadge: React.FC<TrustBadgeProps> = ({ Icon, text, iconColor = `text-zaina-primary` }) => {
  return (
    <div className="flex items-center text-sm text-zaina-slate-gray">
      <Icon className={`w-5 h-5 mr-2 ${iconColor} flex-shrink-0`} />
      <span>{text}</span>
    </div>
  );
};

export default TrustBadge;
