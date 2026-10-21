import { NARRATION, SceneKey, plain } from "./narration";

/**
 * Episode 01 timeline, computed from the voice-over.
 *
 * Each scene = lead-in pause + measured narration + tail pause, never shorter than the
 * time its animation needs (MIN_VISUAL). If the total is under the 60 s target, the spare
 * time is shared out (mostly to the diagram scenes). If it is over, nothing is cut: the
 * episode simply runs longer and `overflowSec` reports it.
 */
export const FPS = 30;
export const TARGET_SEC = 60;
const AUDIO_SAFETY_SEC = 0.1;

export type ManifestScene = {
  /** Path relative to /public. */
  file: string;
  /** Measured duration of the audio file (ffprobe). */
  durationSec: number;
  /** Optional exact phrase start times within the clip (from TTS marks/alignment or manual). */
  phraseStartsSec?: number[] | null;
};

export type VoiceoverManifest = {
  status: "not-recorded" | "measured";
  provider: string | null;
  voice: string | null;
  measuredAt: string | null;
  scenes: Partial<Record<SceneKey, ManifestScene>>;
};

export type Phrase = { text: string; start: number; end: number }; // frames, relative to scene start

export type SceneTiming = {
  key: SceneKey;
  from: number;
  duration: number;
  /** Narration window, frames relative to scene start. */
  voStart: number;
  voEnd: number;
  phrases: Phrase[];
  audioSrc: string | null;
  /** True if timings come from a measured audio file. */
  measured: boolean;
};

export type EpisodeTiming = {
  scenes: Record<SceneKey, SceneTiming>;
  order: SceneKey[];
  durationInFrames: number;
  totalSec: number;
  overflowSec: number;
  measured: boolean;
};

/** Seconds of silence before the narrator starts in each scene (natural breath between scenes). */
const LEAD_IN: Record<SceneKey, number> = {
  opening: 0.6,
  fivePillars: 0.4,
  ihram: 0.4,
  tawaf: 0.4,
  sai: 0.4,
  tahallul: 0.4,
  tertib: 0.35,
  outro: 0.45,
};
const TAIL_SEC = 0.45;

/** Minimum on-screen time the animation of each scene needs. */
export const MIN_VISUAL: Record<SceneKey, number> = {
  opening: 7.5,
  fivePillars: 6.5,
  ihram: 7.5,
  tawaf: 9.5,
  sai: 8.5,
  tahallul: 5.5,
  tertib: 4.8,
  outro: 3.8,
};

/** How spare time (below the 60 s target) is shared out. */
const PAD_WEIGHT: Record<SceneKey, number> = {
  opening: 1,
  fivePillars: 1,
  ihram: 1,
  tawaf: 1.6,
  sai: 1.6,
  tahallul: 1,
  tertib: 0.8,
  outro: 0.6,
};

/** Character-weighted phrase starts (with a little extra weight for punctuation pauses). */
const estimatePhraseStarts = (phrases: string[], voSec: number) => {
  const w = phrases.map((p) => {
    const t = plain(p);
    return t.length + (/[.?!]$/.test(t) ? 6 : /,$/.test(t) ? 3 : 0);
  });
  const total = w.reduce((a, b) => a + b, 0);
  let acc = 0;
  return w.map((x) => {
    const s = (acc / total) * voSec;
    acc += x;
    return s;
  });
};

export const buildTimeline = (manifest: VoiceoverManifest): EpisodeTiming => {
  const order = [...NARRATION].sort((a, b) => a.order - b.order);
  const measuredAll = manifest.status === "measured" && order.every((n) => manifest.scenes[n.key]);

  const base = order.map((n) => {
    const m = manifest.scenes[n.key];
    const vo = m ? m.durationSec : n.estimatedSec;
    const need = LEAD_IN[n.key] + vo + AUDIO_SAFETY_SEC + TAIL_SEC;
    return { n, m, vo, sec: Math.max(MIN_VISUAL[n.key], need) };
  });

  const sum = base.reduce((a, b) => a + b.sec, 0);
  const spare = TARGET_SEC - sum;
  if (spare > 0) {
    const wsum = base.reduce((a, b) => a + PAD_WEIGHT[b.n.key], 0);
    for (const b of base) b.sec += (spare * PAD_WEIGHT[b.n.key]) / wsum;
  }

  const scenes = {} as Record<SceneKey, SceneTiming>;
  let cum = 0;
  for (const b of base) {
    const from = Math.round(cum * FPS);
    cum += b.sec;
    const duration = Math.round(cum * FPS) - from;
    const voStartSec = LEAD_IN[b.n.key];
    const starts =
      b.m?.phraseStartsSec && b.m.phraseStartsSec.length === b.n.phrases.length
        ? b.m.phraseStartsSec
        : estimatePhraseStarts(b.n.phrases, b.vo);
    const voEnd = Math.round((voStartSec + b.vo) * FPS);
    const phrases: Phrase[] = b.n.phrases.map((text, i) => {
      const start = Math.round((voStartSec + starts[i]) * FPS);
      const end = i < b.n.phrases.length - 1 ? Math.round((voStartSec + starts[i + 1]) * FPS) : Math.min(duration, voEnd + 9);
      return { text, start, end };
    });
    scenes[b.n.key] = {
      key: b.n.key,
      from,
      duration,
      voStart: Math.round(voStartSec * FPS),
      voEnd,
      phrases,
      audioSrc: b.m ? b.m.file : null,
      measured: Boolean(b.m),
    };
  }

  const durationInFrames = Math.round(cum * FPS);
  return {
    scenes,
    order: order.map((n) => n.key),
    durationInFrames,
    totalSec: durationInFrames / FPS,
    overflowSec: Math.max(0, cum - TARGET_SEC),
    measured: measuredAll,
  };
};

/** Phrase index active at a scene-relative frame (-1 before the first phrase). */
export const phraseIndexAt = (t: SceneTiming, frame: number) => {
  let idx = -1;
  t.phrases.forEach((p, i) => {
    if (frame >= p.start) idx = i;
  });
  return idx;
};
