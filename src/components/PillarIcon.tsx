import React from "react";
import { PillarId } from "../series/umroh-first-timer/pillars";
import { colors } from "../styles/theme";

type Props = { id: PillarId; size: number; color?: string; accent?: string };

/** Line icons for the five rukun. 100 × 100 artboard, shared across the series. */
export const PillarIcon: React.FC<Props> = ({ id, size, color = colors.navy, accent = colors.gold }) => {
  const s = { stroke: color, strokeWidth: 6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {id === "ihram" ? (
        <g>
          <circle cx={50} cy={24} r={11} {...s} />
          <path d="M28 88 L32 48 Q50 38 68 48 L72 88 Z" {...s} fill={colors.white} />
          <path d="M34 50 L66 80" {...s} stroke={accent} />
        </g>
      ) : null}
      {id === "tawaf" ? (
        <g>
          <rect x={38} y={38} width={24} height={24} fill={color} />
          <rect x={38} y={44} width={24} height={4} fill={accent} />
          {/* counterclockwise arrow: from the right side going up and around */}
          <path d="M86 50 A36 36 0 1 0 74 77" {...s} stroke={accent} />
          <path d="M75 76 L71 89 M75 76 L62 78" {...s} stroke={accent} />
        </g>
      ) : null}
      {id === "sai" ? (
        <g>
          <path d="M6 78 L20 56 L34 78 Z" fill={color} />
          <path d="M66 78 L80 56 L94 78 Z" fill={color} />
          <path d="M28 40 L72 40 M64 32 L72 40 L64 48" {...s} stroke={accent} />
          <path d="M72 56 L28 56 M36 48 L28 56 L36 64" {...s} />
        </g>
      ) : null}
      {id === "tahallul" ? (
        <g>
          <circle cx={26} cy={74} r={11} {...s} />
          <circle cx={74} cy={74} r={11} {...s} />
          <path d="M33 66 L70 16 M67 66 L30 16" {...s} />
          <circle cx={50} cy={42} r={3.5} fill={accent} />
        </g>
      ) : null}
      {id === "tertib" ? (
        <g>
          {[24, 50, 76].map((y, i) => (
            <g key={y}>
              <circle cx={20} cy={y} r={9} fill={i === 2 ? accent : color} />
              <path d={`M38 ${y} L86 ${y}`} {...s} />
            </g>
          ))}
        </g>
      ) : null}
    </svg>
  );
};
