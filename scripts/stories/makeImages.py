# Draws the images the Web Stories need: one background per theme (720x1280), one cover per sign (720x1280, with the sign's symbol),
# one poster per story (640x853, 3:4) and the 96x96 logo.
# Run: python3 scripts/stories/makeImages.py   (needs Pillow). The images are saved in public/stories/img and committed.
import json, glob, os, random, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT = 'public/stories/img'
os.makedirs(OUT, exist_ok=True)
THEMES = {  # top colour, bottom colour (Aurenstar blues and pink, darker at the bottom so white text reads well)
    'fire': ((231, 53, 120), (92, 24, 70)),
    'earth': ((47, 120, 100), (16, 52, 56)),
    'air': ((91, 163, 232), (23, 54, 111)),
    'water': ((57, 130, 200), (14, 34, 80)),
    'night': ((23, 54, 111), (8, 17, 46)),
}
SIGNS = {  # key: (zodiac symbol, element theme)
    'aries': ('♈', 'fire'), 'touro': ('♉', 'earth'), 'gemeos': ('♊', 'air'), 'cancer': ('♋', 'water'),
    'leao': ('♌', 'fire'), 'virgem': ('♍', 'earth'), 'libra': ('♎', 'air'), 'escorpiao': ('♏', 'water'),
    'sagitario': ('♐', 'fire'), 'capricornio': ('♑', 'earth'), 'aquario': ('♒', 'air'), 'peixes': ('♓', 'water'),
}
FONT = '/usr/share/fonts/opentype/inter/Inter-Bold.otf'
SYMBOLS = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'

def base(w, h, top, bot, seed, rings=True):
    im = Image.new('RGB', (w, h))
    d = ImageDraw.Draw(im)
    for y in range(h):
        t = y / (h - 1)
        d.line([(0, y), (w, y)], fill=tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3)))
    im = im.convert('RGBA')
    rnd = random.Random(seed)
    ov = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    od = ImageDraw.Draw(ov)
    # a soft glow high on the page, like a rising sun or moon
    cx, cy, r = int(w * rnd.uniform(.3, .7)), int(h * .22), int(w * .55)
    od.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 255, 255, 34))
    ov = ov.filter(ImageFilter.GaussianBlur(w * .12))
    im = Image.alpha_composite(im, ov)
    if rings:  # thin orbit rings
        ov = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        od = ImageDraw.Draw(ov)
        for k, rr in enumerate((int(w * .42), int(w * .68), int(w * .95))):
            od.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], outline=(255, 255, 255, 46 - k * 10), width=2)
            a = rnd.uniform(0, 6.28); px, py = cx + rr * math.cos(a), cy + rr * math.sin(a)
            od.ellipse([px - 7, py - 7, px + 7, py + 7], fill=(255, 255, 255, 200))
        im = Image.alpha_composite(im, ov)
    d = ImageDraw.Draw(im)
    for _ in range(70):  # small stars
        x, y, rs = rnd.randint(0, w), rnd.randint(0, h), rnd.choice([1, 1, 2, 2, 3])
        a = rnd.randint(150, 250)
        d.ellipse([x - rs, y - rs, x + rs, y + rs], fill=(a, a, a, 255))
    return im

def glyph(im, ch, size, cx, cy, alpha):
    f = ImageFont.truetype(SYMBOLS, size)
    ov = Image.new('RGBA', im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    b = d.textbbox((0, 0), ch, font=f)
    d.text((cx - (b[0] + b[2]) / 2, cy - (b[1] + b[3]) / 2), ch, font=f, fill=(255, 255, 255, alpha))
    return Image.alpha_composite(im, ov)

for name, (top, bot) in THEMES.items():
    base(720, 1280, top, bot, name).convert('RGB').save(f'{OUT}/bg-{name}.webp', quality=78)

for key, (ch, theme) in SIGNS.items():
    top, bot = THEMES[theme]
    im = base(720, 1280, top, bot, 'cover-' + key)
    im = glyph(im, ch, 440, 360, 300, 215)
    im.convert('RGB').save(f'{OUT}/cover-{key}.webp', quality=80)

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
    im = base(640, 853, top, bot, s['slug'])
    if s.get('sign') in SIGNS:
        im = glyph(im, SIGNS[s['sign']][0], 330, 320, 250, 215)
    d = ImageDraw.Draw(im)
    small, big = ImageFont.truetype(FONT, 22), ImageFont.truetype(FONT, 50)
    d.text((48, 52), 'AURENSTAR', font=small, fill=(255, 255, 255))
    lines = wrap(d, s['title'], big, 544)
    y = 853 - 90 - len(lines) * 64 - 40
    for ln in lines:
        d.text((48, y), ln, font=big, fill=(255, 255, 255)); y += 64
    im.convert('RGB').save(f"{OUT}/poster-{s['lang']}-{s['slug']}.webp", quality=80)

Image.open('public/aurenstar-mark.png').convert('RGBA').resize((96, 96), Image.LANCZOS).save(f'{OUT}/logo-96.png')
print('images done')
