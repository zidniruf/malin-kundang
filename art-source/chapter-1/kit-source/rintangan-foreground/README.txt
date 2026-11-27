Malin Kundang Chapter 1 — Rintangan dan Foreground

26 separate PNG assets extracted from the generated sprite sheet:
- 14 obstacle assets
- 12 foreground assets

All PNGs are RGBA with transparent backgrounds and have been upscaled 2x from the source artwork.
Asset filenames follow the labels in the sprite sheet.

Integration notes:
- Place obstacle sprites on the gameplay collision layer and define collision shapes separately in the game engine.
- Use foreground plants, rocks, and corner leaves as decorative layers in front of the player.
- The fg-grass-seamless strip is intended as a repeating ground-cover decoration; verify the left/right seam before shipping.
- The obstacle-pier-hole is decorative artwork; create a separate platform/collision gap in the level geometry.
