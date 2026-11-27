import { OPENING_IMAGES } from '../components/openingAssets'
import { malinAsset } from '../game/malinAssets'
import { motherAsset, npcAssets } from '../game/npcAssets'
import kit from '../game/chapter1/kit.json'
import { BACKDROP, GROUNDS, LAND_FOREST, PLACEMENTS, RUNS } from '../game/chapter1/layout'

// Tanpa impor Phaser: layar loading tampil sebelum modul game selesai diunduh.
const pieces = new Set([
  ...PLACEMENTS.map((item) => item.piece),
  ...RUNS.map((item) => item.piece),
  ...BACKDROP.clouds.map(([name]) => name),
])
const strips = new Set([
  ...BACKDROP.strips.map((item) => item.strip),
  ...LAND_FOREST.map((item) => item.strip),
  ...(GROUNDS.length ? ['ground-fill'] : []),
])
const base = import.meta.env.BASE_URL

export const STARTUP_IMAGES = [...new Set([
  OPENING_IMAGES.sky, OPENING_IMAGES.titleArt, OPENING_IMAGES.beach,
  OPENING_IMAGES.ship, ...Object.values(OPENING_IMAGES),
  ...['01-teluk-establishing', '02-dermaga-closeup', 'overlay-awan', 'overlay-ombak', 'overlay-dedaunan']
    .map((name) => `${base}assets/cinematic/transition/${name}.png`),
  malinAsset.url, motherAsset.url, motherAsset.fallback.url,
  ...Object.values(npcAssets).map((asset) => asset.url),
  ...[...pieces].map((name) => `${base}${kit.pieces[name].url}`),
  ...[...strips].map((name) => `${base}${kit.strips[name].url}`),
  ...GROUNDS.flatMap(({ type }) => ['cap-l', 'mid', 'cap-r']
    .map((part) => `${base}${kit.grounds[type][part].url}`)),
].filter(Boolean))]
