# Product Requirements Document (PRD)

## Malin Kundang: The Moral Adventure

  Informasi                Detail
  ------------------------ ----------------------------------------------------------
  Jenis produk             Game edukasi berbasis cerita rakyat Indonesia
  Genre                    Adventure Platformer
  Perspektif               2D Side-Scrolling dengan pendekatan visual 2.5D
  Target pengguna          Remaja usia 11--17 tahun
  Platform                 Web browser desktop dan mobile
  Teknologi                React, Tailwind CSS 4, Phaser 4, Vite, JavaScript
  Status                   Prototipe menu dan gerakan karakter Level 1
  Durasi proyek akademik   5 minggu

Terakhir diperbarui: **26 November 2026**. Dokumen ini tetap menetapkan
target produk akhir. Bagian status implementasi membedakan fitur yang
sudah ada dari kebutuhan yang belum selesai; kebutuhan wajib tidak dihapus.

------------------------------------------------------------------------

## 1. Ringkasan produk

**Malin Kundang: The Moral Adventure** adalah game edukasi petualangan
yang mengadaptasi cerita rakyat Malin Kundang dari Sumatera Barat.
Pemain mengikuti perjalanan Malin melalui tiga tahap: kehidupan di
kampung halaman, perjalanan merantau melalui laut, dan kepulangannya ke
kampung sebagai seorang saudagar.

Game dirancang sebagai 2D side-scrolling platformer dengan gaya visual
2D Stylized / 2.5D. Kedalaman visual dibangun melalui background
berlapis, parallax scrolling, foreground, pencahayaan, dan dekorasi
lingkungan. Gameplay tetap berlangsung pada bidang 2D dan dikembangkan
menggunakan Phaser 4.

Nilai moral tidak hanya disampaikan melalui teks atau kuis terpisah.
Pemain mempelajarinya melalui interaksi dengan karakter, tantangan,
aktivitas, pilihan dialog, serta umpan balik yang terkait dengan cerita.

### 1.1 Status implementasi saat ini

Kode saat ini menyediakan menu React dan scene Phaser untuk menguji gerakan
Malin di Kampung Nelayan. Ini belum merupakan satu level edukatif lengkap
atau game tiga level yang memenuhi kriteria penerimaan.

| Area | Keadaan berdasarkan kode dan dokumentasi |
| --- | --- |
| Menu utama | Opening React/CSS dengan parallax dari aset `public/assets/opening/`, lalu menu Mulai Petualangan, Pengaturan, Tentang Game, dan Keluar |
| Pengaturan dan petunjuk | Pengaturan musik/volume siap tetapi nonaktif sampai file musik tersedia; tombol/panel Petunjuk belum ada (kontrol singkat ada di Tentang Game) |
| Navigasi | Menu → cinematic yang berlanjut dari scene menu (dapat dilewati) → kamera berpindah ke framing gameplay → `PhaserGame` otomatis tanpa potongan dan tanpa kembali ke menu (game dipasang di bawah frame terakhir intro lalu intro dilepas); Lewati Cinematic memakai fade gelap singkat; tombol Kembali ke Menu melepas komponen game |
| Opening cinematic | Berlanjut dari Main Menu tanpa logo kedua: menu memudar → shot teluk (kamera mendekat, awan/ombak/dedaunan parallax, kapal berlayar) → shot dermaga → babak kampung di Phaser pada dunia yang sama dengan Chapter 1 (framing sinematik lebih dekat; warga sudah ada di dunia tetapi di luar bingkai zoom; Malin tanpa buntalan berjalan; Ibu berjalan masuk dari arah rumah dengan sprite sheet) → dialog Ibu meminta Malin mengantarkan hasil tangkapan ke dermaga (animasi bicara) dan jawaban Malin → narasi penutup → letterbox, narasi, dan tombol memudar sementara kamera zoom out ke framing gameplay sehingga warga terlihat sudah berada di tempatnya → gameplay otomatis dengan label kecil Chapter 1 + tujuan yang hilang sendiri. Tiga baris narasi + dua baris dialog, tombol Lanjut dan Lewati Cinematic. Musik belum ada karena belum tersedia file audio |
| Dunia Level 1 | **World map Phase 1 (world building):** satu dunia side-scrolling 7502×849 px dari 6 background area (Rumah Malin → Dermaga Nelayan → Dermaga Rusak → Jalan Kampung → Pasar Ikan → Pelabuhan) yang garis dermaganya diselaraskan di y=600, disambung dengan gradasi dan ditutup rumah panggung/lapak yang berdiri di dermaga. Dermaga Rusak berisi dek bertingkat dan tunggul tiang (lompat; jatuh ke air → muncul kembali di awal area). Pelabuhan: dermaga depan, kapal layar, tangga ke dek atas. Kamera mengikuti Malin; canvas memenuhi layar (Scale.EXPAND, tanpa blur). Belum ada: props/rintangan peti-batu, zona interaksi, UI pasar |
| Karakter | Dua sprite sheet Malin: tanpa bawaan (8×5: idle, jalan, lari, lompat, jongkok, bicara; gameplay + adegan keseharian cinematic) dan ber-buntalan (8×3, sementara, disimpan untuk keberangkatan). Ibu Malin beranimasi (idle, jalan, bicara). Arah kiri melalui `flipX`. Skala Malin 0,53 (`PLAYER_SCALE`), Ibu dan warga ±15% lebih besar dari versi awal |
| Warga (NPC) | Ibu (NPC cerita di ujung jalan setapak rumah, Area 1) dan 4 NPC ambient: nelayan memakai jala di ujung dermaga Area 1, buruh mengangkat peti di Dermaga Nelayan, anak desa di Jalan Kampung, penjual ikan di depan lapak Pasar Ikan. Gerak acak per area di lantai utama tanpa physics; sudah berada di dunia sejak intro (di luar bingkai zoom); belum bisa diajak bicara |
| Input | A/D atau panah kiri/kanan, Space/panah atas, tombol sentuh kiri/kanan/lompat; input disatukan di `PlayerControls` |
| Interaksi dan edukasi | Tujuan Chapter 1 ("Bantu Ibu mengantarkan hasil tangkapan ke dermaga.") tampil di label pembuka dan HUD, tetapi mekanik misinya (mengambil/mengantar hasil tangkapan, kondisi selesai) belum dibuat. Interaksi E, dialog NPC, Poin Kebajikan, dan feedback moral belum tersedia |
| Kelanjutan cerita | Level 2–3, perpindahan progres, klimaks, dan layar hasil belum tersedia |
| Audio dan pause | Audio dinonaktifkan pada konfigurasi game; pause/Escape belum tersedia |

