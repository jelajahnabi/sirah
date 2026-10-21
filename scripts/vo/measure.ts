/**
 * Measures the real voice-over clips and writes voiceover.manifest.json, which drives the
 * episode timeline (scene lengths, narration placement, subtitle timing).
 *
 *   npm run vo:measure                       # clips in public/assets/audio/episode-01/vo
 *   npm run vo:measure -- --dir <d> --out <manifest.json>   (testing)
 *
 * Expected clip names: 01-opening, 02-fivePillars, 03-ihram, 04-tawaf, 05-sai,
 * 06-tahallul, 07-tertib, 08-outro (.wav/.mp3/.m4a/.flac).
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { buildTimeline, MIN_VISUAL, TARGET_SEC, VoiceoverManifest } from "../../src/episodes/episode-01/timeline";
import { arg, clipStem, findClip, MANIFEST_FILE, MARKS_FILE, probeDuration, ROOT, scenesInOrder, VO_DIR } from "./common";

const dir = arg("dir") ? path.resolve(arg("dir")!) : VO_DIR;
const out = arg("out") ? path.resolve(arg("out")!) : MANIFEST_FILE;
const marksFile = arg("dir") ? path.join(dir, "phrase-marks.json") : MARKS_FILE;
const marks: { provider?: string; voice?: string; scenes?: Record<string, number[]> } = existsSync(marksFile)
  ? JSON.parse(readFileSync(marksFile, "utf8"))
  : {};

const manifest: VoiceoverManifest = {
  status: "not-recorded",
  provider: marks.provider ?? "manual",
  voice: marks.voice ?? null,
  measuredAt: new Date().toISOString(),
  scenes: {},
};

const missing: string[] = [];
console.log(`Measuring voice-over clips in ${path.relative(ROOT, dir) || dir}\n`);
for (const n of scenesInOrder()) {
  const f = findClip(dir, n);
  if (!f) {
    missing.push(clipStem(n));
    continue;
  }
  const durationSec = Number(probeDuration(f).toFixed(3));
  const pm = marks.scenes?.[n.key];
  const phraseStartsSec = pm && pm.length === n.phrases.length ? pm : null;
  manifest.scenes[n.key] = {
    file: path.relative(path.join(ROOT, "public"), f).split(path.sep).join("/"),
    durationSec,
    phraseStartsSec,
  };
  console.log(
    `  ${clipStem(n).padEnd(16)} ${durationSec.toFixed(2).padStart(6)} s   (estimate ${n.estimatedSec.toFixed(1)} s)` +
      `   phrase timing: ${phraseStartsSec ? "exact (marks)" : "estimated from text"}`,
  );
}

if (missing.length === scenesInOrder().length) {
  console.error("\nNo voice-over clips found. Nothing written.");
  process.exit(1);
}
manifest.status = missing.length === 0 ? "measured" : "not-recorded";
if (missing.length) console.warn(`\nMissing clips (scene will use estimated timing, no audio): ${missing.join(", ")}`);

writeFileSync(out, JSON.stringify(manifest, null, 2) + "\n");
const tl = buildTimeline(manifest);
const voTotal = Object.values(manifest.scenes).reduce((a, s) => a + (s?.durationSec ?? 0), 0);
console.log(`\nWrote ${path.relative(ROOT, out)}`);
console.log(`Narration total: ${voTotal.toFixed(2)} s   ->   episode length: ${tl.totalSec.toFixed(2)} s (target ${TARGET_SEC} s)`);

if (tl.overflowSec > 0.05) {
  const rate = Math.min(1.1, voTotal / Math.max(1, voTotal - tl.overflowSec));
  console.warn(`\n⚠ Episode is ${tl.overflowSec.toFixed(2)} s over the target. No words are cut.`);
  console.warn(`  Option A: re-synthesize slightly faster, e.g. TTS_RATE=${rate.toFixed(2)} npm run vo:synth (keep ≤ 1.10 for a natural pace).`);
  console.warn("  Option B: shorten the longest narration lines (scenes whose voice-over exceeds their animation time):");
  for (const n of scenesInOrder()) {
    const s = manifest.scenes[n.key];
    if (s && s.durationSec + 0.95 > MIN_VISUAL[n.key]) console.warn(`    - ${n.key}: ${s.durationSec.toFixed(2)} s  "${n.text}"`);
  }
}
