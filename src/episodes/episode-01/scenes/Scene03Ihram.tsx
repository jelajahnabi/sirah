import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { progress, sceneEnvelope, springAt } from "../../../components/anim";
import { InfoChip } from "../../../components/InfoChip";
import { PilgrimCharacter } from "../../../components/PilgrimCharacter";
import { SceneBackground } from "../../../components/SceneBackground";
import { SceneHeader } from "../../../components/SceneHeader";
import { colors, fonts, shadow, springs } from "../../../styles/theme";
import type { SceneProps } from "../Episode01";
import { cue } from "../sync";

const GROUND = 1330;

const MiqatBackdrop: React.FC<{ build: number }> = ({ build }) => {
  const frame = useCurrentFrame();
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {/* sun disc */}
      <circle cx={760} cy={760} r={150} fill={colors.goldLight} opacity={0.35 * build} />
      {/* desert hills */}
      <path d={`M0 ${GROUND - 170} Q260 ${GROUND - 280} 520 ${GROUND - 190} T1080 ${GROUND - 210} L1080 ${GROUND} L0 ${GROUND} Z`} fill={colors.ivoryDeep} opacity={build} />
      {/* miqat mosque */}
      <g opacity={build} transform={`translate(0 ${(1 - build) * 40})`}>
        <rect x={430} y={GROUND - 330} width={470} height={330} fill={colors.white} stroke={colors.navy} strokeWidth={5} />
        <path d={`M560 ${GROUND - 330} A105 105 0 0 1 770 ${GROUND - 330} Z`} fill={colors.white} stroke={colors.navy} strokeWidth={5} />
        <path d={`M665 ${GROUND - 435} L665 ${GROUND - 470}`} stroke={colors.gold} strokeWidth={6} />
        <circle cx={665} cy={GROUND - 478} r={8} fill={colors.gold} />
        {[480, 560, 640, 720, 800].map((x) => (
          <path key={x} d={`M${x} ${GROUND} L${x} ${GROUND - 120} A30 30 0 0 1 ${x + 60} ${GROUND - 120} L${x + 60} ${GROUND} Z`} fill={colors.navy} opacity={0.12} />
        ))}
        <rect x={430} y={GROUND - 200} width={470} height={10} fill={colors.gold} opacity={0.7} />
        {/* minaret */}
        <rect x={920} y={GROUND - 560} width={46} height={560} fill={colors.white} stroke={colors.navy} strokeWidth={5} />
        <rect x={910} y={GROUND - 440} width={66} height={16} fill={colors.gold} />
        <path d={`M920 ${GROUND - 560} L943 ${GROUND - 630} L966 ${GROUND - 560} Z`} fill={colors.gold} stroke={colors.navy} strokeWidth={5} strokeLinejoin="round" />
        {/* palm */}
        <g transform={`translate(140 ${GROUND}) rotate(${Math.sin(frame / 30) * 1.5})`}>
          <path d="M0 0 Q-10 -150 8 -300" stroke={colors.goldDeep} strokeWidth={16} fill="none" strokeLinecap="round" />
          {[-60, -25, 15, 50, 85].map((a) => (
            <path key={a} d="M8 -300 Q60 -330 120 -290" stroke={colors.navy} strokeWidth={14} fill="none" strokeLinecap="round" transform={`rotate(${a - 20} 8 -300)`} opacity={0.85} />
          ))}
        </g>
      </g>
      {/* ground */}
      <rect x={0} y={GROUND} width={1080} height={1920 - GROUND} fill={colors.ivoryDeep} />
      <rect x={0} y={GROUND} width={1080} height={6} fill={colors.gold} opacity={0.6} />
    </svg>
  );
};