Build dan lint kode terbaru lulus pada tanggal pembaruan ini. Pengujian
browser integrasi karakter sebelumnya terdokumentasi, tetapi menu terbaru
belum diuji ulang di browser. Rincian cakupan dan batas bukti ada di bagian 18.

## 2. Latar belakang dan kebutuhan

Proyek ini merupakan bagian dari tugas mata kuliah Game Programming:
pengembangan game edukasi berbasis cerita rakyat Indonesia selama lima
minggu. Ketentuan tugas meminta game memiliki tujuan pembelajaran yang
jelas, gameplay menarik, interaksi, tantangan, unsur edukasi yang
terintegrasi, sistem skor, umpan balik, minimal tiga level/tahapan, menu
utama, petunjuk, dan tampilan gameplay.

Game ini memilih cerita Malin Kundang karena kisahnya dapat digunakan
untuk membahas penghormatan kepada orang tua, tanggung jawab, kerendahan
hati, rasa syukur, dan konsekuensi tindakan.

## 3. Visi produk

Menyajikan cerita rakyat Malin Kundang sebagai pengalaman petualangan
interaktif yang menarik secara visual, mudah dimainkan melalui browser,
dan membantu remaja merefleksikan nilai moral melalui tindakan dalam
permainan.

## 4. Tujuan produk

### 4.1 Tujuan edukasi

Setelah memainkan game, pemain diharapkan mampu: 1. Mengidentifikasi
tindakan yang menunjukkan sikap menghormati orang tua. 2. Memahami
pentingnya tanggung jawab terhadap tindakan sendiri. 3. Mengenali sikap
rendah hati dan rasa syukur. 4. Menghubungkan tindakan tokoh dengan
konsekuensi yang terjadi dalam cerita. 5. Menjelaskan pesan moral cerita
Malin Kundang melalui refleksi di akhir permainan.

### 4.2 Tujuan produk

-   Mengadaptasi satu cerita rakyat Indonesia menjadi game digital.
-   Menghasilkan minimal tiga level/tahapan yang dapat dimainkan.
-   Mengintegrasikan interaksi, tantangan, sistem skor, dan feedback.
-   Menyediakan antarmuka menu, petunjuk, dan gameplay.
-   Menghasilkan source code, dokumentasi, laporan, dan video
    demonstrasi.

## 5. Target pengguna

**Pengguna utama:** remaja usia 11--17 tahun.

Karakteristik desain: - Instruksi singkat dan mudah dipahami. - Kontrol
sederhana. - Tantangan meningkat secara bertahap. - Dialog tidak terlalu
panjang. - Visual ekspresif dan konsisten. - Pesan moral disampaikan
melalui konteks permainan, bukan ceramah panjang.

**Platform penggunaan:** browser desktop/laptop dan browser mobile.
Orientasi gameplay yang direncanakan adalah landscape. Kompatibilitas
perangkat harus diuji selama pengembangan.

## 6. Konsep cerita dan adaptasi

### 6.1 Premis

Malin Kundang tumbuh di sebuah kampung pesisir bersama ibunya. Ia ingin
mengubah nasib melalui perjalanan merantau. Setelah menghadapi tantangan
di laut dan memperoleh keberhasilan, Malin kembali ke kampung sebagai
saudagar. Ketika ibunya menyambutnya, Malin menyangkal hubungan mereka.
Kisah berakhir dengan kutukan yang mengubah Malin menjadi batu, sesuai
inti legenda yang diadaptasi.

### 6.2 Prinsip adaptasi

-   Pertahankan alur inti legenda Malin Kundang.
-   Hormati konteks budaya Sumatera Barat dan jangan menggambarkan unsur
    budaya secara asal.
-   Dialog, aktivitas tambahan, dan tantangan boleh dikembangkan untuk
    kebutuhan gameplay, tetapi tidak boleh mengubah pesan utama cerita.
-   Bedakan bagian yang bersumber dari cerita rakyat dan bagian yang
    merupakan tambahan kreatif tim.
-   Lengkapi detail bibliografi dari sumber cerita sebelum laporan
    final.

## 7. Genre dan pengalaman bermain

**Genre:** adventure platformer 2D side-scrolling.

Pemain mengendalikan Malin untuk: - Berjalan dan berlari. - Melompat
melewati platform atau rintangan. - Menjelajahi area. - Berinteraksi
dengan NPC dan objek. - Mengumpulkan item yang relevan dengan tujuan
level. - Menyelesaikan tantangan lingkungan. - Memilih respons dalam
dialog tertentu. - Menerima feedback dan poin kebajikan.

### 7.1 Core gameplay loop

1.  Pemain memasuki level dan menerima tujuan.
2.  Pemain menjelajahi lingkungan.
3.  Pemain melewati platform atau rintangan.
4.  Pemain berinteraksi dengan objek/NPC atau menyelesaikan tantangan.
5.  Game memberikan feedback dan memperbarui poin.
6.  Pemain mencapai tujuan level dan melanjutkan cerita.

