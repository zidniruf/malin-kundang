# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# MALIN KUNDANG – CHAPTER 1: KAMPUNG NELAYAN

**Nama Game:** Malin Kundang: The Moral Adventure  
**Chapter:** 01 – Kampung Nelayan  
**Genre:** Adventure, Exploration, Platformer, Educational Game  
**Game Engine:** Phaser 4.2.1  
**Framework:** React + Vite  
**Platform:** Web Desktop, Tablet, dan Mobile Landscape  
**Gameplay Perspective:** 2D / 2.5D Side-Scrolling  
**Versi Dokumen:** 1.0  
**Status:** Rancangan untuk Implementasi

---

# 1. PROJECT OVERVIEW

## 1.1 Deskripsi Game

Malin Kundang: The Moral Adventure merupakan game petualangan edukasi yang mengangkat cerita rakyat Indonesia, khususnya cerita Malin Kundang dari Sumatera Barat.

Game menggunakan perspektif 2D/2.5D side-scrolling dengan lingkungan ilustrasi kartun yang memiliki kedalaman visual, animasi karakter, interaksi NPC, eksplorasi, dan berbagai aktivitas gameplay.

Chapter 1 mengambil latar kehidupan Malin ketika masih tinggal bersama ibunya di sebuah kampung nelayan.

Pemain akan mengendalikan Malin untuk menjalankan aktivitas sehari-hari, membantu ibu, menjual ikan, membantu nelayan, serta mengenal kesempatan untuk merantau.

## 1.2 Tujuan Chapter 1

Chapter 1 bertujuan untuk:

1. Memperkenalkan kehidupan Malin sebelum merantau.
2. Memperlihatkan hubungan Malin dengan ibunya.
3. Memperlihatkan karakter Malin yang rajin dan suka membantu.
4. Memberikan pengalaman eksplorasi kampung nelayan.
5. Memperkenalkan berbagai mekanik gameplay.
6. Menjelaskan alasan Malin ingin merantau.
7. Mengakhiri chapter dengan adegan Malin meminta izin kepada ibunya.

## 1.3 Target Pengalaman Pemain

Pemain diharapkan merasakan:

- Kehidupan masyarakat kampung nelayan.
- Aktivitas membantu keluarga.
- Tantangan sederhana dalam perjalanan.
- Kesibukan berjualan di pasar.
- Kepedulian terhadap masyarakat.
- Keinginan Malin untuk memperbaiki kehidupan keluarganya.

# 2. TARGET PLATFORM DAN TEKNOLOGI

## 2.1 Platform

Game berbasis web dan dapat dijalankan melalui browser.

Perangkat target:
- Desktop / PC.
- Laptop.
- Tablet.
- Smartphone dalam posisi horizontal (landscape).

## 2.2 Teknologi

| Teknologi | Fungsi |
|---|---|
| React | UI, menu, dan integrasi aplikasi |
| Phaser 4.2.1 | Gameplay dan rendering game |
| Vite | Development dan build |
| JavaScript | Logika gameplay |
| CSS / Tailwind | Tampilan UI |
| PNG | Background, karakter, dan objek |
| Spritesheet | Animasi karakter |

## 2.3 Ketentuan teknis

- Pertahankan konfigurasi Phaser yang sudah ada.
- Jangan membuat ulang sistem opening dan cinematic.
- Jangan menghapus gameplay yang sudah berfungsi.
- Jangan mengubah versi dependency tanpa kebutuhan.
- Integrasikan fitur baru ke struktur proyek yang sudah tersedia.
- Pisahkan UI React dan gameplay Phaser secara jelas.

# 3. WORLD DESIGN

## 3.1 Konsep Map

Chapter 1 menggunakan satu map panjang dengan sistem horizontal side-scrolling.

Pemain dapat berjalan dari rumah Malin menuju pasar ikan, dermaga nelayan, dan pelabuhan kapal dagang tanpa berpindah scene.

Lingkungan harus terasa seperti satu kampung yang saling terhubung.

## 3.2 Spesifikasi World

| Komponen | Spesifikasi |
|---|---|
| Target World Width | 5760 px |
| Target World Height | 720 px |
| Viewport Referensi | 1280 × 720 px |
| Jumlah Area | 4 |
| Arah eksplorasi | Kiri ke kanan |
| Kamera | Side-scrolling |
| Ground Referensi | Y = 600 |
| Spawn Malin | X = 180 |

