
import React from 'react';

interface PlayCircleIconProps {
  className?: string;
}

const PlayCircleIcon: React.FC<PlayCircleIconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor" // Assuming a filled play icon
    className={className}
    aria-hidden="true"
  >
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.855 3.295A1.125 1.125 0 019 15.505V8.495c0-.796.894-1.288 1.572-.895l5.706 3.204z" clipRule="evenodd" />
  </svg>
);

export default PlayCircleIcon;
