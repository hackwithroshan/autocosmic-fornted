import React from 'react';

interface SeoScoreIndicatorProps {
  score: number;
}

const SeoScoreIndicator: React.FC<SeoScoreIndicatorProps> = ({ score }) => {
  const circumference = 2 * Math.PI * 20; // 2 * pi * radius
  const offset = circumference - (score / 100) * circumference;

  let colorClass = 'text-red-500';
  let trackColorClass = 'text-red-200 dark:text-red-800/50';
  let label = 'Poor';
  if (score >= 80) {
    colorClass = 'text-green-500';
    trackColorClass = 'text-green-200 dark:text-green-800/50';
    label = 'Good';
  } else if (score >= 50) {
    colorClass = 'text-yellow-500';
    trackColorClass = 'text-yellow-200 dark:text-yellow-800/50';
    label = 'Okay';
  }

  return (
    <div className="flex items-center gap-4 p-3 bg-admin-light dark:bg-admin-dark rounded-lg">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full" viewBox="0 0 44 44">
          <circle
            className={`stroke-current ${trackColorClass}`}
            strokeWidth="4"
            fill="transparent"
            r="20"
            cx="22"
            cy="22"
          />
          <circle
            className={`stroke-current ${colorClass} transition-all duration-500 ease-in-out`}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            r="20"
            cx="22"
            cy="22"
            transform="rotate(-90 22 22)"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
          {score}
        </span>
      </div>
      <div>
        <p className="font-semibold">SEO Score</p>
        <p className={`text-sm font-bold ${colorClass}`}>{label}</p>
      </div>
    </div>
  );
};

export default SeoScoreIndicator;