"""Keluaran + pengecekan untuk stitch_chapter1_map.py (map_full, 3 bagian, map_data.json, pratinjau)."""
import json

from PIL import Image, ImageChops, ImageDraw, ImageStat

import dermaga_rusak
from stitch_chapter1_map import FLOOR, H

MAX_W = 16384
STRIP = 20


def strip_diff(image, x):
    """Selisih warna rata-rata kolom 20 px kiri vs 20 px kanan titik x (skala 0-255)."""
    left = ImageStat.Stat(image.crop((x - STRIP, 0, x, H))).mean
    right = ImageStat.Stat(image.crop((x, 0, x + STRIP, H))).mean
    per = [abs(a - b) for a, b in zip(left, right)]
    return round(max(per), 2), round(sum(per) / 3, 2)


def path_diff(image, path):
    """Selisih rata-rata 20 px kiri vs kanan JALUR POTONG (per baris), skala 0-255."""
    px = image.load()
    tot = [0.0, 0.0, 0.0]
    for y, p in enumerate(path):
        x = int(round(p))
        for dx in range(1, STRIP + 1):
            a, b = px[x - dx, y], px[x + dx - 1, y]
            for c in range(3):
                tot[c] += a[c] - b[c]
    n = H * STRIP
    per = [abs(t / n) for t in tot]
    return round(max(per), 2)


def is_water(p):
    r, g, b = p
    return b > r + 50 and g > r + 30 and g > 135 and b > 160


def is_sky(p):
    """Langit cerah (tepi awan yang keputihan tidak termasuk)."""
    r, g, b = p
    return b > 150 and b > r + 90 and b >= g


