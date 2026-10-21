import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, springs } from "../styles/theme";
import { progress, springAt } from "./anim";

type Props = { series: string; episode: string; delay?: number; tone?: "light" | "dark" };

/** Series intro badge: "UMROH FIRST TIMER · EPISODE 01" with gold rules drawing outward. */
export const SeriesTag: React.FC<Props> = ({ series, episode, delay = 0, tone = "dark" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springAt(frame, fps, delay, springs.gentle);
  const rule = progress(frame, delay + 6, 24);
  const ink = tone === "dark" ? colors.ivory : colors.navy;

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22, opacity: p }}>
      <div style={{ width: 90 * rule, height: 3, background: colors.gold }} />
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: 6,
          color: ink,
          transform: `translateY(${(1 - p) * 14}px)`,
          whiteSpace: "nowrap",
        }}
      >
        {series} <span style={{ color: colors.gold }}>·</span> {episode}
      </div>
      <div style={{ width: 90 * rule, height: 3, background: colors.gold }} />
    </div>
  );
};
