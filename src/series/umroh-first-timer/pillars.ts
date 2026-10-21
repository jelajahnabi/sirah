/**
 * The five rukun (pillars) of umrah as commonly taught in Indonesia
 * following the Shafi'i school. Shared data so every episode labels them identically.
 */
export type PillarId = "ihram" | "tawaf" | "sai" | "tahallul" | "tertib";

export type Pillar = {
  id: PillarId;
  number: string;
  name: string;
  short: string;
};

export const PILLARS: Pillar[] = [
  { id: "ihram", number: "01", name: "IHRAM", short: "Niat memulai umroh" },
  { id: "tawaf", number: "02", name: "TAWAF", short: "7 putaran mengelilingi Ka'bah" },
  { id: "sai", number: "03", name: "SA'I", short: "7 lintasan Safa – Marwah" },
  { id: "tahallul", number: "04", name: "TAHALLUL", short: "Mencukur / memotong rambut" },
  { id: "tertib", number: "05", name: "TERTIB", short: "Berurutan sesuai susunan" },
];
