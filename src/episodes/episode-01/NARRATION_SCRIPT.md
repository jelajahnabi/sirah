# UMROH FIRST TIMER — Episode 01: Kenali 5 Rukun Umroh

Naskah narasi (voice-over) Bahasa Indonesia, 60 detik, 30 fps.
**Sumber kebenaran timing ada di `narration.ts`.** File ini untuk pengisi suara dan reviewer. Kalau teks atau timing diubah, ubah `narration.ts` juga supaya subtitle dan SRT ikut berubah.

Gaya bacaan: hangat, jelas, seperti kakak pembimbing. Tempo sekitar 2,3–2,6 kata per detik. Beri jeda singkat setelah setiap nomor rukun ("Pertama, ihram.").

| # | Waktu | Adegan | Narasi |
|---|-------|--------|--------|
| 1 | 00:00.4 – 00:07.6 | Aerial Masjidil Haram | Baru pertama kali mau umroh? Ada lima rukun yang wajib kamu pahami sebelum berangkat! |
| 2 | 00:08.4 – 00:15.4 | 5 kartu rukun | Inilah lima rukun umroh yang harus dilaksanakan agar ibadah kita sah. |
| 3 | 00:16.4 – 00:24.4 | Miqat / ihram | Pertama, ihram. Yaitu berniat masuk ke dalam ibadah umroh, dengan memperhatikan ketentuan miqat. |
| 4 | 00:25.4 – 00:34.2 | Diagram tawaf | Kedua, tawaf. Mengelilingi Ka'bah sebanyak tujuh putaran, dengan Ka'bah berada di sebelah kiri. |
| 5 | 00:35.4 – 00:43.6 | Diagram sa'i | Ketiga, sa'i. Berjalan tujuh lintasan antara Safa dan Marwah. Dimulai dari Safa dan berakhir di Marwah. |
| 6 | 00:44.4 – 00:50.6 | Tahallul | Keempat, tahallul, dengan mencukur atau memotong rambut sesuai ketentuannya. |
| 7 | 00:51.3 – 00:55.8 | Timeline 5 rukun | Kelima, tertib. Melaksanakan rukun-rukun tersebut sesuai urutannya. |
| 8 | 00:56.3 – 00:59.4 | Outro brand | Yuk, belajar umroh bersama Mudahkebaitullah! |

## Catatan akurasi (untuk reviewer/ustadz)

Kerangka lima rukun di sini mengikuti yang umum diajarkan di Indonesia (mazhab Syafi'i): ihram (niat), tawaf, sa'i, tahallul (mencukur/memotong rambut), tertib.

Teks di layar membedakan tiga hal ini:
- **Rukun**: tidak boleh ditinggalkan. Tanpanya umroh tidak sah, dan tidak bisa diganti dengan dam.
- **Wajib umroh**: memulai ihram dari miqat dan menjauhi larangan ihram. Bila ditinggalkan, umroh tetap sah tetapi wajib membayar dam. Adegan 3 menyebut secara eksplisit bahwa miqat termasuk *wajib*, bukan rukun.
- **Sunnah**: dianjurkan dan berpahala, tidak wajib.

Pilihan visual yang perlu diketahui reviewer:
- **Tawaf**: berlawanan arah jarum jam dilihat dari atas, Ka'bah di sebelah kiri. Mulai dan selesai di garis Hajar Aswad (sudut timur). Pintu ada di sisi timur laut, Hijr Ismail di sisi barat laut, dan Hijr Ismail berada *di dalam* lintasan tawaf. Ketujuh putaran digambar sebagai spiral supaya semuanya terlihat.
- **Sa'i**: digambar sebagai diagram skematik (bukan peta). Safa → Marwah dihitung 1 lintasan. Pulang-pergi dihitung 2 lintasan. Lintasan ke-7 berakhir di Marwah.
- **Ihram**: talbiyah niat "Labbaika Allāhumma ‘umratan" ditampilkan sebagai lafaz niat. Niat letaknya di hati.
- **Tahallul**: laki-laki mencukur habis atau memendekkan rambut. Perempuan cukup memotong ujung rambut. (Dalam mazhab Syafi'i, minimal tiga helai; ini **tidak** ditampilkan di layar, silakan ditambahkan di episode berikutnya kalau diinginkan.)
- **Pakaian ihram laki-laki**: dua kain tanpa jahitan, kedua bahu tertutup (bahu kanan terbuka/idtiba' hanya sunnah saat tawaf, jadi tidak ditampilkan). **Perempuan**: wajah dan telapak tangan terbuka.

Mohon materi ini ditinjau oleh pembimbing/ustadz sebelum dipublikasikan.

## Alur kerja narasi
1. Rekam atau sintesis VO sebagai **satu file 60 detik** yang dimulai di 00:00, dengan mengikuti timing di atas. Pakai `out/episode-01.id.srt` sebagai panduan cue (`npm run srt`).
2. Simpan file di `public/assets/audio/episode-01/narration.wav`.
3. Isi `narration` di `src/episodes/episode-01/audio.config.ts` dengan path tersebut.
4. (Opsional) Isi `music` dengan musik berlisensi. Volumenya otomatis diturunkan (ducking) saat ada narasi.
5. Kalau timing rekaman berbeda, sesuaikan `start`/`end` di `narration.ts`, lalu render ulang.
