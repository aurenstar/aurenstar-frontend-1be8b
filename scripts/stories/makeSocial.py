# Turns every Web Story into pictures for social networks (does NOT post anything):
#   Instagram / Reels stories: 1080x1920, one picture per screen   -> OUT/instagram-<lang>/<slug>/NN.jpg
#   Pinterest pins:            1000x1500, one cover per story       -> OUT/pinterest/<lang>-<slug>.jpg
# Run: python3 scripts/stories/makeSocial.py /tmp/social   (needs Pillow; reuses the images from makeImages.py)
import json, glob, os, sys
from PIL import Image, ImageDraw, ImageFont

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

def card(im, box, fill=(23, 54, 111, 150)):
    ov = Image.new('RGBA', im.size, (0, 0, 0, 0))
    ImageDraw.Draw(ov).rounded_rectangle(box, radius=40, fill=fill)
    return Image.alpha_composite(im.convert('RGBA'), ov)

def text_block(im, x, y, w, kicker, title, text):
    d = ImageDraw.Draw(im)
    if kicker:
        d.text((x, y), kicker.upper(), font=bold(34), fill=(251, 225, 235)); y += 70
    for ln in wrap(d, title, bold(76), w):
        d.text((x, y), ln, font=bold(76), fill='white'); y += 92
    y += 24
    for ln in wrap(d, text, reg(46), w):
        d.text((x, y), ln, font=reg(46), fill='white'); y += 66
    return y

def height_of(d, kicker, title, text, w):
    h = 70 if kicker else 0
    h += len(wrap(d, title, bold(76), w)) * 92 + 24 + len(wrap(d, text, reg(46), w)) * 66
    return h

for f in sorted(glob.glob('data/stories/*/*.json')):
    s = json.load(open(f, encoding='utf-8'))
    lang, slug = s['lang'], s['slug']
    odir = f'{OUT}/instagram-{lang}/{slug}'
    os.makedirs(odir, exist_ok=True)
    W, H = 1080, 1920
    probe = ImageDraw.Draw(Image.new('RGB', (10, 10)))
    frames = []
    # cover
    cov = bg('cover-' + s['sign'] if s.get('sign') else 'bg-' + s['theme'], (W, H)).convert('RGBA')
    d = ImageDraw.Draw(cov)
    d.text((72, 96), 'AURENSTAR', font=bold(38), fill='white')
    y = 1020
    for ln in wrap(d, s['title'], bold(92), 936):
        d.text((72, y), ln, font=bold(92), fill='white'); y += 110
    y += 20
    for ln in wrap(d, s['description'], reg(46), 936):
        d.text((72, y), ln, font=reg(46), fill='white'); y += 66
    frames.append(cov)
    # screens
    for g in s['pages']:
        im = bg('bg-' + g['theme'], (W, H))
        h = height_of(probe, g.get('kicker'), g['title'], g['text'], 856) + 90
        top = (H - h) // 2
        im = card(im, (72, top, W - 72, top + h))
        text_block(im, 112, top + 46, 856, g.get('kicker'), g['title'], g['text'])
        d = ImageDraw.Draw(im); d.text((72, 96), 'AURENSTAR', font=bold(38), fill='white')
        frames.append(im)
    # last screen
    im = bg('bg-night', (W, H))
    h = height_of(probe, None, s['cta']['text'], s['cta']['label'], 856) + 90
    top = (H - h) // 2
    im = card(im, (72, top, W - 72, top + h))
    text_block(im, 112, top + 46, 856, None, s['cta']['text'], s['cta']['label'] + ' · ' + FOOT[lang])
    ImageDraw.Draw(im).text((72, 96), 'AURENSTAR', font=bold(38), fill='white')
    frames.append(im)
    for i, im in enumerate(frames, 1):
        im.convert('RGB').save(f'{odir}/{i:02d}.jpg', quality=86)
    # Pinterest pin: the cover, taller and with the site name at the bottom
    os.makedirs(f'{OUT}/pinterest', exist_ok=True)
    pin = bg('cover-' + s['sign'] if s.get('sign') else 'bg-' + s['theme'], (1000, 1500)).convert('RGBA')
    d = ImageDraw.Draw(pin)
    y = 820
    for ln in wrap(d, s['title'], bold(88), 860):
        d.text((70, y), ln, font=bold(88), fill='white'); y += 106
    y += 16
    for ln in wrap(d, s['description'], reg(44), 860):
        d.text((70, y), ln, font=reg(44), fill='white'); y += 62
    d.text((70, 1400), 'AURENSTAR · aurenstar.com', font=bold(36), fill=(251, 225, 235))
    pin.convert('RGB').save(f'{OUT}/pinterest/{lang}-{slug}.jpg', quality=88)
print('done')
