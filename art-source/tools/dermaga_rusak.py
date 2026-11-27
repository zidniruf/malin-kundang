"""Area 3 (Dermaga Rusak): 3 lubang dermaga yang bisa dilompati, dibuat dari gambar aslinya sendiri.

Koordinat = piksel asli area-03-dermaga-rusak.png (1280x720, sebelum geser vertikal).
Lebar lubang menyesuaikan lompatan Malin (maks. ~200 px asli), bukan 270/570/430 dari brief
(disetujui pemilik proyek): perbandingan kecil-besar-sedang tetap dipertahankan.

  Lubang 1  x 340-437  dek atas kiri: papan, pagar tali, tiang penyangga, peti kecil dihapus.
  Lubang 2  x 597-825  celah tunggul yang sudah ada di lukisan; tepi kiri dibuat patah.
            Pijakan di tengahnya = tunggul-tunggul tiang (tunggul lebar x 735-778).
  Lubang 3  x 930-1100 dek kanan (di x 1100 peta beralih ke dek Area 4 yang lebih rendah): papan, tong, peti, bubu dihapus; tiang rangka jemuran tetap
            berdiri dari air sehingga kain & keranjang gantung tidak melayang.

Isi lubang = air dari baris yang SAMA di Area 3 (tekstur, gelombang, perspektif sama), warnanya
disamakan per baris dengan air di sekitar lubang. Tepi dek bergerigi per papan, satu papan
menggantung miring ke air di tiap lubang, dan beberapa tiang patah dibiarkan mencuat.
"""
import math
import random

from PIL import Image, ImageDraw, ImageFilter

HORIZON = 323  # baris pertama air di Area 3 (asli)

HOLES = [
    {'id': 1, 'x0': 340, 'x1': 437, 'top': 374, 'bottom': 508,
     'deck': (390, 428),          # permukaan + balok depan dek (untuk tepi bergerigi)
     # tiang pagar (di atas tiang depan) & tiang rangka jaring (di atas tiang penyangga)
     'keep': [(364, 380, 0, 398), (362, 381, 398, 508), (404, 416, 0, 400), (412, 424, 400, 508)],
     'protect': [(430, 452, 460, 520)],   # (x0, y0, x1, y1) batu di kanan bawah tetap utuh
     'plank': {'side': 'right', 'angle': 30}},
    {'id': 2, 'x0': 597, 'x1': 825, 'existing': True, 'top': 386, 'bottom': 430,
     'deck': (390, 428), 'edge_only': (572, 600),
     'plank': {'side': 'left', 'angle': -34}},
    {'id': 3, 'x0': 930, 'x1': 1112, 'cut_at': 1100, 'top': 318, 'bottom': 508,
     'deck': (372, 412),
     # tiang rangka jemuran + sisa dek kecil di atas tiang penyangga di bawahnya
     'keep': [(959, 970, 0, 380), (941, 971, 372, 412), (942, 956, 412, 508),
              (1078, 1089, 0, 380), (1076, 1101, 372, 412), (1089, 1101, 412, 508)],
     'stumps': [(1003, 1021, 446)],                       # tiang depan patah, sisa di air
     'protect': [(840, 438, 962, 520)],                   # batu berlumut di kiri bawah tetap utuh
     'plank': {'side': 'left', 'angle': -30}},
]

# Pijakan dek dan tunggul (asli, sebelum geser): (x0, x1, y_atas)
PLATFORMS = [(330, 340, 405), (437, 597, 405), (598, 640, 439), (636, 680, 416), (690, 735, 404),
             (735, 778, 380), (825, 930, 395)]


def is_water(p):
    """Air terbuka yang terang (bukan bayangan bawah dek / tiang gelap)."""
    r, g, b = p
    return b > r + 50 and g > r + 30 and g > 135 and b > 160


def hole_mask(image, hole, rng):
    """Mask L (255 = diganti air) untuk satu lubang, dengan tepi papan bergerigi."""
    size = image.size
    w, h = size
    keep_boxes = []
    mask = Image.new('L', size, 0)
    draw = ImageDraw.Draw(mask)
    if hole.get('existing'):
        # lubang 2 sudah ada: hanya ujung dek kiri yang dipatahkan
        x0, x1 = hole['edge_only']
        y0, y1 = hole['deck']
        for y in range(y0 - 6, y1 + 2, 4):
            cut = x1 - rng.randint(4, x1 - x0)
            draw.rectangle([cut, y, x1 + 3, y + 3], fill=255)
        return mask
    x0, x1, top, bottom = hole['x0'], min(hole['x1'], w), hole['top'], hole['bottom']
    draw.rectangle([x0, top, x1, bottom], fill=255)
    # tepi bergerigi: tiap pita papan (4 px) berhenti di posisi acak
    dy0, dy1 = hole['deck']
    for y in range(dy0 - 8, dy1 + 4, 4):
        left = x0 - rng.randint(0, 16)
        draw.rectangle([left, y, x0, y + 3], fill=255)
        if not hole.get('cut_at'):
            right = x1 + rng.randint(0, 16)
            draw.rectangle([x1, y, right, y + 3], fill=255)
    for kx0, kx1, ky0, ky1 in hole.get('keep', []):
        draw.rectangle([kx0, ky0, kx1, ky1], fill=0)
        keep_boxes.append((kx0, max(ky0, top), kx1, ky1))
    for sx0, sx1, stop in hole.get('stumps', []):
        # tiang patah: puncak miring tidak rata
        pts = [(sx0, bottom)]
        for i, x in enumerate(range(sx0, sx1 + 1, 3)):
            pts.append((x, stop + rng.randint(-6, 6) + i))
        pts.append((sx1, bottom))
        draw.polygon(pts, fill=0)
    for box in hole.get('protect', []):
        draw.rectangle(box, fill=0)
    # di dalam strip tiang yang dipertahankan, air (bayangan bawah dek) tetap diganti air terang
    px, mp = image.load(), mask.load()
    for kx0, ky0, kx1, ky1 in keep_boxes:
        for y in range(ky0, ky1 + 1):
            for x in range(kx0, kx1 + 1):
                if y >= HORIZON and is_water(px[x, y]):
                    mp[x, y] = 255
    return mask


