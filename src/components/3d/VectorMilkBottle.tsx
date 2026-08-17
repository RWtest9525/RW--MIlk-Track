import React from 'react';

// Lightweight 2D Vector Milk Bottle (Zero dependencies, instant render)
export const VectorMilkBottle: React.FC<{ fillPercentage: number; height?: number }> = ({
  fillPercentage,
  height = 140,
}) => {
  const clampedPct = Math.min(100, Math.max(5, fillPercentage));
  const milkHeight = (clampedPct / 100) * 110;
  const milkY = 160 - milkHeight;

  return (
    <div
      style={{ height: `${height}px` }}
      className="flex items-center justify-center relative w-full select-none"
    >
      <svg
        viewBox="0 0 120 190"
        className="h-full w-auto drop-shadow-md transition-transform duration-500 hover:scale-105"
      >
        <defs>
          {/* Glass Gradient */}
          <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.6" />
            <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#E0F2FE" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.5" />
          </linearGradient>

          {/* Milk Gradient */}
          <linearGradient id="milkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F1F5F9" />
          </linearGradient>

          {/* Cap Gradient */}
          <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>

          {/* Clip path inside bottle */}
          <clipPath id="bottleInside">
            <path d="M42 38 L42 55 C42 62 25 78 25 95 L25 152 C25 160 31 166 40 166 L80 166 C89 166 95 160 95 152 L95 95 C95 78 78 62 78 55 L78 38 Z" />
          </clipPath>
        </defs>

        {/* Bottle Cap */}
        <rect x="40" y="16" width="40" height="14" rx="4" fill="url(#capGrad)" />
        <rect x="38" y="27" width="44" height="4" rx="2" fill="#0284C7" />

        {/* Glass Outer Silhouette */}
        <path
          d="M42 32 L42 55 C42 62 25 78 25 95 L25 152 C25 162 31 168 40 168 L80 168 C89 168 95 162 95 152 L95 95 C95 78 78 62 78 55 L78 32 Z"
          fill="url(#glassGrad)"
          stroke="#BAE6FD"
          strokeWidth="2.5"
        />

        {/* Milk Liquid Fill Inside Clip Path */}
        <g clipPath="url(#bottleInside)">
          <rect
            x="20"
            y={milkY}
            width="80"
            height={milkHeight + 10}
            fill="url(#milkGrad)"
            className="transition-all duration-700 ease-out"
          />
          {/* Milk Surface Curve */}
          <ellipse
            cx="60"
            cy={milkY}
            rx="35"
            ry="4"
            fill="#FFFFFF"
            opacity="0.95"
            className="transition-all duration-700 ease-out"
          />
        </g>

        {/* Glass Highlights & Reflections */}
        <path
          d="M32 95 L32 150"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M88 95 L88 150"
          stroke="#BAE6FD"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    </div>
  );
};
