import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { EpisodeAudio } from "../../components/EpisodeAudio";
import { SubtitleOverlay } from "../../components/SubtitleOverlay";
import { colors, video } from "../../styles/theme";
import { EPISODE_01_AUDIO } from "./audio.config";
import { NARRATION, SUBTITLE_LINES } from "./narration";
import { Scene01Opening } from "./scenes/Scene01Opening";
import { Scene02FivePillars } from "./scenes/Scene02FivePillars";
import { Scene03Ihram } from "./scenes/Scene03Ihram";
import { Scene04Tawaf } from "./scenes/Scene04Tawaf";
import { Scene05Sai } from "./scenes/Scene05Sai";
import { Scene06Tahallul } from "./scenes/Scene06Tahallul";
import { Scene07Tertib } from "./scenes/Scene07Tertib";
import { Scene08Outro } from "./scenes/Scene08Outro";
import { SCENES } from "./timeline";

export type Episode01Props = { showSubtitles: boolean };

const SCENE_LIST: { key: keyof typeof SCENES; name: string; C: React.FC }[] = [
  { key: "opening", name: "01 Pembuka", C: Scene01Opening },
  { key: "fivePillars", name: "02 Lima Rukun", C: Scene02FivePillars },
  { key: "ihram", name: "03 Ihram", C: Scene03Ihram },
  { key: "tawaf", name: "04 Tawaf", C: Scene04Tawaf },
  { key: "sai", name: "05 Sa'i", C: Scene05Sai },
  { key: "tahallul", name: "06 Tahallul", C: Scene06Tahallul },
  { key: "tertib", name: "07 Tertib", C: Scene07Tertib },
  { key: "outro", name: "08 Penutup", C: Scene08Outro },
];

/** Navy-background scenes get the light subtitle card. */
const subtitleTone = (f: number) => (f < SCENES.fivePillars.from || f >= SCENES.outro.from ? "light" : "dark");

/** UMROH FIRST TIMER — Episode 01: Kenali 5 Rukun Umroh (60 s, 1080×1920). */
export const Episode01: React.FC<Episode01Props> = ({ showSubtitles }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.ivory, width: video.width, height: video.height }}>
      {SCENE_LIST.map(({ key, name, C }) => (
        <Sequence key={key} name={name} from={SCENES[key].from} durationInFrames={SCENES[key].duration} premountFor={30}>
          <C />
        </Sequence>
      ))}
      {showSubtitles ? <SubtitleOverlay lines={SUBTITLE_LINES} tone={subtitleTone} /> : null}
      <EpisodeAudio
        narration={EPISODE_01_AUDIO.narration}
        music={EPISODE_01_AUDIO.music}
        speech={NARRATION.map((n) => ({ start: n.start, end: n.end }))}
      />
    </AbsoluteFill>
  );
};
