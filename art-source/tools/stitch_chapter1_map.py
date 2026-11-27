"""Gabungkan 6 background area Chapter 1 menjadi satu peta panjang (tinggi 720, PNG lossless).

Jalankan dari root proyek:
    python3 art-source/tools/stitch_chapter1_map.py [--out DIR]

Hanya memakai Pillow (tanpa dependensi baru). Langkah:
  1. Siapkan area: Area 6 = pemandangan + dermaga depan lurus (keputusan hibrida sebelumnya),
     Area 4 dipotong mulai x=380 (bagian kiri = lukisan latar Chapter 1 lama), Area 3 diberi
     3 lubang dermaga (lihat HOLES).
  2. Tiap area digeser vertikal utuh (tanpa skala) agar papan dermaga di satu garis lantai;
     baris kosong di tepi atas/bawah diisi cerminan baris tepi (langit/air).
  3. Tiap sambungan: zona overlap 200-400 px (dipilih otomatis dengan biaya potong terkecil),
     koreksi warna per baris di zona, potongan graph-cut (jalur biaya minimum lewat piksel yang
     mirip di kedua gambar) lalu gradasi smoothstep sempit di sepanjang jalur.
  4. Tulis map_full.png, map_bagian_1..3.png, map_data.json, preview_sambungan.png + cek.
"""
import argparse
import json
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'art-source/chapter-1/backgrounds'
H = 720
FLOOR = 481  # garis pijakan bersama (= Area 1 asli, area intro tidak bergeser)
CANDIDATE_OVERLAPS = (240, 300, 360)
EDGE_KEEP = 60     # jalur potong tidak boleh lebih dekat dari ini ke tepi zona (ruang gradasi warna)
SEAM_FEATHER = 16  # lebar gradasi smoothstep di sepanjang jalur potong (sempit = tanpa ghosting)

AREAS = [
    {'id': 'area-01-rumah-malin', 'name': 'Rumah Malin', 'feet': 481},
    {'id': 'area-02-dermaga-nelayan', 'name': 'Dermaga Nelayan', 'feet': 471, 'canopy': (440, 135)},
    {'id': 'area-03-dermaga-rusak', 'name': 'Dermaga Rusak', 'feet': 446, 'canopy': (440, 150)},
    {'id': 'area-04-jalan-kampung', 'name': 'Jalan Kampung', 'feet': 509, 'crop': (380, 2160)},
    {'id': 'area-05-pasar-ikan', 'name': 'Pasar Ikan', 'feet': 490, 'canopy': (440, 140)},
    {'id': 'area-06-pelabuhan', 'name': 'Pelabuhan', 'feet': 474, 'canopy': (460, 270)},
]


# Batasan jalur potong per sambungan (nomor = area kanan, 1..5), koordinat lokal zona:
# (y0, y1, x_min, x_max) -> pada baris y0..y1 jalur harus di x_min..x_max.
# 'horizon': (y garis pantai/horizon area kiri, area kanan) diukur manual di peta (dekat zona).
# Selisih > 2 px diselaraskan dengan warp vertikal HANYA di zona transisi (lihat warp_zone).
SEAMS = {
    1: {'horizon': (363, 335)},
    # A2->A3: pohon kelapa & pondok kiri Area 3 (terpotong bingkai) diganti air/dermaga Area 2
    2: {'overlap': 360, 'forced': [(150, 400, 290, 300)], 'horizon': (326, 358)},
    # A3->A4: ujung kanan lubang 3 = awal dek Area 4 (x asli Area 3 = 1100); tangga naik Area 3
    # yang keluar bingkai tidak dipakai
    3: {'overlap': 360, 'forced': [(280, 540, 176, 186)], 'jag': (446, 514, 16), 'horizon': (355, 360)},
    # A5->A6: sisa dahan, bunga/batu depan, dan perahu di kiri Area 6 diganti isi Area 5; di baris
    # air bawah dermaga gradasinya dilebarkan (tekstur air dermaga Area 6 lebih halus)
    5: {'overlap': 400, 'forced': [(0, 265, 230, 340), (470, 720, 310, 340)], 'wide': (585, 720, 90)},
}


def smooth(t):
    t = 0.0 if t < 0 else 1.0 if t > 1 else t
    return t * t * (3 - 2 * t)


# ---------------------------------------------------------------- persiapan area

