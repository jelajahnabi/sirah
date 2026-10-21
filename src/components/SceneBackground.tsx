import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "../styles/theme";

type Props = {
  variant?: "ivory" | "navy";
  /** Slowly drifting soft circles, in the spirit of the reference explainer style. */
  blobs?: boolean;
};

/** Series background: flat ivory (or navy) with soft drifting shapes and a fine grain-free vignette. */
export const SceneBackground: React.FC<Props> = ({ variant = "ivory", blobs = true }) => {
  const frame = useCurrentFrame();
  const isNavy = variant === "navy";
  const base = isNavy ? colors.navy : colors.ivory;
  const blobA = isNavy ? "rgba(198,165,107,0.10)" : "rgba(198,165,107,0.16)";
  const blobB = isNavy ? "rgba(255,255,255,0.04)" : "rgba(20,40,63,0.05)";
  const drift = (amp: number, speed: number, phase: number) => Math.sin(frame * speed + phase) * amp;

  return (
    <AbsoluteFill style={{ backgroundColor: base, overflow: "hidden" }}>
      {blobs ? (
        <>
          <div
            className="absolute rounded-full"
            style={{
              width: 900,
              height: 900,
              left: -380 + drift(30, 0.012, 0),
              top: 260 + drift(40, 0.01, 1),
              background: blobA,
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 760,
              height: 760,
              right: -320 + drift(30, 0.014, 2),
              top: 980 + drift(30, 0.011, 3),
              background: blobB,
            }}
          />
        </>
      ) : null}
      <AbsoluteFill
        style={{
          background: isNavy
            ? "radial-gradient(ellipse at 50% 40%, rgba(30,58,88,0.6) 0%, rgba(13,28,46,0) 70%)"
            : "radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 65%)",
        }}
      />
    </AbsoluteFill>
  );
};
