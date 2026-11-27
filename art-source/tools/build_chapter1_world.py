"""Bangun world map Chapter 1 (satu dunia side-scrolling yang menyambung).

Jalankan dari root proyek:
    python3 art-source/tools/build_chapter1_world.py              # tulis aset + layout
    python3 art-source/tools/build_chapter1_world.py --preview D  # juga tulis pratinjau ke folder D

Masukan (semua sudah ada di proyek):
  art-source/chapter-1/backgrounds/area-0*.png      6 background area (paket chapter1-ready-assets)
  public/assets/cinematic/transition/overlay-dedaunan.png   dedaunan/batu (penutup sambungan)
  public/assets/cinematic/village/pier.png          strip dermaga transparan (jalur depan Area 6)

Keluaran:
  public/assets/chapter-1/world/world-<n>.webp      tile background dunia (koordinat asli)
  public/assets/chapter-1/world/<decor>.webp        potongan penutup sambungan (RGBA)
  src/game/chapter1/worldLayout.json                posisi tile/dekor/area dalam koordinat DUNIA

Pendekatan hibrida (disetujui pemilik proyek):
  1. Background disusun berurutan seperti map-layout.json, tanpa diregangkan: satu skala seragam
     WORLD_SCALE (= skala latar Chapter 1 sebelumnya, 1280/1092) diterapkan di Phaser.
  2. Tiap area digeser vertikal (`dy`) agar papan dermaga tepat di satu garis lantai.
  3. Area yang berurutan ditumpuk `blend` px dengan gradasi (smoothstep) di sambungan.
  4. Sambungan ditutup dekor foreground (dedaunan, batu) dan, bila perlu, dekor belakang.
Koordinat "asli" = piksel gambar sumber; koordinat dunia = asli x WORLD_SCALE.
"""
import argparse
import json
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'art-source/chapter-1/backgrounds'
OUT_DIR = ROOT / 'public/assets/chapter-1/world'
LAYOUT = ROOT / 'src/game/chapter1/worldLayout.json'
URL_BASE = 'assets/chapter-1/world'

WORLD_SCALE = 1280 / 1092  # skala latar Chapter 1 sebelumnya; ukuran karakter tetap cocok
FLOOR_WORLD = 600  # lantai collision LevelOneScene (tidak berubah)
FLOOR = FLOOR_WORLD / WORLD_SCALE  # = 512 asli
CANVAS_H = 724
TILE_W = 2048
TILE_PAD = 4  # tile saling menumpuk beberapa px agar tidak ada garis rambut saat diskalakan

