import { Easing, interpolate, spring } from "remotion";
import { springs } from "../styles/theme";

export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** 0 → 1 over [start, start + duration], clamped, eased. */
export const progress = (frame: number, start: number, duration: number, easing = easeOut) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Spring that starts at `delay` frames. */
export const springAt = (
  frame: number,
  fps: number,
  delay = 0,
  config: Partial<{ damping: number; stiffness: number; mass: number }> = springs.gentle,
  durationInFrames?: number,
) => spring({ frame: frame - delay, fps, config, durationInFrames });

/** Opacity envelope for a scene: fade in at the start, fade out at the end. */
export const sceneEnvelope = (frame: number, duration: number, fadeIn = 10, fadeOut = 10) =>
  Math.min(
    interpolate(frame, [0, fadeIn], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [duration - fadeOut, duration], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

/** Deterministic pseudo-random in [0, 1) from a seed. */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
