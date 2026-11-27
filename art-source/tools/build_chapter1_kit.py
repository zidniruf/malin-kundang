"""Bangun kit elemen modular Chapter 1 (potongan yang bisa dipakai berulang di world map).

Jalankan dari root proyek:
    python3 art-source/tools/build_chapter1_kit.py              # tulis aset + kit.json
    python3 art-source/tools/build_chapter1_kit.py --preview D  # juga tulis lembar pratinjau ke folder D

Masukan:  art-source/chapter-1/kit-source/   (salinan paket "asset-malin-kundang", lihat README di sana)
Keluaran: public/assets/chapter-1/kit/<nama>.webp   satu file per elemen (RGBA)
          src/game/chapter1/kit.json                ukuran, skala dunia, dan permukaan pijakan tiap elemen

Konsep:
  - Setiap elemen dipotong dari sprite sheet (kotak sumber diukur dari segmentasi alpha) atau dipakai utuh.
  - `scale` = ukuran dunia per piksel sumber (dipilih agar sebanding dengan Malin, tinggi ±135 px dunia).
    Tekstur disimpan pada scale x RES (maks. ukuran sumber) agar tajam tanpa memboroskan memori.
  - `surface` = baris piksel SUMBER (di dalam potongan) tempat kaki berpijak; dipakai world.js untuk
    membuat collider otomatis dari penempatan elemen (tidak perlu mengukur dari gambar lagi).
  - Strip parallax (gunung, laut, hutan) dibuang label teksnya, lalu ujung kiri/kanannya di-crossfade agar
    bisa diulang tanpa garis sambungan.
"""
import argparse
import json
from collections import deque
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'art-source/chapter-1/kit-source'
OUT = ROOT / 'public/assets/chapter-1/kit'
KIT_JSON = ROOT / 'src/game/chapter1/kit.json'
URL_PREFIX = 'assets/chapter-1/kit'
RES = 1.25  # resolusi tekstur relatif ukuran tampilan dunia
QUALITY = 86

# Sheet dan kotak sumber (x0, y0, x1, y1) hasil segmentasi alpha.
A = 'sheets/dermaga-tanah-a.png'
B = 'sheets/dermaga-tanah-b.png'
DD = 'sheets/dermaga-detail.png'
DK = 'sheets/dekorasi-nelayan.png'
PA = 'sheets/pasar-ikan-a.png'
PB = 'sheets/pasar-ikan-b.png'
KP = 'sheets/kapal-perahu.png'