# Garis pijakan kaki tiap area (asli) diukur dari gambar; dy = FLOOR - pijakan.
# crop = rentang x gambar yang dipakai (tanpa regangan). blend = lebar gradasi dengan area sebelumnya.
# foliage = kluster penutup sambungan di depan area ini: jenis A/B bergantian + skala/geser berbeda.
# Geometri (koordinat gambar asli area, sebelum crop): floor = rentang x lantai utama pada garis
# pijakan area; platforms = (x0, x1, pijakan) untuk dek/tiang yang lebih tinggi. Celah = air.
SEGMENTS = [
    {'id': 'area-01-rumah-malin', 'name': 'Rumah Malin', 'feet': 481,
     # dek dermaga mulai x≈480; halaman rumah (jalan setapak) sedikit lebih tinggi
     'floor': [(480, 1280)], 'platforms': [(170, 480, 448)], 'walkLeft': 170},
    {'id': 'area-02-dermaga-nelayan', 'name': 'Dermaga Nelayan', 'feet': 471, 'blend': 300,
     'seam': {'crop': (0, 455), 'flip': False, 'dx': 0},
     'floor': [(0, 1105)]},
    {'id': 'area-03-dermaga-rusak', 'name': 'Dermaga Rusak', 'feet': 446, 'blend': 300,
     'seam': {'crop': (905, 1245), 'flip': True, 'dx': 0,
              'erase': [(1150, 0, 1260, 250)]},  # pucuk pohon di belakang atap (melayang bila dipotong),
     # dek bawah kiri → anak tangga (jalan naik) → dek atas → 4 tunggul tiang → dek kanan
     'floor': [(0, 250)],
     'platforms': [(240, 335, 425), (330, 600, 405), (598, 640, 439), (636, 680, 416),
                   (690, 735, 404), (735, 778, 380), (825, 1180, 395)]},
    # Area 4 = lukisan yang sama dengan latar Chapter 1 lama. Bagian kiri (pondok + jalan turun di
    # bawah garis lantai) dilewati; dunia masuk tepat sebelum dek utama dan kios ikan.
    {'id': 'area-04-jalan-kampung', 'name': 'Jalan Kampung', 'feet': 509, 'blend': 300, 'crop': (380, 2160),
     'seam': {'crop': (440, 890), 'flip': False, 'dx': 0},
     'floor': [(480, 2160)]},
    {'id': 'area-05-pasar-ikan', 'name': 'Pasar Ikan', 'feet': 490, 'blend': 300,
     'seam': {'crop': (0, 455), 'flip': True, 'dx': 0},
     'floor': [(0, 1280)]},
    # Area 6: background perspektif dipakai sebagai pemandangan; jalur Malin = dermaga lurus di
    # depan (pier.png) dengan air di bawahnya. Dunia berakhir sebelum lapak besar yang terpotong bingkai.
    {'id': 'area-06-pelabuhan', 'name': 'Pelabuhan', 'feet': 474, 'blend': 300, 'crop': (0, 1000),
     'seam': {'crop': (1640, 2172), 'flip': True, 'dx': 0},
     # dermaga depan (pier.png, garis pijakan sama) + tangga ke dek atas di ujung pelabuhan
     'floor': [(0, 1000)], 'platforms': [(483, 578, 432), (513, 608, 398), (588, 933, 357)], 'walkRight': 990},
]

# Komposisi tambahan Area 6 (koordinat asli relatif terhadap kiri Area 6 setelah crop).
HARBOR = {
    'pier': {'file': 'public/assets/cinematic/village/pier.png', 'crop': (1172, 0, 2172, 724), 'x': 0, 'feet': 474},
    # Air menutup jalan papan perspektif di bawah dermaga depan; warnanya disamakan dengan air
    # Area 5 di sebelahnya (rata-rata kanal), tepi atas/kiri dipudarkan.
    'water': {'file': 'public/assets/cinematic/village/sea.png', 'crop': (250, 440, 1000, 690), 'x': 250, 'y': 492,
              'feather_top': 46, 'feather_left': 140, 'match': ('area-05-pasar-ikan', (300, 650, 1200, 715))},
    # Kapal layar (aset opening yang sama) bersandar di pelabuhan, di belakang dermaga depan.
    'ship': {'file': 'public/assets/opening/opening-ship.png', 'scale': 0.36, 'x': 250, 'waterline': 985, 'y': 470},
}

OCCLUDER_SRC = ROOT / 'public/assets/cinematic/village/stilt-village.png'
OCCLUDER_FEET = 515  # garis pijakan dek pada strip rumah panggung
OCCLUDER_FEATHER = 60

FOLIAGE = ROOT / 'public/assets/cinematic/transition/overlay-dedaunan.png'
FOLIAGE_SCALE = CANVAS_H / 941
# Bingkai dedaunan: kiri = dahan dari kiri atas + daun + batu kiri bawah; kanan = cerminannya.
FOLIAGE_CROPS = {'foliage-left': (0, 0, 820, 941), 'foliage-right': (1060, 0, 1672, 941)}
CANOPY_CUT = 370  # kluster A: batas tajuk (atas) dan semak (bawah), koordinat asli
CANOPY_FADE = 40


