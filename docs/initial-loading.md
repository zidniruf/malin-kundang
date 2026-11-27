# Loading awal — 27 November 2026

Sebelum menu dibuka, aplikasi menampilkan laut, logo, kapal beranimasi,
dan bar progres. Persentase berdasarkan jumlah gambar yang selesai
**diunduh dan didekode**, ditambah modul game. Ini bukan persentase byte
atau timer animasi. Nilai 100% hanya tercapai saat semuanya siap.

## Alur dan berkas

- `index.html` menyediakan splash ringan sebelum JavaScript siap.
- `src/App.jsx` membuka `LoadingScreen`, kemudian modul `Adventure.jsx`.
  Pemisahan modul membuat Phaser diunduh saat loading sudah terlihat.
- `src/loading/assetManifest.js` mengumpulkan gambar opening, shot cinematic,
  karakter/NPC, serta tekstur dunia penuh dari `layout.js` dan `kit.json`.
  Aset sumber dan gambar yang tidak digunakan tidak ikut diunduh.
- `src/loading/preload.js` memakai empat pekerja untuk memuat/dekode gambar,
  menyimpan hasil di memori, dan mencegah unduhan ganda saat StrictMode.
  Setiap gambar memiliki batas tunggu 45 detik. Jika ada kegagalan, menu
  tetap tertutup dan tombol Coba lagi mengulang pemuatan; gambar yang sudah
  berhasil tetap digunakan.
- `src/game/preloadAsset.js` memasukkan gambar yang sudah siap langsung ke
  TextureManager Phaser, termasuk spritesheet. Scene dunia, karakter, dan
  NPC memakai helper ini sehingga tidak meminta unduhan gambar lagi.
  Loader Phaser normal tetap tersedia jika scene dijalankan tanpa preloader.
- Menu dan cinematic React memakai cache gambar yang sama. Kembali ke menu
  tidak mengulangi startup loading.

Animasi kapal, awan, dan kilau bar dinonaktifkan saat browser mengaktifkan
`prefers-reduced-motion`. Layout menyesuaikan desktop, portrait, landscape,
dan safe area layar.

## Cache dan batasan

Gambar siap pakai disimpan selama halaman masih terbuka. Setelah reload,
pemuatan diperiksa lagi dan browser dapat memakai HTTP cache sesuai header
server. Cache browser dapat dibersihkan atau dievakuasi; fitur ini tidak
menjanjikan mode offline setelah menutup halaman. Audio belum disertakan
karena proyek saat ini belum menyediakan musik aktif.

Loading mengurangi unduhan dan decoding di tengah permainan. Upload tekstur
ke GPU, inisialisasi scene, dan kemampuan perangkat tetap memengaruhi
kelancaran. Browser menyimpan gambar yang didekode di memori, sehingga
perangkat dengan RAM terbatas masih perlu pengujian fisik.

## Deployment aaPanel

Build dijalankan dari checkout di komputer lokal:

```bash
npm run build
```

Unggah **isi** `dist/` ke `/www/wwwroot/malin-kundang.rupp.my.id/`.
Unggah aset terlebih dahulu dan `index.html` terakhir. Pertahankan file JS/CSS
hasil deployment sebelumnya sementara agar halaman yang masih terbuka dapat
menyelesaikan pemuatan modulnya. Proyek disajikan sebagai Static oleh Nginx.

## Verifikasi

Diperiksa dengan Chrome headless melalui DevTools Protocol pada build produksi:

- Desktop 1440×900, portrait 390×844, dan landscape 844×390: loading tampil;
  layout portrait tidak melebar melewati viewport.
- Preferensi reduced motion menonaktifkan animasi kapal.
- Satu gambar sengaja digagalkan: progres tidak mencapai 100%, menu tetap
  tertutup, dan Coba lagi berhasil membuka opening setelah gambar tersedia.
- Setelah preload selesai, jaringan disimulasikan offline. Transisi ke
  cinematic kampung dan gameplay berhasil; tidak ada permintaan gambar baru
  selama transisi tersebut.
- Gameplay menampilkan satu canvas; kembali ke menu tidak mengulang loading.
- Tidak ada runtime exception pada skenario tersebut.

`npm run build`, `npm run lint`, dan `git diff --check` lulus. Build masih
memberi peringatan ukuran chunk Phaser >500 kB; modul itu sudah dipisahkan
dari antarmuka loading. Pengujian ini tidak menggantikan uji perangkat fisik.