# name: (sumber, kotak atau None = seluruh gambar, skala dunia, permukaan pijakan atau None)
PIECES = {
    # --- Tanah dan dermaga (lantai yang bisa dipijak) ---
    'ground-grass': (A, (15, 19, 752, 137), 1.0, 52),
    'ground-grass-flower': (A, (785, 20, 1521, 137), 1.0, 52),
    'ground-sand': (A, (14, 190, 753, 309), 1.0, 55),
    'ground-rocky': (A, (785, 190, 1522, 309), 1.0, 60),
    'ground-dirt': (A, (15, 355, 764, 484), 1.0, 55),
    'bank-slope-down': (A, (785, 356, 1094, 488), 1.0, None),
    'bank-slope-up': (A, (1238, 357, 1520, 489), 1.0, None),
    'block-grass': (B, (25, 114, 498, 257), 1.0, 45),
    'block-grass-flower': (B, (529, 100, 1006, 256), 1.0, 58),
    'block-sand': (B, (1037, 104, 1517, 256), 1.0, 55),
    'block-rock': (B, (14, 390, 540, 581), 1.0, 60),
    'block-dirt': (B, (560, 400, 1020, 583), 1.0, 60),
    'pillar-rock-a': (B, (1028, 306, 1249, 580), 0.8, 55),
    'pillar-rock-b': (B, (1310, 305, 1528, 580), 0.8, 55),
    'dock-long': (A, (21, 531, 796, 752), 1.0, 50),
    'dock-mid': (A, (855, 531, 1515, 752), 1.0, 55),
    'dock-short': (A, (25, 786, 437, 1004), 1.0, 50),
    'dock-rope': (A, (494, 780, 918, 1005), 1.0, 75),
    'dock-lantern': (A, (1010, 764, 1359, 1005), 1.0, 105),
    'dock-plank-a': (B, (23, 657, 539, 924), 1.0, 50),
    'dock-plank-b': (B, (578, 667, 1169, 915), 1.0, 45),
    'dock-plank-small': (B, (1219, 668, 1523, 919), 1.0, 62),
    'dock-corner': (DD, (25, 29, 515, 412), 0.6, 75),
    'pier-post': (DD, (613, 15, 714, 409), 0.6, 18),
    'pier-post-rope': (DD, (818, 15, 916, 409), 0.6, 18),
    'dock-rail': (DD, (992, 91, 1754, 346), 0.45, None),
    'dock-stairs': (DD, (176, 445, 835, 855), 0.55, None),
    'rope-ladder': (DD, (1052, 415, 1356, 847), 0.5, None),
    # --- Bangunan (gambar utuh) ---
    'house-gadang-a': ('rumah/rumah-gadang-a.png', None, 0.46, None),
    'house-gadang-b': ('rumah/rumah-gadang-b.png', None, 0.46, None),
    'house-gadang-c': ('rumah/rumah-gadang-c.png', None, 0.44, None),
    'house-gadang-long': ('rumah/rumah-gadang-panjang.png', None, 0.46, None),
    'hut-thatch': ('rumah/pondok-jerami.png', None, 0.4, None),
    'hut-fisher': ('rumah/rumah-nelayan.png', None, 0.38, None),
    'rangkiang': ('rumah/rangkiang.png', None, 0.3, None),
    'pavilion-a': ('rumah/dangau-a.png', None, 0.32, None),
    'pavilion-b': ('rumah/dangau-b.png', None, 0.32, None),
    # --- Kapal dan perahu ---
    'ship-sail': (KP, (2, 5, 889, 617), 0.8, None),
    'boat-fishing': (KP, (952, 141, 1774, 596), 0.5, None),
    'boat-row': (KP, (50, 683, 812, 868), 0.42, None),
    'boat-canoe': (KP, (916, 705, 1722, 843), 0.42, None),
    # --- Dekorasi nelayan ---
    'net-stand': (DK, (14, 13, 329, 271), 0.5, None),
    'barrels': (DK, (612, 13, 884, 256), 0.32, None),
    'fish-traps': (DK, (904, 9, 1220, 256), 0.32, None),
    'basket-fish': (DK, (1248, 21, 1521, 241), 0.26, None),
    'rope-coil': (DK, (336, 47, 582, 245), 0.24, None),
    'sacks': (DK, (652, 273, 932, 512), 0.3, None),
    'floats': (DK, (963, 276, 1219, 499), 0.26, None),
    'anchor': (DK, (1267, 259, 1497, 510), 0.34, None),
    'drying-rack': (DK, (15, 302, 367, 520), 0.5, None),
    'crates': (DK, (374, 281, 632, 511), 0.32, None),
    'oars': (DK, (15, 510, 255, 772), 0.36, None),
    'trap-tube': (DK, (294, 549, 614, 746), 0.26, None),
    'fish-tray': (DK, (635, 552, 962, 737), 0.24, None),
    'lantern': (DK, (1009, 512, 1184, 745), 0.24, None),
    'flag': (DK, (1271, 502, 1518, 752), 0.4, None),
    'flower-basket': (DK, (1243, 738, 1516, 1012), 0.28, None),
    'cloth-rack': (DK, (15, 798, 345, 1005), 0.36, None),
    'buoys': (DK, (364, 761, 594, 1010), 0.26, None),
    'mats': (DK, (623, 788, 938, 998), 0.26, None),
    'pot': (DK, (977, 778, 1205, 1010), 0.24, None),
    # --- Pasar ikan ---
    'stall-thatch': (PA, (13, 12, 685, 392), 0.6, None),
    'stall-canopy': (PA, (702, 11, 1296, 376), 0.6, None),
    'fish-rack-tall': (PA, (1338, 23, 1746, 380), 0.5, None),
    'fish-table': (PA, (56, 436, 580, 630), 0.42, None),
    'fish-basket-blue': (PA, (640, 414, 987, 611), 0.26, None),
    'fish-basket-red': (PA, (1042, 414, 1383, 598), 0.26, None),
    'crate-stack': (PA, (189, 635, 525, 856), 0.32, None),
    'net-hammock': (PA, (1038, 617, 1530, 862), 0.4, None),
    'stall-red': (PB, (15, 19, 482, 377), 0.62, None),
    'stall-hut': (PB, (480, 15, 959, 371), 0.62, None),
    'table-baskets': (PB, (1394, 90, 1761, 357), 0.42, None),
    'stall-large': ('sheets/pasar-ikan-lapak-besar.png', None, 0.3, None),
    # --- Pohon dan tanaman (sudah terpisah) ---
    'tree-coconut-a': ('pohon/tree-coconut-01.png', None, 1.25, None),
    'tree-coconut-b': ('pohon/tree-coconut-02.png', None, 1.25, None),
    'tree-coconut-small': ('pohon/tree-coconut-small.png', None, 1.2, None),
    'tree-shade-a': ('pohon/tree-shade-01.png', None, 0.95, None),
    'tree-shade-b': ('pohon/tree-shade-02.png', None, 0.95, None),
    'bush-a': ('pohon/bush-01.png', None, 0.4, None),
    'bush-b': ('pohon/bush-02.png', None, 0.45, None),
    'plant-hibiscus': ('pohon/plant-hibiscus.png', None, 0.45, None),
    'plant-pandan': ('pohon/plant-pandan.png', None, 0.25, None),
    'plant-potted': ('pohon/plant-potted.png', None, 0.18, None),
    'plant-flower-yellow': ('pohon/plant-flower-yellow.png', None, 0.25, None),
    # --- Rintangan dan foreground (sudah terpisah, 2x) ---
    **{f'obstacle-{n}': (f'rintangan-foreground/obstacle-{n}.png', None, s, top) for n, s, top in [
        ('crate', 0.27, 20), ('crate-tall', 0.27, 18), ('barrel', 0.25, None), ('barrel-side', 0.25, None),
        ('basket-stack', 0.27, None), ('broken-plank', 0.4, None), ('cargo-stack', 0.32, None),
        ('log', 0.35, None), ('log-pile', 0.32, None), ('net-pile', 0.3, None), ('rocks', 0.35, None),
        ('rocks-small', 0.32, None), ('barrier-small', 0.3, None), ('pier-hole', 0.45, None)]},
    **{f'fg-{n}': (f'rintangan-foreground/fg-{n}.png', None, s, None) for n, s in [
        ('bush-01', 0.7), ('bush-02', 0.7), ('grass-01', 0.6), ('leaves-corner-left', 0.9),
        ('leaves-corner-right', 0.9), ('leaves-large', 0.8), ('pier-post-near', 0.9), ('plant-coastal-01', 0.7),
        ('plant-coastal-02', 0.7), ('rocks-01', 0.6), ('rocks-02', 0.6)]},
    # --- Langit ---
    **{f'cloud-{n}': (f'langit-laut/cloud-{n}.png', None, s, None) for n, s in [
        ('large-01', 0.34), ('large-02', 0.34), ('medium-01', 0.34), ('medium-02', 0.34),
        ('small-01', 0.34), ('small-02', 0.34), ('wisp-01', 0.4), ('wisp-02', 0.4)]},
    'island-rock': ('langit-laut/island-rock.png', None, 0.32, None),
}

