import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, progress, sceneEnvelope } from "../../../components/anim";
import { SaiRouteAnimation } from "../../../components/SaiRouteAnimation";
import { SceneBackground } from "../../../components/SceneBackground";
import { SceneHeader } from "../../../components/SceneHeader";
import { colors, fonts, shadow } from "../../../styles/theme";
import type { SceneProps } from "../Episode01";
import { cue } from "../sync";

const legsAt = (f: number, walkStart: number, leg: number) => {
  const raw = (f - walkStart) / leg;
  if (raw <= 0) return 0;
  if (raw >= 7) return 7;
  const i = Math.floor(raw);
  return i + easeInOut(raw - i);
};

type Caption = { from: number; to: number; text: React.ReactNode };

/** 00:35–00:44 — Safa ⇄ Marwah: seven legs, one-way vs round trip, start Safa / finish Marwah. */
export const Scene05Sai: React.FC<SceneProps> = ({ t }) => {
  const frame = useCurrentFrame();
  const dur = t.duration;
  // "Berjalan tujuh lintasan" → the walk starts; all 7 legs end ~1.2 s before the cut.
  const WALK_START = Math.min(cue(t, 1), dur - 36 - 175);
  const LEG = (dur - 36 - WALK_START) / 7;
  // "Dimulai dari Safa" → Safa glows; "…berakhir di Marwah" → Marwah glows.
  const safaAt = cue(t, 3);
  const build = progress(frame, 6, 26);
  const legs = legsAt(frame, WALK_START, LEG);
  const safa = Math.max(
    legs < 0.4 ? build : 0,
    interpolate(frame, [safaAt - 4, safaAt + 6, safaAt + 40, safaAt + 52], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const leg2End = Math.round(WALK_START + LEG * 2);
  const rt = interpolate(frame, [leg2End, leg2End + 8, leg2End + 70, leg2End + 85], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const finishAt = Math.round(WALK_START + LEG * 7);
  const finish = progress(frame, finishAt, 14);

  const gold = (t: string) => <b style={{ color: colors.gold }}>{t}</b>;
  const captions: Caption[] = [
    { from: Math.round(WALK_START + LEG - 6), to: leg2End, text: <>Safa → Marwah = {gold("1 lintasan")}</> },
    { from: leg2End, to: leg2End + 85, text: <>Safa → Marwah → Safa = {gold("2 lintasan")}</> },
    { from: leg2End + 85, to: finishAt, text: <>Pulang-pergi dihitung {gold("dua")}, bukan satu</> },
    { from: finishAt, to: dur, text: <>Mulai di {gold("SAFA")}, selesai di {gold("MARWAH")} ✓</> },
  ];

  return (
    <AbsoluteFill style={{ opacity: sceneEnvelope(frame, dur) }}>
      <SceneBackground />
      <SceneHeader number="03" title="SA'I" subtitle="7 Lintasan antara Safa dan Marwah" />

      <div style={{ position: "absolute", left: 90, top: 330 }}>
        <SaiRouteAnimation width={900} legs={legs} build={build} roundTripHighlight={rt} finish={Math.max(finish, interpolate(frame, [cue(t, 4) - 4, cue(t, 4) + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))} start={safa} />
      </div>

      {captions.map((c, i) => {
        const o = Math.min(
          interpolate(frame, [c.from, c.from + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          interpolate(frame, [c.to - 6, c.to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        );
        if (o <= 0) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 1300, display: "flex", justifyContent: "center", opacity: o }}>
            <div
              style={{
                background: colors.navy,
                color: colors.white,
                borderRadius: 999,
                padding: "16px 36px",
                fontFamily: fonts.body,
                fontWeight: 700,
                fontSize: 38,
                boxShadow: shadow.card,
                transform: `translateY(${(1 - o) * 16}px)`,
              }}
            >
              {c.text}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
