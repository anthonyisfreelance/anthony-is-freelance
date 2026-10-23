#!/usr/bin/env python3
"""Bring the WordPress articles across as they are (Articles strategy doc, 22 October 2026).

Reads the live posts from the WordPress REST API and writes one file per article to
src/data/article-content/<slug>.json, in the shape the article template reads. Inline images are
downloaded to src/assets/articles/<slug>/<file name from WordPress>.

As they are means: the same words, headings, tables, links, images, SEO title, meta description and
published date. What changes is only what the template replaces: the Uncode page-builder wrapper,
inline styles, the forms and the CTA blocks after the article, and the FAQ accordion (now plain
questions and answers). Internal links lose the domain and follow public/_redirects, so none hops.

  python3 scripts/import-wordpress.py            # every article (overwrites earlier imports)
  python3 scripts/import-wordpress.py --refresh  # also SEO fields and images of the hand-built ones

A report of anything to check by hand is written to migration/import-report.md, and the raw posts
to migration/wordpress-posts.json (the snapshot the conversion was checked against).
"""
import html
import json
import re
import sys
import urllib.request
from pathlib import Path

from bs4 import BeautifulSoup, NavigableString, Tag

ROOT = Path(__file__).resolve().parent.parent
SITE = 'https://anthonyis.uk'
CONTENT = ROOT / 'src/data/article-content'
ASSETS = ROOT / 'src/assets/articles'
MIGRATION = ROOT / 'migration'
REFRESH = '--refresh' in sys.argv
# Rebuilt by hand in the new template already: never overwritten, only their SEO fields and images.
HAND_BUILT = {'good-conversion-rate-shopify', 'shopify-product-card-design'}


def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'anthonyis-migration'})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def get_json(url):
    return json.loads(get(url))


# --- Redirects, so internal links point at their final URL ---------------------------------
REDIRECTS = {}
for line in (ROOT / 'public/_redirects').read_text().splitlines():
    parts = line.split()
    if len(parts) >= 2 and not line.startswith('#'):
        REDIRECTS[parts[0]] = parts[1]


def local_href(href):
    if not href:
        return href
    m = re.match(r'https?://(www\.)?anthonyis\.uk(/[^#?]*)?([?#].*)?$', href)
    if not m:
        return href
    path = m.group(2) or '/'
    if not path.endswith('/') and '.' not in path.split('/')[-1]:
        path += '/'
    path = REDIRECTS.get(path, path)
    return path + (m.group(3) or '')


def slugify(text):
    s = re.sub(r'[’\'"]', '', text.lower())
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s[:80].strip('-')


# --- Uncode shortcodes -----------------------------------------------------------------------
# Only real page-builder codes. Pasted HTML can carry class names like [li_&]:pb-1 in brackets.
SHORTCODE = r'\[/?(?:vc|uncode)_\w+(?:\s[^\]]*)?\]'
def normalise(raw):
    """wptexturize turns the shortcode quotes curly; put them back so attributes parse."""
    text = html.unescape(raw)

    def fix(m):
        return m.group(0).replace('”', '"').replace('″', '"').replace('“', '"').replace('′', "'")
    return re.sub(SHORTCODE, fix, text)


def attrs(tag):
    return dict(re.findall(r'(\w+)="([^"]*)"', tag))


# --- HTML clean-up ---------------------------------------------------------------------------
KEEP_ATTRS = {'a': ['href'], 'img': ['src', 'alt'], 'td': ['colspan', 'rowspan'], 'th': ['colspan', 'rowspan']}
INLINE = {'a', 'strong', 'em', 'b', 'i', 'span', 'code', 'sup', 'sub', 'br', 'mark', 'small', 'abbr'}
DROP_TAGS = {'script', 'style', 'form', 'input', 'button', 'svg'}