# Strip yang diulang (TileSprite). rows = baris sumber yang dipakai (label/garis tepi terang di bawahnya dibuang);
# blend = 'mirror' (strip + cerminannya) atau lebar crossfade sambungan (px sumber);
# scale = ukuran dunia per px sumber.
STRIPS = {
    'mountain-far': ('langit-laut/mountain-far-seamless.png', (0, 748), 'mirror', 0.42),
    'mountain-mid': ('langit-laut/mountain-mid-seamless.png', (0, 620), 'mirror', 0.45),
    'mountain-near': ('langit-laut/mountain-near-seamless.png', (0, 517), 'mirror', 0.42),
    'ocean': ('langit-laut/ocean-surface-seamless.png', (8, 578), 'mirror', 0.78),
    'forest-back': ('pohon/forest-back-seamless.png', (0, 133), 'mirror', 1.15),
    'forest-front': ('pohon/forest-front-seamless.png', (0, 158), 'mirror', 1.3),
    'grass-strip': ('rintangan-foreground/fg-grass-seamless.png', (0, 162), 'mirror', 0.55),
}

STRIP_PAD = 4

# Tanah menerus (skala 1): lebar ujung kiri/kanan dalam px sumber (semak/batu penutup ujung).
GROUNDS = {
    'ground-grass': (150, 160),
    'ground-grass-flower': (150, 160),
    'ground-sand': (170, 170),
    'ground-rocky': (180, 180),
    'ground-dirt': (150, 150),
}

