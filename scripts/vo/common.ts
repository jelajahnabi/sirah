import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { NARRATION, NarrationScene } from "../../src/episodes/episode-01/narration";
import type { VoiceoverManifest } from "../../src/episodes/episode-01/timeline";

export const ROOT = path.resolve(__dirname, "../..");
/** Folder (relative to /public) that holds the per-scene voice-over clips. */
export const VO_PUBLIC_DIR = "assets/audio/episode-01/vo";
export const VO_DIR = path.join(ROOT, "public", VO_PUBLIC_DIR);
/** Optional sidecar with exact phrase start times (written by TTS providers that report them, or by hand). */
export const MARKS_FILE = path.join(VO_DIR, "phrase-marks.json");
export const MANIFEST_FILE = path.join(ROOT, "src/episodes/episode-01/voiceover.manifest.json");
export const AUDIO_EXTS = [".wav", ".mp3", ".m4a", ".flac"];

/** Clip file stem for a scene, e.g. "03-ihram". Record/synthesize with exactly these names. */
export const clipStem = (n: NarrationScene) => `${String(n.order).padStart(2, "0")}-${n.key}`;

export const findClip = (dir: string, n: NarrationScene) => {
  for (const ext of AUDIO_EXTS) {
    const f = path.join(dir, clipStem(n) + ext);
    if (existsSync(f)) return f;
  }
  return null;
};

/** Real duration of an audio file in seconds, via ffprobe. */
export const probeDuration = (file: string) => {
  const out = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString().trim();
  const d = Number(out);
  if (!Number.isFinite(d) || d <= 0) throw new Error(`ffprobe could not read a duration from ${file}`);
  return d;
};

export const readManifest = (file = MANIFEST_FILE): VoiceoverManifest => JSON.parse(readFileSync(file, "utf8"));

export const scenesInOrder = () => [...NARRATION].sort((a, b) => a.order - b.order);

export const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
};
export const flag = (name: string) => process.argv.includes(`--${name}`);