/** 00:16–00:25 — Pilgrims at the miqat entering ihram with the niat. */
export const Scene03Ihram: React.FC<SceneProps> = ({ t }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = t.duration;
  // "Pertama, ihram." → pilgrims enter; "Yaitu berniat…" → NIAT UMROH + talbiyah;
  // "…ketentuan miqat." → bubble gives way to the miqat note.
  const niatAt = cue(t, 1);
  const miqatAt = cue(t, 2);
  const build = progress(frame, 4, 26);
  const maleIn = springAt(frame, fps, 14, springs.gentle);
  const femaleIn = springAt(frame, fps, 24, springs.gentle);
  const bubble = Math.min(springAt(frame, fps, niatAt - 4, springs.pop), 1 - progress(frame, miqatAt - 8, 10));
  const niatGlow = progress(frame, niatAt - 6, 20) * (0.6 + 0.4 * Math.sin(frame / 6));
  const cam = interpolate(frame, [0, dur], [1.04, 1]);
  const speaking = frame > niatAt && frame < miqatAt - 8 ? 1 : 0;

  return (
    <AbsoluteFill style={{ opacity: sceneEnvelope(frame, dur) }}>
      <SceneBackground />
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: "50% 70%" }}>
        <MiqatBackdrop build={build} />

        {/* signpost */}
        <div
          style={{
            position: "absolute",
            left: 760,
            top: GROUND - 250,
            opacity: build,
            transform: `translateY(${(1 - build) * 30}px)`,
          }}
        >
          <div style={{ position: "absolute", left: 96, top: 60, width: 14, height: 190, background: colors.navy, borderRadius: 4 }} />
          <div
            style={{
              position: "relative",
              background: colors.navy,
              color: colors.gold,
              borderRadius: 16,
              padding: "14px 26px",
              fontFamily: fonts.body,
              fontWeight: 800,
              fontSize: 40,
              letterSpacing: 6,
              boxShadow: shadow.soft,
              border: `4px solid ${colors.gold}`,
            }}
          >
            MIQAT
          </div>
        </div>

        {/* niat glow */}
        <div
          style={{
            position: "absolute",
            left: 140,
            top: GROUND - 760,
            width: 340,
            height: 340,
            borderRadius: 340,
            background: `radial-gradient(circle, rgba(198,165,107,${0.55 * niatGlow}) 0%, rgba(198,165,107,0) 70%)`,
          }}
        />

        {/* characters */}
        <div style={{ position: "absolute", left: 160 - (1 - maleIn) * 400, top: GROUND - 700 + 8, opacity: maleIn }}>
          <PilgrimCharacter gender="male" height={700} talk={speaking} />
        </div>
        <div style={{ position: "absolute", left: 470 + (1 - femaleIn) * 500, top: GROUND - 640 + 8, opacity: femaleIn }}>
          <PilgrimCharacter gender="female" height={640} seed={3} talk={speaking * 0.8} />
        </div>
      </AbsoluteFill>

      <SceneHeader number="01" title="IHRAM" subtitle="Berniat memulai ibadah umroh" />

      {/* talbiyah / niat speech bubble */}
      <div
        style={{
          position: "absolute",
          left: 110,
          right: 110,
          top: 390,
          background: colors.white,
          borderRadius: 34,
          boxShadow: shadow.card,
          padding: "58px 34px 26px",
          textAlign: "center",
          transformOrigin: "25% 100%",
          transform: `scale(${bubble})`,
          opacity: Math.min(1, bubble * 1.5),
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -30,
            left: "50%",
            transform: "translateX(-50%)",
            background: colors.gold,
            color: colors.navy,
            borderRadius: 999,
            padding: "8px 30px",
            fontFamily: fonts.body,
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: 5,
            whiteSpace: "nowrap",
            boxShadow: shadow.soft,
          }}
        >
          NIAT UMROH
        </div>
        <div style={{ fontFamily: fonts.arabic, fontWeight: 700, fontSize: 60, color: colors.navy, direction: "rtl", lineHeight: 1.5 }}>
          لَبَّيْكَ اللّٰهُمَّ عُمْرَةً
        </div>
        <div style={{ fontFamily: fonts.body, fontStyle: "italic", fontWeight: 600, fontSize: 32, color: colors.goldDeep, marginTop: 4 }}>
          Labbaika Allāhumma ‘umratan
        </div>
        <div style={{ fontFamily: fonts.body, fontWeight: 500, fontSize: 26, color: colors.navy, opacity: 0.7, marginTop: 6 }}>
          “Aku penuhi panggilan-Mu ya Allah, untuk berumroh”
        </div>
        <div
          style={{
            position: "absolute",
            left: 170,
            bottom: -26,
            width: 0,
            height: 0,
            borderLeft: "22px solid transparent",
            borderRight: "22px solid transparent",
            borderTop: `28px solid ${colors.white}`,
          }}
        />
      </div>

      <InfoChip label="KETENTUAN MIQAT" delay={miqatAt} tone="navy" fontSize={36} style={{ left: 140, right: 140, top: 420 }}>
        Memulai ihram dari miqat termasuk <b style={{ color: colors.goldLight }}>wajib</b> umroh, bukan rukun.
      </InfoChip>
    </AbsoluteFill>
  );
};
