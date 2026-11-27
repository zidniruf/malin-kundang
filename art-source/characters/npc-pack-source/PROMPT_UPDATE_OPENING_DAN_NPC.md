# PROMPT UNTUK AI AGENT / CODEX
## Perbaiki alur opening/cinematic, animasikan Ibu Malin, dan hidupkan NPC Chapter 1

Bertindak sebagai game developer senior untuk proyek **Malin Kundang** yang menggunakan React + Vite + Phaser. Kerjakan langsung pada kode proyek yang sudah ada.

### Aturan utama sebelum mengubah kode

1. Baca struktur proyek dan file terkait terlebih dahulu: `App.jsx`, komponen Main Menu, komponen cinematic/intro, `PhaserGame.jsx`, `EventBus`, scene Chapter 1, konfigurasi aset, serta `agent.md`/`PRD.md` bila tersedia.
2. Pahami alur yang sudah berjalan dan identifikasi titik ketika tombol **Mulai Petualangan** memulai cinematic serta titik ketika cinematic memulai Phaser Chapter 1.
3. Jangan menebak nama file atau menghapus sistem lama. Ikuti arsitektur yang benar-benar ada di proyek.
4. **Jangan merombak atau merusak core gameplay Chapter 1**: gerakan Malin, lompat, collision, ukuran dunia, dan kontrol mobile harus tetap berfungsi.
5. Jangan membuat Main Menu kedua setelah cinematic. Setelah intro selesai, pemain harus masuk ke Chapter 1.
6. Pertahankan orientasi **landscape/horizontal** untuk permainan di HP dan pertahankan pemberitahuan ketika perangkat berada dalam orientasi portrait.
7. UI, judul chapter, dialog, dan teks narasi harus dibuat lewat React/CSS atau sistem UI game, bukan dicetak ke dalam gambar background.

---

## A. Perbaiki alur dari Main Menu ke Chapter 1

### Masalah saat ini
Saat tombol **Mulai Petualangan** ditekan, perpindahan terasa terlalu mendadak: tampilan opening berubah ke kampung nelayan, lalu Ibu Malin langsung terlihat. Pemain belum memahami lokasi, hubungan Malin dengan ibunya, dan alasan adegan tersebut terjadi. Adegan Ibu meminta tolong juga terasa terputus lalu masuk ke menu/game tanpa penyelesaian yang jelas.

### Alur final yang harus dibuat

**Tahap 1 — Main Menu yang sudah ada**
- Pertahankan desain Main Menu sekarang: background pantai/laut, logo Malin Kundang, Malin, kapal, dan tombol yang sudah tersedia.
- Saat tombol **Mulai Petualangan** ditekan, jangan langsung mengganti layar ke kampung nelayan.
- Nonaktifkan klik berulang selama transisi agar cinematic tidak dimulai dua kali.

**Tahap 2 — Menu menghilang, dunia opening tetap hidup**
- Fade-out tombol, logo, dan deskripsi secara halus sekitar 400–700 ms.
- Jangan menghapus background opening. Background tetap menjadi dasar adegan.
- Pertahankan gerak ombak, awan, kapal, dan elemen lingkungan dengan parallax lembut.
- Kamera melakukan zoom/pan perlahan untuk mengarahkan perhatian ke Malin.
- Jangan munculkan logo besar baru atau layar judul baru.

**Tahap 3 — Narasi pengenalan**
- Tampilkan narasi singkat di area bawah/tengah yang tidak menutupi karakter:
  - “Di sebuah kampung nelayan di pesisir Sumatra Barat, hiduplah seorang pemuda bernama Malin Kundang.”
  - “Malin tinggal sederhana bersama ibunya dan membantu kehidupan sehari-hari di kampung.”
- Tampilkan per kalimat dengan fade-in/fade-out. Beri waktu baca yang cukup, sekitar 2–3 detik per kalimat.
- Visual masih memperlihatkan suasana pantai dan kampung dari kejauhan. Jangan langsung spawn Ibu di sebelah Malin.

**Tahap 4 — Perlihatkan kampung sebelum memperlihatkan Ibu**
- Gunakan transisi bertahap dari pantai ke kampung nelayan panggung di atas air/dermaga yang sudah dipilih sebagai gaya Chapter 1.
- Gunakan pan kamera, parallax, foreground yang melintas, atau crossfade antarlayer. Hindari hard cut.
- Beri establishing shot sekitar 2 detik agar pemain mengenali dermaga, rumah panggung, kios ikan, perahu, dan warga.
- Pastikan visual kampung pada cinematic konsisten dengan background Chapter 1. Jangan kembali memakai kampung berbasis tanah yang lama.

