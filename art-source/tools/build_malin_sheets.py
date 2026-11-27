"""Bangun sprite sheet Malin dari sumber fix pack.

Jalankan dari root proyek:  python3 art-source/tools/build_malin_sheets.py

Masukan : art-source/characters/malin-gameplay-spritesheet-source.png (8x5, sel 198, tidak diubah)
Keluaran: public/assets/characters/malin/malin-gameplay-spritesheet.png (8x5, sel 280)
          public/assets/characters/malin/malin-opening-spritesheet.png  (8x3, sel 280, SEMENTARA)

Gameplay: setiap frame dibersihkan dari piksel hampir transparan, diskalakan seragam, lalu
dijangkar ulang: pusat kepala di x=140 dan pijakan kaki di y=264. Angka ini sama dengan sheet
lama (body collision 100x252 offset 90,12, skala 0.46 di LevelOneScene), sehingga scene tidak
perlu diubah dan karakter tidak bergeser antar-frame.

Opening (sementara): frame gameplay yang sama ditambah buntalan kain krem yang digambar
secara programatik di punggung, plus tali selempang di dada. Ganti dengan hasil prompt
art-source/characters/OPENING-SPRITESHEET-PROMPT.md bila sudah tersedia (layout & sel sama).
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'art-source/characters/malin-gameplay-spritesheet-source.png'
OUT_DIR = ROOT / 'public/assets/characters/malin'

SRC_CELL, SRC_COLS = 198, 8
CELL = 280
ANCHOR_X, BASELINE_Y = 140, 264
SCALE = 258 / 179  # tinggi idle sumber 179 px -> 258 px seperti sheet lama
ALPHA_NOISE = 10
SOLID = 200
HEAD_FRACTION = 0.28  # jangkar horizontal: pusat kepala (paling stabil saat berjalan)

# Baris 3 opening (farewell): melambat, berhenti, berdiri, menoleh, angkat tangan, melambai,
# turunkan tangan, berdiri. Indeks merujuk ke frame gameplay.
OPENING_FRAMES = list(range(0, 8)) + list(range(8, 16)) + [12, 15, 0, 36, 37, 38, 37, 39]


def source_frame(sheet, index):
    col, row = index % SRC_COLS, index // SRC_COLS
    frame = sheet.crop((col * SRC_CELL, row * SRC_CELL, (col + 1) * SRC_CELL, (row + 1) * SRC_CELL))
    alpha = frame.getchannel('A').point(lambda a: 0 if a < ALPHA_NOISE else a)
    frame.putalpha(alpha)
    return frame


def measure(frame):
    alpha = frame.getchannel('A')
    px = alpha.load()
    w, h = frame.size
    pts = [(x, y) for y in range(h) for x in range(w) if px[x, y] > SOLID]
    ys = [p[1] for p in pts]
    top, bottom = min(ys), max(ys)
    head = [p[0] for p in pts if p[1] <= top + HEAD_FRACTION * (bottom - top)]
    return {'anchor_x': sum(head) / len(head), 'top': top, 'bottom': bottom}


def place(frame):
    m = measure(frame)
    size = round(SRC_CELL * SCALE)
    scaled = frame.resize((size, size), Image.LANCZOS)
    dx = round(ANCHOR_X - m['anchor_x'] * SCALE)
    dy = round(BASELINE_Y - m['bottom'] * SCALE)
    cell = Image.new('RGBA', (CELL, CELL), (0, 0, 0, 0))
    cell.paste(scaled, (dx, dy), scaled)  # sel masih kosong; paste memotong offset negatif dengan aman
    return cell


def body_metrics(cell):
    alpha = cell.getchannel('A')
    px = alpha.load()
    ys = [y for y in range(CELL) if any(px[x, y] > SOLID for x in range(CELL))]
    top, bottom = min(ys), max(ys)
    height = bottom - top
    row = round(top + 0.34 * height)
    xs = [x for x in range(CELL) if px[x, row] > SOLID]
    return top, bottom, height, min(xs), max(xs)


def draw_bundle(cell):
    """Buntalan kain krem di punggung (kiri figur, karena figur menghadap kanan)."""
    import math

    top, _, height, back_x, front_x = body_metrics(cell)
    ss = 4  # supersampling agar tepi halus
    size = CELL * ss
    rx, ry = 0.15 * height, 0.125 * height
    cx, cy = back_x + 0.05 * height, top + 0.40 * height

    # bentuk karung tidak beraturan
    points = []
    for i in range(72):
        t = 2 * math.pi * i / 72
        wobble = 1 + 0.06 * math.sin(3 * t + 1.1) + 0.035 * math.sin(5 * t + 0.4)
        sag = 1.08 if math.sin(t) > 0 else 1.0  # bagian bawah sedikit menggembung
        points.append(((cx + rx * wobble * math.cos(t)) * ss, (cy + ry * wobble * sag * math.sin(t)) * ss))
    mask = Image.new('L', (size, size), 0)
    ImageDraw.Draw(mask).polygon(points, fill=255)

    base = Image.new('RGBA', (size, size), (224, 206, 168, 255))
    shade = Image.new('L', (size, size), 0)
    ImageDraw.Draw(shade).ellipse([(cx - rx * 1.2) * ss, (cy - ry * 0.1) * ss, (cx + rx * 0.4) * ss, (cy + ry * 1.6) * ss], fill=150)
    shade = shade.filter(ImageFilter.GaussianBlur(9 * ss))
    base = Image.composite(Image.new('RGBA', (size, size), (160, 133, 96, 255)), base, shade)
    light = Image.new('L', (size, size), 0)
    ImageDraw.Draw(light).ellipse([(cx - rx * 0.1) * ss, (cy - ry * 0.95) * ss, (cx + rx * 0.8) * ss, (cy - ry * 0.05) * ss], fill=170)
    light = light.filter(ImageFilter.GaussianBlur(7 * ss))
    base = Image.composite(Image.new('RGBA', (size, size), (243, 231, 202, 255)), base, light)

    folds = ImageDraw.Draw(base)
    for off, start_angle, end_angle in ((-0.35, 210, 300), (0.05, 200, 290), (0.4, 215, 285)):
        folds.arc([(cx + off * rx - 0.5 * rx) * ss, (cy - 0.2 * ry) * ss, (cx + off * rx + 0.5 * rx) * ss, (cy + 0.9 * ry) * ss],
                  start_angle, end_angle, fill=(176, 150, 112, 255), width=round(1.6 * ss))

    sack = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    sack.paste(base, (0, 0), mask)
    outline = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(outline).line(points + [points[0]], fill=(104, 80, 54, 255), width=round(1.8 * ss))
    sack.alpha_composite(outline)

    # simpul di belakang leher dengan dua ujung kain
    kx, ky = back_x + 0.13 * height, top + 0.235 * height
    knot = ImageDraw.Draw(sack)
    for tail in (((kx - 2, ky), (kx - 13, ky - 9), (kx - 9, ky + 3)), ((kx + 1, ky - 2), (kx - 4, ky - 14), (kx + 4, ky - 3))):
        knot.polygon([(x * ss, y * ss) for x, y in tail], fill=(214, 192, 150, 255), outline=(104, 80, 54, 255))
    knot.ellipse([(kx - 6) * ss, (ky - 4.5) * ss, (kx + 6) * ss, (ky + 4.5) * ss], fill=(220, 199, 158, 255), outline=(104, 80, 54, 255), width=ss)
    knot.line([(kx * ss, ky * ss), (cx * ss, (cy - ry * 0.7) * ss)], fill=(200, 176, 136, 255), width=round(3.5 * ss))
    bundle = sack.resize((CELL, CELL), Image.LANCZOS)

    # tali selempang diagonal di dada: dari bahu belakang ke pinggang depan, hanya di atas badan
    strap = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    s = ImageDraw.Draw(strap)
    start = ((back_x + 0.11 * height) * ss, (top + 0.245 * height) * ss)
    end = ((front_x - 0.01 * height) * ss, (top + 0.57 * height) * ss)
    s.line([start, end], fill=(112, 86, 58, 255), width=round(5 * ss))
    s.line([start, end], fill=(214, 192, 150, 255), width=round(3 * ss))
    strap = strap.resize((CELL, CELL), Image.LANCZOS)
    body_alpha = cell.getchannel('A').filter(ImageFilter.MinFilter(3))
    strap.putalpha(Image.composite(strap.getchannel('A'), Image.new('L', (CELL, CELL), 0), body_alpha))

    out = Image.new('RGBA', (CELL, CELL), (0, 0, 0, 0))
    out.alpha_composite(bundle)  # buntalan di belakang badan
    out.alpha_composite(cell)
    out.alpha_composite(strap)  # tali di depan badan
    return out


def build_sheet(frames, cols, rows):
    sheet = Image.new('RGBA', (cols * CELL, rows * CELL), (0, 0, 0, 0))
    for i, frame in enumerate(frames):
        sheet.alpha_composite(frame, ((i % cols) * CELL, (i // cols) * CELL))
    return sheet


def main():
    source = Image.open(SOURCE).convert('RGBA')
    gameplay = [place(source_frame(source, i)) for i in range(40)]
    build_sheet(gameplay, 8, 5).save(OUT_DIR / 'malin-gameplay-spritesheet.png', optimize=True)
    opening = [draw_bundle(gameplay[i]) for i in OPENING_FRAMES]
    build_sheet(opening, 8, 3).save(OUT_DIR / 'malin-opening-spritesheet.png', optimize=True)
    print('ok:', OUT_DIR / 'malin-gameplay-spritesheet.png', OUT_DIR / 'malin-opening-spritesheet.png')


if __name__ == '__main__':
    main()