Ukuran tersebut merupakan target desain dan harus disesuaikan dengan konfigurasi `LEVEL_SIZE` yang sudah ada pada proyek.

## 3.3 Pembagian Area

| Area | Koordinat X | Fungsi |
|---|---:|---|
| Rumah Malin | 0–1280 | Awal cerita |
| Pasar Ikan | 1280–2720 | Mengantar dan menjual ikan |
| Dermaga Nelayan | 2720–4320 | Membantu nelayan |
| Pelabuhan | 4320–5760 | Mengenal kesempatan merantau |

## 3.4 Desain Visual

Gaya visual yang digunakan:

- Kartun 2D/2.5D.
- Hand-painted environment.
- Warna cerah dan hangat.
- Arsitektur rumah panggung pesisir.
- Dermaga kayu.
- Pasar ikan tradisional.
- Kapal dagang tradisional.
- Laut tropis dan pegunungan.

Background harus dipisahkan menjadi layer:

1. Sky.
2. Mountains.
3. Sea.
4. Village background.
5. Midground.
6. Ground.
7. Characters.
8. Foreground.

Setiap area background dibuat terpisah tetapi harus memiliki sambungan visual yang konsisten.

# 4. STORYLINE CHAPTER 1

## 4.1 Sinopsis

Malin Kundang merupakan pemuda sederhana yang tinggal bersama ibunya di sebuah kampung nelayan.

Sejak kecil Malin dikenal sebagai anak yang rajin, berbakti kepada ibunya, dan suka membantu masyarakat.

Suatu hari, ibu meminta Malin mengantarkan hasil tangkapan ikan ke pasar. Dalam perjalanan, Malin menghadapi berbagai rintangan sebelum akhirnya berhasil menjual ikan.

Setelah menyelesaikan pekerjaannya, Malin bertemu seorang nelayan yang sedang kesulitan memperbaiki jaring. Malin membantu nelayan tersebut.

Sebagai ucapan terima kasih, nelayan menceritakan peluang bekerja dan berdagang di luar pulau. Cerita tersebut membuat Malin mulai berpikir untuk merantau.

Malin kemudian melihat kapal dagang yang sedang bersandar di pelabuhan.

Setelah mempertimbangkan kesempatan tersebut, Malin kembali kepada ibunya dan meminta izin untuk merantau demi mendapatkan penghasilan lebih baik dan memperbaiki kehidupan keluarganya.

## 4.2 Urutan Cerita

1. Kehidupan Malin bersama ibu.
2. Ibu meminta Malin menjual ikan.
3. Malin mengantarkan ikan ke pasar.
4. Malin membantu menjual ikan.
5. Malin membantu nelayan memperbaiki jaring.
6. Nelayan menceritakan peluang merantau.
7. Malin melihat kapal dagang.
8. Malin kembali kepada ibu.
9. Malin meminta izin merantau.
10. Chapter 1 selesai.

# 5. GAMEPLAY REQUIREMENTS

Chapter 1 memiliki tiga misi gameplay utama dan satu bagian penutup cerita.

## 5.1 MISI 1 – MENGANTARKAN IKAN

**Lokasi:** Rumah Malin sampai Pasar Ikan.

**Tujuan:** Mengantarkan keranjang berisi tiga ikan dari rumah menuju pasar.

### Alur gameplay

1. Pemain mendekati ibu.
2. Pemain menekan tombol interaksi.
3. Ibu meminta Malin membawa ikan ke pasar.
4. Malin mengambil keranjang ikan.
5. Gameplay membawa ikan dimulai.
6. Pemain melewati berbagai rintangan.
7. Pemain menjaga keseimbangan keranjang.
8. Malin berhasil sampai di pasar.

### Dialog ibu

"Malin, tolong antarkan ikan ini ke pasar, Nak. Hasil tangkapan hari ini harus segera dijual."

Malin:

"Baik, Bu. Malin akan membawanya sekarang."

### Mekanik membawa ikan

Pemain harus menjaga keseimbangan keranjang selama perjalanan.

