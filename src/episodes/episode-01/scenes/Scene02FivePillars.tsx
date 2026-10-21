import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedTitle } from "../../../components/AnimatedTitle";
import { progress, sceneEnvelope, springAt } from "../../../components/anim";
import { PillarIcon } from "../../../components/PillarIcon";
import { SceneBackground } from "../../../components/SceneBackground";
import { PILLARS } from "../../../series/umroh-first-timer/pillars";
import { colors, fonts, safe, shadow, springs } from "../../../styles/theme";
import type { SceneProps } from "../Episode01";
import { cue } from "../sync";

const LEGEND = [
  { k: "RUKUN", v: "Wajib dikerjakan. Tanpanya umroh tidak sah." },
  { k: "WAJIB", v: "Bila ditinggalkan, umroh sah tapi wajib bayar dam." },
  { k: "SUNNAH", v: "Dianjurkan, berpahala." },
];

/** 00:08–00:16 — Five numbered cards enter sequentially, then rukun vs wajib vs sunnah legend. */
export const Scene02FivePillars: React.FC<SceneProps> = ({ t }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = t.duration;
  // "Rukun adalah bagian pokok…" → legend; "…umroh belum sah" → RUKUN card pulses
  const legendAt = cue(t, 0) + 30;
  const belumSah = springAt(frame, fps, cue(t, 2), springs.pop) * (1 - progress(frame, cue(t, 2) + 40, 20));
  const cam = interpolate(frame, [0, dur], [1, 1.03]);

  return (
    <AbsoluteFill style={{ opacity: sceneEnvelope(frame, dur) }}>
      <SceneBackground />
      <AbsoluteFill style={{ transform: `scale(${cam})` }}>
        <div className="absolute flex flex-col items-center" style={{ top: safe.top, left: safe.x, right: safe.x }}>
          <div
            style={{
              fontFamily: fonts.body,
              fontWeight: 800,
              fontSize: 30,
              letterSpacing: 8,
              color: colors.goldDeep,
              opacity: progress(frame, 0, 15),
            }}
          >
            AGAR UMROH SAH
          </div>
          <AnimatedTitle lines={["5 Rukun Umroh"]} delay={4} fontSize={100} style={{ marginTop: 12 }} accentWords={["5"]} />
        </div>

        {PILLARS.map((p, i) => {
          const s = springAt(frame, fps, 8 + i * 9, springs.pop);
          const top = 400 + i * 156;
          return (
            <div
              key={p.id}
              style={{
                position: "absolute",
                left: safe.x,
                right: safe.x,
                top,
                height: 136,
                background: colors.white,
                borderRadius: 32,
                boxShadow: shadow.card,
                display: "flex",
                alignItems: "center",
                padding: "0 34px",
                gap: 30,
                opacity: Math.min(1, s * 1.4),
                transform: `translateX(${(1 - s) * (i % 2 === 0 ? -140 : 140)}px) scale(${0.85 + 0.15 * s})`,
              }}
            >
              <div
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: 84,
                  background: colors.navy,
                  color: colors.gold,
                  fontFamily: fonts.display,
                  fontWeight: 900,
                  fontSize: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {p.number}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 58, color: colors.navy, lineHeight: 1 }}>{p.name}</div>
                <div style={{ fontFamily: fonts.body, fontWeight: 500, fontSize: 28, color: colors.navy, opacity: 0.7, marginTop: 6 }}>
                  {p.short}
                </div>
              </div>
              <PillarIcon id={p.id} size={84} />
            </div>
          );
        })}

        {/* rukun ≠ wajib ≠ sunnah */}
        <div className="absolute flex" style={{ top: 1200, left: safe.x, right: safe.x, gap: 16 }}>
          {LEGEND.map((l, i) => {
            const s = springAt(frame, fps, legendAt + i * 8, springs.gentle);
            const isRukun = i === 0;
            return (
              <div
                key={l.k}
                style={{
                  flex: 1,
                  borderRadius: 22,
                  padding: "16px 18px",
                  background: isRukun ? colors.navy : "rgba(20,40,63,0.06)",
                  border: isRukun ? "none" : `2px solid rgba(20,40,63,0.12)`,
                  opacity: s,
                  transform: `translateY(${(1 - s) * 24}px) scale(${isRukun ? 1 + 0.08 * belumSah : 1})`,
                  boxShadow: isRukun ? `0 0 0 ${6 * belumSah}px ${colors.gold}` : undefined,
                }}
              >
                <div style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: colors.gold }}>{l.k}</div>
                <div
                  style={{
                    fontFamily: fonts.body,
                    fontWeight: 500,
                    fontSize: 23,
                    lineHeight: 1.3,
                    marginTop: 4,
                    color: isRukun ? colors.ivory : colors.navy,
                  }}
                >
                  {l.v}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
