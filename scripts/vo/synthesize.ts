/**
 * Synthesizes the Episode 01 voice-over, one clip per scene, then measures it.
 *
 * Voice brief: adult Indonesian man (30–40), warm, friendly, calm, clear articulation,
 * a professional manasik guide — not a newsreader, not dramatic, natural beginner-friendly pace.
 *
 * Providers (picked by TTS_PROVIDER, or auto-detected from the credentials present):
 *   google      GOOGLE_TTS_API_KEY  (or GOOGLE_ACCESS_TOKEN + GOOGLE_CLOUD_PROJECT)
 *               default voice id-ID-Wavenet-B (male). Exact phrase timing via SSML marks.
 *   azure       AZURE_SPEECH_KEY + AZURE_SPEECH_REGION
 *               default voice id-ID-ArdiNeural (male).
 *   elevenlabs  ELEVENLABS_API_KEY + ELEVENLABS_VOICE_ID (choose an adult Indonesian male voice)
 *               model eleven_multilingual_v2. Exact phrase timing via character alignment.
 *
 * Options (env): TTS_VOICE (override voice), TTS_RATE (1.0 = normal; keep 0.9–1.1), TTS_PITCH (google, semitones)
 *   npm run vo:synth
 *   npm run vo:synth -- --list-voices        (google: list id-ID voices with gender)
 *   npm run vo:synth -- --only tawaf         (re-synthesize one scene)
 *
 * Nothing is faked: if a provider call fails the script stops with the provider's error.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { NarrationScene, phraseSlices, toTts, VOICE_BRIEF } from "../../src/episodes/episode-01/narration";
import { AUDIO_EXTS, arg, clipStem, flag, MARKS_FILE, ROOT, scenesInOrder, VO_DIR } from "./common";

type Result = { audio: Buffer; ext: ".wav" | ".mp3"; phraseStartsSec: number[] | null };
type Provider = { name: string; voice: string; synth: (n: NarrationScene, slices: string[]) => Promise<Result> };

const env = process.env;
const RATE = Number(env.TTS_RATE ?? "1");
const xmlEscape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

const fail = async (res: Response, who: string) => {
  throw new Error(`${who} request failed: HTTP ${res.status} ${res.statusText}\n${(await res.text()).slice(0, 800)}`);
};

// ---------------------------------------------------------------- Google Cloud TTS
const googleAuth = (): { url: (p: string) => string; headers: Record<string, string> } | null => {
  const base = "https://texttospeech.googleapis.com/v1beta1/";
  if (env.GOOGLE_TTS_API_KEY) return { url: (p) => `${base}${p}${p.includes("?") ? "&" : "?"}key=${env.GOOGLE_TTS_API_KEY}`, headers: {} };
  if (env.GOOGLE_ACCESS_TOKEN && env.GOOGLE_CLOUD_PROJECT)
    return {
      url: (p) => base + p,
      headers: { Authorization: `Bearer ${env.GOOGLE_ACCESS_TOKEN}`, "x-goog-user-project": env.GOOGLE_CLOUD_PROJECT },
    };
  return null;
};

const google = (): Provider | null => {
  const auth = googleAuth();
  if (!auth) return null;
  const voice = env.TTS_VOICE ?? "id-ID-Wavenet-B";
  return {
    name: "google",
    voice,
    synth: async (_n, slices) => {
      const ssml = `<speak>${slices.map((s, i) => `<mark name="p${i}"/>${xmlEscape(toTts(s))}`).join("")}</speak>`;
      const res = await fetch(auth.url("text:synthesize"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...auth.headers },
        body: JSON.stringify({
          input: { ssml },
          voice: { languageCode: "id-ID", name: voice },
          audioConfig: { audioEncoding: "LINEAR16", sampleRateHertz: 48000, speakingRate: 0.96 * RATE, pitch: Number(env.TTS_PITCH ?? "-1.5") },
          enableTimePointing: ["SSML_MARK"],
        }),
      });
      if (!res.ok) await fail(res, "Google TTS");
      const json = (await res.json()) as { audioContent: string; timepoints?: { markName: string; timeSeconds: number }[] };
      const tp = json.timepoints ?? [];
      const starts = slices.map((_, i) => tp.find((t) => t.markName === `p${i}`)?.timeSeconds ?? NaN);
      return { audio: Buffer.from(json.audioContent, "base64"), ext: ".wav", phraseStartsSec: starts.every(Number.isFinite) ? starts : null };
    },
  };
};

const listGoogleVoices = async () => {
  const auth = googleAuth();
  if (!auth) throw new Error("Set GOOGLE_TTS_API_KEY (or GOOGLE_ACCESS_TOKEN + GOOGLE_CLOUD_PROJECT) first.");
  const res = await fetch(auth.url("voices?languageCode=id-ID"), { headers: auth.headers });
  if (!res.ok) await fail(res, "Google TTS");
  const { voices } = (await res.json()) as { voices: { name: string; ssmlGender: string }[] };
  for (const v of voices) console.log(`${v.name.padEnd(28)} ${v.ssmlGender}`);
};

// ---------------------------------------------------------------- Azure Speech
const azure = (): Provider | null => {
  if (!env.AZURE_SPEECH_KEY || !env.AZURE_SPEECH_REGION) return null;
  const voice = env.TTS_VOICE ?? "id-ID-ArdiNeural";
  return {
    name: "azure",
    voice,
    synth: async (n) => {
      const pct = Math.round((RATE * 0.97 - 1) * 100);
      const ssml =
        `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="id-ID"><voice name="${voice}">` +
        `<prosody rate="${pct >= 0 ? "+" : ""}${pct}%">${xmlEscape(toTts(n.text))}</prosody></voice></speak>`;
      const res = await fetch(`https://${env.AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": env.AZURE_SPEECH_KEY!,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "riff-48khz-16bit-mono-pcm",
          "User-Agent": "umroh-first-timer",
        },
        body: ssml,
      });
      if (!res.ok) await fail(res, "Azure TTS");
      return { audio: Buffer.from(await res.arrayBuffer()), ext: ".wav", phraseStartsSec: null };
    },
  };
};

// ---------------------------------------------------------------- ElevenLabs
const elevenlabs = (): Provider | null => {
  if (!env.ELEVENLABS_API_KEY || !(env.ELEVENLABS_VOICE_ID || env.TTS_VOICE)) return null;
  const voice = env.TTS_VOICE ?? env.ELEVENLABS_VOICE_ID!;
  return {
    name: "elevenlabs",
    voice,
    synth: async (_n, slices) => {
      const ttsSlices = slices.map(toTts);
      const text = ttsSlices.join("");
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}/with-timestamps?output_format=mp3_44100_128`, {
        method: "POST",
        headers: { "xi-api-key": env.ELEVENLABS_API_KEY!, "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          model_id: env.ELEVENLABS_MODEL ?? "eleven_multilingual_v2",
          language_code: "id",
          voice_settings: { stability: 0.55, similarity_boost: 0.75, style: 0.1, use_speaker_boost: true, speed: RATE },
        }),
      });
      if (!res.ok) await fail(res, "ElevenLabs");
      const json = (await res.json()) as { audio_base64: string; alignment?: { character_start_times_seconds: number[] } };
      const t = json.alignment?.character_start_times_seconds;
      let offset = 0;
      const starts = ttsSlices.map((s) => {
        const v = t?.[offset];
        offset += s.length;
        return v ?? NaN;
      });
      return { audio: Buffer.from(json.audio_base64, "base64"), ext: ".mp3", phraseStartsSec: starts.every(Number.isFinite) ? starts : null };
    },
  };
};

// ---------------------------------------------------------------- main
const pick = (): Provider => {
  const all: Record<string, () => Provider | null> = { google, azure, elevenlabs };
  const wanted = env.TTS_PROVIDER;
  if (wanted) {
    const p = all[wanted]?.();
    if (!p) throw new Error(`TTS_PROVIDER=${wanted} but its credentials are not set (see header of scripts/vo/synthesize.ts).`);
    return p;
  }
  for (const k of Object.keys(all)) {
    const p = all[k]();
    if (p) return p;
  }
  throw new Error(
    "No TTS provider is configured. Set one of: GOOGLE_TTS_API_KEY | AZURE_SPEECH_KEY+AZURE_SPEECH_REGION | " +
      "ELEVENLABS_API_KEY+ELEVENLABS_VOICE_ID — or record the clips manually (see NARRATION_SCRIPT.md) and run `npm run vo:measure`.",
  );
};

const main = async () => {
  if (flag("list-voices")) return listGoogleVoices();
  const provider = pick();
  const only = arg("only");
  console.log(`Provider: ${provider.name}   voice: ${provider.voice}   rate: ${RATE}`);
  console.log(`Voice brief: ${VOICE_BRIEF}\n`);
  mkdirSync(VO_DIR, { recursive: true });

  const marks: { provider: string; voice: string; scenes: Record<string, number[]> } = existsSync(MARKS_FILE)
    ? { ...JSON.parse(readFileSync(MARKS_FILE, "utf8")), provider: provider.name, voice: provider.voice }
    : { provider: provider.name, voice: provider.voice, scenes: {} };

  for (const n of scenesInOrder()) {
    if (only && n.key !== only) continue;
    const slices = phraseSlices(n);
    process.stdout.write(`  ${clipStem(n).padEnd(16)} … `);
    const r = await provider.synth(n, slices);
    for (const ext of AUDIO_EXTS) {
      const old = path.join(VO_DIR, clipStem(n) + ext);
      if (existsSync(old)) unlinkSync(old);
    }
    const file = path.join(VO_DIR, clipStem(n) + r.ext);
    writeFileSync(file, r.audio);
    if (r.phraseStartsSec) marks.scenes[n.key] = r.phraseStartsSec.map((x) => Number(x.toFixed(3)));
    else delete marks.scenes[n.key];
    console.log(`${path.relative(ROOT, file)}${r.phraseStartsSec ? "  (+ exact phrase marks)" : ""}`);
  }
  writeFileSync(MARKS_FILE, JSON.stringify(marks, null, 2) + "\n");

  console.log("\nMeasuring…");
  execFileSync("npx", ["tsx", path.join(__dirname, "measure.ts")], { stdio: "inherit", cwd: ROOT });
  console.log("\nListen to every clip before rendering — check the voice matches the brief and that Arabic terms are pronounced correctly.");
};

main().catch((e) => {
  console.error(`\n✖ ${e instanceof Error ? e.message : e}`);
  process.exit(1);
});
