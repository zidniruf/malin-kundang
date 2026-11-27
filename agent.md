# Agent Guide --- Malin Kundang: The Moral Adventure

> Dokumen instruksi untuk AI coding agent dan kontributor teknis. Baca
> dokumen ini dan `PRD.md` sebelum mengubah kode.

Terakhir diperbarui: **26 November 2026**. Status saat ini: prototipe menu
dan gerakan karakter di Level 1; game edukasi tiga level belum selesai.

## 1. Misi proyek

Mengembangkan game edukasi berbasis cerita rakyat **Malin Kundang**
untuk pemain usia **11--17 tahun**. Game menggunakan genre adventure
platformer dengan tampilan **2D Stylized / 2.5D side-scrolling**,
dimainkan melalui web browser desktop dan perangkat mobile.

Tujuan edukasi utama adalah membantu pemain memahami nilai: -
Menghormati orang tua. - Tanggung jawab atas tindakan. - Rendah hati dan
tidak sombong. - Rasa syukur dan kepedulian terhadap keluarga.

Unsur edukasi harus muncul di dalam aktivitas, pilihan dialog,
tantangan, dan umpan balik permainan. Jangan mengubah game menjadi kuis
terpisah yang tidak berhubungan dengan gameplay.

## 2. Sumber kebenaran

Urutan acuan proyek ketika mengerjakan tugas: 1. Instruksi eksplisit terbaru
dari pemilik proyek. 2. `PRD.md` --- kebutuhan dan batasan produk. 3.
Kode dan konfigurasi yang benar-benar ada di repository. 4. Dokumen
tugas dosen `Tugas_Proyek Game Edukasi.pdf`.

Jika ada konflik, jangan diam-diam mengubah keputusan. Jelaskan konflik
dan minta konfirmasi jika keputusan tersebut memengaruhi ruang lingkup
atau arsitektur.

### Ketentuan tugas dosen yang wajib dijaga

Game wajib memiliki: - Cerita rakyat Indonesia dengan sumber yang dapat
ditelusuri. - Tujuan edukasi yang jelas. - Minimal tiga level atau
tahapan yang dapat dimainkan. - Interaksi pemain dan tantangan. - Sistem
skor atau penilaian. - Umpan balik yang relevan. - Menu utama, petunjuk
permainan, dan tampilan gameplay. - Audio jika relevan. - Source code
dan dokumentasi pengembangan.

Luaran akhir mencakup game final, source code/project, laporan PDF, GDD,
video demonstrasi, slide presentasi, serta bukti kontribusi anggota.
Penggunaan aset, kode, audio, dan alat bantu AI harus dijelaskan dan
dicantumkan sumber atau keterangannya.

## 3. Stack teknologi yang sudah dipilih

Gunakan stack berikut kecuali pemilik proyek secara eksplisit menyetujui
perubahan:

-   JavaScript --- jangan mengubah proyek menjadi TypeScript.
-   React --- UI aplikasi seperti menu, dialog, HUD, pengaturan, dan
    layar hasil.
-   Tailwind CSS 4 --- styling UI React.
-   Phaser 4 --- gameplay 2D, scene, kamera, sprite, input, collision,
    dan efek.
-   Vite --- development server dan build web.
-   Git --- version control.

Versi yang diperiksa pada 26 November 2026:

| Bagian | Versi |
| --- | --- |
| Node.js pada lingkungan pemeriksaan | `v24.22.2` |
| npm pada lingkungan pemeriksaan | `11.19.1` |
| React / React DOM | `19.3.1` |
| Vite | `8.3.8` |
| Tailwind CSS / plugin Vite Tailwind | `4.3.5` |
| Phaser | `4.2.1` |

Versi paket di atas cocok antara `node_modules` dan `package-lock.json`.
Versi Node/npm adalah hasil pemeriksaan lingkungan, bukan perubahan
persyaratan runtime atau bukti lingkungan seluruh anggota tim.

Periksa `package.json` dan lockfile sebelum mengasumsikan versi. Jangan
downgrade Phaser atau mengganti framework tanpa alasan teknis dan
persetujuan pemilik proyek.

## 4. Prinsip arsitektur

### Batas tanggung jawab

**React + Tailwind** - Main menu dan navigasi. - Petunjuk permainan. -
HUD, skor, dan indikator level. - Dialog dan pilihan respons. -
Pause/settings dan layar hasil.

**Phaser** - Dunia permainan dan scene level. - Karakter, animasi,
gerakan, dan kamera. - Collision, platform, collectible, dan objek
interaktif. - Tantangan lingkungan dan event gameplay. - Efek visual dan
audio yang terkait langsung dengan permainan.