CAP_FADE = 32
# Isian bawah daratan: (elemen sumber, kotak bagian batu di dalam potongan yang sudah di-trim).
FILL = ('block-dirt', (30, 112, 330, 170))


def fade_edge(img, side):
    """Pudarkan CAP_FADE kolom di sisi `side` (alpha dikali gradasi)."""
    w, h = img.size
    ramp = Image.linear_gradient('L').rotate(90, expand=True).resize((CAP_FADE, h))  # 255 kiri → 0 kanan
    if side == 'left':
        ramp = ramp.transpose(Image.FLIP_LEFT_RIGHT)
    mask = Image.new('L', (w, h), 255)
    mask.paste(ramp, (w - CAP_FADE, 0) if side == 'right' else (0, 0))
    out = img.copy()
    out.putalpha(ImageChops.multiply(img.getchannel('A'), mask))
    return out


def alpha_bbox(img, threshold=12):
    return img.getchannel('A').point(lambda v: 255 if v > threshold else 0).getbbox()


def drop_bottom_label(img):
    """Awan/pulau dari paket masih membawa label nama di bawahnya: potong di baris kosong terakhir
    di atas label (dicari dari bawah, hanya di 45% bagian bawah)."""
    alpha = img.getchannel('A').point(lambda v: 255 if v > 12 else 0)
    w, h = img.size
    y = h - 1
    while y > 0 and alpha.crop((0, y, w, y + 1)).getbbox() is None:
        y -= 1
    while y > h * 0.55 and alpha.crop((0, y, w, y + 1)).getbbox() is not None:
        y -= 1  # baris label
    if y > h * 0.55:
        return img.crop((0, 0, w, y))
    # Label menempel tanpa celah: baris label jauh lebih sempit dari dasar objek. Potong di baris
    # terbawah yang lebarnya >= 45% gambar (hanya di 40% bagian bawah).
    solid = img.getchannel('A').point(lambda v: 255 if v > 128 else 0)
    for y in range(h - 1, int(h * 0.6), -1):
        row = solid.crop((0, y, w, y + 1)).getbbox()
        if row and row[2] - row[0] >= w * 0.45:
            return img.crop((0, 0, w, y + 1)) if y < h - 1 else img
    return img