def harbor(image):
    """Area 6: sama dengan world map sebelumnya (dermaga depan lurus, air, kapal)."""
    import importlib.util
    spec = importlib.util.spec_from_file_location('c1world', ROOT / 'art-source/tools/build_chapter1_world.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.harbor_layer(image)


def is_sky(p):
    r, g, b = p
    return b > 150 and b > r + 45 and b >= g


def is_cloud(p):
    return min(p) > 185


def remove_corner_canopy(image, x_max, y_max):
    """Hapus dahan pohon pojok kiri atas (motif bingkai yang batangnya terpotong tepi gambar).
    Di peta menyambung dahan itu akan melayang, jadi diganti langit: komponen piksel bukan-langit
    yang tersambung ke tepi atas/kiri dalam kotak (x_max, y_max), diisi warna langit baris itu."""
    px = image.load()
    mask = set()
    stack = [(x, 0) for x in range(x_max) if not is_sky(px[x, 0])]
    stack += [(0, y) for y in range(y_max) if not is_sky(px[0, y])]
    while stack:
        x, y = stack.pop()
        if (x, y) in mask or not (0 <= x < x_max and 0 <= y < y_max) or is_sky(px[x, y]) or is_cloud(px[x, y]):
            continue
        mask.add((x, y))
        stack += [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]
    # serpihan daun yang tidak tersambung (hijau daun: g >= r dan g > b) di pita atas dekat pojok
    for y in range(min(y_max, 150)):
        for x in range(min(image.width, x_max + 120)):
            r, g, b = px[x, y]
            if g >= r and g > b + 10:
                mask.add((x, y))
    # tepi daun anti-alias: lebarkan 2 px
    grown = set(mask)
    for x, y in mask:
        for dx in (-2, -1, 0, 1, 2):
            for dy in (-2, -1, 0, 1, 2):
                if 0 <= x + dx < image.width and 0 <= y + dy < y_max:
                    grown.add((x + dx, y + dy))
    # warna isi per baris = langit TEPAT di kanan area yang dihapus (bukan median jauh), lalu
    # dihaluskan vertikal agar tidak ada belang; derau +-1 menyamai butir langit lukisan
    rng = random.Random(7)
    raw = {}
    for y in range(y_max):
        xs = [x for x in range(image.width) if (x, y) in grown]
        if not xs:
            continue
        right = max(xs) + 1
        sample = [px[x, y] for x in range(right + 2, min(image.width, right + 40)) if is_sky(px[x, y]) and not is_cloud(px[x, y])][:12]
        if len(sample) >= 4:
            raw[y] = tuple(sum(q[c] for q in sample) / len(sample) for c in range(3))
    for y in range(y_max):
        near = [raw[k] for k in range(y - 6, y + 7) if k in raw]
        if not near:
            continue
        fill = tuple(sum(q[c] for q in near) / len(near) for c in range(3))
        for x in range(image.width):
            if (x, y) in grown:
                n = rng.randint(-1, 1)
                px[x, y] = tuple(max(0, min(255, int(fill[c] + n + 0.5))) for c in range(3))
    return image


def shift_vertical(image, dy):
    """Geser utuh dy px (positif = turun). Tepi kosong diisi cerminan baris tepi gambar."""
    if dy == 0:
        return image
    w = image.width
    out = Image.new('RGB', (w, H))
    out.paste(image, (0, dy))
    if dy > 0:
        band = image.crop((0, 0, w, dy)).transpose(Image.FLIP_TOP_BOTTOM)
        out.paste(band, (0, 0))
    else:
        band = image.crop((0, H + dy, w, H)).transpose(Image.FLIP_TOP_BOTTOM)
        out.paste(band, (0, H + dy))
    return out


def prepare():
    areas = []
    for spec in AREAS:
        image = Image.open(SRC / f"{spec['id']}.png").convert('RGB')
        if spec['id'] == 'area-06-pelabuhan':
            image = harbor(image)
        if spec['id'] == 'area-03-dermaga-rusak':
            from dermaga_rusak import carve_holes  # noqa: E402  (modul di folder yang sama)
            image = carve_holes(image)
        if 'canopy' in spec:
            image = remove_corner_canopy(image, *spec['canopy'])
        if 'crop' in spec:
            image = image.crop((spec['crop'][0], 0, spec['crop'][1], H))
        dy = FLOOR - spec['feet']
        areas.append({**spec, 'image': shift_vertical(image, dy), 'dy': dy})
    return areas


# ---------------------------------------------------------------- sambungan

def pixels(image):
    return image.tobytes(), image.width


def row_color_offsets(a, b, w):
    """Selisih warna per baris (rata-rata B - A) dari piksel yang mirip, dihaluskan vertikal."""
    raw = []
    for y in range(H):
        sums = [0, 0, 0]
        n = 0
        base = y * w * 3
        for i in range(base, base + w * 3, 6):  # tiap 2 px cukup
            da, db = a[i:i + 3], b[i:i + 3]
            if abs(da[0] - db[0]) + abs(da[1] - db[1]) + abs(da[2] - db[2]) < 110:
                sums[0] += db[0] - da[0]
                sums[1] += db[1] - da[1]
                sums[2] += db[2] - da[2]
                n += 1
        raw.append((sums, n))
    out = []
    radius = 18
    for y in range(H):
        s = [0.0, 0.0, 0.0]
        n = 0
        for k in range(max(0, y - radius), min(H, y + radius + 1)):
            (r, g, bb), c = raw[k]
            s[0] += r
            s[1] += g
            s[2] += bb
            n += c
        if n < 30:
            out.append((0.0, 0.0, 0.0))
        else:
            out.append(tuple(max(-45.0, min(45.0, v / n)) for v in s))
    return out


def corrected(data, w, offsets, sign):
    out = bytearray(data)
    for y in range(H):
        o = [sign * v / 2 for v in offsets[y]]
        base = y * w * 3
        for x in range(w):
            i = base + x * 3
            for c in range(3):
                v = out[i + c] + o[c]
                out[i + c] = 0 if v < 0 else 255 if v > 255 else int(v + 0.5)
    return out


def min_cut(a, b, w, forced=None):
    """Jalur vertikal biaya minimum (|A-B| + tekstur) dalam zona; x(y) bergeser maks 2 px/baris."""
    cost = []
    forced = forced or []
    for y in range(H):
        row = []
        rules = [r for r in forced if r[0] <= y < r[1]]
        base = y * w * 3
        below = min(H - 1, y + 1) * w * 3
        for x in range(w):
            i = base + x * 3
            j = i + 3 if x + 1 < w else i
            k = below + x * 3
            diff = abs(a[i] - b[i]) + abs(a[i + 1] - b[i + 1]) + abs(a[i + 2] - b[i + 2])
            grad = (abs(a[i] - a[j]) + abs(a[i + 1] - a[j + 1]) + abs(a[i + 2] - a[j + 2])
                    + abs(b[i] - b[j]) + abs(b[i + 1] - b[j + 1]) + abs(b[i + 2] - b[j + 2])
                    + abs(a[i] - a[k]) + abs(b[i] - b[k]))
            c = diff + 0.35 * grad
            if rules:
                if not any(x0 <= x < x1 for _, _, x0, x1 in rules):
                    c += 100000
            elif x < EDGE_KEEP or x >= w - EDGE_KEEP:
                c += 4000
            row.append(c)
        cost.append(row)
    acc = [cost[0][:]]
    back = []
    for y in range(1, H):
        prev = acc[-1]
        cur = []
        arg = []
        for x in range(w):
            best = prev[x]
            bx = x
            for dx in (-2, -1, 1, 2):
                xx = x + dx
                if 0 <= xx < w and prev[xx] + 2 * abs(dx) < best:
                    best = prev[xx] + 2 * abs(dx)
                    bx = xx
            cur.append(best + cost[y][x])
            arg.append(bx)
        acc.append(cur)
        back.append(arg)
    x = min(range(w), key=lambda i: acc[-1][i])
    total = acc[-1][x]
    path = [x]
    for y in range(H - 2, -1, -1):
        x = back[y][x]
        path.append(x)
    path.reverse()
    # haluskan jalur agar gradasinya tidak bergerigi
    smooth_path = []
    for y in range(H):
        win = path[max(0, y - 3):y + 4]
        smooth_path.append(sum(win) / len(win))
    return smooth_path, total / H


def warp_zone(zone, own, other, own_is_left):
    """Warp vertikal per kolom: garis horizon `own` bergeser mulus ke garis bersama yang berpindah
    dari horizon kiri ke kanan sepanjang zona (smoothstep). Baris 0 dan lantai (FLOOR) tetap, jadi
    papan dermaga dan semua di bawahnya tidak berubah; tepi zona yang menempel ke area sendiri = 0 warp."""
    w = zone.width
    out = zone.copy()
    h_left, h_right = (own, other) if own_is_left else (other, own)
    for x in range(w):
        target = h_left + (h_right - h_left) * smooth(x / (w - 1))
        if abs(target - own) < 0.5:
            continue
        col = zone.crop((x, 0, x + 1, H))
        t = round(target)
        top = col.crop((0, 0, 1, own)).resize((1, t), Image.BICUBIC)
        mid = col.crop((0, own, 1, FLOOR)).resize((1, FLOOR - t), Image.BICUBIC)
        out.paste(top, (x, 0))
        out.paste(mid, (x, t))
    return out


def blend_seam(left, right, overlap, forced=None, jag=None, horizon=None, wide=None):
    """Hasil zona overlap (RGB) + data sambungan."""
    za = left.crop((left.width - overlap, 0, left.width, H))
    zb = right.crop((0, 0, overlap, H))
    if horizon and abs(horizon[0] - horizon[1]) > 2:
        za = warp_zone(za, horizon[0], horizon[1], True)
        zb = warp_zone(zb, horizon[1], horizon[0], False)
    a, w = pixels(za)
    b, _ = pixels(zb)
    offsets = row_color_offsets(a, b, w)
    a_full = corrected(a, w, offsets, +1)
    b_full = corrected(b, w, offsets, -1)
    path, score = min_cut(bytes(a_full), bytes(b_full), w, forced)
    feather = [SEAM_FEATHER] * H
    if wide:
        y0, y1, fw = wide
        for y in range(y0, y1):
            feather[y] = SEAM_FEATHER + (fw - SEAM_FEATHER) * smooth((y - y0) / 25)
    if jag:
        # ujung papan patah: tiap pita papan (4 baris) berakhir di posisi acak, tepi tajam
        y0, y1, amp = jag
        rng = random.Random(311)
        for band in range(y0, y1, 4):
            off = rng.randint(0, amp)
            for y in range(band, min(y1, band + 4)):
                path[y] += off
                feather[y] = 3
    out = bytearray(w * H * 3)
    for y in range(H):
        p = path[y]
        fw = feather[y]
        oa = offsets[y]
        base = y * w * 3
        for x in range(w):
            # koreksi warna: 0 di tepi zona, penuh di jalur potong
            wa = smooth(x / max(p, 1)) if x <= p else 1.0
            wb = smooth((w - 1 - x) / max(w - 1 - p, 1)) if x >= p else 1.0
            m = smooth((x - p + fw / 2) / fw)  # bobot B
            i = base + x * 3
            for c in range(3):
                va = a[i + c] + oa[c] / 2 * wa
                vb = b[i + c] - oa[c] / 2 * wb
                v = va * (1 - m) + vb * m
                out[i + c] = 0 if v < 0 else 255 if v > 255 else int(v + 0.5)
    return Image.frombytes('RGB', (w, H), bytes(out)), path, score


def stitch(areas):
    seams = []
    pieces = []
    x = 0
    # pilih overlap tiap sambungan
    chosen = []
    for i in range(1, len(areas)):
        left, right = areas[i - 1]['image'], areas[i]['image']
        cfg = SEAMS.get(i, {})
        options = [cfg['overlap']] if 'overlap' in cfg else CANDIDATE_OVERLAPS
        best = None
        for o in options:
            zone, path, score = blend_seam(left, right, o, cfg.get('forced'), cfg.get('jag'), cfg.get('horizon'), cfg.get('wide'))
            if best is None or score < best[3]:
                best = (o, zone, path, score)
        chosen.append(best)
    # susun peta
    width = sum(a['image'].width for a in areas) - sum(c[0] for c in chosen)
    canvas = Image.new('RGB', (width, H))
    x = 0
    for i, area in enumerate(areas):
        area['x'] = x
        img = area['image']
        left_cut = chosen[i - 1][0] if i > 0 else 0
        right_cut = chosen[i][0] if i < len(chosen) else 0
        body = img.crop((left_cut, 0, img.width - right_cut, H))
        canvas.paste(body, (x + left_cut, 0))
        if i < len(chosen):
            o, zone, path, score = chosen[i]
            zx = x + img.width - o
            canvas.paste(zone, (zx, 0))
            seams.append({'x0': zx, 'x1': zx + o, 'overlap': o, 'score': round(score, 1),
                          'path': [round(zx + p, 1) for p in path]})
            x = zx
    return canvas, seams


if __name__ == '__main__':
    import sys
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    parser = argparse.ArgumentParser()
    parser.add_argument('--out', type=Path, default=ROOT / 'art-source/chapter-1/map-stitched')
    args = parser.parse_args()
    from stitch_outputs import write_all  # noqa: E402
    areas = prepare()
    canvas, seams = stitch(areas)
    write_all(canvas, areas, seams, args.out)
