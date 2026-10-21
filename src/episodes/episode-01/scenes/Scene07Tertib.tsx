import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { sceneEnvelope, springAt } from "../../../components/anim";
import { FivePillarsTimeline } from "../../../components/FivePillarsTimeline";
import { SceneBackground } from "../../../components/SceneBackground";
import { SceneHeader } from "../../../components/SceneHeader";
import { PILLARS } from "../../../series/umroh-first-timer/pillars";
import { colors, fonts, shadow, springs } from "../../../styles/theme";
import type { SceneProps } from "../Episode01";
import { cue } from "../sync";

/** 00:51–00:56 — The five icons connect into a timeline; TERTIB is highlighted. */
export const Scene07Tertib: React.FC<SceneProps> = ({ t }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = t.duration;
  // "Kelima, tertib." → node 05 highlighted; "Semua rukun dilaksanakan sesuai urutannya" → order chips
  const orderAt = cue(t, 1);
  const order = PILLARS.slice(0, 4);

  return (
    <AbsoluteFill style={{ opacity: sceneEnvelope(frame, dur, 10, 8) }}>
      <SceneBackground />
      <SceneHeader number="05" title="TERTIB" subtitle="Dikerjakan sesuai urutannya" />

      <div style={{ position: "absolute", left: 90, top: 560 }}>
        <FivePillarsTimeline width={900} delay={8} stagger={7} highlight={4} highlightAt={Math.max(30, cue(t, 0) + 14)} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 920,
          background: colors.white,
          borderRadius: 34,
          boxShadow: shadow.card,
          padding: "34px 30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
        }}
      >
        <div style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: colors.goldDeep }}>URUTAN YANG BENAR</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "nowrap" }}>
          {order.map((p, i) => {
            const s = springAt(frame, fps, orderAt + i * 7, springs.pop);
            return (
              <React.Fragment key={p.id}>
                {i > 0 ? (
                  <div style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 36, color: colors.gold, opacity: s }}>→</div>
                ) : null}
                <div
                  style={{
                    background: colors.navy,
                    color: colors.white,
                    borderRadius: 18,
                    padding: "12px 18px",
                    fontFamily: fonts.body,
                    fontWeight: 800,
                    fontSize: 30,
                    transform: `scale(${s})`,
                    opacity: Math.min(1, s * 1.5),
                  }}
                >
                  {p.name}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
