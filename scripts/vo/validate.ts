/**
 * Validates narration, timing, subtitles and (optionally) a rendered MP4.
 *
 *   npm run vo:validate
 *   npm run vo:validate -- --video out/UFT-Episode01-Kenali-5-Rukun-Umroh.mp4
 *
 * Checks
 *  - every subtitle phrase matches the spoken text, fits in two lines
 *  - measured clip durations still match the files on disk
 *  - each scene contains its whole narration; phrases are ordered and non-overlapping
 *  - episode length is close to the 60 s target
 *  - video: 1080×1920, 30 fps, H.264, expected duration; audio stream present when VO exists
 *  - audio sync: speech energy inside every scene's narration window, quiet between scenes
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { phraseSlices, plain } from "../../src/episodes/episode-01/narration";
import { buildTimeline, FPS, TARGET_SEC } from "../../src/episodes/episode-01/timeline";
import { arg, probeDuration, readManifest, ROOT, scenesInOrder } from "./common";

const errors: string[] = [];
const warns: string[] = [];
const ok: string[] = [];
const manifestPath = arg("manifest") ? path.resolve(arg("manifest")!) : undefined;
const manifest = readManifest(manifestPath);
const tl = buildTimeline(manifest);

// ---- narration / subtitle text
/** Approx. characters that fit on one subtitle line (46 px Inter Bold in an 830 px box). */
const LINE_CHARS = 34;
for (const n of scenesInOrder()) {
  try {
    phraseSlices(n);
  } catch (e) {
    errors.push((e as Error).message);
  }
  for (const p of n.phrases) {
    if (plain(p).length > LINE_CHARS * 2 - 4) errors.push(`[${n.key}] subtitle may exceed two lines: "${plain(p)}"`);
  }
}
ok.push(`${scenesInOrder().reduce((a, n) => a + n.phrases.length, 0)} subtitle phrases checked (≤ 2 lines, match narration)`);

// ---- audio clips
const clips = Object.entries(manifest.scenes);
if (clips.length === 0) warns.push("No voice-over clips measured yet — timing uses estimates and the render will be silent.");
for (const [key, s] of clips) {
  if (!s) continue;
  const f = path.join(ROOT, "public", s.file);
  if (!existsSync(f)) {
    errors.push(`[${key}] audio file missing: ${s.file}`);
    continue;
  }
  const d = probeDuration(f);
  if (Math.abs(d - s.durationSec) > 0.02) errors.push(`[${key}] ${s.file} is ${d.toFixed(3)} s but manifest says ${s.durationSec} s — re-run vo:measure`);
}
if (clips.length) ok.push(`${clips.length}/8 voice-over clips present and matching their measured durations`);

// ---- timeline
for (const k of tl.order) {
  const s = tl.scenes[k];
  if (s.voEnd > s.duration) errors.push(`[${k}] narration (${s.voEnd} f) runs past the scene end (${s.duration} f)`);
  s.phrases.forEach((p, i) => {
    if (p.end <= p.start) errors.push(`[${k}] phrase ${i + 1} has no duration`);
    if (i > 0 && p.start < s.phrases[i - 1].end) errors.push(`[${k}] phrase ${i + 1} overlaps the previous one`);
    if (p.end > s.duration) errors.push(`[${k}] phrase ${i + 1} outlasts its scene`);
    if (p.end - p.start < 0.6 * FPS) warns.push(`[${k}] phrase "${plain(p.text)}" is on screen < 0.6 s`);
  });
}
const off = tl.totalSec - TARGET_SEC;
if (Math.abs(off) > 3) errors.push(`Episode is ${tl.totalSec.toFixed(2)} s (${off > 0 ? "+" : ""}${off.toFixed(2)} s vs target)`);
else if (Math.abs(off) > 0.5) warns.push(`Episode is ${tl.totalSec.toFixed(2)} s (target ${TARGET_SEC} s)`);
else ok.push(`Episode length ${tl.totalSec.toFixed(2)} s (target ${TARGET_SEC} s)`);
ok.push(`Timing source: ${tl.measured ? "measured audio" : "estimates (no complete voice-over yet)"}`);

