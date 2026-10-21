import React from "react";
import { useCurrentFrame } from "remotion";
import { colors, fonts } from "../styles/theme";
import { rand } from "./anim";
import { KAABA_CENTER, KAABA_CORNERS, KaabaDiagram } from "./KaabaDiagram";

type Props = {
  size: number;
  /** Laps completed, 0..7 (fractional while walking). */
  laps: number;
  build?: number;
  labels?: number;
  /** 0..1 visibility of the "Ka'bah on the left" pointer on the walker. */
  leftPointer?: number;
  /** 0..1 emphasis on the Hajar Aswad corner. */
  hajarAswad?: number;
};

const R0 = 258;
const R_STEP = 11;
const C = KAABA_CENTER;

/**
 * Plan view, north up. Angle θ is measured from east; increasing θ moves the walker
 * east → north → west → south, i.e. COUNTERCLOCKWISE seen from above.
 * Screen position: x = cx + r·cosθ, y = cy − r·sinθ.
 * Walking counterclockwise keeps the centre (the Ka'bah) on the walker's LEFT.
 * Each lap is drawn on a slightly larger radius so all seven laps stay visible.
 */
const pointAt = (laps: number) => {
  const theta = laps * Math.PI * 2;
  const r = R0 + laps * R_STEP;
  return { x: C.x + r * Math.cos(theta), y: C.y - r * Math.sin(theta), theta };
};

const spiralPath = (laps: number) => {
  if (laps <= 0) return "";
  const steps = Math.max(2, Math.ceil(laps * 120));
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const p = pointAt((laps * i) / steps);
    d += `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
  }
  return d;
};

export const TawafPathAnimation: React.FC<Props> = ({ size, laps, build = 1, labels = 1, leftPointer = 1, hajarAswad = 0 }) => {
  const frame = useCurrentFrame();
  const walker = pointAt(laps);
  const headingDeg = (-walker.theta * 180) / Math.PI;
  const currentLap = Math.min(7, Math.floor(laps));
  const lapFrac = laps - currentLap;

  return (
    <KaabaDiagram size={size} build={build} labels={labels} hajarAswad={hajarAswad}>
      {/* other pilgrims, all moving counterclockwise */}
      {new Array(34).fill(0).map((_, i) => {
        const r = 200 + rand(i) * 200;
        const speed = 0.006 + rand(i + 50) * 0.006;
        const a = rand(i + 100) * Math.PI * 2 + frame * speed;
        return (
          <circle
            key={i}
            cx={C.x + r * Math.cos(a)}
            cy={C.y - r * Math.sin(a)}
            r={6}
            fill={colors.navy}
            opacity={0.18 * build}
          />
        );
      })}

      {/* direction chevrons (counterclockwise) */}
      {new Array(8).fill(0).map((_, i) => {
        const th = (i / 8) * Math.PI * 2 + Math.PI / 8;
        const r = 388;
        const x = C.x + r * Math.cos(th);
        const y = C.y - r * Math.sin(th);
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${(-th * 180) / Math.PI})`} opacity={0.55 * labels}>
            <path d="M-12 8 L0 -8 L12 8" fill="none" stroke={colors.goldDeep} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}

      {/* start / finish line at the Hajar Aswad corner */}
      <line
        x1={KAABA_CORNERS.E.x + 18}
        y1={C.y}
        x2={C.x + R0 + 7 * R_STEP + 30}
        y2={C.y}
        stroke={colors.gold}
        strokeWidth={5}
        strokeDasharray="12 9"
        opacity={labels}
      />
      <text
        x={KAABA_CORNERS.E.x + 30}
        y={C.y - 14}
        fontFamily={fonts.body}
        fontWeight={700}
        fontSize={20}
        fill={colors.goldDeep}
        opacity={labels}
      >
        garis mulai
      </text>

      {/* walked path: all completed laps + current lap */}
      <path d={spiralPath(laps)} fill="none" stroke={colors.gold} strokeWidth={7} strokeLinecap="round" opacity={0.9} />

      {/* lap-completion pulse */}
      {currentLap > 0 && lapFrac < 0.25 ? (
        <circle
          cx={C.x + R0 + currentLap * R_STEP}
          cy={C.y}
          r={14 + lapFrac * 120}
          fill="none"
          stroke={colors.gold}
          strokeWidth={4}
          opacity={1 - lapFrac / 0.25}
        />
      ) : null}

      {/* walker (top-down pilgrim), facing the direction of travel */}
      <g transform={`translate(${walker.x} ${walker.y}) rotate(${headingDeg}) scale(1.5)`} opacity={build}>
        {/* "Ka'bah on the left" pointer */}
        <g opacity={leftPointer}>
          <line x1={-26} y1={0} x2={-58} y2={0} stroke={colors.navy} strokeWidth={4} strokeLinecap="round" />
          <path d="M-66 0 L-54 -8 L-54 8 Z" fill={colors.navy} />
        </g>
        <path d="M0 -30 L-7 -20 L7 -20 Z" fill={colors.gold} />
        <ellipse cx={0} cy={0} rx={22} ry={12} fill={colors.white} stroke={colors.navy} strokeWidth={3} />
        <circle cx={0} cy={0} r={9} fill={colors.hair} />
      </g>
    </KaabaDiagram>
  );
};