def water_fill(image, mask, rng):
    """Isi piksel mask dengan air dari baris yang sama (pita 6 baris, sumber = jendela air bersih
    terpanjang di pita itu), lalu samakan rata-rata warna per baris dengan air di sekitar lubang."""
    w, h = image.size
    src = image.load()
    m = mask.load()
    water = [[False] * w for _ in range(h)]
    for y in range(HORIZON, h):
        row = water[y]
        for x in range(w):
            row[x] = m[x, y] == 0 and is_water(src[x, y])
    out = image.copy()
    dst = out.load()
    ys = [y for y in range(HORIZON, h) if any(m[x, y] for x in range(0, w, 2))]
    if not ys:
        return out
    xs_by_row = {y: [x for x in range(w) if m[x, y]] for y in ys}
    def longest_run(rows):
        best, run_start, run = (0, 0), 0, 0
        for x in range(w):
            if all(water[y][x] for y in rows):
                if run == 0:
                    run_start = x
                run += 1
                if run > best[1]:
                    best = (run_start, run)
            else:
                run = 0
        return best

    band = 6
    for b0 in range(ys[0], ys[-1] + 1, band):
        rows = list(range(b0, min(h, b0 + band)))
        shared = longest_run(rows)
        offset = rng.randint(0, 997)
        for y in rows:
            targets = xs_by_row.get(y)
            if not targets:
                continue
            # sumber: jendela bersama pita (tekstur koheren); kalau terlalu pendek, run baris ini
            start, length = shared if shared[1] >= 24 else longest_run([y])
            if length < 4:
                continue
            near = [src[x, y] for x in range(max(0, targets[0] - 220), min(w, targets[-1] + 220), 2) if water[y][x]]
            pool = [src[start + i, y] for i in range(length)]
            if near:
                tm = [sum(p[c] for p in near) / len(near) for c in range(3)]
                sm = [sum(p[c] for p in pool) / len(pool) for c in range(3)]
                shift = [tm[c] - sm[c] for c in range(3)]
            else:
                shift = [0, 0, 0]
            for x in targets:
                k = (x + offset) % (2 * length)
                k = k if k < length else 2 * length - 1 - k  # cermin agar tidak ada sambungan
                p = pool[k]
                dst[x, y] = tuple(max(0, min(255, int(p[c] + shift[c] + 0.5))) for c in range(3))
    soft = mask.filter(ImageFilter.GaussianBlur(1.2))
    # tepi bawah lubang memudar ke air asli (pantulan tiang lama ikut memudar, tanpa garis)
    fade = Image.new('L', mask.size, 255)
    fd = ImageDraw.Draw(fade)
    for hole in HOLES:
        if hole.get('existing'):
            continue
        b = hole['bottom']
        for i in range(24):
            fd.line([(hole['x0'] - 20, b - i), (min(w, hole['x1'] + 20), b - i)], fill=round(255 * (i + 0.5) / 24))
    from PIL import ImageChops
    soft = ImageChops.multiply(soft, fade)
    return Image.composite(out, image, soft)


def broken_plank(image, rng):
    """Satu papan dek (diambil dari dek atas asli) dengan ujung patah, RGBA."""
    board = image.crop((470, 393, 560, 404)).convert('RGBA')
    alpha = Image.new('L', board.size, 255)
    draw = ImageDraw.Draw(alpha)
    # ujung patah bergerigi
    for y in range(0, board.height, 2):
        draw.rectangle([board.width - rng.randint(2, 14), y, board.width, y + 1], fill=0)
    board.putalpha(alpha)
    return board


def add_hanging_planks(image, rng):
    out = image.convert('RGBA')
    for hole in HOLES:
        spec = hole.get('plank')
        if not spec:
            continue
        plank = broken_plank(image, rng)
        if spec['side'] == 'left':
            plank = plank.transpose(Image.FLIP_LEFT_RIGHT)
        rotated = plank.rotate(spec['angle'], resample=Image.BICUBIC, expand=True)
        y_deck = hole['deck'][0] + 4
        if spec['side'] == 'right':
            # tergantung di ujung dek kanan lubang, ujung patahnya turun ke kiri (ke air)
            x = hole['x1'] - rotated.width + 6
        else:
            # tergantung di ujung dek kiri lubang, ujung patahnya turun ke kanan
            x = hole['x0'] - 6
        out.alpha_composite(rotated, (x, y_deck - 3))
    return out.convert('RGB')


def carve_holes(image):
    rng = random.Random(1203)
    mask = Image.new('L', image.size, 0)
    for hole in HOLES:
        mask.paste(255, mask=hole_mask(image, hole, rng))
    filled = water_fill(image, mask, rng)
    return add_hanging_planks(filled, rng)
