import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { EpisodeAudio } from "../../components/EpisodeAudio";
import { SubtitleCue, SubtitleOverlay } from "../../components/SubtitleOverlay";
import { colors, video } from "../../styles/theme";
import { EPISODE_01_AUDIO } from "./audio.config";
import { SceneKey } from "./narration";
import { Scene01Opening } from "./scenes/Scene01Opening";
import { Scene02FivePillars } from "./scenes/Scene02FivePillars";
import { Scene03Ihram } from "./scenes/Scene03Ihram";
import { Scene04Tawaf } from "./scenes/Scene04Tawaf";
import { Scene05Sai } from "./scenes/Scene05Sai";
import { Scene06Tahallul } from "./scenes/Scene06Tahallul";
import { Scene07Tertib } from "./scenes/Scene07Tertib";
import { Scene08Outro } from "./scenes/Scene08Outro";
import { SceneTiming } from "./timeline";
import { EPISODE_01_TIMING } from "./voiceover";

export type Episode01Props = { showSubtitles: boolean };
export type SceneProps = { t: SceneTiming };

const SCENE_COMPONENTS: Record<SceneKey, { name: string; C: React.FC<SceneProps> }> = {
  opening: { name: "01 Opening", C: Scene01Opening },
  fivePillars: { name: "02 Pengenalan", C: Scene02FivePillars },
  ihram: { name: "03 Ihram", C: Scene03Ihram },
  tawaf: { name: "04 Tawaf", C: Scene04Tawaf },
  sai: { name: "05 Sa'i", C: Scene05Sai },
  tahallul: { name: "06 Tahallul", C: Scene06Tahallul },
  tertib: { name: "07 Tertib", C: Scene07Tertib },
  outro: { name: "08 Closing", C: Scene08Outro },
};

const timing = EPISODE_01_TIMING;

const SUBTITLE_CUES: SubtitleCue[] = timing.order.flatMap((k) => {
  const s = timing.scenes[k];
  return s.phrases.map((p) => ({ from: s.from + p.start, to: s.from + p.end, text: p.text }));
});

/** UMROH FIRST TIMER — Episode 01: Kenali 5 Rukun Umroh (1080×1920, ~60 s, timed to the voice-over). */
export const Episode01: React.FC<Episode01Props> = ({ showSubtitles }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.ivory, width: video.width, height: video.height }}>
      {timing.order.map((key) => {
        const t = timing.scenes[key];
        const { name, C } = SCENE_COMPONENTS[key];
        return (
          <Sequence key={key} name={name} from={t.from} durationInFrames={t.duration} premountFor={30}>
            <C t={t} />
            {t.audioSrc ? (
              <Sequence name={`VO ${name}`} from={t.voStart} layout="none">
                <Audio src={staticFile(t.audioSrc)} />
              </Sequence>
            ) : null}
          </Sequence>
        );
      })}
      {showSubtitles ? <SubtitleOverlay cues={SUBTITLE_CUES} /> : null}
      <EpisodeAudio
        music={EPISODE_01_AUDIO.music}
        hasNarration={timing.order.some((k) => timing.scenes[k].audioSrc)}
        speech={timing.order.map((k) => {
          const s = timing.scenes[k];
          return { start: (s.from + s.voStart) / video.fps, end: (s.from + s.voEnd) / video.fps };
        })}
      />
    </AbsoluteFill>
  );
};
