#!/usr/bin/env python3
"""Keep article images in the repo at a sensible size.

WordPress originals can be 5000px+ and several MB. Articles show images at most 676px wide in the
reading column (1352px at 2x), so anything wider than 2000px is scaled down to 2000px and saved
again at high quality. Astro still makes the small versions at build time. Tiles are left alone.

  python3 scripts/shrink-article-images.py
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
MAX = 2000

for path in sorted((ROOT / 'src/assets/articles').glob('*/*')):
    if path.name == 'tile.png' or path.suffix.lower() not in {'.jpg', '.jpeg', '.png', '.webp'}:
        continue
    before = path.stat().st_size
    with Image.open(path) as im:
        im.load()
        if im.width <= MAX and before < 600_000:
            continue
        if im.width > MAX:
            im = im.resize((MAX, round(im.height * MAX / im.width)), Image.LANCZOS)
        fmt = {'.jpg': 'JPEG', '.jpeg': 'JPEG', '.png': 'PNG', '.webp': 'WEBP'}[path.suffix.lower()]
        if fmt == 'JPEG':
            im.convert('RGB').save(path, fmt, quality=86, optimize=True, progressive=True)
        elif fmt == 'WEBP':
            im.save(path, fmt, quality=86, method=6)
        else:
            im.save(path, fmt, optimize=True)
    after = path.stat().st_size
    print(f'{path.parent.name}/{path.name}: {before // 1024}KB -> {after // 1024}KB')
