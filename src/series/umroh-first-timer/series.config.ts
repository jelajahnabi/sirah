/**
 * Series-level brand identity. Every episode of "Umroh First Timer"
 * pulls its name, tagline, producer credit and episode label from here.
 */
export const series = {
  id: "umroh-first-timer",
  title: "UMROH FIRST TIMER",
  tagline: "Serial Edukasi Umroh untuk Pemula",
  slogan: "Belajar Umroh, Selangkah Demi Selangkah",
  producer: "MUDAHKEBAITULLAH",
  producerLabel: "PRODUCED BY",
  outroCallToAction: "Yuk, belajar umroh bersama Mudahkebaitullah!",
} as const;

export type EpisodeMeta = {
  number: number;
  title: string;
  compositionId: string;
};

export const episodeLabel = (n: number) => `EPISODE ${String(n).padStart(2, "0")}`;

/** Registry of episodes. Add future episodes here. */
export const episodes: EpisodeMeta[] = [
  { number: 1, title: "Kenali 5 Rukun Umroh", compositionId: "UFT-Episode01" },
];