def smooth_mask(width, height, ramp):
    """Alpha 0..255 dengan smoothstep di `ramp` kolom kiri, sisanya penuh."""
    mask = Image.new('L', (width, height), 255)
    draw = ImageDraw.Draw(mask)
    for x in range(ramp):
        t = (x + 0.5) / ramp
        draw.line([(x, 0), (x, height)], fill=round(255 * t * t * (3 - 2 * t)))
    return mask


def feather(image, left=0, right=0, top=0):
    """Kalikan alpha dengan smoothstep di tepi yang diminta (untuk potongan RGBA)."""
    image = image.copy()
    alpha = image.getchannel('A')
    w, h = image.size
    ramp = Image.new('L', (w, h), 255)
    draw = ImageDraw.Draw(ramp)
    def s(t):
        return round(255 * t * t * (3 - 2 * t))
    for i in range(left):
        draw.line([(i, 0), (i, h)], fill=s((i + 0.5) / left))
    for i in range(right):
        x = w - 1 - i
        draw.line([(x, 0), (x, h)], fill=min(ramp.getpixel((x, 0)), s((i + 0.5) / right)))
    if top:
        top_ramp = Image.new('L', (w, h), 255)
        tdraw = ImageDraw.Draw(top_ramp)
        for i in range(top):
            tdraw.line([(0, i), (w, i)], fill=s((i + 0.5) / top))
        ramp = ImageChops.multiply(ramp, top_ramp)
    image.putalpha(ImageChops.multiply(alpha, ramp))
    return image


def feather_bottom(image, ramp):
    flipped = image.transpose(Image.FLIP_TOP_BOTTOM)
    return feather(flipped, top=ramp).transpose(Image.FLIP_TOP_BOTTOM)


def match_color(patch, reference):
    """Samakan rata-rata tiap kanal RGB `patch` (bagian opak) dengan `reference`."""
    from PIL import ImageStat
    alpha = patch.getchannel('A').point(lambda v: 255 if v > 200 else 0)
    src = ImageStat.Stat(patch.convert('RGB'), alpha).mean
    dst = ImageStat.Stat(reference).mean
    bands = [band.point(lambda v, k=dst[i] / max(src[i], 1): min(255, round(v * k)))
             for i, band in enumerate(patch.convert('RGB').split())]
    out = Image.merge('RGB', bands).convert('RGBA')
    out.putalpha(patch.getchannel('A'))
    return out


def harbor_layer(segment):
    """Air, kapal, dan dermaga depan Area 6 (ditempel ke kanvas Area 6 sebelum digabung)."""
    base = segment.convert('RGBA')
    water = HARBOR['water']
    patch = Image.open(ROOT / water['file']).convert('RGBA').crop(water['crop'])
    patch = match_color(patch, Image.open(SRC / f"{water['match'][0]}.png").convert('RGB').crop(water['match'][1]))
    patch = feather(patch, left=water['feather_left'], top=water['feather_top'])
    ship = HARBOR['ship']
    vessel = Image.open(ROOT / ship['file']).convert('RGBA')
    vessel = vessel.resize((round(vessel.width * ship['scale']), round(vessel.height * ship['scale'])), Image.LANCZOS)
    base.alpha_composite(vessel, (ship['x'], round(ship['y'] - ship['waterline'] * ship['scale'])))
    base.alpha_composite(patch, (water['x'], water['y']))
    pier = HARBOR['pier']
    strip = Image.open(ROOT / pier['file']).convert('RGBA').crop(pier['crop'])
    base.alpha_composite(strip, (pier['x'], 0))
    return base.convert('RGB')


