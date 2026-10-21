/**
 * Episode 01 narration — single source of truth for the voice-over script,
 * subtitles, TTS input and the exported timing JSON.
 *
 * - `phrases` are the subtitle cards, in spoken order. Joined, they must equal `text`.
 *   Wrap key words in *asterisks* to render them in gold.
 * - TTS engines receive the text through TTS_LEXICON (pronunciation fixes), never the display text.
 * - `estimatedSec` is used for layout until a real voice-over file has been measured.
 *
 * Timing is NOT stored here: it is computed from the measured audio in
 * voiceover.manifest.json (see timeline.ts).
 */
export type SceneKey = "opening" | "fivePillars" | "ihram" | "tawaf" | "sai" | "tahallul" | "tertib" | "outro";

export type NarrationScene = {
  key: SceneKey;
  order: number;
  title: string;
  text: string;
  phrases: string[];
  estimatedSec: number;
};

export const VOICE_BRIEF =
  "Pria Indonesia dewasa (30–40 th), hangat, bersahabat, tenang, artikulasi jelas; gaya pembimbing manasik profesional, " +
  "tidak terlalu formal, bukan gaya pembaca berita, tidak dramatis; tempo natural untuk pemula.";

export const NARRATION: NarrationScene[] = [
  {
    key: "opening",
    order: 1,
    title: "Opening",
    text: "Baru pertama kali mau umroh? Sebelum berangkat ke Tanah Suci, yuk kenali lima rukun umroh yang wajib kita pahami!",
    phrases: ["Baru pertama kali mau *umroh*?", "Sebelum berangkat ke *Tanah Suci*,", "yuk kenali *lima rukun umroh*", "yang wajib kita pahami!"],
    estimatedSec: 7.2,
  },
  {
    key: "fivePillars",
    order: 2,
    title: "Pengenalan",
    text: "Rukun adalah bagian pokok ibadah. Jika salah satunya tidak dilaksanakan, umroh belum sah.",
    phrases: ["*Rukun* adalah bagian pokok ibadah.", "Jika salah satunya tidak dilaksanakan,", "umroh *belum sah*."],
    estimatedSec: 5.8,
  },
  {
    key: "ihram",
    order: 3,
    title: "Ihram",
    text: "Pertama, ihram. Yaitu berniat masuk ke dalam ibadah umroh, dengan memperhatikan ketentuan miqat.",
    phrases: ["Pertama, *IHRAM*.", "Yaitu *berniat* masuk ke dalam ibadah umroh,", "dengan memperhatikan ketentuan *miqat*."],
    estimatedSec: 6.4,
  },
  {
    key: "tawaf",
    order: 4,
    title: "Tawaf",
    text: "Kedua, tawaf. Mengelilingi Ka'bah tujuh putaran, dimulai dari arah Hajar Aswad, dengan Ka'bah selalu di sebelah kiri.",
    phrases: ["Kedua, *TAWAF*.", "Mengelilingi Ka'bah *tujuh putaran*,", "dimulai dari arah *Hajar Aswad*,", "dengan Ka'bah selalu di sebelah *kiri*."],
    estimatedSec: 7.8,
  },
  {
    key: "sai",
    order: 5,
    title: "Sa'i",
    text: "Ketiga, sa'i. Berjalan tujuh lintasan antara Safa dan Marwah. Dimulai dari Safa, dan berakhir di Marwah.",
    phrases: ["Ketiga, *SA'I*.", "Berjalan *tujuh lintasan*", "antara *Safa* dan *Marwah*.", "Dimulai dari *Safa*,", "dan berakhir di *Marwah*."],
    estimatedSec: 7.0,
  },
  {
    key: "tahallul",
    order: 6,
    title: "Tahallul",
    text: "Keempat, tahallul. Mencukur atau memotong rambut sesuai ketentuan.",
    phrases: ["Keempat, *TAHALLUL*.", "Mencukur atau *memotong rambut*", "sesuai ketentuan."],
    estimatedSec: 4.4,
  },
  {
    key: "tertib",
    order: 7,
    title: "Tertib",
    text: "Kelima, tertib. Semua rukun dilaksanakan sesuai urutannya.",
    phrases: ["Kelima, *TERTIB*.", "Semua rukun dilaksanakan", "*sesuai urutannya*."],
    estimatedSec: 4.0,
  },
  {
    key: "outro",
    order: 8,
    title: "Closing",
    text: "Yuk, belajar umroh bersama Mudahkebaitullah!",
    phrases: ["Yuk, belajar umroh bersama", "*Mudahkebaitullah*!"],
    estimatedSec: 2.8,
  },
];

/** Removes the *highlight* markers. */
export const plain = (s: string) => s.replace(/\*/g, "");

export const narrationByKey = (key: SceneKey) => {
  const n = NARRATION.find((x) => x.key === key);
  if (!n) throw new Error(`No narration for ${key}`);
  return n;
};

/** Pronunciation fixes applied only to text sent to TTS (display text keeps the proper spelling). */
export const TTS_LEXICON: [RegExp, string][] = [
  [/Ka'bah/g, "Kakbah"],
  [/\bsa'i\b/gi, "sai"],
  [/Mudahkebaitullah/g, "Mudah ke Baitullah"],
];

export const toTts = (s: string) => TTS_LEXICON.reduce((acc, [re, rep]) => acc.replace(re, rep), s);

/**
 * Splits a scene's spoken `text` into slices aligned with its subtitle phrases
 * (original casing, trailing spaces kept). Throws if the phrases don't match the text.
 */
export const phraseSlices = (n: NarrationScene) => {
  const lower = n.text.toLowerCase();
  let cursor = 0;
  const starts = n.phrases.map((p) => {
    const idx = lower.indexOf(plain(p).toLowerCase(), cursor);
    if (idx < 0 || lower.slice(cursor, idx).trim() !== "") {
      throw new Error(`[${n.key}] phrase not found in order: "${plain(p)}"`);
    }
    cursor = idx + plain(p).length;
    return idx;
  });
  if (n.text.slice(cursor).trim() !== "") throw new Error(`[${n.key}] text has words not covered by phrases`);
  return starts.map((st, i) => n.text.slice(st, i < starts.length - 1 ? starts[i + 1] : n.text.length));
};
