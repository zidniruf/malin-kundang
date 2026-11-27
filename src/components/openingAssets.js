// Aset dan pengaturan waktu untuk opening/main menu (React + CSS, bukan Phaser).
const base = `${import.meta.env.BASE_URL}assets/opening/`

// Urutan = urutan gambar dimuat sebelum intro dimulai.
export const OPENING_IMAGES = {
  sky: `${base}opening-sky.png`,
  clouds: `${base}opening-clouds.png`,
  beach: `${base}opening-beach-layer.png`,
  ship: `${base}opening-ship.png`,
  underwater: `${base}opening-underwater-foreground.png`,
  // Logo judul. Set ke null untuk memakai judul teks (font Fredoka/Baloo 2).
  titleArt: `${base}opening-title-art.png`,
  malin: `${base}malin-poor.png`,
}

// Tidak dipakai di opening:
// - opening-village-layer.png: isinya (gunung, rumah gadang, kelapa, kapal kecil)
//   sudah ada di opening-beach-layer.png dan opening-ship.png sehingga akan tampil ganda.
// - malin-rich.png dan malin-stone.png: sesuai arahan, bukan untuk opening utama.

// Musik menu. Isi dengan URL file setelah musik instrumental tersedia, misalnya:
// `${import.meta.env.BASE_URL}assets/audio/opening-theme.mp3`
export const OPENING_MUSIC = null

export const OPENING_TIMING = {
  skyMs: 2600, // Scene 1: langit + judul
  revealMs: 3600, // Scene 2: kamera turun ke pantai
  preloadTimeoutMs: 12000, // batas tunggu pemuatan gambar sebelum intro tetap dimulai
}