Komponen:
- Stability meter.
- Tombol Jaga Ikan.
- Animasi keranjang bergoyang.
- Animasi ikan hampir jatuh.
- Efek ketika keranjang kehilangan keseimbangan.

### Kontrol

Desktop:
- A / D atau panah: bergerak.
- Space: melompat.
- Shift: menjaga keseimbangan.

Mobile:
- Kiri.
- Kanan.
- Lompat.
- Jaga Ikan.

### Tantangan perjalanan

| Rintangan | Mekanik |
|---|---|
| Batu | Melompat |
| Lubang papan | Melompat melewati celah |
| Papan tidak rata | Menjaga keseimbangan |
| Dermaga sempit | Bergerak dengan hati-hati |

### Aturan kegagalan

- Keranjang memiliki indikator keseimbangan.
- Ketika melewati rintangan, keseimbangan dapat menurun.
- Pemain harus menggunakan tombol Jaga Ikan ketika keranjang mulai miring.
- Jika keseimbangan mencapai nol, keranjang terjatuh dan ikan tumpah.
- Pemain harus mengulang bagian pengantaran dari titik awal misi.
- Pemain tidak perlu mengulang seluruh chapter.

### Kondisi keberhasilan

Malin berhasil mencapai pasar dengan membawa keranjang ikan.

`fishDeliveryCompleted = true`

---

## 5.2 MISI 2 – BERJUALAN DI PASAR

**Lokasi:** Pasar Ikan.

**Tujuan:** Membantu ibu menjual tiga ikan kepada pembeli.

### Konsep gameplay

Misi jualan dibuat sebagai mini-game berdagang.

Pemain berperan langsung sebagai Malin yang melayani pembeli.

Mini-game terdiri dari tiga tahap:

1. Memilih ikan.
2. Menimbang ikan.
3. Melakukan transaksi.

### Tahap 1 – Melayani pembeli

Terdapat tiga pembeli yang datang secara bergantian.

| Pembeli | Permintaan |
|---|---|
| Pembeli 1 | 1 ikan tongkol |
| Pembeli 2 | 1 ikan kakap |
| Pembeli 3 | 1 ikan kembung |

Pembeli memberikan dialog ketika mendekati lapak.

Contoh:

"Malin, ada ikan tongkol? Saya ingin membeli satu ekor."

Malin:

"Ada, Bu. Sebentar, saya ambilkan."

### Tahap 2 – Memilih ikan

Pemain melihat pilihan ikan yang tersedia.

Aset ikan:
- Tongkol.
- Kakap.
- Kembung.

Pemain harus memilih ikan sesuai pesanan.

Jika benar, proses berlanjut.

Jika salah, pembeli memberikan respons dan pemain dapat mencoba kembali.

Tidak ada pengurangan stok akibat salah memilih.

### Tahap 3 – Menimbang ikan

Setelah memilih ikan, pemain harus menimbangnya.

Mekanik:
- Indikator timbangan bergerak.
- Terdapat zona hijau sebagai target.
- Pemain menekan tombol ketika indikator berada di zona yang tepat.

Hasil:
- Tepat: harga penuh.
- Sedikit meleset: harga sedikit berkurang.
- Sangat meleset: pemain dapat mencoba menimbang kembali.

Mini-game tidak menggunakan batas waktu yang terlalu ketat.

### Tahap 4 – Tawar-menawar

Pembeli ketiga mencoba menawar harga.

Pemain mendapatkan dua pilihan dialog:

Pilihan A:

"Baik, Pak. Saya berikan dengan harga yang sedikit lebih murah."

Pilihan B:

"Maaf, Pak. Ikan ini masih segar dan harganya sesuai kualitasnya."

Kedua pilihan dapat menyelesaikan transaksi. Perbedaannya hanya pada jumlah uang yang diperoleh.

### Sistem transaksi

Setelah transaksi berhasil:

- Ikan berkurang satu.
- Jumlah pembeli terlayani bertambah.
- Uang hasil penjualan bertambah.
- UI transaksi diperbarui.

### Kondisi keberhasilan

- Tiga pembeli berhasil dilayani.
- Tiga ikan berhasil dijual.
- Semua transaksi tercatat.

`marketQuestCompleted = true`

### Reward

Malin mendapatkan uang dari hasil penjualan ikan.