def compose():
    placed = []
    x = 0
    for seg in SEGMENTS:
        image = Image.open(SRC / f"{seg['id']}.png").convert('RGB')
        if seg['id'] == 'area-06-pelabuhan':
            # dermaga depan memakai garis pijakannya sendiri; geser ke garis pijakan background dulu
            image = harbor_layer(image)
        if 'crop' in seg:
            image = image.crop((seg['crop'][0], 0, seg['crop'][1], image.height))
        blend = seg.get('blend', 0)
        left = x - blend if placed else 0
        dy = round(FLOOR - seg['feet'])
        placed.append({**seg, 'image': image, 'x': left, 'dy': dy, 'blend': blend})
        x = left + image.width
    width = x
    canvas = Image.new('RGB', (width, CANVAS_H), (0, 0, 0))
    for seg in placed:
        image = seg['image']
        mask = smooth_mask(image.width, image.height, seg['blend']) if seg['blend'] else None
        canvas.paste(image, (seg['x'], seg['dy']), mask)
    # Penutup sambungan: bangunan utuh dari strip rumah panggung (gaya sama, resolusi penuh),
    # berdiri di dermaga tepat di atas zona gradasi, di BELAKANG Malin (bagian dari background).
    stilts = Image.open(OCCLUDER_SRC).convert('RGBA')
    rgba = canvas.convert('RGBA')
    for seg in placed[1:]:
        occ = seg.get('seam')
        if not occ:
            continue
        source = stilts
        if occ.get('erase'):
            source = stilts.copy()
            for box in occ['erase']:
                source.paste((0, 0, 0, 0), box)
        piece = source.crop((occ['crop'][0], 0, occ['crop'][1], stilts.height))
        # tepi potong (pohon latar, ujung dek) dipudarkan agar tidak membentuk garis persegi
        piece = feather(piece, left=OCCLUDER_FEATHER, right=OCCLUDER_FEATHER)
        if occ.get('flip'):
            piece = piece.transpose(Image.FLIP_LEFT_RIGHT)
        center = seg['x'] + seg['blend'] / 2 + occ.get('dx', 0)
        rgba.alpha_composite(piece, (round(center - piece.width / 2), round(FLOOR - OCCLUDER_FEET)))
    canvas = rgba.convert('RGB')
    top = max(seg['dy'] for seg in placed)
    bottom = min(seg['dy'] + seg['image'].height for seg in placed)
    return canvas, placed, top, bottom


def foliage_pieces():
    source = Image.open(FOLIAGE).convert('RGBA')
    pieces = {}
    for key, box in FOLIAGE_CROPS.items():
        crop = source.crop(box)
        size = (round(crop.width * FOLIAGE_SCALE), round(crop.height * FOLIAGE_SCALE))
        pieces[key] = crop.resize(size, Image.LANCZOS)
    return pieces