## 8. Rancangan level

### Level 1 --- Kampung Nelayan

**Konteks cerita:** kehidupan Malin bersama ibunya sebelum merantau.

**Lingkungan:** - Kampung nelayan pesisir Sumatera Barat yang dibangun di
atas air. - Rumah panggung dengan unsur arsitektur Minangkabau yang
diteliti. - Dermaga kayu sebagai jalur berjalan, laut biru jernih, bukit
hijau di kejauhan, perahu nelayan, kapal layar, dan pepohonan tropis. -
NPC penduduk kampung.

**Aktivitas:** - Menjelajahi kampung. - Membantu warga menyelesaikan
tugas sederhana. - Mengumpulkan bekal perjalanan. - Berinteraksi dengan
ibu Malin. - Menyelesaikan tantangan ringan berbasis kepedulian dan
tanggung jawab.

**Tujuan edukasi:** kepedulian, membantu keluarga, menghargai orang tua,
dan tanggung jawab.

**Kondisi selesai:** pemain menyelesaikan tujuan level dan adegan
keberangkatan Malin dimulai.

**Status implementasi:** saat ini baru lingkungan statis (kampung dermaga)
dan prototipe gerakan/lompatan Malin. Misi membantu warga, bekal, ibu Malin, tantangan,
dan kondisi selesai di atas masih perlu dibuat. Parallax serta kamera
side-scrolling belum diterapkan.

### Level 2 --- Perjalanan Merantau

**Konteks cerita:** Malin meninggalkan kampung dan menghadapi perjalanan
laut.

**Lingkungan:** - Kapal kayu. - Laut, pulau, ombak, dan perubahan
cuaca. - Bagian kapal yang menjadi platform. - Objek perjalanan yang
relevan.

**Aktivitas:** - Melompat melewati bagian kapal. - Menghindari rintangan
lingkungan. - Mengumpulkan perlengkapan atau item perjalanan. -
Menyelesaikan tantangan navigasi/lingkungan sederhana.

**Tujuan edukasi:** kerja keras, ketekunan, tanggung jawab, dan rasa
syukur.

**Kondisi selesai:** pemain mencapai tujuan perjalanan dan cerita
berlanjut ke masa keberhasilan Malin.

**Status implementasi:** scene dan gameplay Level 2 belum tersedia.

### Level 3 --- Kembali ke Kampung

**Konteks cerita:** Malin kembali sebagai saudagar dan bertemu ibunya.

**Lingkungan:** - Pelabuhan dan permukiman pesisir. - Kapal besar. -
Penduduk dan NPC. - Laut yang berubah menjadi lebih dramatis menjelang
klimaks.

**Aktivitas:** - Menjelajahi pelabuhan. - Berinteraksi dengan NPC. -
Mengikuti adegan pertemuan Malin dan ibunya. - Memilih respons dialog
pada bagian yang dirancang. - Menyaksikan konsekuensi dari tindakan
Malin.

**Tujuan edukasi:** menghormati orang tua, rendah hati, rasa syukur, dan
konsekuensi kesombongan serta penyangkalan.

**Kondisi selesai:** klimaks cerita ditampilkan dan game memberikan
ringkasan poin serta refleksi moral.

**Catatan:** pilihan dialog dapat memengaruhi feedback atau poin, tetapi
ending utama tetap mempertahankan inti legenda Malin Kundang. Jangan
membuat cabang cerita besar tanpa persetujuan pemilik produk.

**Status implementasi:** scene, gameplay, dan ending Level 3 belum tersedia.

## 9. Mekanisme dan aturan permainan

### 9.1 Kontrol desktop

  Input              Aksi
  ------------------ --------------------------------------------
  A / Arrow Left     Bergerak ke kiri
  D / Arrow Right    Bergerak ke kanan
  Space / Arrow Up   Melompat
  E                  Interaksi
  Escape             Pause, jika tersedia pada konteks tersebut

### 9.2 Kontrol mobile

-   Tombol arah atau virtual directional pad.
-   Tombol lompat.
-   Tombol interaksi ketika tersedia.
-   Tombol harus cukup besar dan tidak menutupi area penting permainan.

Input desktop dan mobile harus menggunakan abstraksi kontrol yang sama
agar logika karakter tidak terikat pada perangkat tertentu.

