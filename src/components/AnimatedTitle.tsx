import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, springs } from "../styles/theme";
import { springAt } from "./anim";

type Props = {
  lines: string[];
  delay?: number;
  /** Frames between consecutive words. */
  stagger?: number;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  fontWeight?: number;
  letterSpacing?: number;
  lineHeight?: number;
  /** Words to tint gold (exact match, case-sensitive). */
  accentWords?: string[];
  style?: React.CSSProperties;
};

/**
 * Kinetic title: each word rises out of a mask with a spring, line by line.
 * Fully frame-driven, so it renders identically every time.
 */
export const AnimatedTitle: React.FC<Props> = ({
  lines,
  delay = 0,
  stagger = 4,
  fontSize = 110,
  color = colors.navy,
  fontFamily = fonts.display,
  fontWeight = 900,
  letterSpacing = 1,
  lineHeight = 1.05,
  accentWords = [],
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let wordIndex = 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", ...style }}>
      {lines.map((line, li) => (
        <div key={li} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: fontSize * 0.26 }}>
          {line.split(" ").map((word, wi) => {
            const p = springAt(frame, fps, delay + wordIndex++ * stagger, springs.snappy);
            const accent = accentWords.includes(word);
            return (
              <span
                key={wi}
                style={{ display: "inline-block", overflow: "hidden", paddingBottom: fontSize * 0.08, lineHeight }}
              >
                <span
                  style={{
                    display: "inline-block",
                    fontFamily,
                    fontWeight,
                    fontSize,
                    letterSpacing,
                    color: accent ? colors.gold : color,
                    transform: `translateY(${(1 - p) * 110}%) rotate(${(1 - p) * 6}deg)`,
                    opacity: Math.min(1, p * 1.6),
                  }}
                >
                  {word}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
