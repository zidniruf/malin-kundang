# Integrasi Malin — 26 November 2026

Tombol Mulai Petualangan membuka scene pengujian Level 1 dengan karakter
Malin. React menangani menu, pesan pemuatan/error, tombol sentuh, dan
kembali ke menu. Phaser 4.2.1 menangani rendering, animasi, physics dan input
keyboard. Instance dibuat setelah container siap dan dihancurkan saat
komponen dilepas; timer awal dibatalkan saat cleanup React Strict Mode.

## Komunikasi dan input

`src/game/EventBus.js` menjadi satu jembatan React–Phaser:

| Event | Arah | Data |
| --- | --- | --- |
| `control` | UI → scene | `{ action: 'left' / 'right' / 'jump', pressed: boolean }` |
| `release-controls` | UI → scene | Tidak ada |
| `game-ready` | Scene → UI | Tidak ada |
| `game-error` | Scene → UI | Pesan error yang dapat ditindaklanjuti |

`PlayerControls` menyatukan state keyboard dan tombol sentuh. Keyboard
ditangkap hanya pada container game yang mendapat fokus. Input dilepas
saat fokus hilang, halaman tersembunyi, pointer dibatalkan, atau game
ditutup. Listener scene/UI dilepas saat cleanup. Menahan lompat tidak
memicu lompatan baru setelah mendarat.

## Pengujian aktual

| Pemeriksaan | Hasil |
| --- | --- |
| Build produksi (`npm run build`) | Lulus; Vite memberi peringatan ukuran chunk >500 kB karena Phaser |
| ESLint (`npm run lint`) | Lulus |
| Chrome headless, rendering WebGL, desktop 1440×1000 | Scene dan karakter tampil |
| D / ArrowLeft | Bergerak kanan/kiri dan `flipX` benar |
| Animasi berjalan | Frame berada pada rentang 6–11 |
| Space | Beralih ke animasi lompat dan posisi naik |
| Lantai dan mendarat | Body berhenti pada lantai, kembali idle |
| Menahan Space sampai mendarat | Tidak melompat berulang |
| Kehilangan fokus saat tombol ditahan | Kecepatan horizontal kembali 0 |
| Kembali ke menu, kemudian mulai lagi | Canvas lama hilang, hanya satu canvas baru, scene bisa dimainkan |
| Emulasi touch, viewport 844×390 | Tombol kanan menggerakkan Malin; touchCancel menghentikan gerakan |
| Runtime exceptions selama skenario di atas | Tidak ada |

Pengujian browser dilakukan melalui Chrome DevTools Protocol, termasuk
input keyboard dan touch sintetis. Bukti visual disimpan di
`docs/screenshots/malin-character-desktop.png` dan
`docs/screenshots/malin-character-mobile.png`.

Ini masih prototipe gerakan di satu layar. Karakter dirender di atas
foreground agar tetap terbaca di tepi layar. Pada landscape pendek, halaman bisa perlu digulir untuk
melihat kontrol di bawah canvas. Belum diuji pada perangkat fisik, fallback
Canvas, interaksi E, pause, NPC, misi, skor, maupun perpindahan tiga level.
Tidak ada klaim seluruh persyaratan PRD telah selesai.
