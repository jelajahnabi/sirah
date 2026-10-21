import React from "react";
import { Audio, interpolate, staticFile, useVideoConfig } from "remotion";

type Range = { start: number; end: number };

type Props = {
  music: string | null;
  hasNarration: boolean;
  /** Narration ranges (seconds) — music is ducked under these. */
  speech: Range[];
  musicVolume?: number;
  duckedVolume?: number;
};

/**
 * Background music bed, rendered only when a real licensed file is configured.
 * It is ducked under narration so it never obscures the voice.
 * (Narration clips themselves are placed per scene in the episode composition.)
 */
export const EpisodeAudio: React.FC<Props> = ({ music, hasNarration, speech, musicVolume = 0.2, duckedVolume = 0.06 }) => {
  const { fps, durationInFrames } = useVideoConfig();
  if (!music) return null;

  const musicVol = (f: number) => {
    const t = f / fps;
    let duck = 0;
    for (const r of speech) {
      duck = Math.max(
        duck,
        interpolate(t, [r.start - 0.3, r.start, r.end, r.end + 0.4], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      );
    }
    const fadeOut = interpolate(f, [durationInFrames - 45, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
    const fadeIn = interpolate(f, [0, 20], [0, 1], { extrapolateRight: "clamp" });
    return (musicVolume - (musicVolume - duckedVolume) * (hasNarration ? duck : 0)) * fadeOut * fadeIn;
  };

  return <Audio src={staticFile(music)} volume={musicVol} loop />;
};
