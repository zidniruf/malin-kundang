// Konfigurasi cinematic yang berlanjut dari Main Menu. Satu jam React (OpeningCinematic) menggerakkan
// babak 1; babak 2 memakai jam scene Phaser.
//   Babak 1 (React/CSS, satu kamera bertahap):
//     Scene 1  menu: logo, deskripsi, dan tombol memudar; background menu tetap terlihat.
//     Scene 2  teluk (01-teluk-establishing): kamera mendekat, awan/ombak/dedaunan parallax, kapal.
//     Scene 3  dermaga (02-dermaga-closeup): dedaunan "dilewati" kamera menyamarkan crossfade,
//              lalu kamera menyusuri dermaga.
//   Babak 2 (Phaser, OpeningVillageScene, latar & koordinat sama dengan Chapter 1):
//     Scene 4  framing sinematik dekat: Malin berjalan ke kios. Tanpa NPC.
//     Scene 5  Ibu berjalan masuk dari kiri, dialog dengan animasi bicara, narasi penutup.
//     Scene 6  teks/letterbox menghilang, kamera zoom out sampai framing gameplay, lalu PhaserGame
//              mengambil alih tanpa potongan (label chapter kecil tampil di gameplay).
import { malinAsset } from '../game/malinAssets'
import { motherAsset, npcAssets } from '../game/npcAssets'
import { LEVEL_ONE_NPCS } from '../game/npc/levelOneNpcs'
import { PLAYER_START_X, PLAYER_SCALE } from '../game/scenes/LevelOneScene'
import { worldImageUrls } from '../game/chapter1/world'

const base = import.meta.env.BASE_URL

// ---------- Babak 1: scene Main Menu → teluk → dermaga (detik sejak tombol ditekan) ----------
export const VILLAGE_AT = 15.4 // babak kampung dimulai (menunggu Phaser siap; shot dermaga tetap tampil)
export const ASSET_HOLD_AT = 2.2 // jam babak 1 berhenti di sini sampai semua gambar cinematic siap
export const MENU_CAMERA_KEYS = [
  { t: 0, x: 0, y: 0, z: 1 },
  { t: 1.2, x: 0, y: 0, z: 1 },
  { t: 6.5, x: 0.1, y: 0.03, z: 1.18 },
]
export const SHIP_DRIFT_PER_SECOND = 2.4 // sama dengan kecepatan kapal di animasi menu
export const SHIP_FADE_IN_SECONDS = 1.5
export const VILLAGE_FADE_MS = 1400

const transition = (name) => `${base}assets/cinematic/transition/${name}.png`

// Shot transisi (React/CSS). Kamera: fx/fy = titik fokus (pecahan gambar), pfx = fokus di layar
// potret, z = zoom. Gambar 1672×941 selalu menutupi layar (cover) tanpa stretch.
export const TRANSITION_SHOTS = {
  ratio: 1672 / 941,
  bay: {
    url: transition('01-teluk-establishing'),
    bgScale: 1.1, // latar diperbesar sedikit agar pantai menyatu dengan overlay ombak
    fade: [2.4, 4.4],
    camera: [
      { t: 2.4, fx: 0.5, pfx: 0.56, fy: 0.5, z: 1 },
      { t: 6.2, fx: 0.55, pfx: 0.6, fy: 0.5, z: 1.06 },
      { t: 10.6, fx: 0.64, pfx: 0.66, fy: 0.52, z: 1.2 },
    ],
    // Kapal dagang yang sudah ada (opening-ship) berlayar pelan di laut terbuka teluk.
    ship: { from: 0.235, to: 0.3, waterline: 0.552, width: 0.056, waterlineInImage: 0.9 },
  },
  pier: {
    url: transition('02-dermaga-closeup'),
    fade: [8.9, 10.5],
    camera: [
      { t: 8.9, fx: 0.5, pfx: 0.5, fy: 0.5, z: 1 },
      { t: 17.5, fx: 0.52, pfx: 0.54, fy: 0.53, z: 1.1 },
    ],
  },
  clouds: { url: transition('overlay-awan'), lift: { bay: 0.3, pier: 0.36 }, opacity: { bay: 0.9, pier: 0.6 }, drift: 0.0045 },
  waves: { url: transition('overlay-ombak'), sway: 0.014, period: 6.5 },
  // Dedaunan di depan kamera; antara teluk dan dermaga kamera "melewatinya".
  foliage: { url: transition('overlay-dedaunan'), flyFrom: 8.1, flyTo: 10.4, fadeFrom: 8.7, fadeTo: 10.1, scaleTo: 1.75 },
  shipUrl: `${base}assets/opening/opening-ship.png`,
  cues: [
    { id: 'bay', t: 4.6 },
    { id: 'approach', t: 10.8 },
  ],
}

// ---------- Babak 2: kampung (Phaser, detik sejak babak dimulai) ----------
// Dunia yang sama dengan Chapter 1 (world map, Area 1 Rumah Malin, lantai y=600). Malin berakhir di
// posisi awal gameplay dan Ibu di posisi NPC-nya, lalu kamera berbaur ke framing gameplay.
const MOTHER_NPC = LEVEL_ONE_NPCS.find((npc) => npc.id === 'ibu')

