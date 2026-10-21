/**
 * Background music for Episode 01.
 *
 * Set a path (relative to /public) ONLY for an actual, licensed file. It is looped,
 * faded, and automatically ducked under the narration.
 *
 * Narration is NOT configured here: per-scene voice-over files are listed in
 * voiceover.manifest.json, which `npm run vo:measure` writes after measuring them.
 */
export const EPISODE_01_AUDIO: { music: string | null } = {
  music: null, // e.g. "assets/audio/music/series-bed.mp3"
};
