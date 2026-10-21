import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, shadow, springs } from "../styles/theme";
import { springAt } from "./anim";

type Props = {
  label?: string;
  children: React.ReactNode;
  delay: number;
  style?: React.CSSProperties;
  tone?: "ivory" | "navy" | "gold";
  fontSize?: number;
};

/** Floating rounded info card ("pill" from the reference style) that pops in with a spring. */
export const InfoChip: React.FC<Props> = ({ label, children, delay, style, tone = "ivory", fontSize = 32 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springAt(frame, fps, delay, springs.pop);
  const bg = tone === "navy" ? colors.navy : tone === "gold" ? colors.gold : colors.white;
  const fg = tone === "ivory" ? colors.navy : colors.white;
  const float = Math.sin((frame - delay) / 22) * 4;

  return (
    <div
      style={{
        position: "absolute",
        background: bg,
        color: fg,
        borderRadius: 28,
        padding: "20px 28px",
        boxShadow: shadow.card,
        fontFamily: fonts.body,
        fontSize,
        fontWeight: 500,
        lineHeight: 1.3,
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${(1 - p) * 30 + float}px) scale(${0.85 + 0.15 * p})`,
        ...style,
      }}
    >
      {label ? (
        <div
          style={{
            fontWeight: 800,
            fontSize: fontSize * 0.72,
            letterSpacing: 2,
            color: tone === "ivory" ? colors.goldDeep : colors.goldLight,
            marginBottom: 6,
          }}
        >
          {label}
        </div>
      ) : null}
      {children}
    </div>
  );
};
