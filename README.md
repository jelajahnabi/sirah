# Umroh First Timer — Remotion series

Animated educational series for first-time Indonesian umrah pilgrims. Produced by **MUDAHKEBAITULLAH**.
Vertical 1080×1920, 30 fps, Bahasa Indonesia with burned-in subtitles.

## Episode 01 — Kenali 5 Rukun Umroh (60 s, 1800 frames)
Composition id: `UFT-Episode01`

## Structure
```
src/
  styles/theme.ts            # palette, fonts, type scale, safe area, springs (series-wide)
  styles/fonts.ts            # Playfair Display / Inter / Amiri, loaded from public/assets/fonts
  series/umroh-first-timer/  # brand identity (series.config.ts), shared rukun data (pillars.ts)
  components/                # reusable: AnimatedTitle, PilgrimCharacter, KaabaDiagram,
                             # TawafPathAnimation, SaiRouteAnimation, TahallulIllustration,
                             # FivePillarsTimeline, SubtitleOverlay, BrandOutro, SeriesTag,
                             # SceneHeader, InfoChip, PillarIcon, MasjidilHaramAerial, EpisodeAudio
  episodes/episode-01/       # timeline.ts, narration.ts, audio.config.ts, scenes/, NARRATION_SCRIPT.md
public/assets/               # fonts, audio/episode-01 (put narration here)
scripts/export-srt.ts        # narration.ts -> out/episode-01.id.srt
```

## Preview
```bash
npm i
npm run dev            # Remotion Studio -> open "UFT-Episode01"
```

## Render MP4 (H.264)
```bash
npm run render:ep01    # -> out/UFT-Episode01-Kenali-5-Rukun-Umroh.mp4
npm run srt            # -> out/episode-01.id.srt (separate subtitle file)
```
If Remotion can't download its headless browser (offline/sandboxed), point it at a local Chromium:
`REMOTION_BROWSER_EXECUTABLE=/path/to/chrome npm run render:ep01`.
Use `--props='{"showSubtitles":false}'` to render a clean version without burned-in subtitles.

## Audio
The video is **silent by default**: no narration or music file is bundled. See
`src/episodes/episode-01/NARRATION_SCRIPT.md` for the recording workflow, then set paths in
`src/episodes/episode-01/audio.config.ts`. Music is automatically ducked under narration.

## Adding an episode
1. Copy `src/episodes/episode-01` to `episode-0N`. Keep the theme, components and `BrandOutro`.
2. Register it in `series.config.ts` and add a `<Composition>` in `src/Root.tsx`.