def foliage_cluster(pieces, kind, scale):
    """Kluster penutup sambungan dari satu bingkai dedaunan + cerminannya, disambung tepat di tepi
    potongnya (bekas tepi layar) sehingga sambungannya kontinu piksel demi piksel.
    A = bingkai kiri (dahan, daun pisang, kembang sepatu, batu); B = bingkai kanan (tajuk, daun, batu)."""
    def mirrored(frame, cut_left):
        pair = [frame.transpose(Image.FLIP_LEFT_RIGHT), frame] if cut_left else [frame, frame.transpose(Image.FLIP_LEFT_RIGHT)]
        out = Image.new('RGBA', (frame.width * 2, frame.height), (0, 0, 0, 0))
        out.alpha_composite(pair[0], (0, 0))
        out.alpha_composite(pair[1], (frame.width, 0))
        return out

    canopy = mirrored(pieces['foliage-right'], cut_left=False)  # tepi potong bingkai kanan ada di kanan
    if kind == 'B':
        cluster = canopy
    else:
        # Dahan bingkai kiri bila dicerminkan membentuk huruf V yang menggantung, jadi kluster A
        # memakai tajuk kluster B di atas dan semak bingkai kiri (daun pisang, kembang sepatu,
        # batu) di bawah; keduanya bertemu di area daun dengan gradasi vertikal.
        shrubs = mirrored(pieces['foliage-left'], cut_left=True)
        width = max(canopy.width, shrubs.width)
        cluster = Image.new('RGBA', (width, CANVAS_H), (0, 0, 0, 0))
        top = canopy.crop((0, 0, canopy.width, CANOPY_CUT + CANOPY_FADE))
        top = feather_bottom(top, CANOPY_FADE)
        bottom = shrubs.crop((0, CANOPY_CUT - CANOPY_FADE, shrubs.width, shrubs.height))
        bottom = feather(bottom, top=CANOPY_FADE)
        cluster.alpha_composite(bottom, ((width - shrubs.width) // 2, CANOPY_CUT - CANOPY_FADE))
        cluster.alpha_composite(top, ((width - canopy.width) // 2, 0))
    if scale != 1:
        cluster = cluster.resize((round(cluster.width * scale), round(cluster.height * scale)), Image.LANCZOS)
    return cluster, cluster.width / 2


def seam_decor(placed, pieces):
    """Satu kluster dedaunan (foreground, di depan Malin) di pusat tiap sambungan. Variasi cermin,
    skala, dan geser vertikal per sambungan agar kluster tidak terlihat sama."""
    for kind in ('A', 'B'):
        pieces[f'foliage-{kind}'], _ = foliage_cluster(pieces, kind, 1)
    decor = []
    for i, seg in enumerate(placed[1:], start=1):
        opts = seg.get('foliage')
        center = seg['x'] + seg['blend'] / 2
        if not opts:
            decor.append({'kind': None, 'scale': 1, 'center': center, 'x': center, 'y': 0})
            continue
        base = pieces[f"foliage-{opts['kind']}"]
        width, height = base.width * opts['scale'], base.height * opts['scale']
        center = seg['x'] + seg['blend'] / 2
        decor.append({'kind': opts['kind'], 'scale': opts['scale'], 'center': center,
                      'x': center - width / 2, 'y': CANVAS_H + opts['dy'] - height})
    return decor


def to_world(value):
    return round(value * WORLD_SCALE, 1)


def geometry(placed):
    """Lantai/platform dalam koordinat dunia (ikut geser dy dan posisi area)."""
    def wx(seg, px):
        return to_world(seg['x'] + px - seg.get('crop', (0, 0))[0])

    def wy(seg, py):
        return to_world(py + seg['dy'])

    floors, platforms = [], []
    for seg in placed:
        floors += [{'x0': wx(seg, a), 'x1': wx(seg, b), 'y': wy(seg, seg['feet'])} for a, b in seg.get('floor', [])]
        platforms += [{'x0': wx(seg, a), 'x1': wx(seg, b), 'y': wy(seg, f)} for a, b, f in seg.get('platforms', [])]
    first, last = placed[0], placed[-1]
    return {
        'floors': floors,
        'platforms': platforms,
        'walkLeft': wx(first, first['walkLeft']),
        'walkRight': wx(last, last['walkRight']),
    }


def write_outputs(canvas, placed, decor, pieces, top, bottom):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    tiles = []
    for i, x in enumerate(range(0, canvas.width, TILE_W)):
        right = min(canvas.width, x + TILE_W + TILE_PAD)
        name = f'world-{i}.webp'
        canvas.crop((x, 0, right, CANVAS_H)).save(OUT_DIR / name, quality=90, method=6)
        tiles.append({'key': f'c1-world-{i}', 'url': f'{URL_BASE}/{name}', 'x': to_world(x), 'width': right - x})
    foliage = {}
    for kind in sorted({d['kind'] for d in decor if d['kind']}):
        name = f'foliage-{kind.lower()}.webp'
        pieces[f'foliage-{kind}'].save(OUT_DIR / name, quality=90, method=6)
        image = pieces[f'foliage-{kind}']
        foliage[kind] = {'key': f'c1-foliage-{kind.lower()}', 'url': f'{URL_BASE}/{name}',
                         'width': image.width, 'height': image.height}
    seams = [{'x': to_world(d['center']), 'foliage': d['kind'], 'left': to_world(d['x']), 'top': to_world(d['y']),
              'scale': d['scale']} for d in decor]
    centers = [0] + [s['x'] for s in seams] + [to_world(canvas.width)]
    areas = [{'id': seg['id'], 'name': seg['name'], 'x0': centers[i], 'x1': centers[i + 1]} for i, seg in enumerate(placed)]
    layout = {
        '_generated': 'art-source/tools/build_chapter1_world.py (jangan diedit manual)',
        'scale': WORLD_SCALE,
        'width': to_world(canvas.width),
        'height': to_world(CANVAS_H),
        'floorY': FLOOR_WORLD,
        'view': {'top': to_world(top), 'bottom': to_world(bottom)},
        'tiles': tiles,
        'foliage': foliage,
        'seams': seams,
        'areas': areas,
        **geometry(placed),
    }
    LAYOUT.parent.mkdir(parents=True, exist_ok=True)
    LAYOUT.write_text(json.dumps(layout, indent=2, ensure_ascii=False) + '\n')
    for path in sorted(OUT_DIR.iterdir()):
        print(f'  {path.relative_to(ROOT)}  {path.stat().st_size // 1024} KB')
    print(f'  {LAYOUT.relative_to(ROOT)}')


def render_preview(canvas, placed, decor, pieces, top, bottom, out_dir):
    out_dir.mkdir(parents=True, exist_ok=True)
    full = canvas.convert('RGBA')
    for item in decor:
        if not item['kind']:
            continue
        base = pieces[f"foliage-{item['kind']}"]
        cluster = base.resize((round(base.width * item['scale']), round(base.height * item['scale'])), Image.LANCZOS)
        full.alpha_composite(cluster, (round(item['x']), round(item['y'])))
    malin = Image.open(ROOT / 'public/assets/characters/malin/malin-gameplay-spritesheet.png').crop((0, 0, 280, 280))
    m_scale = 0.53 / WORLD_SCALE
    malin = malin.resize((round(280 * m_scale), round(280 * m_scale)), Image.LANCZOS)
    m_feet = 264 * m_scale
    draw = ImageDraw.Draw(full)
    for y in (top, bottom):
        draw.line([(0, y), (full.width, y)], fill=(255, 0, 255, 255), width=2)
    draw.line([(0, FLOOR), (full.width, FLOOR)], fill=(255, 60, 60, 200), width=1)
    for seg in placed:
        for mx in (seg['x'] + 200, seg['x'] + seg['image'].width // 2):
            full.alpha_composite(malin, (round(mx - malin.width / 2), round(FLOOR - m_feet)))
    overview = full.convert('RGB')
    overview.resize((overview.width // 4, overview.height // 4), Image.LANCZOS).save(out_dir / 'world-overview.jpg', quality=85)
    for i, seg in enumerate(placed[1:], start=1):
        center = round(seg['x'] + seg['blend'] / 2)
        box = (max(0, center - 640), 0, min(full.width, center + 640), CANVAS_H)
        full.crop(box).convert('RGB').save(out_dir / f'seam-{i}-{placed[i - 1]["id"][:7]}-{seg["id"][:7]}.jpg', quality=85)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--preview', type=Path)
    parser.add_argument('--no-write', action='store_true')
    args = parser.parse_args()
    canvas, placed, top, bottom = compose()
    pieces = foliage_pieces()
    decor = seam_decor(placed, pieces)
    print(f'dunia asli {canvas.width}x{CANVAS_H}, dunia {canvas.width * WORLD_SCALE:.0f} px, area terlihat y {top}-{bottom}')
    for seg in placed:
        print(f"  {seg['id']}: x={seg['x']} dy={seg['dy']}")
    if args.preview:
        render_preview(canvas, placed, decor, pieces, top, bottom, args.preview)
    if args.no_write:
        return
    write_outputs(canvas, placed, decor, pieces, top, bottom)


if __name__ == '__main__':
    main()