export const VILLAGE_SCENE = {
  // Bagian world map yang dimuat intro: cukup untuk framing gameplay awal di layar terlebar.
  worldRange: { from: 0, to: 2000 },
  // Malin keseharian sebelum merantau: sheet tanpa buntalan, skala sama dengan gameplay (PLAYER_SCALE).
  // Malin datang dari dermaga (kanan) menuju rumah, berhenti di posisi awal gameplay.
  malin: { ...malinAsset, feetY: 264, figureHeight: 258, scale: PLAYER_SCALE, startX: PLAYER_START_X + 400, endX: PLAYER_START_X, walkFps: 7 },
  // Ibu: sprite sheet beranimasi, tinggi dan posisi akhir sama dengan NPC Ibu di Chapter 1.
  // Ibu berjalan dari halaman rumah (di luar bingkai) menuruni jalan setapak ke dermaga.
  mother: { ...motherAsset, height: MOTHER_NPC.height, startX: 150, endX: MOTHER_NPC.x },
  // Warga Chapter 1 (selain Ibu): posisi dan tinggi sama dengan gameplay, hanya diam di intro
  // agar frame pertama gameplay melanjutkan posisi yang sama.
  villagers: LEVEL_ONE_NPCS.filter((npc) => npc.id !== 'ibu'),
  // Kamera: x = pusat horizontal (dunia), feet = posisi lantai di layar (0..1), m = zoom × zoom
  // gameplay. Kunci `gameplay` = berbaur penuh ke framing gameplay (levelFraming.js).
  // Lebar dunia yang terlihat = 1280 / m (16:9 dan lebih lebar; 4:3 lebih sempit), dan kamera
  // pusatnya di x≈660–700, jadi bingkai terlebar intro = x ≈200–1160 (m 1,4). Ibu mulai di x 150 dan
  // Malin di x 1100 (keduanya di luar bingkai). Warga (levelOneNpcs.js) berada di luar rentang itu:
  // sudah ada di dunia, lalu terlihat saat kamera mundur ke framing gameplay.
  camera: [
    { t: 0, x: 700, feet: 0.7, m: 1.4 }, // pembuka: rumah Malin, Malin berjalan dari dermaga
    { t: 2.8, x: 680, feet: 0.69, m: 1.42 },
    { t: 7.6, x: 660, feet: 0.68, m: 1.45 }, // Ibu tiba: bingkai ibu dan anak
    { t: 20.6, x: 660, feet: 0.68, m: 1.5 }, // dorong pelan selama dialog & narasi
    { t: 24.2, gameplay: true }, // zoom berkurang perlahan sampai pas dengan Chapter 1
  ],
  // Di layar pendek (HP landscape) karakter dinaikkan agar tidak tertutup kotak dialog.
  compactFeetShift: -0.08,
  malinScript: [
    { t: 0.8, action: 'walk', to: PLAYER_START_X, duration: 3, face: -1 }, // menuju rumah
    { t: 4.4, face: 1 }, // memandang laut
    { t: 6.4, face: -1 }, // mendengar Ibu datang: menoleh
    { t: 11.8, action: 'talk' }, // menjawab Ibu
    { t: 14.4, action: 'idle' },
    { t: 18.6, face: 1 }, // siap membantu: menghadap dermaga (arah awal gameplay)
  ],
  motherScript: [
    { t: 2.2, action: 'walk', to: MOTHER_NPC.x, duration: 5.6, face: 1 }, // keluar dari arah rumah
    { t: 8, action: 'talk' }, // mother_talk selama dialog Ibu
    { t: 11.8, action: 'idle' }, // Malin berbicara: Ibu diam
  ],
  cues: [
    { id: 'ibu', t: 8 },
    { id: 'malin', t: 11.8 },
    { id: 'penutup', t: 14.4 },
    { id: 'lepas', t: 21 }, // teks, tombol Lanjut/Lewati, dan letterbox menghilang
    { id: 'outro', t: 24.4 }, // framing sudah sama dengan gameplay: serahkan ke Chapter 1
  ],
  fastForward: 5, // tombol Lanjut: percepat waktu scene sampai cue berikutnya
}

// Narasi tampil per kalimat lalu memudar sendiri setelah waktu baca (lihat Narration).
export const NARRATION = {
  bay: 'Di sebuah kampung nelayan di pesisir Sumatra Barat, hiduplah seorang pemuda bernama Malin Kundang.',
  approach: 'Malin tinggal sederhana bersama ibunya dan membantu kehidupan sehari-hari di kampung.',
  penutup: 'Hari itu, seperti biasa, Malin membantu ibunya dan warga kampung. Perjalanannya baru saja dimulai.',
}

// Dialog (teks UI React); animasi bicara Ibu/Malin diatur OpeningVillageScene pada cue yang sama.
export const DIALOGUE = {
  ibu: { speaker: 'Ibu', text: 'Malin, bantu ibu mengantarkan hasil tangkapan ini ke dermaga, Nak.' },
  malin: { speaker: 'Malin', text: 'Baik, Bu. Malin akan membantu.' },
}

// Label chapter singkat di awal gameplay (PhaserGame) dan tujuan di HUD.
export const CHAPTER_ONE = {
  kicker: 'Chapter 1',
  title: 'Kampung Nelayan',
  objective: 'Bantu Ibu mengantarkan hasil tangkapan ke dermaga.',
}

export const SKIP_FADE_MS = 500

export const ALL_CINEMATIC_IMAGES = [
  TRANSITION_SHOTS.bay.url,
  TRANSITION_SHOTS.pier.url,
  TRANSITION_SHOTS.clouds.url,
  TRANSITION_SHOTS.waves.url,
  TRANSITION_SHOTS.foliage.url,
  TRANSITION_SHOTS.shipUrl,
  ...worldImageUrls(VILLAGE_SCENE.worldRange),
  VILLAGE_SCENE.malin.url,
  VILLAGE_SCENE.mother.url,
  // Sheet warga Chapter 1 (sebagian sudah berdiri di luar bingkai intro).
  ...Object.values(npcAssets).map((asset) => asset.url),
]

export const MENU_DEPTH = { underwater: 1.12, malin: 1.04 }