def keep_main_parts(img, step=2, min_share=0.12):
    """Hapus serpihan objek tetangga yang ikut terpotong dari sprite sheet: simpan komponen alpha
    yang luasnya >= min_share x komponen terbesar."""
    alpha = img.getchannel('A').point(lambda v: 255 if v > 24 else 0)
    sw, sh = max(1, img.width // step), max(1, img.height // step)
    small = alpha.resize((sw, sh), Image.BOX).point(lambda v: 255 if v else 0).filter(ImageFilter.MaxFilter(3))
    px = small.load()
    label = [[-1] * sw for _ in range(sh)]
    sizes = []
    for y0 in range(sh):
        for x0 in range(sw):
            if not px[x0, y0] or label[y0][x0] >= 0:
                continue
            idx, queue, n = len(sizes), deque([(x0, y0)]), 0
            label[y0][x0] = idx
            while queue:
                x, y = queue.popleft()
                n += 1
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if 0 <= nx < sw and 0 <= ny < sh and px[nx, ny] and label[ny][nx] < 0:
                        label[ny][nx] = idx
                        queue.append((nx, ny))
            sizes.append(n)
    if len(sizes) <= 1:
        return img
    keep = {i for i, n in enumerate(sizes) if n >= max(sizes) * min_share}
    mask = Image.new('L', (sw, sh), 0)
    mpx = mask.load()
    for y in range(sh):
        for x in range(sw):
            if label[y][x] in keep:
                mpx[x, y] = 255
    mask = mask.filter(ImageFilter.MaxFilter(3)).resize(img.size, Image.NEAREST)
    out = img.copy()
    out.putalpha(ImageChops.multiply(img.getchannel('A'), mask))
    return out


def cut_piece(src, box):
    img = Image.open(SRC / src).convert('RGBA')
    if box:
        img = keep_main_parts(img.crop(box))
    if src.startswith('langit-laut/'):
        # Label nama di bawah awan/pulau: potong di celah kosong, lalu simpan hanya komponen terbesar
        # (label yang menempel tanpa celah selalu lebih kecil dari objeknya).
        img = keep_main_parts(drop_bottom_label(img), min_share=1.0)
    bbox = alpha_bbox(img)
    return img.crop(bbox), bbox[1]


def mirror_tile(img):
    """Strip + cerminannya: kedua sambungan (tengah dan ujung yang berulang) selalu bertemu kolom
    yang sama persis, jadi tidak ada garis atau bayangan ganda seperti pada crossfade."""
    out = Image.new('RGBA', (img.width * 2, img.height))
    out.paste(img, (0, 0))
    out.paste(img.transpose(Image.FLIP_LEFT_RIGHT), (img.width, 0))
    return out


def seamless(img, blend):
    """Buat strip bisa diulang: ekor kanan di-crossfade ke awal kiri, lalu ekor itu dibuang."""
    w, h = img.size
    head = img.crop((0, 0, blend, h))
    tail = img.crop((w - blend, 0, w, h))
    mask = Image.linear_gradient('L').rotate(90, expand=True).resize((blend, h))  # 255 kiri → 0 kanan
    mixed = Image.composite(tail, head, mask)  # x=0: ekor (lanjutan ujung kanan), x=blend: awal asli
    out = img.crop((0, 0, w - blend, h))
    out.paste(mixed, (0, 0))
    return out


def save(img, name):
    path = OUT / f'{name}.webp'
    img.save(path, 'WEBP', quality=QUALITY, method=4)
    return path


def build(preview_dir=None):
    OUT.mkdir(parents=True, exist_ok=True)
    kit = {'_generated': 'art-source/tools/build_chapter1_kit.py (jangan diedit manual)', 'pieces': {}, 'strips': {}}
    thumbs = []
    for name, (src, box, scale, surface) in PIECES.items():
        img, top_trim = cut_piece(src, box)
        res = min(1.0, scale * RES)
        tex = img.resize((max(1, round(img.width * res)), max(1, round(img.height * res))), Image.LANCZOS)
        save(tex, name)
        entry = {
            'url': f'{URL_PREFIX}/{name}.webp',
            'texW': tex.width, 'texH': tex.height,
            'scale': round(scale * img.width / tex.width, 5),  # px dunia per px tekstur
            'w': round(img.width * scale, 1), 'h': round(img.height * scale, 1),
        }
        if surface is not None:
            # Baris permukaan relatif potongan (setelah trim alpha), dalam px dunia dari atas gambar.
            entry['surface'] = round((surface - top_trim) * scale, 1)
        kit['pieces'][name] = entry
        thumbs.append((name, tex, entry))

    for name, (src, rows, blend, scale) in STRIPS.items():
        img = Image.open(SRC / src).convert('RGBA')
        img = img.crop((0, rows[0], img.width, rows[1]))
        # Kolom tepi yang hampir transparan ikut dibuang agar tidak ada celah saat diulang.
        bbox = alpha_bbox(img, 200)
        trim = round((bbox[2] - bbox[0]) * 0.02)  # tepi strip sering memudar: buang 2% tiap sisi
        img = img.crop((bbox[0] + trim, 0, bbox[2] - trim, img.height))
        top = alpha_bbox(img)[1]
        img = img.crop((0, top, img.width, img.height))
        img = mirror_tile(img) if blend == 'mirror' else seamless(img, blend)
        tex = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
        entry = {'url': f'{URL_PREFIX}/{name}.webp', 'w': tex.width, 'h': tex.height}
        if name != 'ocean':
            # TileSprite mengulang tekstur juga secara vertikal: baris bawah yang padat "bocor" sebagai
            # garis tipis di tepi atas strip. Baris transparan di bawah mencegahnya.
            padded = Image.new('RGBA', (tex.width, tex.height + STRIP_PAD))
            padded.paste(tex, (0, 0))
            tex = padded
            entry.update(h=tex.height, padBottom=STRIP_PAD)
        save(tex, name)
        kit['strips'][name] = entry
        thumbs.append((name, tex, entry))

    # Tanah menerus: ujung kiri + bagian tengah yang diulang (strip + cerminannya) + ujung kanan, dari
    # potongan yang sama sehingga permukaan dan garis bawahnya selalu satu baris.
    #   - cap-l/cap-r membawa CAP_FADE px tambahan dari sisi tengah yang memudar (alpha), sehingga
    #     sambungan dengan tile tengah larut, bukan garis tegak.
    #   - tile tengah diberi baris transparan di bawah (pengulangan vertikal TileSprite tidak bocor).
    kit['grounds'] = {}
    for name, (cap_left, cap_right) in GROUNDS.items():
        src, box, scale, surface = PIECES[name]
        img, top_trim = cut_piece(src, box)
        w, h = img.size
        mid = mirror_tile(img.crop((cap_left, 0, w - cap_right, h)))
        padded = Image.new('RGBA', (mid.width, h + STRIP_PAD))
        padded.paste(mid, (0, 0))
        parts = {
            'cap-l': fade_edge(img.crop((0, 0, cap_left + CAP_FADE, h)), 'right'),
            'mid': padded,
            'cap-r': fade_edge(img.crop((w - cap_right - CAP_FADE, 0, w, h)), 'left'),
        }
        entry = {'h': h, 'surface': round(surface - top_trim, 1), 'fade': CAP_FADE}
        for part, tex in parts.items():
            key = f'{name}-{part}'
            save(tex, key)
            entry[part] = {'url': f'{URL_PREFIX}/{key}.webp', 'w': tex.width}
        entry['mid']['w'] = mid.width
        entry['mid']['h'] = padded.height
        kit['grounds'][name] = entry
        thumbs.append((f'{name}-mid', mid, {'h': h, 'surface': entry['surface']}))

    # Isian di bawah daratan (batu + tanah) sampai dasar layar: tile yang bisa diulang ke dua arah
    # (dicerminkan horizontal dan vertikal).
    src, box, _, _ = PIECES[FILL[0]]
    body, _ = cut_piece(src, box)
    body = body.crop(FILL[1])
    body = mirror_tile(body)
    tile = Image.new('RGBA', (body.width, body.height * 2))
    tile.paste(body, (0, 0))
    tile.paste(body.transpose(Image.FLIP_TOP_BOTTOM), (0, body.height))
    tile.putalpha(255)
    # Lebih gelap dan sedikit lunak: terbaca sebagai tanah yang lebih dalam, pola cermin tidak menonjol.
    tile = Image.eval(tile.filter(ImageFilter.GaussianBlur(1.2)).convert('RGB'), lambda v: int(v * 0.72)).convert('RGBA')
    save(tile, 'ground-fill')
    kit['strips']['ground-fill'] = {'url': f'{URL_PREFIX}/ground-fill.webp', 'w': tile.width, 'h': tile.height}
    thumbs.append(('ground-fill', tile, kit['strips']['ground-fill']))

    KIT_JSON.write_text(json.dumps(kit, indent=1) + '\n')
    total = sum(p.stat().st_size for p in OUT.glob('*.webp'))
    print(f'{len(PIECES)} elemen + {len(STRIPS)} strip → {OUT.relative_to(ROOT)} ({total / 1e6:.1f} MB)')

    if preview_dir:
        write_preview(thumbs, Path(preview_dir))


def write_preview(thumbs, folder):
    folder.mkdir(parents=True, exist_ok=True)
    cell, cols = 230, 7
    rows = (len(thumbs) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * cell, rows * (cell + 18)), (205, 205, 210))
    draw = ImageDraw.Draw(sheet)
    for i, (name, tex, entry) in enumerate(thumbs):
        img = tex.copy()
        img.thumbnail((cell - 8, cell - 8))
        x, y = (i % cols) * cell, (i // cols) * (cell + 18)
        sheet.paste(img, (x + 4, y + 4), img)
        if 'surface' in entry:
            sy = y + 4 + entry['surface'] / entry['h'] * img.height
            draw.line((x + 4, sy, x + 4 + img.width, sy), fill=(255, 0, 0), width=2)
        draw.text((x + 4, y + cell), name, fill=(0, 0, 0), font_size=13)
    sheet.save(folder / 'kit-preview.jpg', quality=80)
    print('pratinjau:', folder / 'kit-preview.jpg')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--preview', help='folder untuk lembar pratinjau kit')
    build(parser.parse_args().preview)
