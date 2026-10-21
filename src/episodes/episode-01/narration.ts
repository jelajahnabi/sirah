/**
 * Episode 01 narration — single source of truth for subtitles,
 * the SRT export and the voice-over recording timeline.
 *
 * Times are in seconds on the episode timeline. Each `lines` entry becomes
 * one subtitle card. Edit text/timing here; the video and SRT follow.
 */
export type NarrationLine = { start: number; end: number; text: string };
export type NarrationSegment = {
  scene: string;
  start: number;
  end: number;
  text: string;
  lines: NarrationLine[];
};

export const NARRATION: NarrationSegment[] = [
  {
    scene: "01 Pembuka",
    start: 0.4,
    end: 7.6,
    text: "Baru pertama kali mau umroh? Ada lima rukun yang wajib kamu pahami sebelum berangkat!",
    lines: [
      { start: 0.4, end: 2.9, text: "Baru pertama kali mau umroh?" },
      { start: 3.0, end: 5.6, text: "Ada lima rukun yang wajib kamu pahami" },
      { start: 5.6, end: 7.6, text: "sebelum berangkat!" },
    ],
  },
  {
    scene: "02 Lima Rukun",
    start: 8.4,
    end: 15.4,
    text: "Inilah lima rukun umroh yang harus dilaksanakan agar ibadah kita sah.",
    lines: [
      { start: 8.4, end: 11.6, text: "Inilah lima rukun umroh" },
      { start: 11.6, end: 15.4, text: "yang harus dilaksanakan agar ibadah kita sah." },
    ],
  },
  {
    scene: "03 Ihram",
    start: 16.4,
    end: 24.4,
    text: "Pertama, ihram. Yaitu berniat masuk ke dalam ibadah umroh, dengan memperhatikan ketentuan miqat.",
    lines: [
      { start: 16.4, end: 18.2, text: "Pertama, ihram." },
      { start: 18.2, end: 21.4, text: "Yaitu berniat masuk ke dalam ibadah umroh," },
      { start: 21.4, end: 24.4, text: "dengan memperhatikan ketentuan miqat." },
    ],
  },
  {
    scene: "04 Tawaf",
    start: 25.4,
    end: 34.2,
    text: "Kedua, tawaf. Mengelilingi Ka'bah sebanyak tujuh putaran, dengan Ka'bah berada di sebelah kiri.",
    lines: [
      { start: 25.4, end: 27.2, text: "Kedua, tawaf." },
      { start: 27.2, end: 30.6, text: "Mengelilingi Ka'bah sebanyak tujuh putaran," },
      { start: 30.6, end: 34.2, text: "dengan Ka'bah berada di sebelah kiri." },
    ],
  },
  {
    scene: "05 Sa'i",
    start: 35.4,
    end: 43.6,
    text: "Ketiga, sa'i. Berjalan tujuh lintasan antara Safa dan Marwah. Dimulai dari Safa dan berakhir di Marwah.",
    lines: [
      { start: 35.4, end: 37.0, text: "Ketiga, sa'i." },
      { start: 37.0, end: 40.2, text: "Berjalan tujuh lintasan antara Safa dan Marwah." },
      { start: 40.2, end: 43.6, text: "Dimulai dari Safa dan berakhir di Marwah." },
    ],
  },
  {
    scene: "06 Tahallul",
    start: 44.4,
    end: 50.6,
    text: "Keempat, tahallul, dengan mencukur atau memotong rambut sesuai ketentuannya.",
    lines: [
      { start: 44.4, end: 46.4, text: "Keempat, tahallul," },
      { start: 46.4, end: 50.6, text: "dengan mencukur atau memotong rambut sesuai ketentuannya." },
    ],
  },
  {
    scene: "07 Tertib",
    start: 51.3,
    end: 55.8,
    text: "Kelima, tertib. Melaksanakan rukun-rukun tersebut sesuai urutannya.",
    lines: [
      { start: 51.3, end: 52.9, text: "Kelima, tertib." },
      { start: 52.9, end: 55.8, text: "Melaksanakan rukun-rukun tersebut sesuai urutannya." },
    ],
  },
  {
    scene: "08 Penutup",
    start: 56.3,
    end: 59.4,
    text: "Yuk, belajar umroh bersama Mudahkebaitullah!",
    lines: [{ start: 56.3, end: 59.4, text: "Yuk, belajar umroh bersama Mudahkebaitullah!" }],
  },
];

export const SUBTITLE_LINES: NarrationLine[] = NARRATION.flatMap((s) => s.lines);