Nilai uang digunakan sebagai elemen naratif dan tidak perlu menjadi sistem ekonomi kompleks.

---

## 5.3 MISI 3 – MEMBANTU NELAYAN

**Lokasi:** Dermaga Nelayan.

**Tujuan:** Membantu nelayan memperbaiki jaring yang rusak.

### Cerita

Setelah menyelesaikan pekerjaan di pasar, Malin melewati dermaga.

Malin melihat seorang nelayan yang kesulitan memperbaiki jaring karena beberapa pelampung terlepas.

Malin menawarkan bantuan.

### Dialog awal

Nelayan:

"Malin, kebetulan kau lewat. Bisakah kau membantu mengambil pelampung jaring yang terlepas?"

Malin:

"Tentu, Pak. Malin akan mencarinya."

### Alur gameplay

1. Malin berbicara dengan nelayan.
2. Pemain menerima misi.
3. Pemain mencari tiga pelampung.
4. Pemain menjelajahi area dermaga.
5. Pemain menghindari celah kecil.
6. Pemain mengumpulkan tiga pelampung.
7. Pemain kembali kepada nelayan.
8. Pemain berinteraksi dengan jaring.
9. Jaring berhasil diperbaiki.

### Objek yang dibutuhkan

| Objek | Jumlah |
|---|---:|
| Pelampung jaring | 3 |
| Jaring nelayan | 1 |
| Gulungan tali | 1 |

### Tantangan

- Mencari objek di area dermaga.
- Mengumpulkan tiga pelampung.
- Melompati celah kecil.
- Menjelajahi area sekitar perahu.

Tidak ada pertarungan atau batas waktu.

### Dialog setelah berhasil

Nelayan:

"Terima kasih banyak, Malin. Kau memang anak yang suka membantu orang lain."

Malin:

"Sama-sama, Pak. Senang rasanya bisa membantu."

### Kondisi keberhasilan

- Tiga pelampung terkumpul.
- Jaring diperbaiki.
- Dialog selesai.

`fishermanQuestCompleted = true`

### Bagian cerita penting: Kesempatan merantau

Setelah Malin membantu, nelayan menceritakan kehidupan perdagangan di luar pulau.

Nelayan:

"Malin, banyak pemuda dari kampung ini yang pergi ke pulau seberang untuk berdagang. Ada yang dahulu hidup sederhana, tetapi setelah bekerja keras di sana, mereka berhasil memiliki usaha sendiri."

Malin:

"Benarkah, Pak? Berarti di luar pulau ada banyak kesempatan untuk mendapatkan penghasilan lebih baik?"

Nelayan:

"Benar, Nak. Tapi semuanya membutuhkan kerja keras dan keberanian."

Malin mulai memikirkan kemungkinan merantau untuk membantu ibunya.

---

## 5.4 BAGIAN CERITA – PELABUHAN KAPAL DAGANG

**Lokasi:** Pelabuhan.

**Tujuan:** Memperkuat motivasi Malin untuk merantau.

Bagian ini merupakan eksplorasi dan interaksi cerita, bukan misi gameplay tambahan.

### Aktivitas pemain

- Berjalan menuju pelabuhan.
- Melihat kapal dagang.
- Melihat aktivitas awak kapal.
- Berinteraksi dengan kapten kapal.

### Dialog kapten

"Anak muda, kapal ini akan berlayar ke pulau lain untuk berdagang. Kami membutuhkan orang yang rajin untuk membantu pekerjaan di kapal."

Malin:

"Apakah saya bisa ikut bekerja, Pak?"

Kapten:

"Tentu. Jika kau bersedia bekerja keras, akan ada banyak hal yang bisa kau pelajari."

### Kondisi keberhasilan

Malin mengetahui adanya kesempatan untuk bekerja dan berdagang di luar pulau.

`merchantOpportunityDiscovered = true`

---

## 5.5 PENUTUP – MEMINTA IZIN IBU

**Lokasi:** Rumah Malin.

**Tujuan:** Menyelesaikan Chapter 1 dan membuka cerita perantauan.

Setelah melihat kapal dan mengetahui kesempatan bekerja, Malin kembali kepada ibunya.