Komunikasikan data antara React dan Phaser melalui satu mekanisme event
yang jelas (misalnya `EventBus`). Hindari membuat dua sumber state yang
saling bertentangan. Phaser tidak boleh diinisialisasi berulang kali
akibat render React.

### Siklus hidup Phaser di React

-   Buat instance Phaser ketika container React siap.
-   Simpan referensi instance bila diperlukan.
-   Hancurkan instance dan listener saat komponen dilepas.
-   Perhatikan React Strict Mode saat development.
-   Jangan menambahkan beberapa instance canvas untuk satu game tanpa
    kebutuhan yang jelas.

### Scene

Rancangan scene yang dituju: - Boot/preload scene untuk memuat aset. -
Level 1 --- Kampung Nelayan. - Level 2 --- Perjalanan Merantau. - Level
3 --- Kembali ke Kampung dan Klimaks Cerita.

`TestScene` boleh dipertahankan sementara sebagai scene pengujian.
Jangan menghapusnya sebelum penggantinya berjalan dan sudah diuji.

### Implementasi yang sudah ada

- `src/components/MainMenu.jsx` + `MainMenu.css`: opening sinematik React/CSS
  (langit → kamera turun dengan parallax → menu) memakai aset
  `public/assets/opening/` (daftar di `openingAssets.js`). Menu: Mulai
  Petualangan, Pengaturan (musik/volume, nonaktif sampai file musik diisi di
  `OPENING_MUSIC`), Tentang Game, Keluar. Intro awal hanya diputar
  sekali per sesi, dan dilewati bila `prefers-reduced-motion`. Tombol Lewati
  intro serta pintasan tap/keyboard di opening awal sudah dihapus; transisi
  ke menu berjalan otomatis. Pada portrait, logo, karakter, dan menu memakai
  baris terpisah; ukuran Malin mengikuti slot tersisa supaya tidak menutup
  tombol. Portrait pendek menempatkan dua tombol sekunder berdampingan.
  Font Fredoka/Baloo 2 dimuat dari Google Fonts di `index.html`. Tombol Petunjuk belum ada.
