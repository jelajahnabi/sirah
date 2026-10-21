import React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "../styles/theme";

export type PilgrimGender = "male" | "female";

type Props = {
  gender: PilgrimGender;
  /** Rendered height in px (width follows the 300:760 artboard). */
  height?: number;
  /** Offsets the idle cycle so two characters don't breathe/blink in sync. */
  seed?: number;
  /** Mirror horizontally. */
  flip?: boolean;
  /** 0..1 — how much the mouth is open (for speaking beats). */
  talk?: number;
  style?: React.CSSProperties;
};

const INK = colors.navy;
const STROKE = 4;
const CLOTH = colors.white;
const CLOTH_SHADE = "#E7E1D6";

/**
 * Reusable Indonesian pilgrim character (series mascot pair).
 * Male: two unstitched white ihram sheets (izar + rida covering both shoulders), head uncovered, sandals.
 * Female: loose modest white garment, hijab, face and hands uncovered (as required in ihram).
 * Idle motion (breathing, blinking, head sway) is frame-driven and deterministic.
 */
export const PilgrimCharacter: React.FC<Props> = ({ gender, height = 700, seed = 0, flip = false, talk = 0, style }) => {
  const frame = useCurrentFrame() + seed * 37;
  const breathe = 1 + Math.sin(frame / 18) * 0.008;
  const sway = Math.sin(frame / 40) * 1.6;
  const blinkPhase = frame % 96;
  const eyeScale = blinkPhase < 4 ? 0.12 : 1;
  const mouthOpen = Math.max(0, talk) * (0.5 + 0.5 * Math.abs(Math.sin(frame / 2.6)));
  const width = (height * 300) / 760;

  return (
    <svg
      viewBox="0 0 300 760"
      width={width}
      height={height}
      style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined, ...style }}
    >
      {/* ground shadow */}
      <ellipse cx={150} cy={742} rx={100} ry={12} fill={INK} opacity={0.12} />
      <g style={{ transformOrigin: "150px 740px", transform: `scaleY(${breathe})` }}>
        {gender === "male" ? <MaleBody /> : <FemaleBody />}
        <g style={{ transformOrigin: "150px 180px", transform: `rotate(${sway}deg)` }}>
          {gender === "male" ? <MaleHead eyeScale={eyeScale} mouthOpen={mouthOpen} /> : <FemaleHead eyeScale={eyeScale} mouthOpen={mouthOpen} />}
        </g>
      </g>
    </svg>
  );
};

const Arm: React.FC<{ x1: number; y1: number; x2: number; y2: number }> = ({ x1, y1, x2, y2 }) => (
  <g>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={30} strokeLinecap="round" />
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors.skin} strokeWidth={22} strokeLinecap="round" />
    <circle cx={x2} cy={y2 + 8} r={14} fill={colors.skin} stroke={INK} strokeWidth={STROKE} />
  </g>
);

const MaleBody: React.FC = () => (
  <g>
    {/* shins */}
    <rect x={116} y={630} width={26} height={96} rx={10} fill={colors.skin} stroke={INK} strokeWidth={STROKE} />
    <rect x={158} y={630} width={26} height={96} rx={10} fill={colors.skin} stroke={INK} strokeWidth={STROKE} />
    {/* sandals */}
    <path d="M100 734 Q129 722 150 734 L148 742 L102 742 Z" fill={colors.goldDeep} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
    <path d="M150 734 Q171 722 200 734 L198 742 L152 742 Z" fill={colors.goldDeep} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
    <path d="M114 728 L142 722 M158 722 L186 728" stroke={INK} strokeWidth={5} strokeLinecap="round" />
    {/* izar (lower sheet) */}
    <path d="M90 396 L210 396 L224 652 Q150 668 76 652 Z" fill={CLOTH} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
    <path d="M186 400 L202 650" stroke={CLOTH_SHADE} strokeWidth={4} />
    <path d="M120 470 L112 640 M150 480 L150 650" stroke={CLOTH_SHADE} strokeWidth={3} />
    {/* forearms emerging from the rida */}
    <Arm x1={80} y1={350} x2={76} y2={450} />
    <Arm x1={220} y1={350} x2={224} y2={450} />
    {/* neck */}
    <rect x={134} y={150} width={32} height={56} fill={colors.skin} stroke={INK} strokeWidth={STROKE} />
    {/* rida (upper sheet) covering both shoulders */}
    <path
      d="M150 192 C108 192 82 200 70 226 L58 364 Q72 380 100 372 L92 424 Q150 442 208 424 L200 372 Q228 380 242 364 L230 226 C218 200 192 192 150 192 Z"
      fill={CLOTH}
      stroke={INK}
      strokeWidth={STROKE}
      strokeLinejoin="round"
    />
    <path d="M132 194 Q150 222 168 194" fill={colors.skin} stroke={INK} strokeWidth={STROKE} />
    <path d="M98 220 Q150 310 204 418" stroke={CLOTH_SHADE} strokeWidth={4} fill="none" />
    <path d="M86 250 L80 360 M214 250 L222 360" stroke={CLOTH_SHADE} strokeWidth={3} fill="none" />
  </g>
);

