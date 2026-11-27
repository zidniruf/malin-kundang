"""Bangun background Chapter 1 yang diperpanjang ke bawah.

Jalankan dari root proyek:  python3 art-source/tools/build_level1_background.py

Masukan : art-source/level-1/kampung-tropis-cerah.png (2172x724)
Keluaran: public/assets/backgrounds/level-1/l1-dermaga-tall.png (1280x849)

Potongan dan skala sama dengan l1-dermaga.png (crop x 430-1522, skala 1280/1092), sehingga
720 px teratas identik dan papan dermaga tetap di y=600 (lantai collision). Bedanya, potongan
diteruskan sampai dasar sumber (y=724): 129 px air dan tiang dermaga di bawah lantai. Ruang ini
dipakai kamera agar gameplay memenuhi layar yang lebih tinggi dari 16:9 tanpa stretch atau blur.
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'art-source/level-1/kampung-tropis-cerah.png'
TARGET = ROOT / 'public/assets/backgrounds/level-1/l1-dermaga-tall.png'
CROP = (430, 0, 1522, 724)
WIDTH = 1280


def main():
    source = Image.open(SOURCE).convert('RGB')
    crop = source.crop(CROP)
    height = round(crop.height * WIDTH / crop.width)
    crop.resize((WIDTH, height), Image.LANCZOS).save(TARGET, optimize=True)
    print(f'{TARGET.relative_to(ROOT)}: {WIDTH}x{height}')


if __name__ == '__main__':
    main()
