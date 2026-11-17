# Draws the images the Web Stories need: one background per theme (720x1280), one poster per story (640x853, 3:4) and the 96x96 logo.
# Run: python3 scripts/stories/makeImages.py   (needs Pillow). The images are saved in public/stories/img and committed.
import json, glob, os, random
from PIL import Image, ImageDraw, ImageFont

OUT = 'public/stories/img'
os.makedirs(OUT, exist_ok=True)
THEMES = {  # top colour, bottom colour (Aurenstar blues and pink, darker at the bottom so white text reads well)
    'fire': ((231, 53, 120), (92, 24, 70)),
    'earth': ((47, 120, 100), (16, 52, 56)),
    'air': ((91, 163, 232), (23, 54, 111)),
    'water': ((57, 130, 200), (14, 34, 80)),
    'night': ((23, 54, 111), (8, 17, 46)),
}
FONT = '/usr/share/fonts/opentype/inter/Inter-Bold.otf'

def gradient(w, h, top, bot, seed):
    im = Image.new('RGB', (w, h))
    d = ImageDraw.Draw(im)
    for y in range(h):
        t = y / (h - 1)
        d.line([(0, y), (w, y)], fill=tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3)))
    rnd = random.Random(seed)
    for _ in range(70):  # small stars
        x, y, r = rnd.randint(0, w), rnd.randint(0, h), rnd.choice([1, 1, 2, 2, 3])
        a = rnd.randint(90, 200)
        d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 255, 255, a) if False else (min(255, 150 + a // 2),) * 3)
    return im

for name, (top, bot) in THEMES.items():
    gradient(720, 1280, top, bot, name).save(f'{OUT}/bg-{name}.webp', quality=78)

def wrap(draw, text, font, width):
    lines, cur = [], ''
    for w in text.split():
        t = (cur + ' ' + w).strip()
        if draw.textlength(t, font=font) <= width: cur = t
        else: lines.append(cur); cur = w
    return lines + [cur]

for f in sorted(glob.glob('data/stories/*/*.json')):
    s = json.load(open(f, encoding='utf-8'))
    top, bot = THEMES[s['theme']]
    im = gradient(640, 853, top, bot, s['slug'])
    d = ImageDraw.Draw(im)
    small, big = ImageFont.truetype(FONT, 22), ImageFont.truetype(FONT, 54)
    d.text((48, 52), 'AURENSTAR', font=small, fill=(255, 255, 255))
    lines = wrap(d, s['title'], big, 544)
    y = 853 // 2 - len(lines) * 36
    for ln in lines:
        d.text((48, y), ln, font=big, fill=(255, 255, 255)); y += 68
    im.save(f"{OUT}/poster-{s['lang']}-{s['slug']}.webp", quality=80)

Image.open('public/aurenstar-mark.png').convert('RGBA').resize((96, 96), Image.LANCZOS).save(f'{OUT}/logo-96.png')
print('images done')