Untuk menghindari perjalanan ulang yang terlalu panjang, gunakan transisi waktu/cinematic singkat dari pelabuhan menuju rumah. Scene gameplay tetap sama.

### Dialog

Malin:

"Bu, ada sesuatu yang ingin Malin bicarakan."

Ibu:

"Ada apa, Nak?"

Malin:

"Tadi Malin bertemu seorang nelayan. Katanya di pulau seberang ada banyak kesempatan untuk bekerja dan berdagang."

Ibu:

"Lalu, apa yang sedang kamu pikirkan?"

Malin:

"Malin ingin mencoba merantau. Malin ingin mendapatkan penghasilan lebih baik supaya kehidupan kita bisa berubah."

Ibu:

"Ibu sebenarnya berat melepasmu pergi jauh, Nak. Tetapi jika itu memang keinginanmu, pergilah dengan hati-hati."

Malin:

"Malin berjanji akan bekerja keras dan tidak melupakan Ibu."

Ibu:

"Jangan pernah lupakan Ibu dan kampung halamanmu."

### Cinematic akhir

- Ibu dan Malin berpelukan.
- Malin memainkan animasi perpisahan.
- Kamera perlahan menjauh.
- Tampilan berubah menuju kapal dagang.
- Kapal mulai berlayar.
- Tampilkan teks penutup.

Teks:

"Berbekal harapan untuk mengubah kehidupannya, Malin meninggalkan kampung halaman. Perjalanan panjang menuju kehidupan yang lebih baik pun dimulai."

### Kondisi penyelesaian

`chapter1Completed = true`

Lanjut ke Chapter 2: Perjalanan Merantau.

# 6. SISTEM WAKTU

Chapter 1 menggunakan sistem perubahan waktu berdasarkan perkembangan cerita.

Tidak menggunakan timer mundur atau batas waktu penyelesaian misi.

| Waktu | Aktivitas |
|---|---|
| Pagi | Rumah dan pengantaran ikan |
| Siang | Pasar dan dermaga nelayan |
| Sore | Pelabuhan dan perjalanan kembali ke rumah |

Perubahan waktu dilakukan melalui perubahan pencahayaan, warna langit, dan suasana lingkungan.

Waktu berubah ketika tahapan cerita tertentu selesai.

# 7. NPC REQUIREMENTS

NPC harus membuat lingkungan kampung terasa hidup.

| NPC | Lokasi | Perilaku |
|---|---|---|
| Ibu Malin | Rumah | Idle, talk, gesture |
| Pedagang ikan | Pasar | Berjualan |
| Pembeli 1 | Pasar | Membeli ikan |
| Pembeli 2 | Pasar | Membeli ikan |
| Pembeli 3 | Pasar | Menawar harga |
| Warga | Pasar | Berjalan random |
| Nelayan utama | Dermaga | Memperbaiki jaring |
| Nelayan tambahan | Dermaga | Aktivitas kerja |
| Warga dermaga | Dermaga | Berjalan random |
| Kapten kapal | Pelabuhan | Idle, talk |
| Awak kapal | Pelabuhan | Aktivitas kapal |

### NPC behavior

- NPC memiliki batas pergerakan.
- NPC tidak boleh berjalan keluar map.
- NPC tidak boleh menembus bangunan.
- NPC memiliki animasi idle dan walk.
- NPC pekerjaan khusus tidak menggunakan random movement.
- NPC pembeli hanya aktif selama misi pasar.

# 8. OBJECT INTERACTION REQUIREMENTS

| ID | Objek | Lokasi | Fungsi |
|---|---|---|---|
| OBJ-01 | Ibu Malin | Rumah | Memulai misi |
| OBJ-02 | Keranjang ikan | Rumah | Mengambil ikan |
| OBJ-03 | Batu | Jalur pasar | Rintangan |
| OBJ-04 | Lubang dermaga | Jalur pasar | Rintangan |
| OBJ-05 | Lapak ikan | Pasar | Memulai jualan |
| OBJ-06 | Ikan tongkol | Pasar | Barang dagangan |
| OBJ-07 | Ikan kakap | Pasar | Barang dagangan |
| OBJ-08 | Ikan kembung | Pasar | Barang dagangan |
| OBJ-09 | Timbangan | Pasar | Mini-game |
| OBJ-10 | Pelampung | Dermaga | Dikumpulkan |
| OBJ-11 | Jaring | Dermaga | Diperbaiki |
| OBJ-12 | Kapal dagang | Pelabuhan | Elemen cerita |
| OBJ-13 | Kapten kapal | Pelabuhan | Dialog |

