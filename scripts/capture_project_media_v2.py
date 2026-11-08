"""Record real local demo screens, preserving UI motion and keeping old clips.

Run Koii on 3001 and KasMate on 5174, then run this script.
Requires Python Playwright, Pillow, imageio-ffmpeg, and installed Chrome.
"""

import json
import subprocess
import time
from pathlib import Path
from tempfile import TemporaryDirectory
from urllib.parse import urlparse

from imageio_ffmpeg import get_ffmpeg_exe
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "media"
ARTIFACTS = ROOT / "artifacts" / "demo-v2"
DURATION = 18


def capture(browser, name, url):
    with TemporaryDirectory(prefix=f"{name}-walkthrough-") as temporary:
        context = browser.new_context(
            viewport={"width": 1280, "height": 800}, device_scale_factor=1,
            record_video_dir=temporary, record_video_size={"width": 1280, "height": 800},
        )
        requests, blocked, errors = [], [], []
        origin = urlparse(url).netloc

        def permit(route):
            address = route.request.url
            parsed = urlparse(address)
            if "/api/" in parsed.path or (parsed.scheme in ("http", "https") and parsed.netloc != origin
                and not address.startswith(("https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@master/color/svg/", "https://fonts.googleapis.com/", "https://fonts.gstatic.com/"))):
                blocked.append(address)
                route.abort()
            else:
                route.continue_()

        context.route("**/*", permit)
        context.on("request", lambda request: requests.append(request.url))
        page = context.new_page()
        video = page.video
        video_start = time.monotonic()
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.clock.set_fixed_time("2027-06-15T05:00:00Z" if name == "koii" else "2026-10-21T05:00:00Z")
        page.goto(url, wait_until="networkidle")
        page.evaluate("document.fonts.ready")
        page.add_style_tag(content="""
          nextjs-portal { display: none !important; }
          #demo-pointer { position:fixed; width:14px; height:14px; border-radius:50%;
            border:2px solid white; background:#334155; box-shadow:0 1px 5px #0006;
            pointer-events:none; z-index:2147483647; transform:translate(-50%,-50%); }
          #demo-disclosure { position:fixed; right:14px; bottom:12px; padding:6px 10px;
            background:#ffffffed; color:#475569; border:1px solid #cbd5e1; border-radius:8px;
            font:11px system-ui; pointer-events:none; z-index:2147483646; }
        """)
        page.evaluate("""(name) => {
          const pointer=document.createElement('div'); pointer.id='demo-pointer';
          pointer.style.left='1150px'; pointer.style.top='730px'; document.body.append(pointer);
          document.addEventListener('mousemove',e=>{pointer.style.left=e.clientX+'px';pointer.style.top=e.clientY+'px'});
          const label=document.createElement('div');label.id='demo-disclosure';
          label.textContent=name==='koii'?'Fictional demo · AI-generated sample photos':'Fictional demo · no account or backend';
          document.body.append(label);
        }""", name)
        page.wait_for_timeout(600)
        started = time.monotonic()
        trim = started - video_start

        def at(seconds):
            remaining = seconds - (time.monotonic() - started)
            if remaining > 0:
                page.wait_for_timeout(remaining * 1000)

        def click(locator):
            locator.scroll_into_view_if_needed()
            box = locator.bounding_box()
            page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2, steps=18)
            page.wait_for_timeout(140)
            locator.click()

        if name == "koii":
            page.locator("nav.nav button").filter(has_text="Wishlist").click()
            at(4)
            click(page.locator("nav.nav button").filter(has_text="Agenda"))
            at(7.8)
            click(page.get_by_text("Yogyakarta weekend", exact=True).first)
            at(10)
            page.mouse.wheel(0, 210)
            at(12)
            click(page.locator("nav.nav button").filter(has_text="Memories"))
            at(13)
            click(page.get_by_text("A day at the museum", exact=True).first)
            page.locator("img.photo").first.wait_for()
            page.wait_for_function("Array.from(document.querySelectorAll('img.photo')).every(i=>i.complete&&i.naturalWidth>0)")
            page.screenshot(path=str(ARTIFACTS / "koii-memories.png"))
            page.screenshot(path=str(Path(temporary) / "poster.png"))
            at(14.5)
            click(page.get_by_role("button", name="Open memory 1", exact=True))
            at(16)
            click(page.get_by_role("button", name="Next photo", exact=True))
        else:
            page.locator("main h1").first.wait_for()
            page.screenshot(path=str(Path(temporary) / "poster.png"))
            at(2.7)
            page.mouse.move(1000, 650, steps=18)
            page.mouse.wheel(0, 430)
            at(5.5)
            click(page.locator("aside nav").get_by_role("link", name="Transactions", exact=True))
            page.evaluate("window.scrollTo({top:0,behavior:'smooth'})")
            at(8)
            page.mouse.move(800, 475, steps=18)
            page.mouse.wheel(0, 200)
            at(10.5)
            click(page.locator("aside nav").get_by_role("link", name="Budgets", exact=True))
            page.evaluate("window.scrollTo({top:0,behavior:'smooth'})")
            at(13)
            page.mouse.move(850, 500, steps=18)
            page.screenshot(path=str(ARTIFACTS / "kasmate-budgets.png"))
            at(15)
            click(page.locator("aside nav").get_by_role("link", name="Overview", exact=True))
            page.evaluate("window.scrollTo({top:0,behavior:'smooth'})")
        at(DURATION + 0.3)
        if blocked or errors:
            context.close()
            raise RuntimeError(json.dumps({"blocked": blocked, "errors": errors}))
        with Image.open(Path(temporary) / "poster.png") as image:
            image.save(OUTPUT / f"{name}-poster-v2.webp", "WEBP", quality=88)
        context.close()
        raw = video.path()
        subprocess.run([
            get_ffmpeg_exe(), "-hide_banner", "-loglevel", "error", "-y", "-ss", f"{trim:.3f}",
            "-i", str(raw), "-t", str(DURATION), "-an", "-vf", "fps=30,scale=1280:800",
            "-c:v", "libx264", "-crf", "21", "-preset", "medium", "-pix_fmt", "yuv420p",
            "-movflags", "+faststart", str(OUTPUT / f"{name}-demo-v2.mp4"),
        ], check=True)
        return {"name": name, "duration": DURATION, "output_fps": 30, "size": [1280, 800],
                "blocked_requests": blocked, "page_errors": errors,
                "api_requests": [url for url in requests if "/api/" in urlparse(url).path],
                "clip": f"{name}-demo-v2.mp4"}


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome", headless=True)
        results = [capture(browser, "koii", "http://127.0.0.1:3001/portfolio-demo?page=plans"),
                   capture(browser, "kasmate", "http://127.0.0.1:5174/portfolio-demo")]
        browser.close()
    (ARTIFACTS / "capture-report.json").write_text(json.dumps(results, indent=2), encoding="utf-8")
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
