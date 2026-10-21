import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { sceneEnvelope, springAt } from "../../../components/anim";
import { InfoChip } from "../../../components/InfoChip";
import { SceneBackground } from "../../../components/SceneBackground";
import { SceneHeader } from "../../../components/SceneHeader";
import { TahallulIllustration } from "../../../components/TahallulIllustration";
import { colors, springs } from "../../../styles/theme";
import { SCENES } from "../timeline";

/** 00:44–00:51 — Respectful close-up of a pilgrim's hair being trimmed. */
export const Scene06Tahallul: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = SCENES.tahallul.duration;
  const enter = springAt(frame, fps, 6, springs.gentle);
  const hand = springAt(frame, fps, 18, springs.gentle);
  const cam = interpolate(frame, [0, dur], [1, 1.07]);

  return (
    <AbsoluteFill style={{ opacity: sceneEnvelope(frame, dur) }}>
      <SceneBackground />
      <div
        style={{
          position: "absolute",
          left: 130,
          top: 400,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 60}px) scale(${cam})`,
          transformOrigin: "60% 30%",
        }}
      >
        <TahallulIllustration size={820} snipFrom={36} handIn={hand} />
      </div>
      <SceneHeader number="04" title="TAHALLUL" subtitle="Mencukur atau memotong rambut" />

      <InfoChip label="LAKI-LAKI" delay={84} fontSize={30} style={{ left: 70, top: 1190, width: 450 }}>
        Mencukur habis, atau memendekkan rambut
      </InfoChip>
      <InfoChip label="PEREMPUAN" delay={98} tone="navy" fontSize={30} style={{ right: 70, top: 1190, width: 440 }}>
        Cukup memotong <b style={{ color: colors.goldLight }}>ujung</b> rambut
      </InfoChip>
    </AbsoluteFill>
  );
};
