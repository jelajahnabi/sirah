import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { easeInOut, progress, sceneEnvelope, springAt } from "../../../components/anim";
import { InfoChip } from "../../../components/InfoChip";
import { SceneBackground } from "../../../components/SceneBackground";
import { SceneHeader } from "../../../components/SceneHeader";
import { TawafPathAnimation } from "../../../components/TawafPathAnimation";
import { colors, fonts, shadow, springs } from "../../../styles/theme";
import { SCENES } from "../timeline";

const WALK_START = 56;
const FIRST_LAP = 54; // first lap slower so the direction reads clearly
const LAP = 24;
const WALK_END = WALK_START + FIRST_LAP + LAP * 6;

/** Piecewise lap progress: slow first lap, then six steady laps. */
const lapsAt = (f: number) =>
  interpolate(f, [WALK_START, WALK_START + FIRST_LAP, WALK_END], [0, 1, 7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => t,
  });

/** 00:25–00:35 — Top-down Ka'bah, seven counterclockwise laps with the Ka'bah on the left. */
export const Scene04Tawaf: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = SCENES.tawaf.duration;
  const build = progress(frame, 10, 30, easeInOut);
  const labels = progress(frame, 30, 30);
  const laps = frame < WALK_START + FIRST_LAP ? interpolate(frame, [WALK_START, WALK_START + FIRST_LAP], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut }) : lapsAt(frame);
  const lapShown = Math.min(7, Math.max(laps > 0 ? 1 : 0, Math.ceil(laps - 1e-6)));
  const done = springAt(frame, fps, WALK_END + 4, springs.pop);
  const diagScale = interpolate(frame, [0, dur], [0.96, 1.02]);

  return (
    <AbsoluteFill style={{ opacity: sceneEnvelope(frame, dur) }}>
      <SceneBackground />
      <SceneHeader number="02" title="TAWAF" subtitle="7 Putaran · Ka'bah di sebelah kiri" />

      <div style={{ position: "absolute", left: 90, top: 370, transform: `scale(${diagScale})`, transformOrigin: "50% 50%" }}>
        <TawafPathAnimation size={900} laps={laps} build={build} labels={labels} leftPointer={progress(frame, WALK_START, 20)} />
      </div>

      <InfoChip label="ARAH" delay={WALK_START + 10} tone="navy" fontSize={28} style={{ left: 70, top: 1130, width: 330 }}>
        Berlawanan arah jarum jam, Ka'bah di <b style={{ color: colors.goldLight }}>kiri</b>
      </InfoChip>

      {/* lap counter */}
      <div
        style={{
          position: "absolute",
          right: 70,
          top: 1160,
          background: colors.white,
          borderRadius: 30,
          boxShadow: shadow.card,
          padding: "18px 28px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: progress(frame, WALK_START - 10, 12),
        }}
      >
        <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: colors.goldDeep }}>PUTARAN</div>
        <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 64, color: colors.navy, lineHeight: 1.1 }}>
          {lapShown}
          <span style={{ fontSize: 36, opacity: 0.5 }}> / 7</span>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          {new Array(7).fill(0).map((_, i) => (
            <div
              key={i}
              style={{
                width: 22,
                height: 22,
                borderRadius: 22,
                background: laps >= i + 1 ? colors.gold : "rgba(20,40,63,0.12)",
              }}
            />
          ))}
        </div>
      </div>

      {/* completion badge */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 770,
          display: "flex",
          justifyContent: "center",
          opacity: Math.min(1, done * 1.5),
          transform: `scale(${done})`,
        }}
      >
        <div
          style={{
            background: colors.navy,
            color: colors.white,
            borderRadius: 999,
            padding: "16px 36px",
            fontFamily: fonts.body,
            fontWeight: 800,
            fontSize: 44,
            boxShadow: shadow.card,
            border: `4px solid ${colors.gold}`,
          }}
        >
          7 Putaran ✓
        </div>
      </div>
    </AbsoluteFill>
  );
};
