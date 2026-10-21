import React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "../styles/theme";
import { rand } from "./anim";

type Props = {
  /** 0..1 camera push-in toward the Ka'bah. */
  push: number;
};

const W = 1080;
const H = 1920;
const CX = 540;
const CY = 1300; // Ka'bah base centre (ground plane)
const TILT = 0.45; // ground-plane ellipse ratio (aerial oblique view)

const ellPt = (rx: number, a: number) => ({ x: CX + rx * Math.cos(a), y: CY - rx * TILT * Math.sin(a) });

/**
 * Stylised 2.5D aerial of Masjidil Haram at dusk: mataf, arcade rings, minarets,
 * the Ka'bah with its gold band, Hijr Ismail, and pilgrims circling counterclockwise.
 * Camera push-in is applied as a transform around the Ka'bah.
 */
export const MasjidilHaramAerial: React.FC<Props> = ({ push }) => {
  const frame = useCurrentFrame();
  const scale = 1 + push * 0.4;
  const ty = -push * 40;

  const pilgrims = new Array(220).fill(0).map((_, i) => {
    const r = 120 + rand(i) * 300;
    const speed = 0.004 + rand(i + 7) * 0.004;
    const a = rand(i + 13) * Math.PI * 2 + frame * speed; // increasing angle = counterclockwise
    const p = ellPt(r, a);
    return { ...p, back: Math.sin(a) > 0, white: rand(i + 21) > 0.3, size: 3 + rand(i + 3) * 2.2 };
  });

  const minarets = [0.07, 0.24, 0.4, 0.6, 0.76, 0.93].map((a) => ellPt(660, a * Math.PI));

  const Dot = (p: (typeof pilgrims)[number], k: number) => (
    <circle key={k} cx={p.x} cy={p.y} r={p.size} fill={p.white ? colors.white : colors.navySoft} opacity={0.95} />
  );

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={colors.navyDeep} />
          <stop offset="0.55" stopColor={colors.navy} />
          <stop offset="0.85" stopColor="#3A4F66" />
          <stop offset="1" stopColor={colors.goldLight} />
        </linearGradient>
        <radialGradient id="kaabaGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={colors.goldLight} stopOpacity="0.55" />
          <stop offset="1" stopColor={colors.goldLight} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={colors.goldLight} stopOpacity="0" />
          <stop offset="1" stopColor={colors.goldLight} stopOpacity="0.22" />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill="url(#sky)" />
      {/* stars */}
      {new Array(40).fill(0).map((_, i) => (
        <circle
          key={i}
          cx={rand(i + 300) * W}
          cy={rand(i + 400) * 640}
          r={1 + rand(i + 500) * 1.6}
          fill={colors.ivory}
          opacity={0.25 + 0.35 * (0.5 + 0.5 * Math.sin(frame / 12 + i))}
        />
      ))}

      <g style={{ transformOrigin: `${CX}px ${CY - 60}px`, transform: `translateY(${ty}px) scale(${scale})` }}>
        {/* distant mountains + skyline */}
        <path d="M0 860 L120 780 L240 830 L380 760 L520 820 L700 750 L860 820 L1080 770 L1080 900 L0 900 Z" fill="#26405C" />
        {new Array(22).fill(0).map((_, i) => {
          const w = 30 + rand(i + 60) * 40;
          const h = 30 + rand(i + 70) * 70;
          const x = i * 50 - 10;
          return <rect key={i} x={x} y={880 - h} width={w} height={h + 40} fill="#2E4866" />;
        })}
        {/* clock tower silhouette (south of the mosque, in the background) */}
        <g opacity={0.9}>
          <rect x={810} y={520} width={90} height={380} fill="#2B4561" />
          <rect x={826} y={430} width={58} height={100} fill="#2B4561" />
          <circle cx={855} cy={480} r={22} fill={colors.goldLight} opacity={0.9} />
          <path d="M840 430 L855 330 L870 430 Z" fill="#2B4561" />
          <path d="M855 330 L855 300" stroke={colors.goldLight} strokeWidth={4} />
          <rect x={730} y={700} width={90} height={200} fill="#2B4561" />
          <rect x={900} y={680} width={90} height={220} fill="#2B4561" />
        </g>
        {/* horizon glow */}
        <rect x={0} y={840} width={W} height={120} fill={colors.goldLight} opacity={0.15} />

        {/* outer plaza */}
        <ellipse cx={CX} cy={CY} rx={1000} ry={1000 * TILT} fill="#E6DECD" />
        {/* arcade building ring */}
        <ellipse cx={CX} cy={CY + 8} rx={720} ry={720 * TILT} fill="#CDBFA4" />
        <ellipse cx={CX} cy={CY} rx={720} ry={720 * TILT} fill={colors.ivoryDeep} stroke="#BCAE92" strokeWidth={3} />
        {/* small domes along the ring */}
        {new Array(36).fill(0).map((_, i) => {
          const a = (i / 36) * Math.PI * 2;
          const p = ellPt(630, a);
          return <path key={i} d={`M${p.x - 12} ${p.y} A12 12 0 0 1 ${p.x + 12} ${p.y} Z`} fill={colors.white} stroke="#BCAE92" strokeWidth={2} />;
        })}
        {/* inner courtyard */}
        <ellipse cx={CX} cy={CY} rx={540} ry={540 * TILT} fill={colors.marble} />
        {/* arches on the inner facade (back half visible) */}
        {new Array(48).fill(0).map((_, i) => {
          const a = (i / 48) * Math.PI * 2;
          if (Math.sin(a) < 0.05) return null;
          const p = ellPt(540, a);
          return <path key={i} d={`M${p.x - 7} ${p.y} L${p.x - 7} ${p.y - 14} A7 7 0 0 1 ${p.x + 7} ${p.y - 14} L${p.x + 7} ${p.y} Z`} fill={colors.navy} opacity={0.35} />;
        })}
        {/* mataf rings */}
        {[180, 280, 380, 470].map((r) => (
          <ellipse key={r} cx={CX} cy={CY} rx={r} ry={r * TILT} fill="none" stroke={colors.ivoryDeep} strokeWidth={2} />
        ))}

        {/* minarets (back) */}
        {minarets
          .filter((p) => p.y < CY)
          .map((p, i) => (
            <g key={i}>
              <rect x={p.x - 9} y={p.y - 260} width={18} height={260} fill={colors.white} stroke="#BCAE92" strokeWidth={2} />
              <rect x={p.x - 14} y={p.y - 190} width={28} height={8} fill={colors.ivoryDeep} />
              <rect x={p.x - 13} y={p.y - 110} width={26} height={8} fill={colors.ivoryDeep} />
              <path d={`M${p.x - 9} ${p.y - 260} L${p.x} ${p.y - 300} L${p.x + 9} ${p.y - 260} Z`} fill={colors.gold} />
              <circle cx={p.x} cy={p.y - 308} r={4} fill={colors.goldLight} />
            </g>
          ))}

        {/* glow */}
        <ellipse cx={CX} cy={CY - 70} rx={360} ry={240} fill="url(#kaabaGlow)" opacity={0.7 + 0.2 * Math.sin(frame / 20)} />

        {/* pilgrims behind the Ka'bah */}
        {pilgrims.filter((p) => p.back).map(Dot)}

        {/* Hijr Ismail (low semicircular wall) */}
        <path d={`M${CX - 62} ${CY + 12} C ${CX - 170} ${CY + 10}, ${CX - 150} ${CY - 60}, ${CX - 14} ${CY - 22}`} fill="none" stroke={colors.navy} strokeWidth={14} strokeLinecap="round" />
        <path d={`M${CX - 62} ${CY + 12} C ${CX - 170} ${CY + 10}, ${CX - 150} ${CY - 60}, ${CX - 14} ${CY - 22}`} fill="none" stroke={colors.white} strokeWidth={8} strokeLinecap="round" />

        {/* Ka'bah (2.5D cube) */}
        <g>
          <ellipse cx={CX + 20} cy={CY + 14} rx={110} ry={26} fill={colors.navyDeep} opacity={0.25} />
          {/* right face */}
          <path d={`M${CX + 50} ${CY + 12} L${CX + 104} ${CY - 14} L${CX + 104} ${CY - 170} L${CX + 50} ${CY - 144} Z`} fill="#0B0B0B" />
          {/* front face */}
          <rect x={CX - 62} y={CY - 144} width={112} height={156} fill={colors.kaaba} />
          {/* roof */}
          <path d={`M${CX - 62} ${CY - 144} L${CX + 50} ${CY - 144} L${CX + 104} ${CY - 170} L${CX - 8} ${CY - 170} Z`} fill="#2A2A2A" />
          {/* gold band (hizam) */}
          <rect x={CX - 62} y={CY - 116} width={112} height={12} fill={colors.gold} />
          <path d={`M${CX + 50} ${CY - 116} L${CX + 104} ${CY - 142} L${CX + 104} ${CY - 130} L${CX + 50} ${CY - 104} Z`} fill={colors.goldDeep} />
          {/* calligraphy hint below band */}
          <rect x={CX - 52} y={CY - 96} width={92} height={3} fill={colors.gold} opacity={0.6} />
          {/* door */}
          <rect x={CX + 14} y={CY - 84} width={24} height={50} fill={colors.gold} />
          <rect x={CX + 18} y={CY - 80} width={16} height={42} fill="none" stroke={colors.goldDeep} strokeWidth={2} />
        </g>

        {/* pilgrims in front of the Ka'bah */}
        {pilgrims.filter((p) => !p.back).map(Dot)}

        {/* light rays */}
        <g opacity={0.6 + 0.25 * Math.sin(frame / 30)}>
          {[-1, 0, 1].map((k) => (
            <path
              key={k}
              d={`M${CX + k * 70 - 30} 0 L${CX + k * 70 + 30} 0 L${CX + k * 140 + 90} ${CY - 120} L${CX + k * 140 - 90} ${CY - 120} Z`}
              fill="url(#ray)"
            />
          ))}
        </g>
      </g>

      {/* floating gold dust */}
      {new Array(30).fill(0).map((_, i) => {
        const x = rand(i + 900) * W + Math.sin(frame / 40 + i) * 20;
        const y = ((rand(i + 950) * H - frame * (0.6 + rand(i) * 0.8)) % H + H) % H;
        return <circle key={i} cx={x} cy={y} r={1.5 + rand(i + 990) * 2.5} fill={colors.goldLight} opacity={0.35} />;
      })}
    </svg>
  );
};