- `src/components/OpeningCinematic.jsx` + `.css`, `cinematicConfig.js`,
  `cinematicMotion.js`, `TransitionShots.jsx`: cinematic yang **berlanjut dari
  Main Menu** (fase `story` di `MainMenu.jsx`). Tidak ada logo/layar judul kedua.
  Urutan: menu → teluk → dermaga → establishing kampung (Malin) → Ibu berjalan
  masuk + dialog → narasi penutup → kamera ke framing gameplay → gameplay (otomatis,
  tanpa potongan dan tanpa menu di antaranya).
  Babak 1 (React/CSS, satu jam rAF di OpeningCinematic): tombol dan tagline
  memudar, logo naik lalu hilang, kamera (`.mm-camera`, `--cam-x/y/z`) mendekat;
  Malin menu tetap berdiri. Lalu crossfade ke shot teluk
  (`cinematic/transition/01-teluk-establishing.png`: kamera mendekat, awan/ombak/
  dedaunan parallax, `opening-ship.png` berlayar pelan) dan shot dermaga
  (`02-dermaga-closeup.png`; dedaunan "dilewati" kamera untuk menyamarkan
  crossfade). Shot ini bukan sistem kedua: `TransitionShots` hanya menyusun DOM,
  frame dihitung `computeShotsFrame` dari jam yang sama, dan cue narasi `bay`/
  `approach` dikirim dari jam itu. Jam ditahan di `ASSET_HOLD_AT` sampai semua
  gambar cinematic selesai dimuat.
  Babak 2 (Phaser, `VillageStage.jsx` + `src/game/scenes/OpeningVillageScene.js`,
  instance terpisah dari gameplay, input mati, tidak memakai EventBus):
  crossfade ke kampung dermaga. Babak ini memakai **dunia yang sama dengan Chapter 1**
  (world map modular Area 1 Rumah Malin via `preloadWorld/addWorldVisuals` rentang x 0–2000,
  lantai y=600, Malin datang dari dermaga dan berhenti di `PLAYER_START_X`, Ibu berjalan
  dari bawah rumah panggung di x 150 di lantai y=600 ke posisi NPC-nya), Scale.EXPAND, dan framing `levelView()`
  dari `src/game/levelFraming.js`.
  Kamera sinematik (zoom lebih dekat) diatur lewat key `shot {x, feet, m, g}`; key
  terakhir (`gameplay: true`) men-tween `g` ke 1 sehingga zoom/posisi kamera sama
  persis dengan Chapter 1. Bingkai intro (m 1,4–1,5, pusat x 660–700) hanya menampilkan
  dunia x ≈200–1160 (Ibu mulai di x 150, Malin di x 1100); warga Chapter 1 sudah berdiri (diam) di posisinya di luar bingkai
  (nelayan di dermaga Area 1, x 1200–1320), dan terlihat saat kamera mundur. Gameplay membuat warga di posisi yang sama tanpa
  fade, jadi tidak ada yang muncul tiba-tiba. Malin memakai
  sheet **gameplay** (tanpa buntalan, karena ini keseharian sebelum merantau; sheet
  ber-buntalan disimpan untuk adegan keberangkatan) dan Ibu memakai
  `mother-malin-spritesheet.png`; keduanya dipindah dengan tween linear sambil
  memainkan animasi jalan, idle saat berhenti, dan animasi bicara saat dialognya.
  Jangan menggerakkan gambar statis untuk mensimulasikan berjalan (fallback Ibu
  statis hanya fade). Semua aksi dijadwalkan dengan `time.delayedCall` (jam scene);
  tween tidak memakai `delay` sendiri karena tween berjalan dengan jam
  dinding sedangkan timer dengan delta game loop. Cue narasi/dialog dikirim ke
  React lewat callback. Urutan babak 2: establishing shot (rumah, kios dengan
  pada kampung dermaga; Ibu belum terlihat), Malin berjalan lalu
  berhenti; Ibu berjalan masuk dari arah rumah di kiri luar layar, berhenti di
  dekat Malin; Malin menoleh; dialog Ibu ("Malin, bantu ibu mengantarkan hasil
  tangkapan ini ke dermaga, Nak.", `mother-talk`) lalu Malin ("Baik, Bu. Malin
  akan membantu.", Ibu kembali idle, `malin-talk`); narasi penutup. Tidak ada
  adegan berpamitan: menurut PRD keberangkatan terjadi setelah Level 1 selesai.
  Babak 3 (cue `lepas` → `outro`): letterbox, narasi, Lanjut/Lewati, dan partikel
  memudar sementara kamera bergerak ke framing gameplay; pada `outro` MainMenu
  memanggil `onStart('seamless')`. Tidak ada kartu Chapter 1 lagi; label kecil
  "Chapter 1 · Kampung Nelayan" + tujuan tampil sebagai toast di gameplay lalu hilang
  sendiri. Lewati Cinematic: layar meredup (`SKIP_FADE_MS`) lalu `onStart('fade')`
  dan gameplay muncul dari tirai gelap. Narasi memudar sendiri
  setelah waktu baca (`--hold`). Kunci landscape dicoba dari klik Mulai Petualangan.
  Skip/Escape, tombol Lanjut (mempercepat waktu), fokus khusus layar potret
  (`pfx`), dan mode reduced-motion tersedia. Gambar cinematic di-preload saat
  menu tampil. `public/assets/cinematic/0*-*.png` adalah duplikat lama yang
  tidak dipakai.
- `src/App.jsx`: `stage` = `menu` | `handoff` | `game`. Saat `onStart`, PhaserGame
  dipasang **di bawah** cinematic yang masih menampilkan frame terakhirnya; setelah
  scene siap, warga dimuat (`npcs-ready`, batas 2,5 detik) dan frame pertama
  dilukis (`postrender`), `onReady` melepas MainMenu/cinematic. Satu canvas
  gameplay; instance cinematic dihancurkan saat MainMenu dilepas.
- `src/PhaserGame.jsx`: layar gameplay Chapter 1 layar penuh (mobile first,
  landscape), loading/error, pembuatan instance Phaser, dan cleanup. Timer awal
  dibatalkan saat cleanup Strict Mode; instance dihancurkan dengan
  `game.destroy(true)`. Phaser memakai Scale.EXPAND (basis 1280×720) sehingga
  canvas memenuhi layar tanpa stretch dan tanpa backdrop blur; kamera
  (`attachLevelCamera`) selalu mengikuti Malin secara horizontal di world map
  (7502 px), lebar terlihat 1280 px dunia; layar yang lebih tinggi dari 16:9 melihat
  air tambahan sampai batas `WORLD.view` (tablet 4:3: lebar terlihat ±1027).
  Dev saja: `window.__MALIN_GAME__` (instance) untuk uji otomatis. HUD HTML (muncul setelah serah terima): label level (kiri atas),
  toast Chapter 1 (±3,2 detik), petunjuk kontrol (tengah atas, hilang pada input
  gerak/lompat pertama dan tidak muncul lagi), Kembali ke Menu (kanan atas). Gaya di
  `src/components/ChapterOne.css`; ukuran HUD mengikuti tinggi area game (`--gh`).
- `src/components/TouchControls.jsx`: tombol ←/→ (kiri bawah) dan Lompat (kanan
  bawah), hanya pada `(pointer: coarse)`. Tombol diletakkan di bawah garis pijakan
  Malin (83% tinggi game) agar tidak menutupi karakter. Capture implisit dilepas
  sehingga pointerleave melepas tombol dan jari dapat digeser ← ↔ →.
- `src/components/OrientationGuard.jsx` + `useDeviceProfile.js`: perangkat sentuh
  dalam portrait → overlay "Putar Perangkat Anda" / "Putar perangkat ke mode
  horizontal untuk bermain.", scene `LevelOneScene` dijeda
  (`game.scene.pause`) dan tombol dilepas; kembali landscape → scene dilanjutkan
  tanpa reload/reset. `tryLockLandscape()` dipanggil dari klik Mulai Petualangan
  (layar penuh + `screen.orientation.lock`, kegagalan diabaikan, mis. iOS Safari);
  `releaseLandscape()` saat kembali ke menu.
- `src/game/scenes/LevelOneScene.js`: satu scene prototipe: preload, world map
  (`addWorldVisuals`), animasi Malin, collision (`addWorldColliders`), respawn saat jatuh
  ke air (y > 760 → awal lantai utama terakhir yang dilewati, memakai `body.reset`).
  Batas jalan dunia `WORLD.walkLeft`–`walkRight`. Malin: `PLAYER_START_X` 700 (dermaga
  Area 1), `PLAYER_SCALE` 0,53 (dipakai juga oleh intro; body Arcade ikut skala,
  pijakan kaki tetap). Movement/jump (230 px/s, 440, gravitasi 1050) tidak berubah.
  Memanggil `spawnLevelOneNpcs(this)` dan `attachLevelCamera(this, player)`.
- `src/game/chapter1/world.js` + `layout.js` + `kit.json`: world map Chapter 1 **modular** (one
  continuous side-scrolling world, ±7500 px) yang disusun dari elemen yang bisa dipakai berulang,
  bukan satu gambar panjang. `kit.json` **dibangkitkan** oleh
  `art-source/tools/build_chapter1_kit.py` (118 elemen + 7 strip; jangan edit manual).
  `layout.js` **boleh diedit manual**: `walk()` (tanah/dermaga, x = tepi kiri, garis pijakan),
  `run()` (ulangi elemen lantai), `ground(type, x0, x1)` (tanah menerus satu jenis per daratan: ujung kiri +
  tengah diulang + ujung kanan, permukaan dan garis bawah satu baris, ujung memudar ke tile tengah, dan isian tanah
  `ground-fill` di bawahnya sampai dasar layar sehingga tidak ada air di bawah daratan; dipakai Area 1, 4, 5), `put()` (objek, x = tengah, y = dasar; layer `far`/`back`/`prop`/
  `front`, `s`, `flip`, `sf`, `solid`). Latar: langit gradasi (canvas texture), awan (parallax 0,12),
  strip gunung jauh/tengah/dekat, laut (bergerak pelan), dan hutan jauh sebagai TileSprite parallax;
  strip hutan di belakang daratan ditutup pohon di ujungnya. Collider = zona statis satu arah yang
  dihitung dari `surface` setiap elemen (satu zona per elemen; `WORLD.floors` = permukaan y=600 untuk
  respawn, `WORLD.platforms` = pijakan lain, mis. papan/tiang Dermaga Rusak). API tetap sama
  (`WORLD`, `preloadWorld`, `addWorldVisuals(scene, range)`, `addWorldColliders`, `respawnPoint`,
  `areaAt`, `worldImageUrls`); batas 6 area, lantai y=600, `view` 77,4–847,5, dan skala karakter
  tidak berubah. `worldLayout.json` + `build_chapter1_world.py` (world lama dari 6 lukisan area)
  disimpan tetapi tidak dipakai lagi.
- `src/game/levelFraming.js`: `LEVEL_VIEW` dan `levelView()` (zoom/pusat kamera
  untuk ukuran layar apa pun; garis pijakan tetap di 84% tinggi layar) dipakai
  bersama oleh LevelOneScene dan OpeningVillageScene agar akhir intro identik
  dengan gameplay. Tinggi pandang dibatasi jarak tanah ke batas atas/bawah
  gambar, bukan tinggi gambar penuh; tablet mempersempit lebar pandang sehingga
  area tanah/air di bawah tidak bertambah. Kamera hanya mengikuti gerak horizontal.
  Pada cinematic di perangkat sentuh/layar pendek, tanah juga dijaga di 84%
  sepanjang zoom dan transisi ke gameplay. Dialog/narasi adegan kampung tampil
  di atas karakter dan tombol Lewati Cinematic di kanan bawah; posisi teks shot
  teluk/dermaga dan framing cinematic desktop tetap mengikuti pengaturan semula.
- `src/game/npcAssets.js`: konfigurasi terpusat sheet Ibu + 4 NPC (path, frame
  200×216, kaki y=210, animasi idle/walk/action, `mother-talk`, frame peti buruh).
- `src/game/npc/AmbientNpc.js`: NPC dengan aksi acak yang dipilih hanya saat aksi
  sebelumnya selesai (diam → jalan/aksi → diam), berjalan dengan tween sampai tujuan,
  dijepit ke area patroli, tanpa physics (tidak menghalangi Malin), depth di belakang
  Malin, timer/tween dibersihkan saat shutdown. `src/game/npc/levelOneNpcs.js`: posisi
  dan area warga; sheet dimuat setelah scene siap sehingga kegagalan NPC tidak
  memblokir gameplay (Ibu jatuh ke gambar statis). Tinggi tampilan: Ibu/penjual 128,
  anak 100, buruh 134, nelayan 138 px dunia. Area warga: Ibu 610 (Area 1), nelayan
  1200–1320 (dermaga Area 1), buruh 1680–1960 dengan peti di 1820 (Area 2), anak
  3900–4300 (Area 4), penjual 5660–5800 (Pasar Ikan); semuanya di lantai utama dan di
  luar bingkai kamera intro (x ≈200–1160); tanpa fade (lanjutan dari intro).
- `src/game/PlayerControls.js`: satu lapisan input keyboard dan sentuh;
  reset saat fokus hilang/halaman tersembunyi, dan lompat saat baru ditekan.
- `src/game/malinAssets.js` (Malin **tanpa bawaan**, texture `malin`, animasi
  `malin-*`; gameplay dan adegan keseharian cinematic) dan
  `src/game/malinOpeningAssets.js` (Malin **ber-buntalan**, texture `malin-opening`;
  disimpan untuk adegan keberangkatan). Jangan memakai versi ber-buntalan untuk
  adegan sebelum merantau.
- `src/game/level1Assets.js`: URL background Level 1 satu layar sebelumnya (`l1-dermaga-tall`),
  kini hanya dipakai `LevelOnePreview` (game memakai `chapter1/world.js`);
  enam layer lama ada di `level1LegacyAssets` (tidak dimuat). Pertahankan dukungan `import.meta.env.BASE_URL`.
- `src/components/LevelOnePreview.jsx`: preview aset lama masih tersedia,
  tetapi tidak dirender oleh `App.jsx` saat ini. Jangan menganggap preview
  ini sebagai menu aktif.

Boot scene terpisah, Level 2, Level 3, dan `TestScene` belum ada pada kode
yang diperiksa. Rancangan scene di atas tetap menjadi target pengembangan.

Kontrak `src/game/EventBus.js` yang sudah digunakan:

| Event | Arah | Payload |
| --- | --- | --- |
| `control` | React → Phaser | `{ action: 'left' / 'right' / 'jump', pressed: boolean }` |
| `release-controls` | React → Phaser | Tidak ada |
| `game-ready` | Phaser → React | Tidak ada |
| `game-error` | Phaser → React | String pesan kegagalan |

State posisi, physics, dan animasi tetap milik Phaser. React menyimpan
state navigasi dan tampilan pemuatan/error. Saat menambah interaksi atau
skor, perluas kontrak ini secara jelas dan bersihkan listener saat keluar.

## 5. Arah desain dan aset

### Art direction

-   2D Stylized / 2.5D, hand-painted, side-scrolling.
-   Lingkungan kaya detail, vegetasi tropis, bentuk yang ramah, dan
    warna yang terarah.
-   Gunakan parallax untuk membangun ilusi kedalaman.
-   Level 1: kampung nelayan pesisir Sumatera Barat dengan unsur budaya
    Minangkabau yang diteliti secara wajar.
-   Level 2: kapal kayu, laut, pulau, dan cuaca.
-   Level 3: pelabuhan, kapal besar, konflik keluarga, dan badai.

### Aturan aset

-   Pisahkan background menjadi layer yang masuk akal: sky, distant
    landscape, far background, midground, gameplay/ground, foreground.
-   Jangan memakai asset sheet berlabel atau gambar referensi gabungan
    sebagai background gameplay final.
-   Potong atau buat ulang aset menjadi file terpisah sebelum dipakai.
-   Background dekoratif tidak boleh mengandung teks UI yang seharusnya
    dibuat oleh React.
-   Sprite karakter dan objek yang membutuhkan transparansi disimpan
    sebagai PNG atau format transparan yang sesuai.
-   Background tanpa transparansi dapat menggunakan WebP setelah diuji.
-   Gunakan nama file dan texture key yang konsisten, misalnya `l1-sky`,
    `l1-village`, `malin-idle`.
-   Catat asal setiap aset: buatan sendiri, AI-generated, aset pihak
    ketiga, atau hasil modifikasi. Sertakan lisensi/atribusi bila
    berlaku.
-   Jangan menyalin karakter, logo, atau aset dari game referensi.
    Referensi hanya untuk inspirasi art direction.

Ukuran desain awal gameplay adalah rasio 16:9 dengan kanvas acuan
1280×720. Ini adalah ukuran desain, bukan kewajiban agar setiap file
gambar berukuran sama. Gunakan scaling yang responsif.

### Aset yang tersedia

- **Indeks dan asal-usul:** `ASSET_INDEX.md` (semua PNG dan statusnya) dan
  `ASSET_PROVENANCE.md` (sumber, alat jika diketahui, modifikasi, status
  lisensi). Perbarui keduanya setiap menambah atau mengganti aset.
- **Lingkungan utama:** kampung nelayan Minangkabau di atas air (rumah
  panggung, dermaga kayu sebagai jalur berjalan). Main Menu tetap di pantai
  dan menjadi titik awal cinematic.
- **Desain ibu Malin:** kerudung merah bermotif, selendang krem, baju krem, kain
  marun. Animasi: `mother-malin-spritesheet.png`; acuan statis/fallback:
  `mother-standing.png`. Jangan memakai panel atau aset dengan desain ibu berbeda.
- `public/assets/chapter-1/kit/`: elemen world map modular (WebP RGBA, satu file per elemen,
  ±5,7 MB total), dibangun `art-source/tools/build_chapter1_kit.py` dari
  `art-source/chapter-1/kit-source/` (salinan paket "asset-malin-kundang" pemilik proyek: tanah/
  dermaga, rumah gadang/rumah nelayan/rangkiang/dangau, pasar ikan, kapal, dekorasi nelayan, pohon,
  rintangan/foreground, awan, gunung, laut). Skrip memotong sprite sheet lewat segmentasi alpha,
  membuang serpihan objek tetangga dan label teks yang ikut tergambar, dan membuat strip parallax
  bisa diulang (strip + cerminannya). `--preview DIR` menulis lembar pratinjau.
- `public/assets/chapter-1/world/`: tile world map lama (`world-0..3.webp`), disimpan tetapi tidak
  dimuat lagi.
- `public/assets/backgrounds/level-1/l1-dermaga-tall.png` (1280×849): background
  Chapter 1 satu layar sebelumnya (disimpan, tidak dimuat game), dibangun oleh
  `art-source/tools/build_level1_background.py` dari
  `art-source/level-1/kampung-tropis-cerah.png` (potongan sama dengan
  `l1-dermaga.png` ditambah air di bawahnya) agar pijakan dermaga tepat di y=600.
  `l1-dermaga.png` (1280×720) disimpan tetapi tidak dimuat. Enam PNG `l1-*` lama (1672×941) disimpan tetapi tidak dimuat; prompt
  mereka ada di `asset-generation.json`.
- `public/assets/cinematic/village/`: tujuh layer panorama 3:1, disimpan tetapi
  tidak lagi dimuat (babak kampung kini memakai dunia Chapter 1).
- `public/assets/cinematic/transition/`: dua shot (teluk, dermaga) dan tiga
  overlay (awan, dedaunan, ombak) untuk transisi babak 1 (lihat README folder).
- `public/assets/characters/malin/malin-gameplay-spritesheet.png`: Malin
  gameplay tanpa bawaan, 8×5 frame 280×280 (idle 0–7, walk 8–15, run 16–23,
  jump 24–31, crouch 32–35, talk 36–39). Setiap frame dijangkar (kepala x=140,
  kaki y=264) agar cocok dengan body collision dan skala di LevelOneScene.
- `public/assets/characters/malin/malin-opening-spritesheet.png`: Malin
  opening dengan buntalan kain krem, 8×3 frame 280×280 (idle 0–7, jalan pelan
  8–15, farewell 16–23). **Sementara**: buntalan digambar programatik di atas
  frame gameplay; ganti dengan hasil prompt di
  `art-source/characters/OPENING-SPRITESHEET-PROMPT.md`.
- Kedua sheet dibangun oleh `art-source/tools/build_malin_sheets.py`.
  `malin-spritesheet.png` (6×3 lama) tidak dimuat lagi. Arah kiri memakai `flipX`.
- Scene menempatkan lantai collision di y=600, terpisah dari PNG ground,
  dan merender karakter di atas foreground agar tetap terlihat.
- README di folder background/karakter mencatat sumber dan batasannya.
  Pembuat/lisensi spritesheet dan sumber/lisensi referensi belum dikonfirmasi;
  jangan mengarang atribusi atau menganggapnya CC0.
- `public/assets/references/level-1/README.md` mencatat delapan lampiran
  referensi. File gambar asli lampiran belum tersedia di folder tersebut.

## 6. Kontrol dan platform

Target utama adalah browser desktop dan mobile. Orientasi gameplay yang
direncanakan adalah landscape.

Kontrol desktop: - A/D atau Arrow Left/Right: bergerak. - Space atau
Arrow Up: lompat. - E: interaksi. - Escape: pause (jika sesuai konteks).

Kontrol mobile: - Tombol sentuh atau virtual directional pad untuk
bergerak. - Tombol lompat. - Tombol interaksi ketika relevan.

Bangun input melalui satu lapisan kontrol agar logika gameplay tidak
bergantung langsung pada jenis perangkat. Uji sentuhan, ukuran tombol,
dan area aman layar. Jangan mengklaim dukungan semua perangkat sebelum
diuji.

Pada prototipe saat ini hanya kiri/kanan dan lompat yang diimplementasikan.
Klik area permainan untuk memberi fokus keyboard. Tombol sentuh (hanya pada
perangkat `pointer: coarse`) mengirim input melalui EventBus; pointerup,
pointercancel, dan pointerleave melepas tombol. Layar gameplay memenuhi
viewport (`100dvh`, safe-area) tanpa scroll; perangkat sentuh dalam portrait
menampilkan overlay putar perangkat dan menjeda scene. E/interaksi,
Escape/pause, dan tombol interaksi mobile masih target. Layout sudah diuji di
emulasi Chrome, belum di perangkat fisik.

## 7. Aturan implementasi

1.  Baca file yang relevan sebelum mengubahnya.
2.  Kerjakan satu fitur kecil dalam satu tahap.
3.  Jangan membuat seluruh game sekaligus.
4.  Jangan menambah dependency jika API browser atau library yang sudah
    terpasang cukup.
5.  Jangan mengganti versi paket tanpa alasan dan persetujuan.
6.  Jangan menulis kode Phaser 3 secara otomatis; proyek menggunakan
    Phaser 4. Periksa API yang tersedia pada versi terpasang.
7.  Gunakan nama variabel, class, dan file yang jelas.
8.  Pisahkan scene, entity, system, dan UI bila kompleksitasnya memang
    membutuhkan.
9.  Hindari nilai magic yang berulang; gunakan konfigurasi/konstanta
    bila bermanfaat.
10. Bersihkan event listener, timer, tween, dan objek saat scene atau
    komponen dihentikan.
11. Tangani kegagalan pemuatan aset dengan pesan yang dapat
    ditindaklanjuti.
12. Jangan memasukkan credential, token, atau data pribadi ke
    repository.
13. Jangan mengklaim pengujian berhasil jika perintah atau pengujian
    belum benar-benar dijalankan.

## 8. Kualitas dan performa

-   Utamakan gameplay stabil sebelum efek visual kompleks.
-   Batasi partikel, filter, dan objek aktif, terutama untuk mobile.
-   Kompres aset dan hindari gambar berukuran berlebihan.
-   Gunakan sprite sheet/atlas jika sesuai dan lebih efisien.
-   Hindari membuat ulang texture atau objek setiap frame.
-   Gunakan delta time atau pola update Phaser yang sesuai.
-   Pastikan teks UI terbaca dan kontrol mudah dijangkau.
-   Jangan mengandalkan warna saja untuk menyampaikan status atau
    jawaban.
-   Jaga kontras karakter dengan background dan pastikan platform mudah
    dikenali.
-   Gunakan fallback Canvas bila konfigurasi rendering memungkinkan;
    jangan mengasumsikan WebGL selalu tersedia.

## 9. Perintah kerja

Jalankan dari root repository.

``` bash
npm install
npm run dev
```

Untuk validasi sebelum commit:

``` bash
npm run build
npm run lint
```

Periksa `package.json` terlebih dahulu jika script `lint` belum
tersedia. Jangan menganggap build atau lint lulus sebelum
menjalankannya.

## 10. Git dan dokumentasi

-   Buat perubahan kecil dan mudah ditinjau.
-   Gunakan commit yang menjelaskan tujuan perubahan.
-   Simpan screenshot/video progres mingguan.
-   Perbarui dokumentasi ketika fitur atau keputusan produk berubah.
-   Catat kontribusi tiap anggota dan bukti pekerjaan.
-   Simpan daftar aset beserta pembuat, sumber, lisensi, dan penggunaan
    AI bila ada.

## 11. Cara merespons permintaan coding

Sebelum implementasi: 1. Jelaskan tujuan perubahan secara singkat. 2.
Identifikasi file yang akan disentuh. 3. Periksa dependensi dan API yang
sudah ada. 4. Implementasikan hanya lingkup yang diminta.

Sesudah implementasi: 1. Ringkas file yang diubah. 2. Jelaskan cara
menjalankan atau menguji. 3. Sebutkan hasil pengujian yang benar-benar
dilakukan. 4. Sebutkan keterbatasan atau pekerjaan lanjutan. 5. Jangan
mengubah keputusan produk di luar permintaan.

Jika ada informasi yang belum ditentukan, pilih solusi paling sederhana
yang sesuai PRD dan tandai sebagai asumsi. Tanyakan kepada pemilik
proyek bila keputusan tersebut sulit dibalik.

## 12. Status proyek — 26 November 2026

-   [x] Proyek React + Vite dibuat.
-   [x] Tailwind CSS dipasang pada folder proyek yang benar.
-   [x] Phaser `4.2.1` terpasang.
-   [x] Integrasi React--Phaser selesai dan diverifikasi (scene prototipe,
    Chrome headless; lihat `docs/character-integration.md`).
-   [x] Enam background Level 1 terpisah dan dipakai di scene prototipe;
    kesiapan final, seamless tiling, dan akurasi budaya belum diverifikasi.
-   [x] Kontrol karakter dan physics dasar (gerakan, lompat, lantai,
    animasi, serta kontrol sentuh melalui emulasi browser).
-   [x] Komponen MainMenu terhubung ke game berdasarkan inspeksi kode;
    panel Tentang Game tersedia dan panel Pengaturan masih placeholder.
-   [ ] Petunjuk permainan lengkap dan pengaturan audio yang berfungsi.
-   [ ] Kamera side-scrolling, parallax, dan tantangan platform Level 1.
-   [ ] Tujuan/misi Level 1 dan kondisi selesai.
-   [ ] Sistem dialog, interaksi, skor, dan feedback.
-   [ ] Tiga level playable.
-   [x] Build dan lint kode saat ini lulus; ada peringatan chunk >500 kB.
-   [ ] Pengujian penerimaan lengkap desktop/mobile dan perangkat fisik.
-   [ ] Build dan dokumentasi final.

Perbarui checklist ini berdasarkan keadaan repository yang sebenarnya;
jangan mencentang pekerjaan yang belum diverifikasi.

### Bukti pemeriksaan dan pekerjaan berikutnya

Build dan lint dijalankan ulang pada pembaruan dokumen ini. Uji browser
integrasi karakter sebelumnya tercatat di `docs/character-integration.md`,
dengan screenshot di `docs/screenshots/`. Hasil itu mencakup gerak, lompat,
collision, pelepasan input, emulasi sentuh, dan keluar/masuk game tanpa
canvas ganda. Screenshot tersebut mendahului menu `MainMenu.jsx` terbaru;
jangan menggunakannya sebagai bukti uji panel atau visual menu baru.
Uji browser tidak dijalankan ulang pada pembaruan dokumen ini.

Lanjutkan dengan fitur kecil yang diminta pemilik proyek. Backlog mencakup
petunjuk dan penyempurnaan menu/mobile, tantangan serta misi Level 1,
interaksi NPC/dialog, Poin Kebajikan dan feedback, lalu Level 2–3 dan alur
akhir. Ketentuan wajib PRD tetap berlaku; prototipe gerakan belum memenuhi
kriteria satu level edukatif selesai.
