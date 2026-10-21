/**
 * Centralized design system for the "Umroh First Timer" series.
 * Every episode must read colors, typography, spacing and timing from here
 * so the series stays visually consistent.
 */

export const colors = {
  navy: "#14283F",
  navyDeep: "#0D1C2E",
  navySoft: "#1E3A58",
  ivory: "#F5F0E6",
  ivoryDeep: "#EDE4D3",
  gold: "#C6A56B",
  goldLight: "#E3CB9A",
  goldDeep: "#A8874F",
  white: "#FFFFFF",
  // Supporting neutrals derived from the core palette (illustration only).
  ink: "#14283F",
  line: "#14283F",
  shadow: "rgba(20, 40, 63, 0.14)",
  kaaba: "#141414",
  marble: "#FBFAF6",
  skin: "#C68A5E",
  skinShade: "#A9704A",
  hair: "#1B1512",
} as const;

export const fonts = {
  display: "'Playfair Display', Georgia, serif",
  body: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  arabic: "'Amiri', 'Traditional Arabic', serif",
} as const;

/** Type scale tuned for a 1080px-wide vertical canvas. */
export const type = {
  hero: 128,
  h1: 96,
  h2: 72,
  h3: 54,
  body: 44,
  small: 34,
  caption: 28,
  subtitle: 46,
} as const;

export const video = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

/**
 * Safe area. Content stays inside these margins; the bottom band above
 * `subtitleTop` is reserved for subtitles and platform UI (Reels / TikTok / Shorts).
 */
export const safe = {
  x: 90,
  top: 150,
  bottom: 300,
  subtitleTop: 1440,
  contentBottom: 1400,
} as const;

export const radius = {
  card: 36,
  pill: 999,
} as const;

export const shadow = {
  card: "0 24px 60px rgba(20, 40, 63, 0.14), 0 4px 14px rgba(20, 40, 63, 0.08)",
  soft: "0 12px 30px rgba(20, 40, 63, 0.10)",
  glow: "0 0 80px rgba(198, 165, 107, 0.45)",
} as const;

/** Shared spring presets so motion feels the same in every episode. */
export const springs = {
  gentle: { damping: 200 },
  pop: { damping: 14, stiffness: 160, mass: 0.7 },
  snappy: { damping: 20, stiffness: 220 },
} as const;

export const theme = { colors, fonts, type, video, safe, radius, shadow, springs };
export type Theme = typeof theme;