def clean_fragment(fragment, report, slug):
    """Clean one vc_column_text: returns (html, [image srcs found inline])."""
    frag = fragment.strip()
    frag = re.sub(r'^(</p>\s*)+', '', frag)
    frag = re.sub(r'(\s*<p>)+$', '', frag)
    soup = BeautifulSoup(frag, 'lxml')
    body = soup.body or soup
    images = []
    for t in body.find_all(DROP_TAGS):
        t.decompose()
    for t in body.find_all(['span', 'font', 'div', 'section']):
        t.unwrap()
    for t in body.find_all('b'):
        t.name = 'strong'
    for t in body.find_all('i'):
        t.name = 'em'
    for img in body.find_all('img'):
        images.append({'src': img.get('src'), 'alt': img.get('alt', '')})
        parent = img.parent
        img.decompose()
        if parent and parent.name in ('p', 'a') and not parent.get_text(strip=True):
            parent.decompose()
    for t in body.find_all(True):
        keep = KEEP_ATTRS.get(t.name, [])
        for a in list(t.attrs):
            if a not in keep:
                del t.attrs[a]
        if t.name == 'a':
            t['href'] = local_href(t.get('href'))
    # Paragraphs that are only whitespace or a non-breaking space
    for p in body.find_all('p'):
        if not p.get_text(strip=True).replace('\xa0', '') and not p.find(['img', 'iframe']):
            p.decompose()
    # Loose text and inline tags at the top level (WordPress often leaves them unwrapped) go into
    # one paragraph per run, so a bold phrase or a link stays inside its sentence.
    run = []

    def flush():
        while run and isinstance(run[0], NavigableString) and not run[0].strip():
            run.pop(0)
        while run and isinstance(run[-1], NavigableString) and not run[-1].strip():
            run.pop()
        if run:
            p = soup.new_tag('p')
            run[0].insert_before(p)
            for n in run:
                p.append(n.extract())
        run.clear()
    for node in list(body.children):
        if isinstance(node, NavigableString) or (isinstance(node, Tag) and node.name in INLINE):
            run.append(node)
        else:
            flush()
    flush()
    # A <br> straight after a block, or two in a row inside a paragraph, is spacing, not content
    for br in body.find_all('br'):
        prev = br.previous_sibling
        if prev is None or (isinstance(prev, Tag) and prev.name == 'br'):
            br.decompose()
    for t in body.find_all('table'):
        if not (t.parent and t.parent.name == 'div'):
            wrap = soup.new_tag('div', attrs={'class': 'table-wrap'})
            t.wrap(wrap)
    for br in body.find_all('br'):
        # Trailing <br> at the end of a block
        if br.next_sibling is None:
            br.decompose()
    out = ''.join(str(c) for c in body.children).strip()
    out = re.sub(r'\n{2,}', '\n', out)
    return out, images


def text_of(fragment):
    return re.sub(r'\s+', ' ', BeautifulSoup(fragment, 'lxml').get_text()).strip()


# --- Media -----------------------------------------------------------------------------------
media_cache = {}


def media(mid):
    if mid not in media_cache:
        try:
            media_cache[mid] = get_json(f'{SITE}/wp-json/wp/v2/media/{mid}')
        except Exception as e:  # noqa: BLE001
            media_cache[mid] = {'error': str(e)}
    return media_cache[mid]


def download(src, slug, report):
    name = src.split('?')[0].split('/')[-1]
    dest = ASSETS / slug / name
    if Path(name).suffix.lower() in VIDEO_EXT and (VIDEOS / slug / f'{Path(name).stem.strip("-").lower()}.mp4').exists():
        return name
    if not dest.exists():
        dest.parent.mkdir(parents=True, exist_ok=True)
        try:
            dest.write_bytes(get(src))
        except Exception as e:  # noqa: BLE001
            report.append(f'- Image could not be downloaded: {src} ({e})')
            return None
    return name


VIDEO_EXT = {'.mp4', '.mov', '.webm', '.m4v'}
VIDEOS = ROOT / 'public/video/articles'


