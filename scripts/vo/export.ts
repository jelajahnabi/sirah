/**
 * Exports the episode's narration with its order and timing:
 *   src/episodes/episode-01/narration.timeline.json   (text, order, scene/VO/phrase timing)
 *   out/episode-01.id.srt                              (sidecar subtitles)
 *
 *   npm run vo:export
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { phraseSlices, plain, toTts, VOICE_BRIEF } from "../../src/episodes/episode-01/narration";
import { buildTimeline, FPS } from "../../src/episodes/episode-01/timeline";
import { arg, clipStem, readManifest, ROOT, scenesInOrder, VO_PUBLIC_DIR } from "./common";

const manifest = readManifest(arg("manifest") ? path.resolve(arg("manifest")!) : undefined);
const tl = buildTimeline(manifest);
const sec = (f: number) => Number((f / FPS).toFixed(3));

const json = {
  episode: "UMROH FIRST TIMER — EPISODE 01",
  theme: "Kenali 5 Rukun Umroh",
  producer: "MUDAHKEBAITULLAH",
  language: "id-ID",
  fps: FPS,
  durationSec: tl.totalSec,
  timingSource: tl.measured ? "measured-audio" : "estimated (no voice-over recorded yet)",
  voice: { brief: VOICE_BRIEF, provider: manifest.provider, voice: manifest.voice },
  scenes: scenesInOrder().map((n) => {
    const s = tl.scenes[n.key];
    const m = manifest.scenes[n.key];
    return {
      order: n.order,
      key: n.key,
      title: n.title,
      text: n.text,
      ttsText: toTts(n.text),
      audioFile: m?.file ?? `${VO_PUBLIC_DIR}/${clipStem(n)}.wav (not recorded yet)`,
      audioDurationSec: m?.durationSec ?? null,
      estimatedSec: n.estimatedSec,
      sceneStartSec: sec(s.from),
      sceneEndSec: sec(s.from + s.duration),
      voiceStartSec: sec(s.from + s.voStart),
      voiceEndSec: sec(s.from + s.voEnd),
      phrases: s.phrases.map((p, i) => ({
        subtitle: plain(p.text),
        highlight: (p.text.match(/\*([^*]+)\*/g) ?? []).map((h) => h.slice(1, -1)),
        spoken: phraseSlices(n)[i].trim(),
        startSec: sec(s.from + p.start),
        endSec: sec(s.from + p.end),
      })),
    };
  }),
};

const jsonFile = path.join(ROOT, "src/episodes/episode-01/narration.timeline.json");
writeFileSync(jsonFile, JSON.stringify(json, null, 2) + "\n");

const ts = (f: number) => {
  const ms = Math.round((f / FPS) * 1000);
  const p = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor((ms % 3600000) / 60000))}:${p(Math.floor((ms % 60000) / 1000))},${p(ms % 1000, 3)}`;
};
let i = 0;
const srt = tl.order
  .flatMap((k) => tl.scenes[k].phrases.map((p) => ({ from: tl.scenes[k].from + p.start, to: tl.scenes[k].from + p.end, text: plain(p.text) })))
  .map((c) => `${++i}\n${ts(c.from)} --> ${ts(c.to)}\n${c.text}\n`)
  .join("\n");
mkdirSync(path.join(ROOT, "out"), { recursive: true });
writeFileSync(path.join(ROOT, "out/episode-01.id.srt"), srt);

console.log(`Wrote ${path.relative(ROOT, jsonFile)} and out/episode-01.id.srt  (${json.timingSource}, ${tl.totalSec.toFixed(2)} s)`);
