import React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "../styles/theme";
import { rand } from "./anim";

type Props = {
  size: number;
  /** Frame (local) at which snipping starts. */
  snipFrom?: number;
  /** 0..1 entrance of the barber's hand. */
  handIn?: number;
};

const INK = colors.navy;
const SW = 6;
const SNIP_POINT = { x: 530, y: 232 };

/**
 * Respectful close-up: a pilgrim in ihram, eyes calmly closed, having a lock of hair
 * trimmed with scissors. Scissor blades open/close on a frame-driven cycle and hair
 * clippings fall with simple deterministic physics.
 */
export const TahallulIllustration: React.FC<Props> = ({ size, snipFrom = 20, handIn = 1 }) => {
  const frame = useCurrentFrame();
  const t = frame - snipFrom;
  const snipping = t >= 0;
  const open = snipping ? 0.5 + 0.5 * Math.cos(t * 0.45) : 1; // 1 = open, 0 = closed
  const bladeAngle = 4 + open * 20;
  const breathe = Math.sin(frame / 20) * 2;

  // hair clippings: one spawned each time the blades close (~every 14 frames)
  const period = (Math.PI * 2) / 0.45;
  const clippings: React.ReactNode[] = [];
  if (snipping) {
    const spawned = Math.floor(t / period) + 1;
    for (let k = Math.max(0, spawned - 6); k < spawned; k++) {
      for (let j = 0; j < 4; j++) {
        const seed = k * 10 + j;
        const age = t - (k * period + period / 2);
        if (age < 0) continue;
        const vx = 2.6 + rand(seed) * 2.4; // drift outward so clippings fall beside the ear, never across the face
        const x = SNIP_POINT.x + vx * age + Math.sin(age / 6 + seed) * 6;
        const y = SNIP_POINT.y + 0.5 * 0.35 * age * age + age * 0.5;
        if (y > 900) continue;
        const rot = rand(seed + 3) * 180 + age * 4;
        clippings.push(
          <line
            key={seed}
            x1={-9}
            y1={0}
            x2={9}
            y2={0}
            stroke={colors.hair}
            strokeWidth={4}
            strokeLinecap="round"
            transform={`translate(${x} ${y}) rotate(${rot})`}
          />,
        );
      }
    }
  }

  const handX = 140 * (1 - handIn);
  const handY = -140 * (1 - handIn);

  return (
    <svg viewBox="0 0 900 900" width={size} height={size} style={{ overflow: "visible" }}>
      {/* soft backdrop */}
      <circle cx={430} cy={430} r={380} fill={colors.white} opacity={0.65} />

      <g transform={`translate(0 ${breathe})`}>
        {/* shoulders in ihram (rida) */}
        <path
          d="M130 900 C140 720 230 640 330 618 L530 618 C630 640 720 720 730 900 Z"
          fill={colors.white}
          stroke={INK}
          strokeWidth={SW}
          strokeLinejoin="round"
        />
        <path d="M250 680 Q400 760 560 900" stroke="#E7E1D6" strokeWidth={8} fill="none" />
        {/* neck */}
        <path d="M370 540 L370 640 Q430 670 490 640 L490 540 Z" fill={colors.skin} stroke={INK} strokeWidth={SW} />
        {/* ears */}
        <ellipse cx={278} cy={400} rx={28} ry={42} fill={colors.skin} stroke={INK} strokeWidth={SW} />
        <ellipse cx={582} cy={400} rx={28} ry={42} fill={colors.skin} stroke={INK} strokeWidth={SW} />
        {/* face */}
        <ellipse cx={430} cy={390} rx={150} ry={178} fill={colors.skin} stroke={INK} strokeWidth={SW} />
        {/* calmly closed eyes */}
        <path d="M360 392 Q378 404 396 392" stroke={INK} strokeWidth={6} strokeLinecap="round" fill="none" />
        <path d="M464 392 Q482 404 500 392" stroke={INK} strokeWidth={6} strokeLinecap="round" fill="none" />
        <path d="M350 352 Q376 338 402 348" stroke={colors.hair} strokeWidth={11} strokeLinecap="round" fill="none" />
        <path d="M458 348 Q484 338 510 352" stroke={colors.hair} strokeWidth={11} strokeLinecap="round" fill="none" />
        <path d="M430 400 Q418 444 436 452" stroke={colors.skinShade} strokeWidth={6} strokeLinecap="round" fill="none" />
        <ellipse cx={352} cy={448} rx={22} ry={12} fill="#D9785F" opacity={0.22} />
        <ellipse cx={508} cy={448} rx={22} ry={12} fill="#D9785F" opacity={0.22} />
        <path d="M400 492 Q430 510 460 492" stroke={INK} strokeWidth={6} strokeLinecap="round" fill="none" />
        {/* short beard */}
        <path d="M296 440 Q306 572 430 576 Q554 572 564 440 Q540 530 430 538 Q320 530 296 440 Z" fill={colors.hair} opacity={0.92} />
        {/* hair */}
        <path
          d="M276 370 C262 230 340 180 430 180 C530 180 600 230 584 370 C574 300 548 268 520 256 C480 276 380 274 340 258 C306 280 286 320 276 370 Z"
          fill={colors.hair}
          stroke={INK}
          strokeWidth={SW}
          strokeLinejoin="round"
        />
        {/* lock of hair being trimmed */}
        <path d="M540 236 Q560 222 572 208" stroke={colors.hair} strokeWidth={14} strokeLinecap="round" fill="none" />
      </g>

      {clippings}

      {/* barber's hand with scissors (drawn in the scissors' local frame; pivot at origin, blades point left) */}
      <g transform={`translate(${610 + handX} ${200 + handY}) rotate(-20) scale(1.5)`} opacity={handIn}>
        {/* forearm + sleeve, leaving the frame to the upper right */}
        <line x1={92} y1={0} x2={150} y2={-14} stroke={INK} strokeWidth={36} strokeLinecap="round" />
        <line x1={92} y1={0} x2={150} y2={-14} stroke={colors.skin} strokeWidth={28} strokeLinecap="round" />
        <path d="M140 -40 L300 -110 L330 -20 L160 24 Z" fill={colors.navySoft} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        {/* upper blade + handle */}
        <g transform={`rotate(${-bladeAngle / 2})`}>
          <path d="M0 -5 L-82 -1 Q-84 2 -80 3 L0 5 Z" fill="#D5DBE2" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
          <line x1={0} y1={0} x2={44} y2={-14} stroke={INK} strokeWidth={7} strokeLinecap="round" />
          <ellipse cx={58} cy={-20} rx={15} ry={11} fill="none" stroke={colors.gold} strokeWidth={6} />
        </g>
        {/* lower blade + handle */}
        <g transform={`rotate(${bladeAngle / 2})`}>
          <path d="M0 5 L-82 1 Q-84 -2 -80 -3 L0 -5 Z" fill="#B8C0CA" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
          <line x1={0} y1={0} x2={44} y2={14} stroke={INK} strokeWidth={7} strokeLinecap="round" />
          <ellipse cx={58} cy={20} rx={15} ry={11} fill="none" stroke={colors.gold} strokeWidth={6} />
        </g>
        <circle cx={0} cy={0} r={5} fill={colors.gold} stroke={INK} strokeWidth={2} />
        {/* hand: thumb through upper ring, fingers through lower ring */}
        <ellipse cx={86} cy={2} rx={26} ry={30} fill={colors.skin} stroke={INK} strokeWidth={4} />
        <ellipse cx={62} cy={-22} rx={14} ry={8} fill={colors.skin} stroke={INK} strokeWidth={4} transform="rotate(-15 62 -22)" />
        <ellipse cx={62} cy={22} rx={14} ry={8} fill={colors.skin} stroke={INK} strokeWidth={4} transform="rotate(15 62 22)" />
        <ellipse cx={70} cy={38} rx={12} ry={7} fill={colors.skin} stroke={INK} strokeWidth={4} transform="rotate(25 70 38)" />
      </g>
    </svg>
  );
};
