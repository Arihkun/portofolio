"""Local browser acceptance checks. Requires Python Playwright + installed Chrome.

Run against a production server: python scripts/verify_redesign.py --url http://127.0.0.1:3100
Artifacts are private local review outputs, not public website assets.
"""
import argparse
import json
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument("--url", default="http://127.0.0.1:3100")
parser.add_argument("--round", default="first")
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
output = root / "artifacts" / "redesign" / args.round
output.mkdir(parents=True, exist_ok=True)
routes = ["/", "/projects", "/about", "/resume"] + [
    "/projects/" + path.stem for path in sorted((root / "content/projects").glob("*.md"))
]
report = {"checks": [], "failures": [], "page_errors": [], "screenshots": []}

def check(name, ok, details=None):
    report["checks"].append({"name": name, "passed": bool(ok), "details": details})
    if not ok:
        report["failures"].append(name)

def capture(page, name, full=False):
    target = output / (name + ".png")
    page.evaluate("""async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(img => {
        img.loading = 'eager';
        return img.decode().catch(() => {});
      }));
      scrollTo({top:0, behavior:'instant'});
    }""")
    page.screenshot(path=str(target), full_page=full)
    report["screenshots"].append(target.name)

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome")
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    page = context.new_page()
    page.on("pageerror", lambda error: report["page_errors"].append(str(error)))
    urls = set()
    for route in routes:
        response = page.goto(args.url + route, wait_until="networkidle")
        page.evaluate("document.fonts.ready")
        check("HTTP " + route, response.status == 200, response.status)
        check("one main and h1 " + route, page.locator("main").count() == 1 and page.locator("h1").count() == 1)
        for width, height in [(1440, 900), (1366, 768), (820, 1180), (390, 844), (320, 740)]:
            page.set_viewport_size({"width": width, "height": height})
            overflow = page.evaluate("""() => ({
              width: innerWidth, scroll: document.documentElement.scrollWidth,
              offenders: [...document.querySelectorAll('main *')].filter(e => {
                const r = e.getBoundingClientRect();
                return r.width && (r.right > innerWidth + 1 || r.left < -1) && getComputedStyle(e).position !== 'fixed' && !e.closest('pre,.table-scroll,.capability-marquee-container,.heatmap-visual,.heatmap-scroll-container');
              }).slice(0,5).map(e => e.tagName + '.' + e.className)
            })""")
            check("width " + str(width) + " " + route, overflow["scroll"] <= width and not overflow["offenders"], overflow)
        page.set_viewport_size({"width": 1440, "height": 900})
        urls.update(page.locator('a[href^="/"]').evaluate_all("(links) => links.map(a => a.getAttribute('href'))"))
        missing_anchors = page.locator('a[href^="#"]').evaluate_all("(links) => links.map(a => a.hash.slice(1)).filter(id => id && !document.getElementById(id))")
        check("anchors " + route, not missing_anchors, missing_anchors)
        if route in ["/", "/projects", "/about", "/resume", "/projects/koii", "/projects/credit-scoring-ml"]:
            name = route.strip("/").replace("/", "-") or "home"
            page.evaluate("scrollTo(0,0)")
            capture(page, name + "-desktop")
            if route == "/":
                capture(page, "home-desktop-full", True)
                page.locator(".showcase-koii").screenshot(path=str(output / "products-desktop.png"))
            page.set_viewport_size({"width": 390, "height": 844})
            page.evaluate("scrollTo(0,0)")
            capture(page, name + "-mobile")
            if route == "/":
                capture(page, "home-mobile-full", True)
    for href in sorted(urls):
        parsed = urlparse(href)
        if parsed.path.startswith("/media/"):
            check("linked media " + href, context.request.get(args.url + href).status == 200)
        else:
            check("linked route " + href, parsed.path in routes or parsed.path == "/")

    page.goto(args.url + "/does-not-exist", wait_until="networkidle")
    page.set_viewport_size({"width":390,"height":844})
    check("404", page.locator("h1").inner_text() == "A small detour.")
    capture(page, "404-mobile")
    check("OG image", context.request.get(args.url + "/opengraph-image").status == 200)

    # Verify smart autoplay, loop, offscreen pause, and reduced motion fallback.
    for reduced in ["no-preference", "reduce"]:
        media_context = browser.new_context(viewport={"width": 1440, "height": 900}, reduced_motion=reduced)
        media_page = media_context.new_page()
        media_page.goto(args.url, wait_until="networkidle")
        check("only two demos " + reduced, media_page.locator("video").count() == 2)
        for slug in ["koii", "kasmate"]:
            video = media_page.locator(".video-" + slug + " video")
            if reduced == "no-preference":
                video.evaluate("(v) => v.scrollIntoView({block:'center', behavior:'instant'})")
                try:
                    media_page.wait_for_function("(slug) => { const v = document.querySelector('.video-' + slug + ' video'); return !v.paused && v.muted; }", arg=slug, timeout=8000)
                    check("smart autoplay in view " + slug, True)
                except Exception as exc:
                    check("smart autoplay in view " + slug, False, str(exc).splitlines()[0])
                media_page.evaluate("scrollTo({top:0, behavior:'instant'})")
                media_page.wait_for_timeout(300)
                check("offscreen pause " + slug, video.evaluate("(v) => v.paused"))
                video.evaluate("(v) => v.scrollIntoView({block:'center', behavior:'instant'})")
                try:
                    media_page.wait_for_function("(slug) => { const v = document.querySelector('.video-' + slug + ' video'); return !v.paused; }", arg=slug, timeout=8000)
                    check("resume autoplay in view " + slug, True)
                except Exception as exc:
                    check("resume autoplay in view " + slug, False, str(exc).splitlines()[0])
            else:
                video.evaluate("(v) => v.scrollIntoView({block:'center', behavior:'instant'})")
                media_page.wait_for_timeout(300)
                check("paused for reduced motion " + slug, video.evaluate("(v) => v.paused"))
                video.evaluate("(v) => v.play()")
                try:
                    media_page.wait_for_function("(slug) => { const v = document.querySelector('.video-' + slug + ' video'); return !v.paused; }", arg=slug, timeout=8000)
                    check("manual playback on reduced motion " + slug, True)
                except Exception as exc:
                    check("manual playback on reduced motion " + slug, False, str(exc).splitlines()[0])
                media_page.evaluate("scrollTo({top:0, behavior:'instant'})")
                media_page.wait_for_timeout(300)
                check("offscreen pause on reduced motion " + slug, video.evaluate("(v) => v.paused"))
        media_context.close()

    page.goto(args.url, wait_until="networkidle")
    page.set_viewport_size({"width":1440,"height":900})
    check("local Plex loaded", page.evaluate("document.fonts.check('400 16px \"IBM Plex Sans\"')"))
    stages = []
    for y in [0, 180, 380]:
        page.locator(".decision-scene").evaluate("(el, y) => scrollTo({top:el.getBoundingClientRect().top + scrollY - innerHeight * .75 + y,behavior:'instant'})", y)
        page.wait_for_timeout(80)
        stages.append(page.locator(".decision-scene").get_attribute("data-active"))
    check("scroll scene advances", len(set(stages)) > 1, stages)
    page.set_viewport_size({"width":390,"height":844})
    page.wait_for_timeout(80)
    check("mobile static diagram", page.locator(".decision-scene").get_attribute("data-active") is None)
    page.set_viewport_size({"width":1440,"height":900})
    page.emulate_media(reduced_motion="reduce")
    page.wait_for_timeout(80)
    check("reduced-motion static diagram", page.locator(".decision-scene").get_attribute("data-active") is None)

    page.goto(args.url, wait_until="networkidle")
    page.keyboard.press("Tab")
    check("keyboard skip link", page.locator(":focus").inner_text() == "Skip to content")
    page.keyboard.press("Enter")
    check("skip link target", page.url.endswith("#main-content"))
    page.goto(args.url + "/projects", wait_until="networkidle")
    check("active navigation", page.locator('.main-nav a[aria-current="page"]').inner_text() == "Work")
    page.get_by_role("link", name="About", exact=True).click()
    page.wait_for_url("**/about")
    check("client navigation", page.locator("h1").inner_text() == "A little about the person behind the work.")
    page.goto(args.url + "/resume", wait_until="networkidle")
    page.emulate_media(media="print")
    page.pdf(path=str(output / "resume-a4.pdf"), format="A4", print_background=True, prefer_css_page_size=True)
    check("print hides navigation", not page.locator(".site-header").is_visible() and not page.locator(".resume-toolbar").is_visible())
    page.emulate_media(media="screen")

    no_js = browser.new_context(java_script_enabled=False, viewport={"width":390,"height":844})
    static = no_js.new_page()
    for route in ["/", "/projects", "/about", "/resume", "/projects/cde-gorules", "/projects/koii"]:
        static.goto(args.url + route, wait_until="networkidle")
        check("no JS content " + route, static.locator("h1").is_visible() and static.locator(".main-nav").is_visible())
        check("no JS overflow " + route, static.evaluate("document.documentElement.scrollWidth <= innerWidth"))
    no_js.close()
    check("no runtime errors", not report["page_errors"], report["page_errors"])
    context.close()
    browser.close()

(output / "report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
print(json.dumps({"checks": len(report["checks"]), "failures": report["failures"], "artifacts": str(output)}, indent=2))
raise SystemExit(1 if report["failures"] else 0)
