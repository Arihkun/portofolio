"""Capture local-only fictional demo routes as silent portfolio clips.

Requires: pip install playwright imageio-ffmpeg pillow
Uses installed Chrome, not personal browser sessions. Never points to production.
Run while Koii serves :3001 and KasMate serves :5174:
    python scripts/capture_project_media.py
"""

from pathlib import Path
import subprocess
from tempfile import TemporaryDirectory

from imageio_ffmpeg import get_ffmpeg_exe
from PIL import Image
from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "media"
CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
FPS = 8


def record(page, name, url, labels, selector):
    with TemporaryDirectory(prefix=f"{name}-portfolio-") as temporary:
        frames = Path(temporary)
        page.goto(url, wait_until="networkidle")
        page.add_style_tag(content="nextjs-portal { display: none !important; }")
        page.locator(selector(labels[0])).wait_for()
        page.wait_for_timeout(1200)
        body_text = page.locator("body").inner_text()
        if "demo" not in body_text.lower() and "fictional data" not in body_text.lower():
            raise RuntimeError(f"Fictional demo marker missing at {url}: {body_text[:300]}")
        number = 0
        expected_headings = {"Wishlist": "It starts with", "Agenda": "A little time", "Memories": "We were", "Overview": "Overview", "Transactions": "Transactions", "Budgets": "Budgets"}
        for label in labels:
            page.locator(selector(label)).click()
            page.wait_for_timeout(700)
            heading = page.locator("main h1").first.inner_text()
            if expected_headings[label] not in heading:
                raise RuntimeError(f"Unexpected {name} scene for {label}: {heading}")
            for _ in range(19):
                page.screenshot(path=str(frames / f"frame{number:03d}.png"), animations="disabled")
                number += 1
        OUTPUT.mkdir(parents=True, exist_ok=True)
        with Image.open(frames / "frame000.png") as image:
            image.save(OUTPUT / f"{name}-poster.webp", "WEBP", quality=85)
        command = [
            get_ffmpeg_exe(), "-hide_banner", "-loglevel", "error", "-y",
            "-framerate", str(FPS), "-i", str(frames / "frame%03d.png"),
            "-c:v", "libx264", "-crf", "25", "-preset", "medium",
            "-pix_fmt", "yuv420p", "-movflags", "+faststart",
            str(OUTPUT / f"{name}-demo.mp4"),
        ]
        subprocess.run(command, check=True)
        print(f"Saved {name}: {number} frames, {(OUTPUT / f'{name}-demo.mp4').stat().st_size // 1024} KiB")


def main():
    if not CHROME.exists():
        raise SystemExit("Chrome executable not found at the expected local path")
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path=str(CHROME), headless=True)
        page = browser.new_page(viewport={"width": 1200, "height": 720}, device_scale_factor=1)
        api_requests = []
        page.on("request", lambda request: api_requests.append(request.url) if "/api/" in request.url else None)
        allowed = ("http://localhost:3001/", "http://127.0.0.1:5174/", "https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@master/color/svg/", "https://fonts.googleapis.com/", "https://fonts.gstatic.com/")
        page.route("**/*", lambda route: route.continue_() if route.request.url.startswith(allowed) and "/api/" not in route.request.url else route.abort())
        record(page, "koii", "http://localhost:3001/portfolio-demo?page=plans", ["Wishlist", "Agenda", "Memories"], lambda label: f'nav.nav button:has-text("{label}")')
        record(page, "kasmate", "http://127.0.0.1:5174/portfolio-demo", ["Overview", "Transactions", "Budgets"], lambda label: f'aside nav button:has-text("{label}")')
        if api_requests:
            raise RuntimeError(f"Demo unexpectedly requested an API: {api_requests[0]}")
        browser.close()


if __name__ == "__main__":
    main()
