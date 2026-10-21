# UMROH FIRST TIMER — Episode 01: Kenali 5 Rukun Umroh

Naskah voice-over final. **Sumber kebenaran teks ada di `narration.ts`.** Timing **tidak** ditulis manual: timing dihitung dari durasi audio yang benar-benar terukur (`voiceover.manifest.json`). Hasilnya diekspor ke `narration.timeline.json` dan `out/episode-01.id.srt`.

## Karakter suara
Pria Indonesia dewasa (usia suara 30–40 tahun). Hangat, bersahabat, tenang, artikulasi jelas. Gaya pembimbing manasik profesional: tidak terlalu formal, bukan gaya pembaca berita, tidak berlebihan atau dramatis. Tempo natural yang mudah diikuti pemula. Beri jeda singkat setelah setiap nama rukun ("Pertama, ihram.").

## Naskah per scene (satu file audio per scene)

| File | Scene | Narasi |
|------|-------|--------|
| `01-opening` | Opening | Baru pertama kali mau umroh? Sebelum berangkat ke Tanah Suci, yuk kenali lima rukun umroh yang wajib kita pahami! |
| `02-fivePillars` | Pengenalan | Rukun adalah bagian pokok ibadah. Jika salah satunya tidak dilaksanakan, umroh belum sah. |
| `03-ihram` | Ihram | Pertama, ihram. Yaitu berniat masuk ke dalam ibadah umroh, dengan memperhatikan ketentuan miqat. |
| `04-tawaf` | Tawaf | Kedua, tawaf. Mengelilingi Ka'bah tujuh putaran, dimulai dari arah Hajar Aswad, dengan Ka'bah selalu di sebelah kiri. |
| `05-sai` | Sa'i | Ketiga, sa'i. Berjalan tujuh lintasan antara Safa dan Marwah. Dimulai dari Safa, dan berakhir di Marwah. |
| `06-tahallul` | Tahallul | Keempat, tahallul. Mencukur atau memotong rambut sesuai ketentuan. |
| `07-tertib` | Tertib | Kelima, tertib. Semua rukun dilaksanakan sesuai urutannya. |
| `08-outro` | Closing | Yuk, belajar umroh bersama Mudahkebaitullah! |

Pengucapan: *Ka'bah* = "Kakbah", *sa'i* = "sa-i", *Mudahkebaitullah* = "Mudah ke Baitullah". Untuk TTS, koreksi ini otomatis diterapkan lewat `TTS_LEXICON`.

## Alur kerja voice-over

### A. TTS (otomatis)
1. Set salah satu kredensial berikut sebagai environment variable/secret:
   - **Google Cloud TTS**: `GOOGLE_TTS_API_KEY`. Suara default `id-ID-Wavenet-B` (pria). Timing frasa diambil persis dari SSML mark. Daftar suara: `npm run vo:synth -- --list-voices`.
   - **Azure Speech**: `AZURE_SPEECH_KEY` + `AZURE_SPEECH_REGION`. Suara default `id-ID-ArdiNeural` (pria).
   - **ElevenLabs**: `ELEVENLABS_API_KEY` + `ELEVENLABS_VOICE_ID` (pilih suara pria Indonesia dewasa). Timing frasa diambil dari alignment karakter.
2. Pastikan host provider diizinkan oleh network policy environment.
3. `npm run vo:synth`. Perintah ini membuat 8 file di `public/assets/audio/episode-01/vo/` lalu langsung mengukurnya.
   Opsi: `TTS_VOICE=…`, `TTS_RATE=1.0` (0,9–1,1), `--only tawaf`.
4. **Dengarkan semua klip.** Cek karakter suara dan pengucapan istilah Arab.

### B. Rekaman manual
1. Rekam setiap baris sebagai file terpisah, beri nama persis seperti kolom *File* di atas (`.wav`/`.mp3`/`.m4a`/`.flac`). Simpan di `public/assets/audio/episode-01/vo/`.
2. Potong hening di awal/akhir file hingga sekitar 0,1 detik. Jeda antar-scene sudah ditambahkan otomatis.
3. `npm run vo:measure`.
4. (Opsional, supaya subtitle lebih presisi) tulis waktu mulai setiap frasa, dalam detik dari awal klip, di `vo/phrase-marks.json`:
   `{ "scenes": { "tawaf": [0.0, 1.4, 3.6, 5.5] } }`, lalu jalankan `npm run vo:measure` lagi.

### Setelah audio siap
```bash
npm run vo:export      # narration.timeline.json + out/episode-01.id.srt
npm run render:ep01    # MP4
npm run validate:ep01  # validasi video, audio & sinkronisasi
```

Jika total durasi melebihi 60 detik, `vo:measure` akan melaporkannya. Tidak ada kata atau kalimat yang dipotong. Saran yang diberikan berupa tempo sedikit lebih cepat (≤ 1,10×) atau daftar kalimat yang bisa dipersingkat.

## Sinkronisasi animasi (otomatis dari timing frasa)
| Ucapan | Visual |
|---|---|
| "…yuk kenali lima rukun umroh" | Pill "Kenali 5 Rukunnya!" muncul |
| "Rukun adalah bagian pokok ibadah" / "…umroh belum sah" | Legend Rukun/Wajib/Sunnah muncul, lalu kartu RUKUN berdenyut |
| "Pertama, ihram" | Jamaah pria & wanita masuk di miqat |
| "Yaitu berniat…" | Label **NIAT UMROH** + lafaz talbiyah |
| "…ketentuan miqat" | Catatan: miqat = wajib umroh, bukan rukun |
| "Mengelilingi Ka'bah tujuh putaran" | Jalan tawaf mulai, 7 putaran berlawanan arah jarum jam |
| "…dari arah Hajar Aswad" | Sudut Hajar Aswad & garis mulai disorot |
| "…selalu di sebelah kiri" | Catatan arah: Ka'bah di kiri |
| "Berjalan tujuh lintasan" | 7 lintasan Safa ⇄ Marwah dimulai (Safa → Marwah = 1 lintasan) |
| "Dimulai dari Safa" / "berakhir di Marwah" | Bukit Safa lalu Marwah disorot |
| "Mencukur atau memotong rambut" | Gunting mulai memotong |
| "sesuai ketentuan" | Ketentuan laki-laki / perempuan |
| "Kelima, tertib" / "Semua rukun…" | Node TERTIB disorot, lalu urutan Ihram → Tawaf → Sa'i → Tahallul |

## Catatan akurasi (untuk reviewer/ustadz)
- Kerangka lima rukun mengikuti yang umum diajarkan di Indonesia (mazhab Syafi'i).
- Video membedakan rukun, wajib, dan sunnah. Memulai ihram dari miqat adalah **wajib** umroh, bukan rukun.
- Tawaf berlawanan arah jarum jam dilihat dari atas, Ka'bah di kiri, dimulai dari garis Hajar Aswad (sudut timur). Hijr Ismail berada di dalam lintasan.
- Sa'i: Safa → Marwah = 1 lintasan, lintasan ke-7 berakhir di Marwah (diagram skematik, bukan peta).
- Tahallul: laki-laki mencukur habis atau memendekkan rambut, perempuan memotong ujung rambut.
- Mohon ditinjau oleh pembimbing/ustadz sebelum dipublikasikan.