def horizon_row(image, x0, x1):
    """Garis horizon = baris pertama air terbuka tepat di bawah daratan/gunung (bukan langit, bukan
    air) pada kolom x0..x1; median dari kolom yang batasnya bersih. None bila < 5 kolom."""
    px = image.load()
    rows = []
    for x in range(x0, x1, 2):
        for y in range(210, 470):
            if not all(is_water(px[x, y + k]) for k in range(6)):
                continue
            above = [px[x, y - k] for k in range(1, 7)]
            if all(not is_water(q) and not is_sky(q) and q[1] > q[0] for q in above):
                rows.append(y)
            break
    if len(rows) < 5:
        return None
    rows.sort()
    return rows[len(rows) // 2]


def background_diff(image, x):
    """Lompatan warna latar: per baris, hanya baris yang di KEDUA strip 20 px >= 80% langit (baris
    di atas horizon, y < 320) atau >= 80% air (di bawahnya, y > 380). Selisih rata-rata kiri-kanan per baris dirata-rata atas baris itu; hasil = kanal
    terburuk (skala 0-255). Tepi objek (tiang, atap) tidak ikut terhitung."""
    px = image.load()
    tot = [0.0, 0.0, 0.0]
    n = 0
    for y in range(H):
        left = [px[xx, y] for xx in range(x - STRIP, x)]
        right = [px[xx, y] for xx in range(x, x + STRIP)]
        tests = (is_sky,) if y < 320 else (is_water,) if y > 380 else ()
        for test in tests:
            l = [q for q in left if test(q)]
            r = [q for q in right if test(q)]
            if len(l) >= 0.8 * STRIP and len(r) >= 0.8 * STRIP:
                for c in range(3):
                    tot[c] += sum(q[c] for q in l) / len(l) - sum(q[c] for q in r) / len(r)
                n += 1
                break
    if n < 40:
        return None
    return round(max(abs(t / n) for t in tot), 2)


def hole_texture(image, x0, x1, y0, y1, ref_x0, ref_x1):
    """Bandingkan air di lubang dengan air di sekitarnya pada baris yang sama:
    selisih rata-rata kecerahan per baris dan rasio deviasi (tekstur)."""
    px = image.load()
    dmean, ratio = [], []
    for y in range(y0, y1):
        inside = [sum(px[x, y]) / 3 for x in range(x0, x1) if is_water(px[x, y])]
        around = [sum(px[x, y]) / 3 for x in list(range(ref_x0, x0 - 4)) + list(range(x1 + 4, ref_x1)) if is_water(px[x, y])]
        if len(inside) < 10 or len(around) < 10:
            continue
        mi, ma = sum(inside) / len(inside), sum(around) / len(around)
        si = (sum((v - mi) ** 2 for v in inside) / len(inside)) ** 0.5
        sa = (sum((v - ma) ** 2 for v in around) / len(around)) ** 0.5
        dmean.append(abs(mi - ma))
        ratio.append(si / sa if sa else 1)
    return round(sum(dmean) / len(dmean), 2), round(sum(ratio) / len(ratio), 2), len(dmean)


def bottom_edge_step(image, x0, x1, y):
    """Lompatan kecerahan rata-rata melintasi baris y (batas bawah isian air) dibanding
    lompatan antar-baris biasa di sekitarnya (y-8 dan y+8). Rasio ~1 = tidak ada garis."""
    px = image.load()
    def step(yy):
        return sum(abs(sum(px[x, yy]) - sum(px[x, yy - 1])) / 3 for x in range(x0, x1)) / (x1 - x0)
    ref = (step(y - 8) + step(y + 8)) / 2
    return round(step(y), 2), round(ref, 2)


def write_all(canvas, areas, seams, out_dir):
    out_dir.mkdir(parents=True, exist_ok=True)
    W = canvas.width
    canvas.save(out_dir / 'map_full.png')

    centers = [round((s['x0'] + s['x1']) / 2) for s in seams]
    cuts = [0, centers[1], centers[3], W]  # bagian 1 = A1+A2, 2 = A3+A4, 3 = A5+A6
    parts = []
    for i in range(3):
        part = canvas.crop((cuts[i], 0, cuts[i + 1], H))
        name = f'map_bagian_{i + 1}.png'
        part.save(out_dir / name)
        parts.append({'file': name, 'lebar': part.width, 'tinggi': part.height, 'x_di_peta_gabungan': cuts[i]})

    # ---------------- data
    bounds = [0] + centers + [W]
    a3 = areas[2]
    def a3x(x):
        return a3['x'] + x
    def a3y(y):
        return y + a3['dy']
    floor_row = FLOOR
    hole3_end = round(seams[2]['path'][floor_row - 20])  # awal dek Area 4 pada baris papan
    holes = []
    for hole in dermaga_rusak.HOLES:
        x0 = a3x(hole['x0'])
        x1 = hole3_end if hole.get('cut_at') else a3x(hole['x1'])
        holes.append({'id': hole['id'], 'x_mulai': x0, 'x_akhir': x1, 'lebar': x1 - x0, 'tipe': 'jatuh_ke_air'})
    stumps = [p for p in dermaga_rusak.PLATFORMS if 597 <= p[0] < 825]
    widest = max(stumps, key=lambda p: p[1] - p[0])
    area_entries = []
    for i, area in enumerate(areas):
        entry = {'id': i + 1, 'nama': area['name'], 'sumber': f"{area['id']}.png",
                 'x_mulai': bounds[i], 'x_akhir': bounds[i + 1], 'ground_y': FLOOR,
                 'geser_vertikal_px': area['dy']}
        if 'crop' in area:
            entry['crop_sumber_x'] = list(area['crop'])
        area_entries.append(entry)
    area_entries[0]['catatan'] = 'Halaman rumah (jalan setapak) sedikit lebih tinggi: y 448, x 170-480.'
    area_entries[2]['ground_y'] = a3y(405)
    area_entries[2]['catatan'] = ('Dermaga bertingkat: jalan naik dari dek Area 2 (y 481) ke dek atas (y 440); '
                                  'dek kanan y 430; lihat dermaga_rusak.pijakan.')
    data = {
        'peta': 'Chapter 1 - Kampung Nelayan (6 area digabung)',
        'dibuat_oleh': 'art-source/tools/stitch_chapter1_map.py (jangan edit manual)',
        'tinggi': H,
        'lebar_total': W,
        'cara_menyambung': 'Letakkan bagian 1, 2, 3 berurutan pada x_di_peta_gabungan; hasilnya identik piksel-per-piksel dengan map_full.png.',
        'catatan_koordinat': 'Semua x/y dalam piksel peta gabungan (asli, tanpa skala). ground_y = permukaan papan tempat kaki karakter berdiri.',
        'bagian': parts,
        'area': area_entries,
        'sambungan': [{'antara': [i + 1, i + 2], 'zona_x': [s['x0'], s['x1']], 'overlap': s['overlap'],
                       'titik_tengah_x': centers[i]} for i, s in enumerate(seams)],
        'dermaga_rusak': {
            'lubang': holes,
            'pijakan_di_lubang_2': [{'x_mulai': a3x(p[0]), 'x_akhir': a3x(p[1]), 'y_atas': a3y(p[2]), 'tipe': 'tunggul_tiang'}
                                    for p in stumps],
            'pijakan_utama_lubang_2': {'x_mulai': a3x(widest[0]), 'x_akhir': a3x(widest[1]), 'y_atas': a3y(widest[2])},
            'pijakan': [{'x_mulai': a3x(p[0]), 'x_akhir': a3x(p[1]), 'y_atas': a3y(p[2])}
                        for p in dermaga_rusak.PLATFORMS if p not in stumps],
            'dek_sesudah_lubang_3': {'x_mulai': hole3_end, 'y_atas': FLOOR},
            'air_y': a3y(500),
        },
    }
    (out_dir / 'map_data.json').write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')

    # ---------------- pratinjau sambungan (100%, 1280x720 per titik)
    rejoined = Image.new('RGB', (W, H))
    for p in parts:
        rejoined.paste(Image.open(out_dir / p['file']), (p['x_di_peta_gabungan'], 0))
    points = [(f'Sambungan {i + 1}: {areas[i]["name"]} -> {areas[i + 1]["name"]}', c, canvas) for i, c in enumerate(centers)]
    points += [(f'Sambungan file: map_bagian_{k + 1} | map_bagian_{k + 2} (dari file yang disusun ulang)', cuts[k + 1], rejoined)
               for k in range(2)]
    label_h = 34
    sheet = Image.new('RGB', (1280, len(points) * (H + label_h)), (24, 24, 24))
    draw = ImageDraw.Draw(sheet)
    for i, (label, c, src) in enumerate(points):
        left = max(0, min(W - 1280, c - 640))
        y = i * (H + label_h)
        draw.text((12, y + 10), f'{label}   (x peta {left}-{left + 1280}, titik sambung x={c})', fill=(255, 255, 255))
        sheet.paste(src.crop((left, 0, left + 1280, H)), (0, y + label_h))
    sheet.save(out_dir / 'preview_sambungan.png')

    # ---------------- pengecekan
    report = {'ukuran_file': [], 'sambungan': [], 'lubang': []}
    for p in parts + [{'file': 'map_full.png', 'lebar': W, 'tinggi': H}]:
        report['ukuran_file'].append({**{k: p[k] for k in ('file', 'lebar', 'tinggi')},
                                      'tinggi_720': p['tinggi'] == H, 'lebar_di_bawah_16384': p['lebar'] < MAX_W})
    diff = ImageChops.difference(rejoined, canvas)
    report['gabung_ulang_vs_map_full'] = {'piksel_berbeda': sum(1 for v in diff.convert('L').getdata() if v),
                                          'bbox_selisih': diff.getbbox()}
    for i, s in enumerate(seams):
        a_side = horizon_row(canvas, s['x0'] - 70, s['x0'] - 10)
        b_side = horizon_row(canvas, s['x1'] + 10, s['x1'] + 70)
        mx, mean = strip_diff(canvas, centers[i])
        report['sambungan'].append({
            'sambungan': i + 1, 'titik_x': centers[i],
            'selisih_warna_kolom_20px_maks_kanal': mx, 'selisih_warna_rata_rata': mean,
            'selisih_warna_latar_langit_air': background_diff(canvas, centers[i]),
            'selisih_warna_di_jalur_potong': path_diff(canvas, s['path']),
            'horizon_y_kiri': a_side, 'horizon_y_kanan': b_side,
            'selisih_horizon_px': None if a_side is None or b_side is None else abs(a_side - b_side),
        })
    for k in range(2):
        mx, mean = strip_diff(rejoined, cuts[k + 1])
        report['sambungan'].append({'sambungan': f'file {k + 1}|{k + 2}', 'titik_x': cuts[k + 1],
                                    'selisih_warna_kolom_20px_maks_kanal': mx, 'selisih_warna_rata_rata': mean,
                                    'selisih_warna_latar_langit_air': background_diff(rejoined, cuts[k + 1])})
    for hole, info in zip(dermaga_rusak.HOLES, holes):
        if hole.get('existing'):
            continue
        y0, y1 = a3y(hole['top'] + 10), a3y(hole['bottom'] - 26)
        dmean, ratio, rows = hole_texture(canvas, info['x_mulai'] + 4, info['x_akhir'] - 4, y0, y1,
                                          info['x_mulai'] - 260, info['x_akhir'] + 260)
        edge = [bottom_edge_step(canvas, info['x_mulai'] + 4, info['x_akhir'] - 4, a3y(yy))
                for yy in (hole['bottom'] - 24, hole['bottom'])]
        report['lubang'].append({'lubang': hole['id'], 'baris_diukur': rows,
                                 'selisih_kecerahan_per_baris': dmean, 'rasio_tekstur_dalam_vs_sekitar': ratio,
                                 'batas_bawah_lompatan_vs_baris_biasa': edge})
    (out_dir / 'cek_hasil.json').write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps(report, indent=1, ensure_ascii=False))
    return report
