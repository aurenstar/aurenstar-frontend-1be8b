# Turns every Web Story into pictures for social networks (does NOT post anything):
#   Instagram / Reels stories: 1080x1920, one picture per screen   -> OUT/instagram-<lang>/<slug>/NN.jpg
#   Pinterest pins:            1000x1500, one cover per story       -> OUT/pinterest/<lang>-<slug>.jpg
# Run: python3 scripts/stories/makeSocial.py /tmp/social   (needs Pillow; reuses the images from makeImages.py)
import json, glob, os, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT = sys.argv[1] if len(sys.argv) > 1 else '/tmp/social'
IMG = 'public/stories/img'
F = '/usr/share/fonts/opentype/inter/'
bold = lambda n: ImageFont.truetype(F + 'Inter-Bold.otf', n)
reg = lambda n: ImageFont.truetype(F + 'Inter-Regular.otf', n)
FOOT = {'pt': 'aurenstar.com', 'en': 'aurenstar.com'}

def wrap(d, text, font, width):
    lines, cur = [], ''
    for w in text.split():
        t = (cur + ' ' + w).strip()
        if d.textlength(t, font=font) <= width: cur = t
        else: lines.append(cur); cur = w
    return lines + [cur]

def bg(name, size):
    return Image.open(f'{IMG}/{name}.webp').convert('RGB').resize(size, Image.LANCZOS)

BLUE, PINK, NAVY, SOFT = (57, 130, 200), (231, 53, 120), (23, 43, 77), (100, 125, 165)

def card(im, box):
    # white rounded card with a soft shadow, like the site
    im = im.convert('RGBA')
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0))
    x0, y0, x1, y1 = box
    ImageDraw.Draw(sh).rounded_rectangle((x0, y0 + 14, x1, y1 + 14), radius=56, fill=(23, 54, 111, 70))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(18)))
    ov = Image.new('RGBA', im.size, (0, 0, 0, 0))
    ImageDraw.Draw(ov).rounded_rectangle(box, radius=56, fill=(255, 255, 255, 243), outline=(217, 232, 248, 255), width=2)
    return Image.alpha_composite(im, ov)

def logo(im, x=60, y=70, h=84):
    # the colored logo on a white pill, top left
    lg = Image.open('public/logo-aurenstar.webp').convert('RGBA')
    lg = lg.resize((int(lg.width * h / lg.height), h), Image.LANCZOS)
    pill = Image.new('RGBA', im.size, (0, 0, 0, 0))
    ImageDraw.Draw(pill).rounded_rectangle((x, y, x + lg.width + 56, y + h + 28), radius=70, fill=(255, 255, 255, 245))
    im = Image.alpha_composite(im.convert('RGBA'), pill)
    im.alpha_composite(lg, (x + 28, y + 14))
    return im


def text_block(im, x, y, w, kicker, title, text, text_color=NAVY):
    d = ImageDraw.Draw(im)
    if kicker:
        kf = bold(30); kw = d.textlength(kicker.upper(), font=kf)
        d.rounded_rectangle((x, y, x + kw + 44, y + 58), radius=29, fill=PINK)
        d.text((x + 22, y + 11), kicker.upper(), font=kf, fill='white'); y += 92
    for ln in wrap(d, title, bold(70), w):
        d.text((x, y), ln, font=bold(70), fill=BLUE); y += 84
    y += 16
    for ln in wrap(d, text, reg(44), w):
        d.text((x, y), ln, font=reg(44), fill=text_color); y += 62
    return y

def height_of(d, kicker, title, text, w):
    h = 92 if kicker else 0
    h += len(wrap(d, title, bold(70), w)) * 84 + 16 + len(wrap(d, text, reg(44), w)) * 62
    return h

for f in sorted(glob.glob('data/stories/*/*.json')):
    s = json.load(open(f, encoding='utf-8'))
    lang, slug = s['lang'], s['slug']
    odir = f'{OUT}/instagram-{lang}/{slug}'
    os.makedirs(odir, exist_ok=True)
    W, H = 1080, 1920
    probe = ImageDraw.Draw(Image.new('RGB', (10, 10)))
    frames = []
    CW = 856
    # cover: sign symbol on top, white card at the bottom
    cov = bg('cover-' + s['sign'] if s.get('sign') else 'bg-' + s['theme'], (W, H))
    h = height_of(probe, None, s['title'], s['description'], CW) + 150
    top = H - 190 - h
    cov = card(cov, (72, top, W - 72, top + h))
    text_block(cov, 112, top + 50, CW, None, s['title'], s['description'], SOFT)
    ImageDraw.Draw(cov).text((112, top + h - 82), (s.get('swipe') or '') + ' →', font=bold(34), fill=PINK)
    frames.append(logo(cov))
    # screens
    for g in s['pages']:
        im = bg('bg-' + g['theme'], (W, H))
        h = height_of(probe, g.get('kicker'), g['title'], g['text'], CW) + 100
        top = H - 190 - h
        im = card(im, (72, top, W - 72, top + h))
        text_block(im, 112, top + 50, CW, g.get('kicker'), g['title'], g['text'])
        frames.append(logo(im))
    # last screen
    im = bg('bg-night', (W, H))
    h = height_of(probe, None, s['cta']['text'], '', CW) + 190
    top = H - 190 - h
    im = card(im, (72, top, W - 72, top + h))
    text_block(im, 112, top + 50, CW, None, s['cta']['text'], '')
    d = ImageDraw.Draw(im)
    bl = bold(40); lw = d.textlength(s['cta']['label'], font=bl)
    d.rounded_rectangle((112, top + h - 130, 112 + lw + 80, top + h - 50), radius=40, fill=PINK)
    d.text((152, top + h - 115), s['cta']['label'], font=bl, fill='white')
    frames.append(logo(im))
    for i, im in enumerate(frames, 1):
        im.convert('RGB').save(f'{odir}/{i:02d}.jpg', quality=86)
    # Pinterest pin: the cover, taller, with the site name
    os.makedirs(f'{OUT}/pinterest', exist_ok=True)
    pin = bg('cover-' + s['sign'] if s.get('sign') else 'bg-' + s['theme'], (1000, 1500))
    h = height_of(probe, None, s['title'], s['description'], 780) + 120
    top = 1500 - 130 - h
    pin = card(pin, (60, top, 940, top + h))
    text_block(pin, 100, top + 44, 780, None, s['title'], s['description'], SOFT)
    pin = logo(pin, 60, 60, 80)
    pin.convert('RGB').save(f'{OUT}/pinterest/{lang}-{slug}.jpg', quality=88)
print('done')