**Status kontrol:** kiri/kanan dan lompat sudah diimplementasikan pada
keyboard dan tombol sentuh. Keyboard aktif pada area game yang mendapat
fokus. Tombol sentuh hanya tampil pada perangkat sentuh: ←/→ di kiri bawah,
Lompat di kanan bawah, ukuran 48–76 px, di bawah garis pijakan Malin.
Petunjuk kontrol di tengah atas hilang pada input pertama. Layar gameplay
memenuhi viewport landscape tanpa scroll; di HP/tablet portrait tampil
overlay "Putar Perangkat Anda" ("Putar perangkat ke mode horizontal untuk
bermain.") dan gameplay dijeda sampai kembali landscape.
E, Escape, dan interaksi mobile belum tersedia.

### 9.3 Tantangan

-   Platform dan rintangan lingkungan.
-   Objek yang perlu dikumpulkan.
-   Interaksi NPC.
-   Tantangan sederhana yang berhubungan dengan konteks level.
-   Pilihan dialog yang menyampaikan nilai moral.

### 9.4 Kondisi keberhasilan

Pemain menyelesaikan tujuan level dan mencapai titik akhir yang
ditetapkan. Jika ada kondisi gagal, game harus memberi informasi yang
jelas dan menyediakan cara mencoba kembali.

## 10. Sistem skor dan feedback edukasi

### 10.1 Poin Kebajikan

Game menggunakan sistem **Poin Kebajikan** untuk merepresentasikan
tindakan edukatif pemain.

Poin dapat diberikan ketika pemain: - Membantu NPC. - Menyelesaikan
aktivitas yang menunjukkan kepedulian atau tanggung jawab. - Memilih
respons dialog yang menghormati orang tua. - Menyelesaikan tantangan
edukatif sesuai aturan.

Poin tidak diberikan hanya karena pemain mengumpulkan item biasa,
kecuali item tersebut memang menjadi bagian dari tujuan edukatif level.

### 10.2 Feedback

Feedback dapat berupa: - Pesan berhasil/gagal menyelesaikan tantangan. -
Penjelasan singkat mengapa suatu tindakan tepat atau tidak tepat. -
Perubahan jumlah Poin Kebajikan. - Ringkasan nilai yang dipelajari
setelah level. - Refleksi moral pada akhir cerita.

Aturan perolehan poin harus ditetapkan di GDD dan diterapkan konsisten.
Jangan menilai karakter pemain secara personal; feedback harus membahas
tindakan dalam konteks cerita.

## 11. Antarmuka dan pengalaman pengguna

### 11.1 Main menu

Elemen: - Judul dan identitas game. - Tombol Mulai. - Petunjuk. -
Pengaturan suara. - Informasi game.

### 11.2 Petunjuk permainan

Menjelaskan kontrol desktop/mobile, cara berinteraksi, tujuan level,
cara memperoleh poin, dan arti feedback.

### 11.3 Gameplay HUD

Elemen: - Nama/indikator level. - Poin Kebajikan. - Item atau tujuan
level bila relevan. - Tombol pause. - Petunjuk interaksi kontekstual.

### 11.4 Dialogue UI

Elemen: - Nama atau potret tokoh. - Teks dialog singkat. - Tombol
lanjut. - Pilihan respons jika diperlukan. - Feedback setelah pilihan.

### 11.5 Pause dan hasil permainan

Pause menyediakan lanjutkan dan kembali ke menu. Layar hasil menampilkan
progres, Poin Kebajikan, dan ringkasan pesan moral.

## 12. Art direction dan aset

### 12.1 Gaya visual

-   2D Stylized / 2.5D.
-   Hand-painted look.
-   Side-scrolling.
-   Warna dan pencahayaan atmosferis.
-   Vegetasi tropis, lingkungan kaya detail, karakter ekspresif.
-   Referensi visual digunakan untuk arah gaya, bukan untuk menyalin
    aset atau karakter dari game lain.

### 12.2 Prinsip background

Gunakan layer terpisah agar parallax dapat diterapkan: 1. Sky dan awan.
2. Pegunungan atau garis pantai jauh. 3. Far forest / vegetasi jauh. 4.
Midground seperti rumah dan kapal. 5. Gameplay layer seperti tanah,
jalan, dermaga, atau platform. 6. Foreground seperti daun, rumput, dan
batang pohon.

Background dekoratif harus dipisahkan dari platform/collision gameplay.
Foreground tidak boleh menghalangi keterbacaan karakter atau rintangan.

### 12.3 Standar aset awal

-   Rasio desain gameplay: 16:9.
-   Kanvas acuan: 1280×720.
-   Sprite transparan: PNG atau format transparan yang sesuai.
-   Background tanpa transparansi: WebP dapat digunakan setelah diuji.
-   Gunakan nama file dan key yang konsisten.
-   Aset produksi harus berupa gambar terpisah, bukan asset sheet
    referensi yang masih berisi label atau panel.

### 12.4 Atribusi

Setiap aset harus dicatat dalam asset register dengan kolom: - Nama
aset. - Lokasi file. - Pembuat/sumber. - Jenis sumber (buatan sendiri,
AI-generated, pihak ketiga, modifikasi). - Lisensi atau ketentuan
penggunaan. - Bagian game yang menggunakan aset.

### 12.5 Aset prototipe yang tersedia

| Aset | Lokasi dan spesifikasi | Sumber/status |
| --- | --- | --- |
| World map Chapter 1 (aktif, modular) | `public/assets/chapter-1/kit/*.webp` (elemen yang dipakai berulang, disusun `src/game/chapter1/layout.js`), dibangun `art-source/tools/build_chapter1_kit.py` dari paket asset-malin-kundang (S9). World lama `chapter-1/world/world-0..3.webp` disimpan, tidak dimuat | Paket aset pemilik proyek; README paket: dibuat/diproses dengan AI, alat dan lisensi tidak tercatat |
| Background kampung dermaga satu layar (disimpan) | `public/assets/backgrounds/level-1/l1-dermaga-tall.png`; 1280×849 (dibangun `art-source/tools/build_level1_background.py`; `l1-dermaga.png` 1280×720 disimpan), turunan dari `art-source/level-1/kampung-tropis-cerah.png` | Paket aset pemilik proyek; indikasi AI, alat dan lisensi belum dikonfirmasi |
| Layer kampung dermaga untuk cinematic (disimpan, tidak dimuat) | `public/assets/cinematic/village/*.png`; panorama 3:1 | Paket aset pemilik proyek; indikasi AI, alat dan lisensi belum dikonfirmasi |
| Ibu Malin | `public/assets/characters/mother/mother-malin-spritesheet.png` (4×3, 200×216) + `mother-standing.png` (fallback) | Desain sama; lisensi belum dikonfirmasi |
| Enam layer Kampung Nelayan (arsip) | `public/assets/backgrounds/level-1/l1-{sky,mountains,forest,village,ground,foreground}.png`; masing-masing 1672×941 | Dibuat ulang dengan AI berdasarkan referensi pemilik proyek; tidak dimuat lagi |
| Spritesheet Malin gameplay | `public/assets/characters/malin/malin-gameplay-spritesheet.png`; 2240×1400, grid 8×5, frame 280×280 | Turunan dari fix pack pemilik proyek (frame dijangkar ulang); lisensi belum dikonfirmasi |
| Spritesheet Malin opening | `public/assets/characters/malin/malin-opening-spritesheet.png`; 2240×840, grid 8×3, frame 280×280 | Sementara: frame gameplay + buntalan programatik; menunggu sheet final |
| Delapan referensi visual | Dicatat di `public/assets/references/level-1/README.md` | File asli lampiran belum diimpor; bukan file background aktif |

Daftar lengkap ada di `ASSET_INDEX.md` dan asal-usulnya di `ASSET_PROVENANCE.md`.
Prompt dan alat pembuatan layer `l1-*` lama dicatat di `asset-generation.json`.
README folder background/karakter menyimpan metadata dan batas penggunaan.
Animasi gameplay: idle 0–7 (6 fps), berjalan 8–15 (12 fps), lompat 24–31
(10 fps, sekali); lari, jongkok, dan bicara sudah terdaftar untuk fitur
berikutnya. Animasi opening: idle 0–7, jalan pelan 8–15, farewell 16–23. Frame
rate merupakan pilihan implementasi dan dapat disesuaikan setelah evaluasi.

Layer yang sudah terpisah belum membuktikan seamless tiling, akurasi budaya,
atau performa pada perangkat target. Bangunan masih dekoratif, dan gambar
ground tidak mendefinisikan collision. Sumber/lisensi referensi perlu
dilengkapi sebelum dokumentasi final.

## 13. Persyaratan fungsional

  -----------------------------------------------------------------------
  ID                      Kebutuhan               Prioritas
  ----------------------- ----------------------- -----------------------
  FR-01                   Game dapat dibuka       Must
                          melalui web browser     

  FR-02                   Main menu menyediakan   Must
                          tombol mulai dan        
                          petunjuk                

  FR-03                   Pemain dapat            Must
                          mengendalikan karakter  

  FR-04                   Pemain dapat melompat   Must
                          dan berinteraksi dengan 
                          lingkungan              

  FR-05                   Game menyediakan        Must
                          minimal tiga            
                          level/tahapan playable  

  FR-06                   Setiap level memiliki   Must
                          tujuan dan tantangan    
                          yang berbeda            

  FR-07                   Pemain dapat            Must
                          berinteraksi dengan     
                          NPC/objek               

  FR-08                   Game memiliki sistem    Must
                          Poin Kebajikan atau     
                          penilaian lain          

  FR-09                   Game memberikan         Must
                          feedback terhadap       
                          aktivitas/pilihan       

  FR-10                   Unsur edukasi           Must
                          terintegrasi dengan     
                          gameplay                

  FR-11                   Game memiliki alur      Should
                          akhir dan layar         
                          hasil/refleksi          

  FR-12                   Game menyediakan audio  Should
                          yang sesuai jika        
                          relevan                 

  FR-13                   Game menyediakan        Should
                          kontrol sentuh untuk    
                          mobile                  

  FR-14                   Progress satu sesi      Must
                          tetap konsisten ketika  
                          berpindah scene         
  -----------------------------------------------------------------------

## 14. Persyaratan nonfungsional

### Performa

-   Game harus dapat dimainkan tanpa jeda yang mengganggu pada perangkat
    target yang diuji.
-   Ukuran aset dan penggunaan partikel harus dikendalikan.
-   Hindari memuat aset yang tidak diperlukan untuk level aktif.
-   Uji performa pada setidaknya satu browser desktop dan satu
    perangkat/browser mobile jika tersedia.

### Responsivitas

-   Canvas menyesuaikan viewport dengan rasio gameplay yang
    direncanakan.
-   UI React menyesuaikan lebar layar.
-   Pada mobile, gameplay mengutamakan landscape.
-   Jangan menganggap rotasi layar atau kompatibilitas semua browser
    telah terjamin sebelum diuji.

### Usability dan aksesibilitas

-   Instruksi singkat dan jelas.
-   Teks mudah dibaca.
-   Kontrol tidak terlalu kecil.
-   Feedback tidak hanya dibedakan dengan warna.
-   Karakter dan platform tetap mudah dibedakan dari background.

### Maintainability

-   Kode dipisah berdasarkan tanggung jawab.
-   Komunikasi React--Phaser terdokumentasi.
-   Aset memiliki penamaan konsisten.
-   Perubahan disimpan melalui Git.
-   Tidak menambah dependency tanpa kebutuhan yang jelas.

## 15. Stack dan arsitektur teknis

### Stack

  Bagian            Teknologi        Tanggung jawab
  ----------------- ---------------- -----------------------------------------
  UI                React            Menu, HUD, dialog, pause, hasil
  Styling           Tailwind CSS 4   Tampilan UI
  Game engine       Phaser 4         Scene, gameplay, physics, kamera, input
  Build tool        Vite             Development dan build web
  Bahasa            JavaScript       Logika aplikasi dan game
  Version control   Git              Riwayat dan kolaborasi

### Batas arsitektur

-   React mengelola UI aplikasi.
-   Phaser mengelola dunia dan logika real-time permainan.
-   EventBus atau mekanisme event setara menjadi jembatan komunikasi.
-   Jangan menduplikasi state gameplay di React dan Phaser tanpa alasan.
-   Tidak ada backend atau akun pengguna dalam lingkup awal.
-   Simpan progres minimum dalam satu sesi permainan; persistensi lintas
    sesi merupakan fitur tambahan jika waktu memungkinkan.

### Struktur folder tujuan

``` text
public/
└── assets/
    ├── backgrounds/
    │   ├── level-1/
    │   ├── level-2/
    │   └── level-3/
    ├── characters/
    ├── objects/
    ├── audio/
    └── ui/

src/
├── components/
├── game/
│   ├── scenes/
│   ├── entities/
│   ├── systems/
│   └── EventBus.js
├── PhaserGame.jsx
├── App.jsx
├── index.css
└── main.jsx
```

Struktur ini adalah target yang dapat disesuaikan dengan kebutuhan nyata
repository. Jangan membuat semua file kosong hanya untuk meniru
struktur.

### Implementasi arsitektur saat ini

| File | Tanggung jawab yang sudah diterapkan |
| --- | --- |
| `src/App.jsx` | State navigasi menu → handoff → game (serah terima intro ke gameplay tanpa potongan) |
| `src/components/MainMenu.jsx` | Menu aktif dan panel Pengaturan/Tentang Game |
| `src/PhaserGame.jsx` | Layar gameplay Chapter 1 layar penuh: instance Phaser (EXPAND, basis 1280×720), sinyal siap untuk serah terima, HUD (label, toast Chapter 1, petunjuk, Kembali ke Menu), jeda saat portrait, loading/error, dan cleanup |
| `src/components/TouchControls.jsx`, `OrientationGuard.jsx`, `useDeviceProfile.js`, `ChapterOne.css` | Tombol sentuh, overlay putar perangkat, deteksi sentuh/orientasi + kunci landscape opsional, dan gaya layar gameplay |
| `src/game/scenes/LevelOneScene.js` | Preload dalam scene, rendering layer, physics, collision lantai, karakter, dan animasi |
| `src/game/levelFraming.js` | Framing kamera bersama (`levelView`, `attachLevelCamera`) untuk gameplay dan akhir intro |
| `src/game/chapter1/world.js`, `layout.js`, `kit.json` | World map modular: penempatan elemen (layout.js, boleh diedit), latar parallax, batas area, lantai/platform satu arah dari permukaan elemen, titik respawn (kit.json dibangkitkan skrip) |
| `src/game/PlayerControls.js` | Abstraksi input keyboard/sentuh dan reset input |
| `src/game/EventBus.js` | Jembatan event React–Phaser |
| `src/game/level1Assets.js` dan `src/game/malinAssets.js` | URL aset berbasis `import.meta.env.BASE_URL` dan konfigurasi animasi |
| `src/components/LevelOnePreview.jsx` | Preview aset lama; tidak dipakai pada alur `App.jsx` saat ini |

Event yang sudah digunakan adalah `control` dan `release-controls` dari
React ke scene, serta `game-ready`, `game-error`, dan `npcs-ready` dari
scene ke React.
State karakter tetap dikelola Phaser. Kontrak payload dan hasil pengujian
tercatat di `docs/character-integration.md`.

Konfigurasi memakai `Phaser.AUTO`, scaling EXPAND, Arcade Physics, dan
`audio.noAudio: true`. Boot/preload scene terpisah belum dibuat; preload
masih di LevelOneScene. Belum ada state progres antarscene. Perpindahan
kembali ke menu menghancurkan game, dan mulai lagi membuat instance baru.

Versi terpasang yang cocok dengan lockfile pada 26 November 2026: React dan
React DOM 19.3.1, Phaser 4.2.1, Tailwind CSS/plugin Vite 4.3.5, Vite 8.3.8.
Lingkungan pemeriksaan memakai Node.js v24.22.2 dan npm 11.19.1; ini catatan
lingkungan, bukan penetapan versi runtime baru untuk seluruh tim.

## 16. Di luar ruang lingkup (non-goals)

Untuk menjaga proyek tetap realistis dalam lima minggu, hal berikut
tidak menjadi target utama: - Gameplay 3D atau kamera third-person 3D. -
Multiplayer atau online co-op. - Akun, login, server, dan leaderboard
online. - Open world besar. - Sistem inventori kompleks. - Banyak ending
bercabang. - Voice acting penuh. - Editor level di dalam game.

Fitur tambahan hanya dikerjakan setelah persyaratan wajib terpenuhi dan
waktu memungkinkan.

## 17. Kriteria penerimaan

Game dinyatakan memenuhi target produk jika: 1. Dapat dijalankan melalui
URL web atau build web yang dapat diakses. 2. Menu utama dan petunjuk
berfungsi. 3. Karakter dapat bergerak dan berinteraksi. 4. Minimal tiga
level/tahapan dapat dimainkan. 5. Setiap level memiliki tantangan yang
berbeda. 6. Sistem skor/poin berjalan sesuai aturan. 7. Feedback
ditampilkan setelah tindakan atau tantangan. 8. Tujuan edukasi terlihat
dalam aktivitas gameplay. 9. Alur cerita mencapai klimaks dan akhir. 10.
UI dapat digunakan pada ukuran layar yang diuji. 11. Tidak ada bug
kritis yang menghalangi penyelesaian permainan. 12. Source code,
dokumentasi, aset, dan kontribusi anggota dapat ditelusuri.

## 18. Pengujian

Minimal uji skenario berikut:

  -----------------------------------------------------------------------
  Fitur                   Skenario                Hasil yang diharapkan
  ----------------------- ----------------------- -----------------------
  Main menu               Tekan Mulai             Game berpindah ke level
                                                  awal

  Petunjuk                Buka petunjuk           Instruksi tampil dengan
                                                  benar

  Gerakan                 Tekan kontrol arah      Karakter bergerak
                                                  sesuai input

  Lompat                  Tekan tombol lompat     Karakter melompat
                                                  sesuai aturan

  Interaksi               Dekati NPC/objek dan    Dialog/aksi muncul
                          tekan interaksi         

  Tantangan               Selesaikan tantangan    Status keberhasilan
                          level                   tampil

  Skor                    Selesaikan aktivitas    Poin berubah sesuai
                          bernilai                aturan

  Feedback                Pilih respons/tindakan  Feedback relevan
                                                  ditampilkan

  Perpindahan level       Selesaikan tujuan level Level berikutnya
                                                  terbuka

  Akhir permainan         Selesaikan level        Ending dan refleksi
                          terakhir                tampil

  Mobile                  Uji kontrol sentuh      Kontrol dapat digunakan

  Build                   Jalankan build produksi Game dapat dimuat tanpa
                                                  error kritis
  -----------------------------------------------------------------------

Catat hasil aktual, status lulus/tidak, bug, dan tindakan perbaikan.
Jangan mengisi hasil pengujian sebelum pengujian benar-benar dilakukan.

### 18.1 Hasil yang sudah tersedia — 26 November 2026

| Pemeriksaan | Hasil aktual dan batas cakupan |
| --- | --- |
| Build kode terbaru | `npm run build` dijalankan ulang saat pembaruan dokumen: lulus, dengan peringatan chunk JavaScript >500 kB |
| Lint kode terbaru | `npm run lint` dijalankan ulang saat pembaruan dokumen: lulus |
| Integrasi karakter, uji browser sebelumnya | Chrome headless/WebGL: gerak D/ArrowLeft, arah karakter, frame berjalan, Space, mendarat, dan menahan lompat lulus |
| Pelepasan input, uji sebelumnya | Kehilangan fokus menghentikan gerakan; emulasi touchCancel melepas tombol kanan |
| Siklus hidup game, uji sebelumnya | Kembali ke menu lalu mulai lagi menghasilkan satu canvas aktif dan scene yang bisa dimainkan |
| Tampilan/input mobile, uji sebelumnya | Screenshot background 390×844 dan emulasi sentuh gameplay 844×390 tersedia; bukan pengujian perangkat fisik |
| Menu `MainMenu.jsx` terbaru | Diperiksa dari kode dan tercakup build/lint; panel, navigasi, visual, dan aksesibilitas menu belum diuji ulang di browser |
| Layout Chapter 1 mobile first | Chrome headless (emulasi): desktop 1920×1080, HP 640×360 (16:9), 800×360 dan 915×412 (20:9), tablet 1024×768 dan 1280×800, portrait 360×800. Tanpa scroll, canvas tetap 16:9, tombol ≥48 px di dalam layar dan di bawah garis pijakan Malin, petunjuk hilang setelah input pertama, overlay portrait muncul/hilang dan posisi Malin tetap setelah rotasi. Bukan perangkat fisik |
| Cinematic intro bertahap | Chrome headless: urutan cue leaving → bay → approach → kampung → ibu → malin → outro → Chapter 1 → Level 1 (1 canvas) lulus di 1280×720, HP 800×360, portrait 360×800, dan reduced motion; Lewati dan Lanjut lulus; tanpa scroll horizontal. Waktu babak Phaser lebih lambat di headless (render software) |
| Intro → gameplay + NPC | Chrome headless: menu → teluk → dermaga → kampung → Ibu berjalan masuk → dialog (animasi bicara) → penutup → kartu Chapter 1 + tujuan → gameplay otomatis (1 canvas, menu tidak muncul lagi) lulus di 1280×720, HP 800×360, portrait 360×800, dan reduced motion; Lewati menuju kartu lalu gameplay; klik ganda Mulai Petualangan diabaikan; NPC berpatroli di areanya; gerak/lompat Malin tetap jalan; konsol tanpa error |
| Penerimaan produk akhir | Belum dapat dinyatakan lulus: misi, edukasi, skor, tiga level, dan ending belum diimplementasikan |

Rincian uji browser sebelumnya ada di `docs/character-integration.md` dan
bukti visual di `docs/screenshots/`. Screenshot menu lama tidak menjadi
bukti tampilan menu saat ini. Pembaruan dokumen ini tidak menjalankan ulang
uji browser. Fallback Canvas, perangkat mobile fisik, performa target,
rotasi layar di perangkat fisik, serta seluruh fitur yang belum dibuat tetap perlu diuji.

## 19. Rencana kerja lima minggu

Rencana ini mengikuti tahapan dalam PDF tugas dosen.

  -----------------------------------------------------------------------
  Minggu                  Fokus                   Target luaran
  ----------------------- ----------------------- -----------------------
  1                       Penentuan ide dan       Judul/deskripsi, sumber
                          perancangan             cerita, sinopsis,
                                                  tujuan belajar, target
                                                  pengguna, GDD,
                                                  storyboard, flowchart,
                                                  rancangan level,
                                                  pembagian tugas

  2                       Desain aset dan         UI/UX awal, aset
                          prototype               karakter dan
                                                  lingkungan, prototype
                                                  yang dapat dicoba,
                                                  screenshot/rekaman
                                                  proses

  3                       Implementasi dan        Game Alpha, minimal
                          gameplay                tiga level playable,
                                                  fitur inti dan unsur
                                                  edukasi, dokumentasi
                                                  perkembangan

  4                       Pengujian dan           Game Beta, tabel
                          penyempurnaan           pengujian, daftar bug
                                                  dan perbaikan, draft
                                                  laporan

  5                       Finalisasi dan          Game final, source
                          presentasi              code, laporan PDF,
                                                  video demonstrasi,
                                                  slide, bukti kontribusi
  -----------------------------------------------------------------------

## 20. Tim dan pembagian tanggung jawab

**Catatan administrasi:** PDF tugas menyebut komposisi kelompok tiga
mahasiswa, sedangkan penugasan kelompok yang dilaporkan pemilik proyek
berisi dua mahasiswa. PRD ini menggunakan kondisi aktual kelompok dua
orang. Konfirmasikan kepada dosen jika format administrasi atau
penilaian tetap mengharuskan tiga peran formal.

Pembagian kerja yang disarankan:

  Peran kerja                      Anggota 1                  Anggota 2
  -------------------------------- -------------------------- --------------------------
  Konsep, cerita, tujuan edukasi   Penanggung jawab           Review
  GDD, storyboard, flowchart       Penanggung jawab           Review teknis
  Setup dan arsitektur project     Kolaborasi                 Penanggung jawab
  Gameplay dan integrasi Phaser    Kolaborasi/review          Penanggung jawab
  UI/UX dan aset                   Penanggung jawab bersama   Penanggung jawab bersama
  Testing dan dokumentasi          Kolaborasi                 Kolaborasi
  Laporan, video, presentasi       Kolaborasi                 Kolaborasi

Sesuaikan nama, NIM, dan pembagian aktual berdasarkan kesepakatan
kelompok. Simpan bukti kontribusi masing-masing anggota melalui file,
screenshot, catatan pekerjaan, dan Git commit.

## 21. Risiko dan mitigasi

  -----------------------------------------------------------------------
  Risiko                  Dampak                  Mitigasi
  ----------------------- ----------------------- -----------------------
  Aset background masih   Tidak siap dipakai      Pisahkan atau buat
  berupa asset sheet      sebagai layer game      ulang aset produksi per
                                                  layer

  Integrasi React--Phaser Canvas tidak tampil     Uji integrasi sederhana
  bermasalah              atau instance ganda     sebelum menambah fitur

  Scope terlalu besar     Tiga level tidak        Prioritaskan fitur
                          selesai                 wajib dan batasi fitur
                                                  tambahan

  Aset terlalu berat      Performa mobile turun   Kompres gambar, batasi
                                                  partikel, uji perangkat

  Cerita menyimpang dari  Nilai budaya dan pesan  Catat sumber dan
  sumber                  cerita tidak akurat     bedakan adaptasi
                                                  kreatif

  Unsur edukasi hanya     Tujuan pembelajaran     Hubungkan nilai moral
  berupa teks             tidak tercapai          dengan aktivitas dan
                                                  feedback

  Kontribusi tidak        Bukti kerja individu    Gunakan Git dan catatan
  terdokumentasi          kurang                  progres mingguan
  -----------------------------------------------------------------------

## 22. Keputusan yang sudah ditetapkan dan hal yang masih terbuka

### Keputusan yang sudah ditetapkan

-   Cerita rakyat: Malin Kundang.
-   Judul kerja: Malin Kundang: The Moral Adventure.
-   Target usia: 11--17 tahun.
-   Genre: adventure platformer.
-   Visual: 2D Stylized / 2.5D side-scrolling.
-   Platform: web browser.
-   Stack: React, Tailwind CSS 4, Phaser 4, Vite, JavaScript.
-   Tiga level: Kampung Nelayan, Perjalanan Merantau, Kembali ke
    Kampung.
-   Target orientasi gameplay: landscape.
-   Sistem nilai: Poin Kebajikan dan feedback moral.

### Hal yang perlu diputuskan saat desain rinci

-   Detail mekanisme dan jumlah tantangan per level.
-   Formula dan bobot Poin Kebajikan.
-   Dialog final dan pilihan respons.
-   Daftar aset produksi dan ukuran masing-masing.
-   Audio yang digunakan.
-   Detail kompatibilitas browser/perangkat setelah pengujian.
-   Apakah progress perlu disimpan lintas sesi.

### Backlog berdasarkan kondisi prototipe

- Lengkapi Petunjuk, perilaku pengaturan audio, dan evaluasi menu serta
  layout kontrol mobile, termasuk aksesibilitas panel.
- Kembangkan Level 1 menjadi level edukatif: jelajah/platform, tujuan,
  interaksi NPC/objek, dialog, kondisi selesai, dan feedback yang relevan.
- Tetapkan bobot Poin Kebajikan di GDD lalu terapkan konsisten; angka
  poin dan isi dialog belum diputuskan oleh prototipe gerakan.
- Bangun progres satu sesi, Level 2–3, klimaks, dan refleksi akhir.
- Optimalkan bundle/aset sesuai pengukuran, uji desktop/perangkat mobile,
  serta lengkapi sumber aset, laporan dan bukti kontribusi.

Daftar ini mencatat pekerjaan yang tersisa, bukan perubahan prioritas
persyaratan wajib atau persetujuan fitur tambahan di luar ruang lingkup.

## 23. Referensi dan sumber

### Dokumen tugas

-   `Tugas_Proyek Game Edukasi.pdf` --- dokumen tugas proyek Game
    Programming yang diberikan dosen. Menjadi acuan utama untuk
    persyaratan, timeline, luaran, pengujian, dan penilaian.

### Referensi cerita rakyat yang diberikan tim

1.  https://journal.upy.ac.id/index.php/skripta/article/view/901
2.  https://senafti.budiluhur.ac.id/senafti/article/view/537

URL di atas dicantumkan sesuai tautan yang diberikan tim. Lengkapi nama
penulis, judul artikel, nama jurnal/prosiding, tahun, volume/nomor, dan
halaman setelah metadata publikasi berhasil diperiksa. Jangan mengarang
detail bibliografi.

### Referensi visual

Gambar game yang diberikan pemilik proyek digunakan sebagai acuan art
direction (warna, kedalaman, parallax, komposisi, dan atmosfer). Jangan
menyalin aset, logo, karakter, atau elemen berhak cipta dari game
tersebut.

### Penggunaan AI dan aset

Catat alat bantu AI yang digunakan, jenis aset yang dihasilkan, prompt
atau deskripsi proses yang relevan, tanggal pembuatan, serta bagian game
yang menggunakan aset. Periksa lisensi dan ketentuan penggunaan untuk
semua aset pihak ketiga.

------------------------------------------------------------------------

**Dokumen ini adalah PRD kerja.** Perbarui ketika ada keputusan produk
yang disetujui, dan jangan mengubah kebutuhan wajib tugas dosen tanpa
persetujuan.
