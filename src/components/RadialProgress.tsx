import React from 'react';

interface RadialProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export const RadialProgress: React.FC<RadialProgressProps> = ({ value, size = 64, strokeWidth = 8, color = '#4f46e5' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize={size * 0.28}
        fill={color}
        fontWeight="bold"
      >
        {Math.round(value)}%
      </text>
    </svg>
  );
};
