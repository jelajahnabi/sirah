import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { PILLARS } from "../series/umroh-first-timer/pillars";
import { colors, fonts, shadow, springs } from "../styles/theme";
import { progress, springAt } from "./anim";
import { PillarIcon } from "./PillarIcon";

type Props = {
  width: number;
  /** Frame at which the first node appears. */
  delay?: number;
  /** Frames between nodes. */
  stagger?: number;
  /** Index of the node to highlight (0-based), or -1. */
  highlight?: number;
  /** Frame at which the highlight kicks in. */
  highlightAt?: number;
};

/** Five rukun icons connected left → right into a timeline, with an optional highlighted node. */
export const FivePillarsTimeline: React.FC<Props> = ({ width, delay = 0, stagger = 8, highlight = -1, highlightAt = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = PILLARS.length;
  const node = 150;
  const gap = (width - node) / (n - 1);
  const lineP = progress(frame, delay, stagger * (n - 1) + 8);
  const hl = springAt(frame, fps, highlightAt, springs.pop);

  return (
    <div style={{ position: "relative", width, height: node + 120 }}>
      {/* connector */}
      <div
        style={{
          position: "absolute",
          left: node / 2,
          top: node / 2 - 3,
          height: 6,
          width: (width - node) * lineP,
          background: colors.gold,
          borderRadius: 3,
        }}
      />
      {PILLARS.map((p, i) => {
        const pop = springAt(frame, fps, delay + i * stagger, springs.pop);
        const isHl = i === highlight;
        const scale = pop * (isHl ? 1 + 0.18 * hl : 1);
        const dim = highlight >= 0 && !isHl ? 1 - 0.45 * hl : 1;
        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: i * gap,
              top: 0,
              width: node,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              opacity: Math.min(1, pop * 1.5) * dim,
            }}
          >
            <div
              style={{
                width: node,
                height: node,
                borderRadius: node,
                background: isHl && hl > 0.01 ? colors.navy : colors.white,
                boxShadow: isHl ? `${shadow.card}, 0 0 0 ${8 * hl}px ${colors.gold}` : shadow.soft,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${scale})`,
              }}
            >
              <PillarIcon id={p.id} size={86} color={isHl && hl > 0.01 ? colors.white : colors.navy} />
            </div>
            <div style={{ marginTop: 22, fontFamily: fonts.body, fontWeight: 800, fontSize: 26, color: colors.goldDeep }}>
              {p.number}
            </div>
            <div style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 28, color: colors.navy, letterSpacing: 1 }}>
              {p.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};