**Tahap 5 — Malin dan Ibu berada dalam satu adegan**
- Tampilkan Malin di area dermaga/kampung. Gunakan desain Malin miskin/sederhana yang konsisten dengan cerita sebelum ia merantau.
- Jika versi Malin dengan karung/bawaan di punggung adalah versi untuk adegan keberangkatan merantau, jangan gunakan versi itu pada adegan keseharian sebelum merantau. Jangan mengganti desain Malin secara mendadak di tengah adegan.
- Ibu Malin **tidak boleh muncul tiba-tiba**. Ibu harus masuk dari sisi kiri atau dari arah rumah/kios menggunakan animasi berjalan dari spritesheet yang disertakan.
- Ibu berjalan mendekati Malin, berhenti pada jarak percakapan, lalu menghadap Malin. Jika arah sprite tidak sesuai, gunakan flip horizontal dengan benar.

**Tahap 6 — Percakapan Ibu dan Malin**
Gunakan dialog singkat, jelas, dan sesuai konteks kampung nelayan:

- Ibu: “Malin, bantu ibu mengantarkan hasil tangkapan ini ke dermaga, Nak.”
- Malin: “Baik, Bu. Malin akan membantu.”
- Narasi penutup: “Hari itu, seperti biasa, Malin membantu ibunya dan warga kampung. Perjalanannya baru saja dimulai.”

Saat dialog Ibu tampil, mainkan animasi `mother_talk`/`mother_call`. Saat Malin menjawab, kembalikan Ibu ke `mother_idle` dan tampilkan respons Malin. Jangan biarkan mulut/gestur Ibu terus bergerak saat Malin sedang berbicara.

**Tahap 7 — Serahkan kendali kepada pemain, bukan kembali ke menu**
- Setelah dialog selesai, tampilkan kartu chapter singkat:
  - `CHAPTER 1`
  - `Kampung Nelayan`
  - `Bantu Ibu mengantarkan hasil tangkapan ke dermaga.`
- Kartu tampil sekitar 1,5–2 detik, lalu fade ke scene Phaser Chapter 1.
- Spawn Malin pada posisi yang masuk akal di area kampung/dermaga, sedekat mungkin dengan lokasi akhir adegan intro agar perpindahan terasa kontinu.
- Ibu berada di lokasi yang sesuai di kampung sebagai NPC cerita, bukan menghilang mendadak.
- Mulai gameplay dengan objective sederhana: **“Bantu Ibu mengantarkan hasil tangkapan ke dermaga.”**
- Jangan munculkan Main Menu lagi setelah intro. Jangan membuat pemain memilih chapter atau menekan tombol menu tambahan.
- Tambahkan opsi **Lewati Cinematic** yang langsung menuju kondisi awal Chapter 1 yang sama. Pastikan skip tidak meninggalkan timer, listener, atau objek cinematic yang masih aktif.

---

## B. Ganti Ibu yang statis menjadi karakter animasi dari spritesheet

### File aset
Gunakan file:
`/assets/characters/mother/mother-malin-spritesheet.png`

Spritesheet Ibu berukuran 1448 × 1086 px, transparan, dengan susunan nominal 4 kolom × 3 baris (setiap sel 362 × 362 px):

- Baris 1, frame 0–3: `mother_idle` — pose berdiri/diam.
- Baris 2, frame 4–7: `mother_walk` — pose berjalan.
- Baris 3, frame 8–11: `mother_talk` — gestur memanggil/berbicara.

Gunakan pemetaan frame sesuai urutan kiri ke kanan, atas ke bawah. Validasi tampilan tiap frame sebelum menetapkan animasi. Jangan menganggap semua frame punya bounding box karakter yang sama; pertahankan ukuran sel dan titik pijak kaki agar sprite tidak bergeser/bergetar.

### Perilaku animasi Ibu

1. Saat pertama muncul, Ibu masuk dari luar layar dengan `mother_walk`.
2. Selama berjalan, gerakkan posisi Ibu secara halus menuju titik berhenti. Kecepatan animasi dan kecepatan perpindahan harus sinkron.
3. Saat tiba, hentikan gerak dan mainkan `mother_idle`.
4. Ketika dialog Ibu aktif, mainkan `mother_talk`.
5. Setelah dialog Ibu selesai, kembali ke `mother_idle`.
6. Saat adegan berpindah ke Chapter 1, jangan membuat Ibu teleport. Pertahankan posisi atau lakukan transisi kamera yang membuat perpindahan masuk akal.

### Implementasi teknis
- Gunakan mekanisme animasi yang sudah dipakai proyek. Jika cinematic dirender di React, integrasikan spritesheet dengan metode sprite animation/CSS yang cocok; jika adegan berjalan di Phaser, daftarkan animasi Phaser. Jangan membuat dua sistem rendering karakter yang saling bertentangan.
- Buat konfigurasi terpusat untuk path aset, frame width/height, frame rate, dan nama animasi.
- Rekomendasi awal: idle 2–4 fps, walk 7–9 fps, talk 4–6 fps. Sesuaikan setelah diuji agar gerakan tidak terlalu cepat.
- Gunakan `object-fit`/scale yang menjaga proporsi karakter. Jangan meregangkan lebar dan tinggi secara terpisah.
- Gunakan anchor/origin di tengah bawah (sekitar titik kaki) agar posisi Ibu stabil saat berganti frame.
- Jika spritesheet gagal dimuat, tampilkan fallback gambar statis yang sudah ada dan catat error secara jelas; jangan membuat layar kosong.

