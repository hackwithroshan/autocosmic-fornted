
import React from 'react';

interface BusinessIllustrationProps {
  className?: string;
}

const BusinessIllustration: React.FC<BusinessIllustrationProps> = ({ className }) => {
  const gradientId = "illustrationGradient";
  return (
    <svg 
        viewBox="0 0 350 200" 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        aria-labelledby="illustrationTitle"
        role="img"
    >
        <title id="illustrationTitle">Business process and ideas illustration</title>
        <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#F87A7D', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#7873f5', stopOpacity: 1 }} />
            </linearGradient>
            <style>{`
              .base-stroke { stroke: #CBD5E1; stroke-width:1; fill: none; }
              .grad-stroke { stroke: url(#${gradientId}); stroke-width:1.5; fill: none; }
              .grad-fill { fill: url(#${gradientId}); opacity: 0.1; }
              .icon-fill { fill: #CBD5E1; }
            `}</style>
        </defs>
        
        {/* Main basket/keyboard element */}
        <rect x="120" y="80" width="100" height="40" rx="5" className="base-stroke" fill="#FFF" />
        <path d="M120 85 h100" className="base-stroke" />
        <path d="M125,90 h10 M140,90 h10 M155,90 h10 M170,90 h10 M185,90 h10" stroke="#E5E7EB" strokeWidth="1" />
        <path d="M130,95 h10 M145,95 h10 M160,95 h10 M175,95 h10" stroke="#E5E7EB" strokeWidth="1" />
        <path d="M125,100 h10 M140,100 h10 M155,100 h10 M170,100 h10 M185,100 h10" stroke="#E5E7EB" strokeWidth="1" />

        {/* Hands */}
        <path d="M130 110 q -5 10, 0 20 q 5 0, 10 -5 v -10 Z" className="grad-stroke" fill="white"/>
        <path d="M142 110 q 0 10, 5 15 q 5 -5, 5 -15 Z" className="grad-stroke" fill="white"/>
        <path d="M180 110 q 5 10, 0 20 q -5 0, -10 -5 v -10 Z" className="grad-stroke" fill="white"/>
        <path d="M168 110 q 0 10, -5 15 q -5 -5, -5 -15 Z" className="grad-stroke" fill="white"/>

        {/* Lightbulb Idea */}
        <g transform="translate(60, 50)">
            <path d="M0 20 a 10 10 0 1 1 20 0 a 12 12 0 0 1 -20 0" className="grad-stroke" />
            <path d="M6 20 h8 v5 h-8 Z" className="grad-stroke" />
            <path d="M2 10 l5 -5 M18 10 l-5 -5" className="grad-stroke" />
        </g>

        {/* Target */}
        <g transform="translate(250, 60)">
            <circle cx="15" cy="15" r="20" className="base-stroke" />
            <circle cx="15" cy="15" r="12" className="grad-stroke" />
            <circle cx="15" cy="15" r="4" fill={`url(#${gradientId})`} />
             <path d="M-5 5 l10 10 m0 -10 l-10 10" stroke="#E5E7EB" strokeWidth="1" transform="translate(25, -25)"/>
        </g>
        
        {/* Paper Plane */}
        <path d="M220 30 l 15 15 l -30 -5 Z" fill={`url(#${gradientId})`} opacity="0.8"/>
        <path d="M220,30 l-5, 20 l-10 -15 Z" fill={`url(#${gradientId})`} opacity="0.5"/>

        {/* Dollar Symbol */}
        <g transform="translate(40, 130)">
          <circle cx="15" cy="15" r="15" className="base-stroke"/>
          <text x="10" y="20" fontSize="14" fontWeight="bold" fill="#9CA3AF">$</text>
        </g>
        <path d="M40 145 q 10 10, 20 0" className="base-stroke" strokeDasharray="2 2" />

        {/* Documents */}
        <g transform="translate(80, 150)">
            <rect x="0" y="0" width="30" height="40" rx="3" className="base-stroke"/>
            <path d="M5 8 h20 M5 14 h20 M5 20 h10" stroke="#E5E7EB"/>
        </g>
         <g transform="translate(210, 140)">
            <rect x="0" y="0" width="30" height="40" rx="3" className="grad-stroke"/>
            <path d="M5 8 h20 M5 14 h20 M5 20 h10" stroke={`url(#${gradientId})`} strokeOpacity="0.5"/>
        </g>

         {/* Connection dots */}
        <circle cx="100" cy="80" r="2" fill={`url(#${gradientId})`} />
        <path d="M102 80 h18" className="base-stroke" strokeDasharray="2 2"/>
        <circle cx="240" cy="80" r="2" fill={`url(#${gradientId})`} />
        <path d="M222 80 h18" className="base-stroke" strokeDasharray="2 2"/>
    </svg>
  );
}

export default BusinessIllustration;
