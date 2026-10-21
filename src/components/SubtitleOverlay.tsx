import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, safe, type } from "../styles/theme";

export type SubtitleLine = { start: number; end: number; text: string };

type Props = {
  lines: SubtitleLine[];
  /** Subtitles sit on a navy card by default; "light" for dark scenes. */
  tone?: (frame: number) => "dark" | "light";
};

/**
 * Series subtitle style: one centred card in the reserved lower band,
 * with a karaoke-style gold highlight that follows the (estimated) spoken word.
 */
export const SubtitleOverlay: React.FC<Props> = ({ lines, tone }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const line = lines.find((l) => t >= l.start && t < l.end);
  if (!line) return null;

  const localF = frame - line.start * fps;
  const durF = (line.end - line.start) * fps;
  const appear = interpolate(localF, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const leave = interpolate(localF, [durF - 5, durF], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = Math.min(appear, leave);

  // Word timing estimated by character count across the line's duration.
  const words = line.text.split(" ");
  const total = words.reduce((a, w) => a + w.length + 1, 0);
  const spoken = (localF / Math.max(1, durF * 0.92)) * total;
  let acc = 0;
  const isLight = tone?.(frame) === "light";

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
          opacity: o,
          transform: `translateY(${(1 - appear) * 16}px)`,
        }}
      >
        <div
          style={{
            background: isLight ? "rgba(245,240,230,0.96)" : "rgba(20,40,63,0.92)",
            borderRadius: 26,
            padding: "20px 34px",
            textAlign: "center",
            fontFamily: fonts.body,
            fontWeight: 700,
            fontSize: type.subtitle,
            lineHeight: 1.28,
            maxWidth: 900,
            boxShadow: "0 10px 30px rgba(13,28,46,0.25)",
          }}
        >
          {words.map((w, i) => {
            const startC = acc;
            acc += w.length + 1;
            const active = spoken >= startC;
            return (
              <span
                key={i}
                style={{
                  color: active ? (isLight ? colors.navy : colors.white) : isLight ? "rgba(20,40,63,0.45)" : "rgba(255,255,255,0.5)",
                }}
              >
                {w}
                {i < words.length - 1 ? " " : ""}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
