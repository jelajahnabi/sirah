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
  episodes/episode-01/       # narration.ts (script), timeline.ts (timing from audio), voiceover.manifest.json,
                             # narration.timeline.json, sync.ts, scenes/, NARRATION_SCRIPT.md
public/assets/               # fonts, audio/episode-01/vo (per-scene voice-over clips)
scripts/vo/                  # synthesize, measure, export, validate
```

## Preview
```bash
npm i
npm run dev            # Remotion Studio -> open "UFT-Episode01"
```

## Voice-over → timing → render
The episode timing is driven by the **measured** voice-over (one clip per scene):
```bash
npm run vo:synth       # TTS (Google / Azure / ElevenLabs — see scripts/vo/synthesize.ts), then measures
# …or record manually into public/assets/audio/episode-01/vo/ and run:
npm run vo:measure     # ffprobe every clip -> src/episodes/episode-01/voiceover.manifest.json
npm run vo:export      # -> src/episodes/episode-01/narration.timeline.json + out/episode-01.id.srt
npm run render:ep01    # -> out/UFT-Episode01-Kenali-5-Rukun-Umroh.mp4 (H.264 + AAC)
npm run validate:ep01  # checks resolution/fps/duration, audio present, speech inside each scene window
```
Without voice-over clips the timeline falls back to estimates and the render is silent.
Full workflow, voice brief and sync map: `src/episodes/episode-01/NARRATION_SCRIPT.md`.

If Remotion can't download its headless browser (offline/sandboxed), point it at a local Chromium:
`REMOTION_BROWSER_EXECUTABLE=/path/to/chrome npm run render:ep01`.
Use `--props='{"showSubtitles":false}'` to render a clean version without burned-in subtitles.

## Background music
Set a licensed file in `src/episodes/episode-01/audio.config.ts`; it loops, fades and is ducked under the narration.

## Adding an episode
1. Copy `src/episodes/episode-01` to `episode-0N`. Keep the theme, components and `BrandOutro`.
2. Register it in `series.config.ts` and add a `<Composition>` in `src/Root.tsx`.