def as_video(name, slug, report):
    """A screen recording WordPress kept as an "image": compress it into public/video/articles/<slug>/
    (H.264, no sound, at most 1280px wide, fast start) and save a still from it as the poster, which
    shows until the video plays and for anyone with reduced motion. Returns the block fields."""
    import subprocess
    src = ASSETS / slug / name
    stem = Path(name).stem.strip('-').lower()
    out = VIDEOS / slug / f'{stem}.mp4'
    poster = ASSETS / slug / f'{stem}-poster.jpg'
    out.parent.mkdir(parents=True, exist_ok=True)
    if src.exists() and not out.exists():
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(src), '-vf', "scale='min(1280,iw)':-2",
                        '-c:v', 'libx264', '-crf', '27', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-an',
                        '-movflags', '+faststart', str(out)], check=True)
    if out.exists() and not poster.exists():
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-ss', '0.3', '-i', str(out), '-frames:v', '1',
                        '-q:v', '3', str(poster)], check=True)
    if src.exists():
        src.unlink()
    probe = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height',
                            '-of', 'csv=p=0', str(out)], capture_output=True, text=True).stdout.strip().split(',')
    return {'type': 'video', 'file': f'/video/articles/{slug}/{stem}.mp4', 'poster': poster.name,
            'width': int(probe[0]), 'height': int(probe[1])}


def alt_for(m, report, name):
    alt = (m.get('alt_text') or '').strip()
    if not alt:
        cap = BeautifulSoup((m.get('caption') or {}).get('rendered', ''), 'lxml').get_text().strip()
        title = html.unescape((m.get('title') or {}).get('rendered', '')).strip()
        alt = cap or re.sub(r'[-_]+', ' ', title).strip()
        report.append(f'- No alt text in WordPress for {name}; used "{alt}". Write a real one.')
    return alt