Setiap objek interaktif memiliki:
- ID unik.
- Posisi world.
- Area interaksi.
- Kondisi aktivasi.
- Status selesai.
- Indikator interaksi.

# 9. QUEST SYSTEM

## 9.1 Quest State

Gunakan satu sistem state untuk mengatur progres Chapter 1.

Contoh struktur:

```js
const chapter1State = {
  motherTalked: false,

  fishBasketCollected: false,
  fishDeliveryCompleted: false,

  buyersServed: 0,
  fishSold: 0,
  marketQuestCompleted: false,

  fishermanTalked: false,
  floatsCollected: 0,
  netRepaired: false,
  fishermanQuestCompleted: false,

  merchantOpportunityDiscovered: false,

  motherFarewellCompleted: false,
  chapter1Completed: false
};
```

## 9.2 Urutan Quest

```text
START
  |
  v
Talk to Mother
  |
  v
Collect Fish Basket
  |
  v
Deliver Fish
  |
  v
Sell 3 Fish
  |
  v
Help Fisherman
  |
  v
Collect 3 Floats
  |
  v
Repair Fishing Net
  |
  v
Learn About Overseas Opportunities
  |
  v
Visit Merchant Ship
  |
  v
Return to Mother
  |
  v
Ask Permission
  |
  v
CHAPTER 1 COMPLETED
```

Quest berikutnya hanya aktif ketika persyaratan sebelumnya terpenuhi.

# 10. UI/UX REQUIREMENTS

## 10.1 Gameplay HUD

UI gameplay harus sederhana dan sesuai tema kampung nelayan.

Elemen:
- Nama chapter.
- Informasi misi aktif.
- Progres misi.
- Indikator interaksi.
- Tombol kontrol mobile.
- Stability meter ketika membawa ikan.
- Stok ikan ketika berjualan.
- Uang hasil penjualan.

## 10.2 Dialogue UI

- Panel dialog berada di bagian bawah layar.
- Potret karakter dapat ditampilkan.
- Nama karakter terlihat jelas.
- Teks muncul secara bertahap.
- Pemain dapat melanjutkan dialog.
- Panel tidak menutupi karakter dan objek penting.

## 10.3 Market UI

Mini-game pasar memiliki:
- Permintaan pembeli.
- Pilihan ikan.
- Tampilan timbangan.
- Indikator zona akurasi.
- Pilihan tawar-menawar.
- Hasil transaksi.

## 10.4 Mobile Controls

Mobile harus menggunakan orientasi landscape.

Kontrol:
- Kiri.
- Kanan.
- Lompat.
- Interaksi.
- Jaga Ikan.

Tombol harus memiliki ukuran yang nyaman disentuh dan tidak saling bertumpuk.

Jika perangkat portrait, tampilkan pesan:

"Silakan putar perangkat ke posisi horizontal untuk bermain."

Tidak menggunakan background blur untuk mengisi ruang kosong.

# 11. ASSET REQUIREMENTS

## 11.1 Background

| Asset | Penggunaan |
|---|---|
| Sky | Langit |
| Mountains | Pegunungan |
| Sea | Laut |
| House background | Area rumah |
| Market background | Area pasar |
| Fishing dock background | Dermaga nelayan |
| Harbor background | Pelabuhan |
| Foreground | Elemen dekorasi depan |

Background dibuat dalam beberapa bagian dengan sambungan yang konsisten.

## 11.2 Character

**Malin:**
- Idle.
- Walk.
- Run.
- Jump.
- Fall.
- Land.
- Interact.
- Carry basket.
- Balance basket.
- Talk.

**Ibu:**
- Idle.
- Walk.
- Talk.
- Gesture.
- Farewell.

**NPC:**
- Idle.
- Walk.
- Talk.
- Work.
- Carry item.

Gunakan spritesheet yang sudah tersedia jika animasinya sesuai. Jangan membuat ulang aset yang sudah benar.

## 11.3 Props