const Face: React.FC<{ cy: number; rx: number; ry: number; eyeScale: number; mouthOpen: number; lashes?: boolean }> = ({
  cy,
  rx,
  ry,
  eyeScale,
  mouthOpen,
  lashes,
}) => (
  <g>
    <ellipse cx={150} cy={cy} rx={rx} ry={ry} fill={colors.skin} stroke={INK} strokeWidth={STROKE} />
    {/* brows */}
    <path d={`M120 ${cy - 20} Q131 ${cy - 26} 141 ${cy - 21}`} stroke={colors.hair} strokeWidth={6} strokeLinecap="round" fill="none" />
    <path d={`M159 ${cy - 21} Q169 ${cy - 26} 180 ${cy - 20}`} stroke={colors.hair} strokeWidth={6} strokeLinecap="round" fill="none" />
    {/* eyes */}
    {[131, 169].map((x) => (
      <g key={x} style={{ transformOrigin: `${x}px ${cy - 2}px`, transform: `scaleY(${eyeScale})` }}>
        <ellipse cx={x} cy={cy - 2} rx={6} ry={7.5} fill={INK} />
        <circle cx={x + 2} cy={cy - 5} r={2} fill={colors.white} />
        {lashes ? <path d={`M${x - 8} ${cy - 8} L${x - 11} ${cy - 11}`} stroke={INK} strokeWidth={3} strokeLinecap="round" /> : null}
      </g>
    ))}
    {/* nose */}
    <path d={`M150 ${cy + 2} Q144 ${cy + 16} 152 ${cy + 19}`} stroke={colors.skinShade} strokeWidth={4} strokeLinecap="round" fill="none" />
    {/* cheeks */}
    <ellipse cx={122} cy={cy + 18} rx={9} ry={5} fill="#D9785F" opacity={0.25} />
    <ellipse cx={178} cy={cy + 18} rx={9} ry={5} fill="#D9785F" opacity={0.25} />
    {/* mouth */}
    {mouthOpen > 0.05 ? (
      <ellipse cx={150} cy={cy + 33} rx={10} ry={3 + mouthOpen * 7} fill="#6E2E2A" stroke={INK} strokeWidth={3} />
    ) : (
      <path d={`M137 ${cy + 30} Q150 ${cy + 40} 163 ${cy + 30}`} stroke={INK} strokeWidth={4} strokeLinecap="round" fill="none" />
    )}
  </g>
);

const MaleHead: React.FC<{ eyeScale: number; mouthOpen: number }> = ({ eyeScale, mouthOpen }) => (
  <g>
    <ellipse cx={99} cy={112} rx={11} ry={16} fill={colors.skin} stroke={INK} strokeWidth={STROKE} />
    <ellipse cx={201} cy={112} rx={11} ry={16} fill={colors.skin} stroke={INK} strokeWidth={STROKE} />
    <Face cy={110} rx={50} ry={58} eyeScale={eyeScale} mouthOpen={mouthOpen} />
    {/* short neat beard */}
    <path d="M106 128 Q112 172 150 174 Q188 172 194 128 Q186 156 150 160 Q114 156 106 128 Z" fill={colors.hair} opacity={0.92} />
    {/* short black hair */}
    <path
      d="M98 104 C94 56 124 42 150 42 C182 42 208 58 202 104 C196 84 186 74 172 72 C160 82 128 80 114 76 C104 84 100 94 98 104 Z"
      fill={colors.hair}
      stroke={INK}
      strokeWidth={STROKE}
      strokeLinejoin="round"
    />
  </g>
);

const FemaleBody: React.FC = () => (
  <g>
    {/* shoes */}
    <ellipse cx={126} cy={734} rx={24} ry={10} fill={colors.navy} />
    <ellipse cx={174} cy={734} rx={24} ry={10} fill={colors.navy} />
    {/* sleeves + hands */}
    <path d="M86 236 L64 452 L100 456 L112 260 Z" fill={CLOTH} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
    <path d="M214 236 L236 452 L200 456 L188 260 Z" fill={CLOTH} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
    <circle cx={82} cy={468} r={15} fill={colors.skin} stroke={INK} strokeWidth={STROKE} />
    <circle cx={218} cy={468} r={15} fill={colors.skin} stroke={INK} strokeWidth={STROKE} />
    {/* loose gown */}
    <path
      d="M150 196 C116 196 96 206 88 232 L72 726 Q150 740 228 726 L212 232 C204 206 184 196 150 196 Z"
      fill={CLOTH}
      stroke={INK}
      strokeWidth={STROKE}
      strokeLinejoin="round"
    />
    <path d="M120 420 L108 720 M150 430 L150 728 M180 420 L192 720" stroke={CLOTH_SHADE} strokeWidth={3} />
    {/* re-draw sleeve fronts over gown edge */}
    <path d="M88 240 L68 450 L100 454 L110 270" fill={CLOTH} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
    <path d="M212 240 L232 450 L200 454 L190 270" fill={CLOTH} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
  </g>
);

const FemaleHead: React.FC<{ eyeScale: number; mouthOpen: number }> = ({ eyeScale, mouthOpen }) => (
  <g>
    {/* hijab drape (covers hair, neck and chest) */}
    <path
      d="M150 34 C94 34 76 80 78 128 C80 176 68 232 62 318 Q150 352 238 318 C232 232 220 176 222 128 C224 80 206 34 150 34 Z"
      fill={colors.ivory}
      stroke={INK}
      strokeWidth={STROKE}
      strokeLinejoin="round"
    />
    <path d="M96 200 Q150 250 204 200" stroke={CLOTH_SHADE} strokeWidth={4} fill="none" />
    <path d="M84 260 Q150 300 216 260" stroke={CLOTH_SHADE} strokeWidth={3} fill="none" />
    {/* inner cap edge */}
    <ellipse cx={150} cy={118} rx={54} ry={63} fill={colors.white} stroke={INK} strokeWidth={STROKE} />
    <Face cy={122} rx={45} ry={53} eyeScale={eyeScale} mouthOpen={mouthOpen} lashes />
  </g>
);
