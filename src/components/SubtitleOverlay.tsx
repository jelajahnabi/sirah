import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, fonts, safe, type } from "../styles/theme";

/** One subtitle card. Frames are absolute (episode timeline). Wrap key words in *asterisks* for gold. */
export type SubtitleCue = { from: number; to: number; text: string };

type Props = { cues: SubtitleCue[] };

/** Splits "a *gold* b" into styled spans. */
const renderRich = (text: string) =>
  text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <span key={i} style={{ color: colors.goldLight }}>
        {part.slice(1, -1)}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );

/**
 * Series subtitle style: one phrase at a time, white on a deep-navy card,
 * key words in gold, max two lines, inside the reserved lower band so it never covers
 * the scene's main subject.
 */
export const SubtitleOverlay: React.FC<Props> = ({ cues }) => {
  const frame = useCurrentFrame();
  const cue = cues.find((c) => frame >= c.from && frame < c.to);
  if (!cue) return null;

  const local = frame - cue.from;
  const len = cue.to - cue.from;
  const appear = interpolate(local, [0, 5], [0, 1], { extrapolateRight: "clamp" });
  const leave = interpolate(local, [len - 4, len], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: safe.subtitleTop,
          left: safe.x,
          right: safe.x,
          display: "flex",
          justifyContent: "center",
          opacity: Math.min(appear, leave),
          transform: `translateY(${(1 - appear) * 12}px)`,
        }}
      >
        <div
          style={{
            background: "rgba(13, 28, 46, 0.88)",
            border: "2px solid rgba(198, 165, 107, 0.35)",
            borderRadius: 28,
            padding: "18px 36px 20px",
            maxWidth: 900,
            textAlign: "center",
            fontFamily: fonts.body,
            fontWeight: 700,
            fontSize: type.subtitle,
            lineHeight: 1.3,
            letterSpacing: 0.2,
            color: colors.white,
            boxShadow: "0 12px 34px rgba(13, 28, 46, 0.28)",
            // hard cap at two lines
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {renderRich(cue.text)}
        </div>
      </div>
    </AbsoluteFill>
  );
};