# --- One post ----------------------------------------------------------------------------------
def convert(post, report):
    slug = post['slug']
    h = normalise(post['content']['rendered'])
    tokens = re.split(f'({SHORTCODE})', h)
    blocks, faqs = [], []
    faq_heading = None
    pending_heading = None  # the heading just before an accordion becomes the FAQ heading
    in_tab = None
    ids = set()
    counts = {'h2': 0, 'h3': 0, 'h4': 0, 'tables': 0, 'links': 0, 'images': 0}
    skipped = []
    i = 0
    while i < len(tokens):
        t = tokens[i]
        if t.startswith('[uncode_block'):
            break  # the article ends here: CTA, form and footer blocks follow
        m = re.match(r'\[(\w+)([^\]]*)\]', t)
        name = m.group(1) if m else None
        if name == 'vc_custom_heading':
            a = attrs(m.group(2))
            level = a.get('heading_semantic', 'h2')
            text = text_of(tokens[i + 1])
            i += 2
            if level == 'h2':
                block = {'type': 'h2', 'text': text}
                base = slugify(text) or 'section'
                hid, n = base, 2
                while hid in ids:
                    hid, n = f'{base}-{n}', n + 1
                ids.add(hid)
                block['id'] = hid
                blocks.append(block)
                pending_heading = len(blocks) - 1
                counts['h2'] += 1
            elif level == 'h3':
                blocks.append({'type': 'h3', 'text': text})
                pending_heading = None
                counts['h3'] += 1
            else:
                # H4 and below. A long one with quote marks is a client quote: a blockquote.
                if len(text) > 80 or text[:1] in '“"‘\'':
                    blocks.append({'type': 'html', 'html': f'<blockquote><p>{html.escape(text)}</p></blockquote>'})
                else:
                    blocks.append({'type': 'html', 'html': f'<h4>{html.escape(text)}</h4>'})
                pending_heading = None
            continue
        if name == 'vc_accordion':
            # The heading right before it is the FAQ heading, not an article section
            if pending_heading is not None and pending_heading == len(blocks) - 1:
                heading = blocks.pop()
                ids.discard(heading['id'])
                counts['h2'] -= 1
                faq_heading = faq_heading or heading['text']
            pending_heading = None
        elif name == 'vc_accordion_tab':
            in_tab = {'q': html.unescape(attrs(m.group(2)).get('title', '')).strip(), 'html': ''}
        elif t.startswith('[/vc_accordion_tab'):
            if in_tab and in_tab['q'] and not any(f['q'] == in_tab['q'] for f in faqs):
                faqs.append(in_tab)
            in_tab = None
        elif name == 'vc_column_text':
            content, imgs = clean_fragment(tokens[i + 1], report, slug)
            i += 2
            target = in_tab
            if content:
                if target is not None:
                    target['html'] += content
                else:
                    blocks.append({'type': 'html', 'html': content})
                    pending_heading = None
            for im in imgs:
                name_ = download(im['src'], slug, report)
                if name_:
                    alt = im['alt'] or ''
                    if not alt:
                        report.append(f'- Inline image without alt text: {name_}. Write one.')
                    blocks.append({'type': 'image', 'file': name_, 'alt': alt})
                    counts['images'] += 1
            continue
        elif name == 'vc_single_image':
            mid = attrs(m.group(2)).get('media')
            if mid:
                md = media(int(mid))
                src = md.get('source_url')
                if src:
                    name_ = download(src, slug, report)
                    if name_:
                        block = {'type': 'image', 'file': name_}
                        if Path(name_).suffix.lower() in VIDEO_EXT:
                            block = as_video(name_, slug, report)
                        block['alt'] = alt_for(md, report, name_)
                        cap = BeautifulSoup((md.get('caption') or {}).get('rendered', ''), 'lxml').get_text().strip()
                        if attrs(m.group(2)).get('caption') == 'yes' and cap:
                            block['caption'] = cap
                        blocks.append(block)
                        counts['images'] += 1
                        pending_heading = None
                else:
                    report.append(f'- Image {mid} not found in the media library ({md.get("error", "")}).')
        elif name == 'uncode_lottie':
            skipped.append('a Lottie animation')
        elif name in ('vc_icon', 'vc_btn', 'vc_gallery', 'vc_raw_html', 'vc_video', 'uncode_index'):
            skipped.append(name)
        i += 1

    # An <h2> typed inside a text block becomes a real section heading, so it gets an anchor and a
    # place in the contents list.
    split = []
    for b in blocks:
        if b['type'] != 'html' or '<h2' not in b['html']:
            split.append(b)
            continue
        soup = BeautifulSoup(b['html'], 'lxml')
        buf = []
        for node in list((soup.body or soup).children):
            if isinstance(node, Tag) and node.name == 'h2':
                if ''.join(buf).strip():
                    split.append({'type': 'html', 'html': ''.join(buf).strip()})
                buf = []
                text = node.get_text(' ', strip=True)
                base = slugify(text) or 'section'
                hid, n = base, 2
                while hid in ids:
                    hid, n = f'{base}-{n}', n + 1
                ids.add(hid)
                split.append({'type': 'h2', 'text': text, 'id': hid})
                counts['h2'] += 1
            else:
                buf.append(str(node))
        if ''.join(buf).strip():
            split.append({'type': 'html', 'html': ''.join(buf).strip()})
    blocks = split

    # A quote followed by a short line naming who said it: the line becomes the quote's cite.
    merged = []
    for b in blocks:
        prev = merged[-1] if merged else None
        if (prev and prev['type'] == 'html' and prev['html'].startswith('<blockquote>') and b['type'] == 'html'):
            m2 = re.match(r'^<p>(.{3,80}?)</p>(.*)$', b['html'], re.S)
            if m2 and '<' not in m2.group(1):
                prev['html'] = prev['html'].replace('</blockquote>', f'<cite>{m2.group(1).strip()}</cite></blockquote>')
                rest = m2.group(2).strip()
                if rest:
                    merged.append({'type': 'html', 'html': rest})
                continue
        merged.append(b)
    blocks = merged

    # Content counts for the check against the live page
    all_html = ''.join(b.get('html', '') for b in blocks) + ''.join(f['html'] for f in faqs)
    counts['tables'] = all_html.count('<table')
    counts['h4'] = len(re.findall(r'<h[2-6][\s>]', ''.join(b.get('html', '') for b in blocks)))
    counts['quotes'] = all_html.count('<blockquote')
    counts['links'] = all_html.count('<a ')
    for f in faqs:
        f['html'] = f['html'].strip()
    return blocks, faqs, faq_heading, counts, skipped


