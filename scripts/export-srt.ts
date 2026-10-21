/**
 * Exports Episode 01 subtitles/narration timeline as SRT.
 * Usage: node --experimental-strip-types scripts/export-srt.ts
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { SUBTITLE_LINES } from "../src/episodes/episode-01/narration.ts";

const ts = (sec: number) => {
  const ms = Math.round(sec * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const r = ms % 1000;
  const p = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${p(h)}:${p(m)}:${p(s)},${p(r, 3)}`;
};

const srt = SUBTITLE_LINES.map((l, i) => `${i + 1}\n${ts(l.start)} --> ${ts(l.end)}\n${l.text}\n`).join("\n");
mkdirSync("out", { recursive: true });
writeFileSync("out/episode-01.id.srt", srt);
console.log(`Wrote out/episode-01.id.srt (${SUBTITLE_LINES.length} cues)`);