- Keranjang ikan.
- Ikan tongkol.
- Ikan kakap.
- Ikan kembung.
- Meja jualan.
- Timbangan.
- Keranjang bambu.
- Pelampung jaring.
- Jaring nelayan.
- Tali tambang.
- Peti kayu.
- Kapal dagang.
- Karung dagangan.

# 12. AUDIO REQUIREMENTS

| Audio | Penggunaan |
|---|---|
| Suara ombak | Background |
| Suara burung | Background |
| Aktivitas pasar | Area pasar |
| Suara kayu | Langkah kaki |
| Suara mengambil objek | Interaksi |
| Suara ikan jatuh | Tantangan membawa ikan |
| Suara timbangan | Mini-game pasar |
| Suara transaksi | Penjualan |
| Suara jaring | Misi nelayan |
| Musik lembut | Gameplay |
| Musik emosional | Perpisahan |

Audio harus dapat dikontrol volumenya dan tidak mengganggu dialog.

# 13. FUNCTIONAL REQUIREMENTS

| ID | Requirement | Prioritas |
|---|---|---|
| FR-01 | Malin dapat berjalan | Must |
| FR-02 | Malin dapat melompat | Must |
| FR-03 | Kamera mengikuti pemain | Must |
| FR-04 | Map dapat dieksplorasi | Must |
| FR-05 | Collision berjalan benar | Must |
| FR-06 | Interaksi NPC | Must |
| FR-07 | Sistem dialog | Must |
| FR-08 | Sistem quest | Must |
| FR-09 | Mengambil keranjang ikan | Must |
| FR-10 | Sistem keseimbangan ikan | Must |
| FR-11 | Rintangan perjalanan | Must |
| FR-12 | Mini-game jualan | Must |
| FR-13 | Mini-game timbangan | Must |
| FR-14 | Sistem transaksi | Must |
| FR-15 | Mengumpulkan pelampung | Must |
| FR-16 | Memperbaiki jaring | Must |
| FR-17 | NPC random movement | Should |
| FR-18 | Perubahan waktu | Should |
| FR-19 | Cinematic perpisahan | Must |
| FR-20 | Kontrol mobile landscape | Must |

# 14. NON-FUNCTIONAL REQUIREMENTS

## Performance

- Gameplay berjalan lancar di browser.
- Aset gambar dioptimalkan.
- Tidak memuat ulang seluruh aset ketika pemain berpindah area.
- Animasi NPC tidak membebani performa.
- Target 60 FPS pada perangkat yang mendukung dan performa stabil pada HP kelas menengah.

## Responsive

- Mendukung desktop.
- Mendukung tablet landscape.
- Mendukung mobile landscape.
- Tidak memotong elemen penting.
- UI menyesuaikan ukuran layar.

## Usability

- Pemain memahami instruksi misi.
- Tombol interaksi mudah ditemukan.
- Dialog mudah dibaca.
- Pemain mengetahui tujuan berikutnya.
- Kegagalan misi tidak membuat pemain mengulang seluruh chapter.

## Reliability

- Quest tidak dapat terjebak pada status yang tidak valid.
- Objek tidak dapat diambil berulang kali jika sudah selesai.
- NPC tidak menghilang dari area.
- Tidak terjadi softlock ketika pemain gagal dalam mini-game.

# 15. ACCEPTANCE CRITERIA

Chapter 1 dinyatakan berhasil apabila seluruh kriteria berikut terpenuhi.

### Map
- [ ] Empat area saling terhubung.
- [ ] Kamera mengikuti Malin.
- [ ] Map dapat dieksplorasi.
- [ ] Background tidak memiliki sambungan yang terlihat.
- [ ] Collision sesuai dengan pijakan.

### Misi mengantar ikan
- [ ] Malin menerima keranjang dari ibu.
- [ ] Malin dapat membawa keranjang.
- [ ] Stability meter bekerja.
- [ ] Rintangan dapat dilewati.
- [ ] Kegagalan dapat mengulang misi.

### Misi pasar
- [ ] Tiga pembeli muncul.
- [ ] Pembeli memiliki permintaan berbeda.
- [ ] Pemain dapat memilih ikan.
- [ ] Mini-game timbangan berfungsi.
- [ ] Tawar-menawar berfungsi.
- [ ] Transaksi memperbarui jumlah uang.

