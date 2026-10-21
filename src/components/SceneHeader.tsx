import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, safe, springs, type } from "../styles/theme";
import { progress, springAt } from "./anim";

type Props = {
  number: string;
  title: string;
  subtitle: string;
  delay?: number;
  tone?: "light" | "dark";
};

/** "01 — IHRAM" style header used by every rukun scene. */
export const SceneHeader: React.FC<Props> = ({ number, title, subtitle, delay = 0, tone = "light" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const numIn = springAt(frame, fps, delay, springs.pop);
  const titleIn = springAt(frame, fps, delay + 5, springs.gentle);
  const lineW = progress(frame, delay + 8, 22);
  const subIn = progress(frame, delay + 14, 18);
  const ink = tone === "light" ? colors.navy : colors.ivory;

  return (
    <div className="absolute flex flex-col items-center" style={{ top: safe.top, left: safe.x, right: safe.x }}>
      <div className="flex items-center" style={{ gap: 28 }}>
        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: 800,
            fontSize: 40,
            color: colors.white,
            background: colors.gold,
            borderRadius: 999,
            padding: "10px 26px",
            transform: `scale(${numIn})`,
            letterSpacing: 2,
          }}
        >
          {number}
        </div>
        <div style={{ width: 70 * lineW, height: 4, background: colors.gold, borderRadius: 2 }} />
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: type.h1,
            color: ink,
            letterSpacing: 2,
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * 40}px)`,
            lineHeight: 1,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          marginTop: 26,
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: type.body,
          color: ink,
          opacity: subIn * 0.85,
          transform: `translateY(${(1 - subIn) * 20}px)`,
          textAlign: "center",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};
