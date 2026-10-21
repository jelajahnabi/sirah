import { video } from "../../styles/theme";

const s = (sec: number) => Math.round(sec * video.fps);

/** Scene boundaries for Episode 01 (60 s @ 30 fps = 1800 frames). */
export const SCENES = {
  opening: { from: s(0), duration: s(8) }, //    00:00–00:08
  fivePillars: { from: s(8), duration: s(8) }, // 00:08–00:16
  ihram: { from: s(16), duration: s(9) }, //      00:16–00:25
  tawaf: { from: s(25), duration: s(10) }, //     00:25–00:35
  sai: { from: s(35), duration: s(9) }, //        00:35–00:44
  tahallul: { from: s(44), duration: s(7) }, //   00:44–00:51
  tertib: { from: s(51), duration: s(5) }, //     00:51–00:56
  outro: { from: s(56), duration: s(4) }, //      00:56–01:00
} as const;

export const EPISODE_01_DURATION = s(60);
