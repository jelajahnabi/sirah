/**
 * Audio assets for Episode 01.
 *
 * Set a path (relative to /public) ONLY when you have an actual, authorized file.
 * - narration: recorded or synthesized voice-over aligned to narration.ts timestamps
 *   (one continuous 60 s file starting at 00:00).
 * - music: licensed background music. It is automatically ducked under narration.
 *
 * Both are null by default: the rendered video is silent until real audio is supplied.
 */
export const EPISODE_01_AUDIO: { narration: string | null; music: string | null } = {
  narration: null, // e.g. "assets/audio/episode-01/narration.wav"
  music: null, // e.g. "assets/audio/music/series-bed.mp3"
};
