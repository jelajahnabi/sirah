import React from "react";
import { Audio, interpolate, staticFile, useVideoConfig } from "remotion";

type Range = { start: number; end: number };

type Props = {
  narration: string | null;
  music: string | null;
  /** Narration ranges (seconds) — music is ducked under these. */
  speech: Range[];
  musicVolume?: number;
  duckedVolume?: number;
};

/**
 * Renders narration and background music only when real files are configured.
 * Music is ducked under narration so it never obscures the voice.
 */
export const EpisodeAudio: React.FC<Props> = ({ narration, music, speech, musicVolume = 0.22, duckedVolume = 0.07 }) => {
  const { fps, durationInFrames } = useVideoConfig();

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
    return (musicVolume - (musicVolume - duckedVolume) * (narration ? duck : 0)) * fadeOut * fadeIn;
  };

  return (
    <>
      {narration ? <Audio src={staticFile(narration)} /> : null}
      {music ? <Audio src={staticFile(music)} volume={musicVol} /> : null}
    </>
  );
};
