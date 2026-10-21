import manifestJson from "./voiceover.manifest.json";
import { buildTimeline, VoiceoverManifest } from "./timeline";

/** The episode timing used by the composition — derived from the measured voice-over manifest. */
export const EPISODE_01_TIMING = buildTimeline(manifestJson as VoiceoverManifest);