def source_counts(post):
    """The same counts taken straight from the live HTML, up to where the article ends."""
    h = normalise(post['content']['rendered'])
    h = h.split('[uncode_block')[0]
    heads = re.findall(r'\[vc_custom_heading([^\]]*)\]', h)
    levels = [attrs(a).get('heading_semantic', 'h2') for a in heads]
    text_heads = len(re.findall(r'<h[2-6][\s>]', h))
    return {
        'headings': len(heads) + text_heads,
        'tables': h.count('<table'),
        'links': len(re.findall(r'<a\s', h)),
        'images': h.count('[vc_single_image') + len(re.findall(r'<img\s', h)),
        'faqs': h.count('[vc_accordion_tab'),
        'levels': levels,
    }


def main():
    MIGRATION.mkdir(exist_ok=True)
    posts = get_json(f'{SITE}/wp-json/wp/v2/posts?per_page=100')
    (MIGRATION / 'wordpress-posts.json').write_text(json.dumps(posts, indent=1, ensure_ascii=False))
    report = ['# WordPress import report', '', f'{len(posts)} posts read from {SITE}.', '']
    for post in posts:
        slug = post['slug']
        dest = CONTENT / f'{slug}.json'
        head = post.get('aioseo_head_json') or {}
        seo_title = html.unescape(head.get('title') or post['title']['rendered']).strip()
        description = html.unescape(head.get('description') or '').strip()
        published = post['date'][:10]
        notes = []
        if slug in HAND_BUILT and not REFRESH:
            continue
        if slug in HAND_BUILT:
            # Already rebuilt by hand: only the SEO fields from WordPress, and its images
            data = json.loads(dest.read_text())
            data['seoTitle'] = seo_title
            data['description'] = description or data['description']
            blocks, *_ = convert(post, notes)
            dest.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')
            report.append(f'## {slug} (rebuilt earlier; SEO title, description and images refreshed)')
            report.extend(notes or ['- Nothing to check.'])
            report.append('')
            continue
        blocks, faqs, faq_heading, counts, skipped = convert(post, notes)
        src = source_counts(post)
        hero = {'file': '', 'alt': ''}
        if post.get('featured_media'):
            md = media(post['featured_media'])
            if md.get('source_url'):
                hero = {'file': md['source_url'].split('/')[-1], 'alt': (md.get('alt_text') or '').strip()}
        data = {
            'seoTitle': seo_title,
            'description': description,
            'published': published,
            # Moving to the new template is not an update: no updated date until the content changes.
            'modified': published,
            'hero': hero,
            'faqHeading': faq_heading or 'Frequently asked questions',
            'blocks': blocks,
            'faqs': faqs,
        }
        dest.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')
        got_heads = counts['h2'] + counts['h3'] + counts['h4'] + (1 if faq_heading else 0)
        report.append(f'## {slug}')
        check = (
            f'Headings {got_heads}/{src["headings"]}, tables {counts["tables"]}/{src["tables"]}, '
            f'links {counts["links"]}/{src["links"]}, images {counts["images"]}/{src["images"]}, '
            f'FAQs {len(faqs)}/{src["faqs"]}'
        )
        report.append(f'- Against the live page: {check}.')
        if skipped:
            report.append(f'- Left out (template replaces or no equivalent yet): {", ".join(sorted(set(skipped)))}.')
        report.extend(notes)
        report.append('')
    (MIGRATION / 'import-report.md').write_text('\n'.join(report) + '\n')
    print('\n'.join(report))


if __name__ == '__main__':
    main()
