import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { sceneEnvelope } from "../../../components/anim";
import { BrandOutro } from "../../../components/BrandOutro";
import { series } from "../../../series/umroh-first-timer/series.config";
import { SCENES } from "../timeline";

/** 00:56–01:00 — Series end card. */
export const Scene08Outro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: sceneEnvelope(frame, SCENES.outro.duration, 10, 1) }}>
      <BrandOutro seriesTitle={series.title} tagline={series.tagline} producerLabel={series.producerLabel} producer={series.producer} />
    </AbsoluteFill>
  );
};
