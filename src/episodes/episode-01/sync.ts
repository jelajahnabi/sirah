import { SceneTiming } from "./timeline";

/**
 * Scene-relative frame at which phrase `i` starts being spoken.
 * Scenes key their animation beats to these so visuals land on the narration.
 */
export const cue = (t: SceneTiming, i: number) => t.phrases[Math.min(i, t.phrases.length - 1)]?.start ?? 0;
