"""Bangun sprite sheet Ibu Malin dan 4 NPC dari paket malin-opening-mother-npc-pack.

Jalankan dari root proyek:  python3 art-source/tools/build_npc_sheets.py

Masukan : art-source/characters/npc-pack-source/*.png (4x3, sel 362, tidak diubah)
Keluaran: public/assets/characters/mother/mother-malin-spritesheet.png
          public/assets/characters/npc/npc-{anak-desa,nelayan,buruh-pelabuhan,penjual-ikan}.png
          (4x3, sel CELL_W x CELL_H, urutan frame sama dengan sumber)

Masalah sumber yang diperbaiki:
  - Karakter bergeser horizontal antar-frame (mis. idle nelayan ~60 px, idle Ibu ~48 px), sehingga
    dipakai apa adanya karakter akan meluncur saat diam.
  - Garis pijakan kaki berbeda antar-baris (mis. baris jalan Ibu ~7 px lebih tinggi dari idle).
  - Piksel hampir transparan (alpha 1-9) tersebar di area kosong.
Setiap frame dibersihkan, diskalakan seragam (OUT_SCALE, cukup tajam untuk tampilan ~120-180 px
dan jauh lebih ringan di HP), lalu dijangkar ulang: pusat kepala di ANCHOR_X dan kaki di BASELINE_Y.
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SRC_DIR = ROOT / 'art-source/characters/npc-pack-source'
OUTPUTS = {
    'mother-malin-spritesheet.png': ROOT / 'public/assets/characters/mother/mother-malin-spritesheet.png',
    'npc-anak-desa.png': ROOT / 'public/assets/characters/npc/npc-anak-desa.png',
    'npc-nelayan.png': ROOT / 'public/assets/characters/npc/npc-nelayan.png',
    'npc-buruh-pelabuhan.png': ROOT / 'public/assets/characters/npc/npc-buruh-pelabuhan.png',
    'npc-penjual-ikan.png': ROOT / 'public/assets/characters/npc/npc-penjual-ikan.png',
}

COLS, ROWS, SRC_CELL = 4, 3, 362
OUT_SCALE = 0.6
CELL_W, CELL_H = 200, 216
ANCHOR_X, BASELINE_Y = 100, 210
ALPHA_NOISE = 10
SOLID = 200
HEAD_FRACTION = 0.16  # hanya kepala: lengan yang menunjuk/melambai tidak ikut terhitung


def source_frame(sheet, index):
    col, row = index % COLS, index // COLS
    frame = sheet.crop((col * SRC_CELL, row * SRC_CELL, (col + 1) * SRC_CELL, (row + 1) * SRC_CELL))
    frame.putalpha(frame.getchannel('A').point(lambda a: 0 if a < ALPHA_NOISE else a))
    return frame


def measure(frame):
    px = frame.getchannel('A').load()
    w, h = frame.size
    pts = [(x, y) for y in range(h) for x in range(w) if px[x, y] > SOLID]
    ys = [p[1] for p in pts]
    top, bottom = min(ys), max(ys)
    head = [p[0] for p in pts if p[1] <= top + HEAD_FRACTION * (bottom - top)]
    return {'anchor_x': sum(head) / len(head), 'top': top, 'bottom': bottom,
            'left': min(p[0] for p in pts), 'right': max(p[0] for p in pts)}


def build(name):
    sheet = Image.open(SRC_DIR / name).convert('RGBA')
    out = Image.new('RGBA', (CELL_W * COLS, CELL_H * ROWS), (0, 0, 0, 0))
    report = []
    for index in range(COLS * ROWS):
        frame = source_frame(sheet, index)
        m = measure(frame)
        size = round(SRC_CELL * OUT_SCALE)
        scaled = frame.resize((size, size), Image.LANCZOS)
        dx = round(ANCHOR_X - m['anchor_x'] * OUT_SCALE)
        dy = round(BASELINE_Y - m['bottom'] * OUT_SCALE)
        # Pastikan tidak ada bagian karakter yang terpotong oleh sel keluaran.
        left, right = m['left'] * OUT_SCALE + dx, m['right'] * OUT_SCALE + dx
        top = m['top'] * OUT_SCALE + dy
        assert left >= 0 and right < CELL_W and top >= 0, (name, index, left, right, top)
        cell = Image.new('RGBA', (CELL_W, CELL_H), (0, 0, 0, 0))
        cell.paste(scaled, (dx, dy), scaled)  # sel masih kosong; offset negatif diperbolehkan
        col, row = index % COLS, index // COLS
        out.alpha_composite(cell, (col * CELL_W, row * CELL_H))
        report.append((index, round(left), round(right), round(top)))
    target = OUTPUTS[name]
    target.parent.mkdir(parents=True, exist_ok=True)
    out.save(target, optimize=True)
    return report


def verify(name):
    """Ukur ulang hasil: pusat kepala dan kaki setiap frame harus di jangkar (±1 px)."""
    sheet = Image.open(OUTPUTS[name]).convert('RGBA')
    worst_x = worst_y = 0
    for index in range(COLS * ROWS):
        col, row = index % COLS, index // COLS
        cell = sheet.crop((col * CELL_W, row * CELL_H, (col + 1) * CELL_W, (row + 1) * CELL_H))
        m = measure(cell)
        worst_x = max(worst_x, abs(m['anchor_x'] - ANCHOR_X))
        worst_y = max(worst_y, abs(m['bottom'] - BASELINE_Y))
    return worst_x, worst_y


def main():
    for name in OUTPUTS:
        build(name)
        wx, wy = verify(name)
        print(f'{name}: deviasi kepala x <= {wx:.1f} px, kaki y <= {wy:.0f} px')


if __name__ == '__main__':
    main()
