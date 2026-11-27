# Aset background Level 1

## Aktif: `l1-dermaga.png` (sejak 26 November 2026)

Background Level 1 dan kartu Chapter 1 sekarang memakai **satu** gambar 1280×720:
kampung nelayan di atas air dengan papan dermaga kayu sebagai jalur berjalan. Gambar ini
dipotong dari `art-source/level-1/kampung-tropis-cerah.png` sehingga pijakan dermaga
tepat di y=600, yaitu lantai collision di `LevelOneScene`. Physics, collision, dan kontrol
tidak diubah; hanya daftar di `src/game/level1Assets.js`. Asal-usul ada di
`ASSET_PROVENANCE.md`.

Enam layer di bawah ini **tidak lagi dimuat** (tercatat sebagai `level1LegacyAssets`)
tetapi tidak dihapus.

## Arsip: enam layer kampung di atas tanah

Enam PNG dibuat pada 26 November 2026 menggunakan built-in `image_gen`.
Arah visual mengikuti lampiran pemilik proyek, terutama gambar terakhir.
Ini adalah pembuatan ulang berbasis referensi, bukan hasil crop file asli.

| File / texture key | Ukuran | Transparansi | Penggunaan |
| --- | --- | --- | --- |
| `l1-sky.png` / `l1-sky` | 1672×941 | Tidak | Langit dan awan |
| `l1-mountains.png` / `l1-mountains` | 1672×941 | Alpha | Pegunungan jauh |
| `l1-forest.png` / `l1-forest` | 1672×941 | Alpha | Hutan jauh |
| `l1-village.png` / `l1-village` | 1672×941 | Alpha | Rumah, kelapa, dermaga dekoratif |
| `l1-ground.png` / `l1-ground` | 1672×941 | Alpha | Visual tanah, belum collision |
| `l1-foreground.png` / `l1-foreground` | 1672×941 | Alpha | Dedaunan sudut depan |

Urutan komposisi mengikuti tabel. Layer desa digeser ke atas 9% tinggi
kanvas pada preview untuk menyesuaikan fondasi rumah dengan permukaan tanah.
Daftar URL dan offset ada di `src/game/level1Assets.js` dan menggunakan
`import.meta.env.BASE_URL` agar sesuai base path Vite.

## Provenance dan batas penggunaan

- Pembuat: OpenAI image generation, melalui Codex atas permintaan pemilik proyek.
- Jenis sumber: AI-generated berdasarkan referensi visual pemilik proyek.
- Sumber/lisensi gambar referensi: belum dikonfirmasi oleh pemilik proyek.
- Ketentuan hasil AI: mengikuti ketentuan layanan penyedia; tidak ditetapkan
  sebagai CC0 atau lisensi pihak ketiga tanpa bukti.
- Prompt lengkap dan alat dicatat di `asset-generation.json` pada root proyek.
- Ukuran dan keberadaan alpha telah diperiksa dari file PNG.
- Belum diuji sebagai tile seamless, belum divalidasi akurasi budaya secara
  independen, dan belum menjadi level playable.
- Bangunan masih satu layer dekoratif; NPC, item interaktif, sprite karakter,
  collision, audio, dan parallax Phaser perlu implementasi terpisah.
- Preview React hanya memperlihatkan susunan aset; gameplay tetap ditujukan
  untuk Phaser sesuai PRD. Tidak ada perubahan versi paket atau dependency.

## Validasi 26 November 2026

- `npm run build` dan `npm run lint`: lulus.
- Keenam PNG dapat didekode dan disalin identik ke build produksi.
- Screenshot Chrome headless diperiksa pada viewport desktop 1440×1200 dan
  mobile 390×844: seluruh layer tampil, layout mengikuti lebar viewport.
- Bukti visual tersimpan di `docs/screenshots/level-1-assets-desktop.png`
  dan `docs/screenshots/level-1-assets-mobile.png` pada root proyek.
- Pemeriksaan viewport mobile bukan pengujian perangkat fisik atau kontrol
  sentuh. Gameplay dan performa mobile belum diuji.

Integrasi berikutnya: background ini juga dipakai di `LevelOneScene` dengan
karakter dan lantai collision terpisah. Status pengujian terbaru tersedia
di `docs/character-integration.md` pada root proyek; keterbatasan preview
awal di atas tetap mendeskripsikan tahap pembuatan background.