---

## C. Tambahkan 4 NPC ambient yang bergerak di peta Chapter 1

Gunakan empat spritesheet berikut dari paket ini:

1. `/assets/characters/npc/npc-anak-desa.png`
2. `/assets/characters/npc/npc-nelayan.png`
3. `/assets/characters/npc/npc-buruh-pelabuhan.png`
4. `/assets/characters/npc/npc-penjual-ikan.png`

Masing-masing berukuran 1448 × 1086 px, transparan, susunan 4 kolom × 3 baris, sel nominal 362 × 362 px. Pemetaan per baris:

- **Anak desa**: baris 1 idle, baris 2 berjalan, baris 3 gestur/menunjuk.
- **Nelayan**: baris 1 idle, baris 2 berjalan, baris 3 menggunakan jala.
- **Buruh pelabuhan**: baris 1 idle, baris 2 berjalan, baris 3 mengangkat/membawa peti.
- **Penjual ikan**: baris 1 berdiri membawa keranjang, baris 2 berjalan, baris 3 menawarkan/menunjukkan ikan.

### Perilaku NPC
Buat kampung terasa hidup, tetapi jangan membuat gerakan yang terlalu ramai atau mengganggu pemain.

- **Anak desa**: berjalan santai secara acak di area aman dekat rumah/dermaga, berhenti sebentar, lalu berjalan lagi. Sesekali gunakan gestur baris 3.
- **Nelayan**: berjalan pendek di dekat perahu/dermaga, berhenti, lalu gunakan animasi jala di lokasi kerja.
- **Buruh pelabuhan**: berjalan di area bongkar muat; sesekali berhenti dan memainkan animasi mengangkat peti. Jangan biarkan peti atau karakter masuk ke jalur pemain.
- **Penjual ikan**: mayoritas diam di dekat kios dengan animasi idle/menawarkan ikan. Sesekali boleh berjalan sangat pendek di area kios, tetapi jangan meninggalkan lapaknya.

### Sistem gerak random yang aman
- Setiap NPC memiliki titik awal, batas patroli kiri/kanan, dan area kerja masing-masing.
- Pilih aksi secara acak **hanya saat NPC selesai melakukan aksi**, bukan melakukan random setiap frame.
- Contoh pola: idle 2–5 detik -> berjalan 1–3 detik -> berhenti 2–4 detik -> ulangi.
- Jangan teleport. NPC harus berjalan sampai titik tujuan.
- Jangan biarkan NPC keluar dari platform, jatuh ke air, menembus bangunan, atau berjalan keluar batas map.
- Gunakan collision atau batas patroli sederhana. NPC tidak harus memiliki collision fisik dengan Malin jika itu mengganggu gameplay.
- Atur depth berdasarkan posisi Y agar karakter terlihat berada di atas/depan dermaga dengan benar.
- Gunakan timer/event Phaser yang dibersihkan saat scene dihentikan. Jangan membuat timer/listener bocor.
- Maksimalkan reuse animasi dan batasi jumlah NPC aktif agar lancar di HP.

---

## D. Pengujian wajib

Setelah implementasi, uji dan laporkan hasilnya:

1. Klik **Mulai Petualangan** hanya memulai satu cinematic.
2. Logo/tombol menu memudar, tetapi background opening tidak hilang mendadak.
3. Ada establishing shot kampung sebelum Ibu muncul.
4. Ibu terlihat berjalan masuk, berhenti, berbicara, lalu idle kembali.
5. Dialog Ibu dan Malin tampil berurutan dan terbaca.
6. Intro berakhir dengan kartu Chapter 1, kemudian langsung menyerahkan kontrol ke gameplay — bukan kembali ke Main Menu.
7. Tombol Lewati Cinematic menuju posisi awal gameplay yang sama.
8. NPC memiliki gerak random yang wajar, tetap di area masing-masing, dan tidak mengganggu pemain.
9. Kontrol gerak/lompat Malin yang sudah ada tetap berfungsi.
10. Tampilan tetap nyaman di layar HP landscape; mode portrait tetap menampilkan arahan untuk memutar perangkat.
11. Tidak ada error console, asset 404, timer yang tertinggal, atau event listener ganda.

### Batasan perubahan
Jangan mengubah desain visual utama Main Menu, jangan mengganti background Chapter 1 yang sudah dipilih, jangan menghapus aset lama, dan jangan merombak sistem kontrol/gameplay. Fokus pada transisi intro, animasi Ibu, serta NPC ambient.

### Laporan setelah selesai
Sebutkan file yang diubah, file aset yang dipakai, animasi yang dibuat, cara menjalankan/menguji, dan hal yang belum selesai. Jika ada frame sheet yang ternyata tidak sesuai pemetaan, laporkan dan jangan menebak diam-diam.