### Misi nelayan
- [ ] Nelayan dapat memberikan tugas.
- [ ] Tiga pelampung dapat dikumpulkan.
- [ ] Jaring dapat diperbaiki.
- [ ] Dialog peluang merantau muncul.

### Penutup
- [ ] Kapal dagang dapat ditemukan.
- [ ] Kapten dapat diajak berbicara.
- [ ] Malin kembali kepada ibu.
- [ ] Dialog meminta izin berjalan.
- [ ] Cinematic perpisahan berjalan.
- [ ] Chapter 2 dapat dibuka.

### Mobile
- [ ] Kontrol sentuh berfungsi.
- [ ] Tombol tidak saling menutupi.
- [ ] Landscape berjalan dengan baik.
- [ ] Portrait menampilkan perintah memutar perangkat.

# 16. DEVELOPMENT PRIORITY

Pengembangan dilakukan secara bertahap agar setiap fitur bisa diuji sebelum melanjutkan fitur berikutnya.

**PHASE 1 – WORLD BUILDING**
- Membuat world panjang.
- Menyambungkan empat background.
- Membuat ground dan collision.
- Mengatur kamera.

**PHASE 2 – CHARACTER**
- Integrasi spritesheet Malin.
- Mengatur animasi.
- Movement dan jump.
- Animasi membawa keranjang.

**PHASE 3 – FISH DELIVERY**
- Interaksi ibu.
- Mengambil keranjang.
- Stability meter.
- Rintangan.
- Sistem gagal dan retry.

**PHASE 4 – MARKET GAMEPLAY**
- NPC pembeli.
- Sistem pesanan.
- Memilih ikan.
- Menimbang.
- Tawar-menawar.
- Transaksi.

**PHASE 5 – FISHERMAN QUEST**
- NPC nelayan.
- Objek pelampung.
- Sistem pengumpulan.
- Memperbaiki jaring.
- Dialog merantau.

**PHASE 6 – STORY PROGRESSION**
- Pelabuhan.
- Kapten kapal.
- Kembali kepada ibu.
- Dialog perpisahan.
- Cinematic ending.

**PHASE 7 – POLISHING**
- NPC behavior.
- Audio.
- Efek visual.
- Perubahan waktu.
- Optimasi mobile.
- Testing.

# 17. OUT OF SCOPE

Fitur berikut tidak diperlukan untuk Chapter 1:

- Sistem pertarungan.
- Sistem musuh.
- Sistem lapar dan energi.
- Sistem crafting.
- Sistem ekonomi kompleks.
- Sistem inventory besar.
- Multiplayer.
- Sistem quest sampingan yang banyak.
- Siklus siang dan malam real-time.
- Sistem batas waktu misi.

Fitur tersebut dapat dipertimbangkan untuk chapter lain apabila memang dibutuhkan.

# 18. FINAL CHAPTER 1 DEFINITION

Chapter 1: Kampung Nelayan merupakan pengenalan kehidupan Malin sebelum merantau.

Pemain menjalani tiga misi utama:

1. Mengantarkan ikan dari rumah ke pasar dengan menjaga keseimbangan keranjang.
2. Menjual tiga ikan melalui mini-game berdagang.
3. Membantu nelayan memperbaiki jaring dan mendengar cerita tentang peluang merantau.

Setelah itu pemain menjelajahi pelabuhan, melihat kapal dagang, dan kembali kepada ibunya untuk meminta izin merantau.

Chapter berakhir ketika ibu memberikan restu dan Malin memulai perjalanan meninggalkan kampung halaman.

**Pesan moral utama:**
Berbakti kepada orang tua, bekerja keras, membantu sesama, dan tidak melupakan keluarga serta kampung halaman.

---

**STATUS AKHIR:** PRD Chapter 1 v1.0 – Siap dijadikan acuan implementasi dan pengujian.

**CATATAN:** Koordinat, jumlah objek, dan ukuran world merupakan spesifikasi target awal. Implementasi wajib menyesuaikan struktur proyek, ukuran aset aktual, dan konfigurasi scene yang sudah tersedia. Jangan menghapus atau menulis ulang fitur existing yang sudah berfungsi tanpa kebutuhan dan persetujuan.