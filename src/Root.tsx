import "./index.css";
import React from "react";
import { Composition, Folder } from "remotion";
import { Episode01 } from "./episodes/episode-01/Episode01";
import { EPISODE_01_DURATION } from "./episodes/episode-01/timeline";
import { loadSeriesFonts } from "./styles/fonts";
import { video } from "./styles/theme";

loadSeriesFonts();

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Umroh-First-Timer">
      <Composition
        id="UFT-Episode01"
        component={Episode01}
        durationInFrames={EPISODE_01_DURATION}
        fps={video.fps}
        width={video.width}
        height={video.height}
        defaultProps={{ showSubtitles: true }}
      />
    </Folder>
  );
};
