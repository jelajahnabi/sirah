import React from "react";
import { colors, fonts } from "../styles/theme";

type Props = {
  width: number;
  /** Legs (lintasan) walked, 0..7 (fractional while walking). */
  legs: number;
  /** 0..1 reveal of the corridor. */
  build?: number;
  /** 0..1 emphasis on the first round trip (legs 1 + 2). */
  roundTripHighlight?: number;
  /** 0..1 emphasis on the finish at Marwah. */
  finish?: number;
};

const VB_W = 900;
const VB_H = 1000;
const SAFA_X = 175;
const MARWAH_X = 725;
const ROW0 = 190;
const ROW_GAP = 112;
const rowY = (i: number) => ROW0 + i * ROW_GAP;

/** Leg i (0-based): even legs go Safa → Marwah, odd legs Marwah → Safa. Leg 7 ends at Marwah. */
const legEnds = (i: number) => (i % 2 === 0 ? [SAFA_X, MARWAH_X] : [MARWAH_X, SAFA_X]);

const walkerPos = (legs: number) => {
  const i = Math.min(6, Math.floor(legs));
  const t = legs >= 7 ? 1 : legs - i;
  const [a, b] = legEnds(i);
  return { x: a + (b - a) * t, y: rowY(i), dir: b > a ? 1 : -1 };
};

/**
 * Schematic Sa'i diagram: each horizontal row is one lintasan between Safa (left) and
 * Marwah (right). Odd legs (1, 3, 5, 7) go Safa → Marwah; even legs come back.
 * Seven legs therefore start at Safa and finish at Marwah, and a round trip counts as two.
 */
export const SaiRouteAnimation: React.FC<Props> = ({ width, legs, build = 1, roundTripHighlight = 0, finish = 0 }) => {
  const walker = walkerPos(legs);
  const height = (width * VB_H) / VB_W;

  const Hill: React.FC<{ x: number; name: string; glow: number }> = ({ x, name, glow }) => (
    <g opacity={build}>
      <rect x={x - 70} y={70} width={140} height={830} rx={70} fill={colors.ivoryDeep} />
      <rect
        x={x - 70}
        y={70}
        width={140}
        height={830}
        rx={70}
        fill="none"
        stroke={colors.gold}
        strokeWidth={6}
        opacity={glow}
      />
      {/* rocky hill glyph */}
      <path d={`M${x - 46} 140 L${x - 18} 96 L${x} 116 L${x + 22} 84 L${x + 48} 140 Z`} fill={colors.navy} opacity={0.85} />
      <text x={x} y={58} textAnchor="middle" fontFamily={fonts.display} fontWeight={900} fontSize={42} fill={colors.navy}>
        {name}
      </text>
    </g>
  );

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width={width} height={height} style={{ overflow: "visible" }}>
      {/* first round trip highlight */}
      <rect
        x={SAFA_X - 60}
        y={rowY(0) - 48}
        width={MARWAH_X - SAFA_X + 120}
        height={ROW_GAP + 96}
        rx={48}
        fill={colors.gold}
        opacity={0.16 * roundTripHighlight}
      />

      <Hill x={SAFA_X} name="SAFA" glow={legs < 0.4 ? build : 0} />
      <Hill x={MARWAH_X} name="MARWAH" glow={finish} />

      {/* turn connectors */}
      {new Array(6).fill(0).map((_, i) => {
        const x = i % 2 === 0 ? MARWAH_X : SAFA_X;
        const done = legs >= i + 1;
        return (
          <path
            key={`t${i}`}
            d={`M${x} ${rowY(i)} L${x} ${rowY(i + 1)}`}
            stroke={done ? colors.gold : colors.navy}
            strokeWidth={4}
            strokeDasharray="4 8"
            strokeLinecap="round"
            opacity={(done ? 0.9 : 0.15) * build}
          />
        );
      })}

      {/* legs */}
      {new Array(7).fill(0).map((_, i) => {
        const [a, b] = legEnds(i);
        const y = rowY(i);
        const t = Math.max(0, Math.min(1, legs - i));
        const dir = b > a ? 1 : -1;
        const tipX = a + (b - a) * t;
        const complete = t >= 1;
        return (
          <g key={i} opacity={build}>
            {/* track */}
            <line x1={a} y1={y} x2={b} y2={y} stroke={colors.navy} strokeWidth={4} opacity={0.12} strokeLinecap="round" />
            {/* walked */}
            {t > 0 ? (
              <line x1={a} y1={y} x2={tipX} y2={y} stroke={colors.gold} strokeWidth={10} strokeLinecap="round" />
            ) : null}
            {complete ? (
              <path
                d={`M${b - dir * 4} ${y} L${b - dir * 30} ${y - 18} L${b - dir * 30} ${y + 18} Z`}
                fill={colors.goldDeep}
              />
            ) : null}
            {/* leg number */}
            <g opacity={t > 0 ? 1 : 0.35}>
              <circle cx={450} cy={y - 40} r={22} fill={t > 0 ? colors.navy : colors.ivoryDeep} />
              <text
                x={450}
                y={y - 32}
                textAnchor="middle"
                fontFamily={fonts.body}
                fontWeight={800}
                fontSize={24}
                fill={t > 0 ? colors.white : colors.navy}
              >
                {i + 1}
              </text>
            </g>
            <text
              x={dir > 0 ? a + 80 : a - 80}
              y={y - 32}
              textAnchor={dir > 0 ? "start" : "end"}
              fontFamily={fonts.body}
              fontWeight={600}
              fontSize={22}
              fill={colors.navy}
              opacity={(t > 0 ? 0.75 : 0.25) * build}
            >
              {dir > 0 ? "Safa → Marwah" : "Marwah → Safa"}
            </text>
          </g>
        );
      })}

      {/* walker */}
      {legs > 0 || build >= 1 ? (
        <g transform={`translate(${walker.x} ${walker.y})`} opacity={build}>
          <circle r={26} fill={colors.white} stroke={colors.navy} strokeWidth={5} />
          <circle r={11} fill={colors.navy} />
          <path d={`M${walker.dir * 36} 0 L${walker.dir * 26} -9 L${walker.dir * 26} 9 Z`} fill={colors.navy} />
        </g>
      ) : null}
    </svg>
  );
};
