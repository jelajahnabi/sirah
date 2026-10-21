import React from "react";
import { colors, fonts } from "../styles/theme";

/**
 * Top-down (plan view) diagram of the Ka'bah and the mataf, north up.
 * Geometry follows the real layout:
 *  - The Ka'bah's corners point roughly to the cardinal directions.
 *  - Hajar Aswad = east corner (tawaf start/finish line).
 *  - The door is on the north-east face, near the Hajar Aswad corner.
 *  - Hijr Ismail (semicircular wall) lies outside the north-west face.
 *  - Rukun Yamani = south corner.
 * Viewbox is 900 × 900 with the Ka'bah centred at (450, 450).
 */
export const KAABA_VIEWBOX = 900;
export const KAABA_CENTER = { x: 450, y: 450 };

const E = { x: 560, y: 450 };
const N = { x: 450, y: 344 };
const W = { x: 338, y: 450 };
const S = { x: 450, y: 556 };
export const KAABA_CORNERS = { E, N, W, S };

const lerp = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

type Props = {
  size: number;
  /** 0..1 reveal of the labels. */
  labels?: number;
  /** 0..1 draw-on of the Ka'bah + Hijr Ismail. */
  build?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

export const KaabaDiagram: React.FC<Props> = ({ size, labels = 1, build = 1, children, style }) => {
  const door1 = lerp(E, N, 0.22);
  const door2 = lerp(E, N, 0.44);
  // Hijr Ismail: a semicircular wall bulging outward from the NW face, with openings at both ends.
  const hA = lerp(N, W, 0.1);
  const hB = lerp(N, W, 0.9);
  const nx = -0.707;
  const ny = -0.707;
  const bulge = 125;
  const hijrPath = `M ${hA.x} ${hA.y} C ${hA.x + nx * bulge} ${hA.y + ny * bulge}, ${hB.x + nx * bulge} ${hB.y + ny * bulge}, ${hB.x} ${hB.y}`;

  const Label: React.FC<{ x: number; y: number; text: string; anchor?: "start" | "middle" | "end"; delay: number; rotate?: number; fontSize?: number }> = ({
    x,
    y,
    text,
    anchor = "middle",
    delay,
    rotate = 0,
    fontSize = 24,
  }) => {
    const o = Math.max(0, Math.min(1, (labels - delay) / 0.4));
    return (
      <text
        x={x}
        y={y}
        textAnchor={anchor}
        fontFamily={fonts.body}
        fontWeight={700}
        fontSize={fontSize}
        fill={colors.navy}
        opacity={o}
        transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}
        style={{ paintOrder: "stroke", stroke: colors.marble, strokeWidth: 8 }}
      >
        {text}
      </text>
    );
  };

  return (
    <svg viewBox={`0 0 ${KAABA_VIEWBOX} ${KAABA_VIEWBOX}`} width={size} height={size} style={{ overflow: "visible", ...style }}>
      {/* mataf (white marble courtyard) */}
      <circle cx={450} cy={450} r={420} fill={colors.marble} stroke={colors.ivoryDeep} strokeWidth={6} />
      {[360, 300, 240, 180].map((r) => (
        <circle key={r} cx={450} cy={450} r={r} fill="none" stroke={colors.ivoryDeep} strokeWidth={2} strokeDasharray="2 10" />
      ))}
      {/* compass */}
      <g opacity={labels}>
        <text x={450} y={58} textAnchor="middle" fontFamily={fonts.body} fontWeight={800} fontSize={22} fill={colors.goldDeep}>
          U
        </text>
        <path d="M450 66 L442 84 L458 84 Z" fill={colors.goldDeep} />
      </g>

      {/* Hijr Ismail */}
      <path
        d={hijrPath}
        fill="none"
        stroke={colors.navy}
        strokeWidth={18}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - build}
      />
      <path
        d={hijrPath}
        fill="none"
        stroke={colors.white}
        strokeWidth={10}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - build}
      />

      {/* Ka'bah */}
      <g style={{ transformOrigin: "450px 450px", transform: `scale(${0.6 + 0.4 * build})` }} opacity={Math.min(1, build * 2)}>
        <polygon points={`${E.x},${E.y} ${N.x},${N.y} ${W.x},${W.y} ${S.x},${S.y}`} fill={colors.kaaba} />
        <polygon
          points={`${E.x - 16},${E.y} ${N.x},${N.y + 16} ${W.x + 16},${W.y} ${S.x},${S.y - 16}`}
          fill="none"
          stroke={colors.gold}
          strokeWidth={4}
        />
        {/* door (north-east face) */}
        <line x1={door1.x} y1={door1.y} x2={door2.x} y2={door2.y} stroke={colors.gold} strokeWidth={12} strokeLinecap="round" />
        {/* Hajar Aswad (east corner) */}
        <circle cx={E.x} cy={E.y} r={12} fill="#3A3A3A" stroke="#C9CDD2" strokeWidth={5} />
      </g>

      <Label x={E.x - 8} y={E.y + 52} text="Hajar Aswad" anchor="start" delay={0} />
      <Label x={(door1.x + door2.x) / 2 + 40} y={(door1.y + door2.y) / 2 - 30} text="Pintu" anchor="start" delay={0.15} />
      <Label x={366} y={372} text="Hijr Ismail" delay={0.3} rotate={-43} fontSize={20} />
      <Label x={S.x} y={S.y + 44} text="Rukun Yamani" delay={0.45} />

      {children}
    </svg>
  );
};
