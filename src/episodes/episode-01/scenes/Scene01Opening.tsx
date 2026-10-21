import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedTitle } from "../../../components/AnimatedTitle";
import { easeInOut, progress, sceneEnvelope, springAt } from "../../../components/anim";
import { MasjidilHaramAerial } from "../../../components/MasjidilHaramAerial";
import { SeriesTag } from "../../../components/SeriesTag";
import { episodeLabel, series } from "../../../series/umroh-first-timer/series.config";
import { colors, fonts, safe, springs } from "../../../styles/theme";
import type { SceneProps } from "../Episode01";
import { cue } from "../sync";

/** 00:00–00:08 — Aerial Masjidil Haram, slow push-in, kinetic headline. */
export const Scene01Opening: React.FC<SceneProps> = ({ t }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = t.duration;
  const push = progress(frame, 0, dur, easeInOut);
  // "…yuk kenali lima rukun umroh" → the pill lands with the words
  const pill = springAt(frame, fps, cue(t, 2) - 3, springs.pop);
  const titleFloat = -push * 30;

  return (
    <AbsoluteFill style={{ opacity: sceneEnvelope(frame, dur, 1, 12), backgroundColor: colors.navyDeep }}>
      <MasjidilHaramAerial push={push} />
      {/* top scrim for legibility */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(13,28,46,0.92) 0%, rgba(13,28,46,0.7) 30%, rgba(13,28,46,0) 50%)" }} />

      <div className="absolute flex flex-col items-center" style={{ top: safe.top, left: safe.x, right: safe.x, transform: `translateY(${titleFloat}px)` }}>
        <SeriesTag series={series.title} episode={episodeLabel(1)} delay={4} />
        <AnimatedTitle
          lines={["UMROH", "PERTAMA KALI?"]}
          delay={14}
          stagger={5}
          fontSize={124}
          color={colors.ivory}
          accentWords={["KALI?"]}
          style={{ marginTop: 60, textShadow: "0 8px 40px rgba(0,0,0,0.35)" }}
        />
        <div
          style={{
            marginTop: 44,
            background: colors.gold,
            color: colors.navy,
            borderRadius: 999,
            padding: "18px 44px",
            fontFamily: fonts.body,
            fontWeight: 800,
            fontSize: 54,
            boxShadow: "0 16px 50px rgba(198,165,107,0.45)",
            transform: `scale(${pill}) rotate(${(1 - pill) * -6}deg)`,
            opacity: Math.min(1, pill * 1.5),
          }}
        >
          Kenali <span style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 64 }}>5</span> Rukunnya!
        </div>
      </div>
    </AbsoluteFill>
  );
};
