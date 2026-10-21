import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, springs } from "../styles/theme";
import { progress, springAt } from "./anim";
import { IslamicStar } from "./IslamicPattern";
import { SceneBackground } from "./SceneBackground";

type Props = {
  seriesTitle: string;
  tagline: string;
  producerLabel: string;
  producer: string;
};

/** Series end card: navy field, gold line drawing across, title, tagline and producer credit. */
export const BrandOutro: React.FC<Props> = ({ seriesTitle, tagline, producerLabel, producer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const star = progress(frame, 0, 40);
  const line = progress(frame, 6, 30);
  const title = springAt(frame, fps, 10, springs.snappy);
  const tag = progress(frame, 24, 18);
  const credit = springAt(frame, fps, 40, springs.gentle);
  const shimmer = ((frame - 30) / 60) * 160 - 30;

  return (
    <AbsoluteFill>
      <SceneBackground variant="navy" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", top: 560 }}>
          <IslamicStar size={620} color={colors.gold} opacity={0.14} rotate={frame * 0.15} strokeWidth={1.2} draw={star} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -120 }}>
          <IslamicStar size={96} color={colors.gold} rotate={45 + frame * 0.4} strokeWidth={4} draw={star} />
          <div
            style={{
              marginTop: 50,
              fontFamily: fonts.display,
              fontWeight: 900,
              fontSize: 104,
              lineHeight: 1,
              letterSpacing: 2,
              textAlign: "center",
              color: colors.ivory,
              opacity: title,
              transform: `translateY(${(1 - title) * 50}px)`,
              backgroundImage: `linear-gradient(100deg, ${colors.ivory} ${shimmer - 12}%, ${colors.goldLight} ${shimmer}%, ${colors.ivory} ${shimmer + 12}%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {seriesTitle.split(" ").slice(0, 1).join(" ")}
            <br />
            {seriesTitle.split(" ").slice(1).join(" ")}
          </div>
          <div style={{ marginTop: 44, width: 640 * line, height: 4, background: colors.gold, borderRadius: 2 }} />
          <div
            style={{
              marginTop: 36,
              fontFamily: fonts.display,
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 46,
              color: colors.goldLight,
              opacity: tag,
              transform: `translateY(${(1 - tag) * 20}px)`,
              textAlign: "center",
            }}
          >
            {tagline}
          </div>
          <div style={{ marginTop: 120, textAlign: "center", opacity: credit, transform: `translateY(${(1 - credit) * 20}px)` }}>
            <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 26, letterSpacing: 8, color: colors.ivory, opacity: 0.7 }}>
              {producerLabel}
            </div>
            <div style={{ marginTop: 14, fontFamily: fonts.body, fontWeight: 800, fontSize: 52, letterSpacing: 6, color: colors.gold }}>
              {producer}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