// ---- rendered video
const video = arg("video");
if (video) {
  const v = path.resolve(video);
  if (!existsSync(v)) errors.push(`Video not found: ${video}`);
  else {
    const probe = JSON.parse(
      execFileSync("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", v]).toString(),
    ) as { streams: { codec_type: string; codec_name: string; width?: number; height?: number; r_frame_rate?: string; nb_frames?: string }[]; format: { duration: string } };
    const vs = probe.streams.find((s) => s.codec_type === "video");
    const as = probe.streams.find((s) => s.codec_type === "audio");
    const dur = Number(probe.format.duration);
    if (!vs || vs.codec_name !== "h264") errors.push("Video stream is not H.264");
    if (vs && (vs.width !== 1080 || vs.height !== 1920)) errors.push(`Resolution is ${vs.width}×${vs.height}, expected 1080×1920`);
    if (vs && vs.r_frame_rate !== "30/1") errors.push(`Frame rate is ${vs.r_frame_rate}, expected 30/1`);
    if (Math.abs(dur - tl.totalSec) > 0.1) errors.push(`Video is ${dur.toFixed(2)} s, timeline says ${tl.totalSec.toFixed(2)} s`);
    else ok.push(`Video: H.264 ${vs?.width}×${vs?.height} @ ${vs?.r_frame_rate}, ${dur.toFixed(2)} s`);

    const hasVo = clips.length > 0;
    if (hasVo && !as) errors.push("Voice-over is configured but the MP4 has no audio stream");
    if (!hasVo) warns.push(as ? "MP4 has an audio stream but no voice-over is configured (silent track)" : "MP4 has no audio (no voice-over recorded yet)");

    if (hasVo && as) {
      // Speech-activity check: RMS level per 100 ms window.
      const pcm = execFileSync("ffmpeg", ["-v", "error", "-i", v, "-ac", "1", "-ar", "8000", "-f", "s16le", "-"], { maxBuffer: 1 << 28 });
      const samples = new Int16Array(pcm.buffer, pcm.byteOffset, Math.floor(pcm.length / 2));
      const win = 800;
      const rmsDb = (fromSec: number, toSec: number) => {
        const a = Math.max(0, Math.floor(fromSec * 8000));
        const b = Math.min(samples.length, Math.floor(toSec * 8000));
        let loudWindows = 0;
        let total = 0;
        for (let i = a; i + win <= b; i += win) {
          let sum = 0;
          for (let j = i; j < i + win; j++) sum += samples[j] * samples[j];
          const db = 20 * Math.log10(Math.sqrt(sum / win) / 32768 + 1e-9);
          if (db > -40) loudWindows++;
          total++;
        }
        return total ? loudWindows / total : 0;
      };
      for (const k of tl.order) {
        const s = tl.scenes[k];
        if (!s.audioSrc) continue;
        const a = (s.from + s.voStart) / FPS;
        const b = (s.from + s.voEnd) / FPS;
        const speech = rmsDb(a, b);
        if (speech < 0.4) errors.push(`[${k}] little speech detected in its narration window (${(speech * 100).toFixed(0)}% active)`);
        const gapFrom = (s.from + s.voEnd) / FPS + 0.15;
        const gapTo = (s.from + s.duration) / FPS - 0.05;
        if (gapTo - gapFrom > 0.2 && rmsDb(gapFrom, gapTo) > 0.5) warns.push(`[${k}] audio is still loud after the narration should have ended — check sync`);
      }
      ok.push("Speech detected inside every scene's narration window");
    }
  }
}

for (const o of ok) console.log(`✔ ${o}`);
for (const w of warns) console.log(`⚠ ${w}`);
for (const e of errors) console.log(`✖ ${e}`);
console.log(errors.length ? `\nFAILED (${errors.length} error(s))` : "\nPASSED");
process.exit(errors.length ? 1 : 0);
