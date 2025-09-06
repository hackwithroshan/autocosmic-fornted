
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.FC<{ className?: string }>;
  percentageChange?: string;
  changeDirection?: 'up' | 'down';
  accentColor: string; // HEX value, e.g., "#8A5CF5"
  bgColor: string; // Tailwind class name, e.g., "bg-admin-accent-light"
  vsText?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  percentageChange,
  changeDirection,
  accentColor,
  bgColor,
  vsText = "vs. last month"
}) => {
  const changeColor = changeDirection === 'up' ? 'text-admin-green' : 'text-admin-red';

  return (
    <div className="bg-admin-card dark:bg-dark-admin-card p-5 rounded-2xl shadow-admin-soft">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgColor}`} style={{ color: accentColor }}>
            <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-admin-text-secondary">{title}</p>
        <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-admin-text-primary">{value}</h3>
            {percentageChange && changeDirection && (
            <div className={`text-sm font-bold flex items-center ${changeColor}`}>
                {changeDirection === 'up' ? '↑' : '↓'} {percentageChange}
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;