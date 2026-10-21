import React from "react";

type Props = { size: number; color: string; opacity?: number; rotate?: number; strokeWidth?: number; draw?: number };

/** Eight-pointed star (khatam) ornament — the series' decorative motif. */
export const IslamicStar: React.FC<Props> = ({ size, color, opacity = 1, rotate = 0, strokeWidth = 2, draw = 1 }) => {
  const sq = "M50 8 L92 50 L50 92 L8 50 Z";
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ opacity, transform: `rotate(${rotate}deg)` }}>
      <path d={sq} fill="none" stroke={color} strokeWidth={strokeWidth} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      <rect
        x={20}
        y={20}
        width={60}
        height={60}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - draw}
      />
      <circle cx={50} cy={50} r={16} fill="none" stroke={color} strokeWidth={strokeWidth} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
    </svg>
  );
};
