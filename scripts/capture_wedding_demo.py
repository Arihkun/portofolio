import http.server
import json
import socketserver
import subprocess
import threading
import time
from pathlib import Path
from tempfile import TemporaryDirectory
from imageio_ffmpeg import get_ffmpeg_exe
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "media"
ARTIFACTS = ROOT / "artifacts" / "demo-v2"
UNDANGAN_OUT = Path(r"D:\Project\undangan\out")
DURATION = 16
PORT = 8789

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(UNDANGAN_OUT), **kwargs)
    def log_message(self, format, *args):
        pass

def capture_wedding():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    
    httpd = socketserver.TCPServer(("127.0.0.1", PORT), QuietHandler)
    server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    server_thread.start()
    time.sleep(0.5)
    
    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(channel="chrome", headless=True)
            with TemporaryDirectory(prefix="wedding-demo-") as temporary:
                context = browser.new_context(
                    viewport={"width": 1280, "height": 800},
                    device_scale_factor=1,
                    record_video_dir=temporary,
                    record_video_size={"width": 1280, "height": 800},
                )
                page = context.new_page()
                video = page.video
                video_start = time.monotonic()
                
                page.goto(f"http://127.0.0.1:{PORT}/", wait_until="networkidle")
                page.evaluate("document.fonts.ready")
                
                # Pointer & disclosure
                page.add_style_tag(content="""
                  #demo-pointer { position:fixed; width:14px; height:14px; border-radius:50%;
                    border:2px solid white; background:#1C2E24; box-shadow:0 1px 6px rgba(0,0,0,0.3);
                    pointer-events:none; z-index:2147483647; transform:translate(-50%,-50%); transition:left 80ms ease, top 80ms ease; }
                  #demo-disclosure { position:fixed; right:14px; bottom:12px; padding:6px 12px;
                    background:#fdfbf7ef; color:#1C2E24; border:1px solid #c5a059; border-radius:8px;
                    font:11px system-ui, sans-serif; font-weight:500; pointer-events:none; z-index:2147483646; }
                """)
                page.evaluate("""() => {
                  const pointer=document.createElement('div'); pointer.id='demo-pointer';
                  pointer.style.left='640px'; pointer.style.top='500px'; document.body.append(pointer);
                  document.addEventListener('mousemove',e=>{pointer.style.left=e.clientX+'px';pointer.style.top=e.clientY+'px'});
                  const label=document.createElement('div');label.id='demo-disclosure';
                  label.textContent='Kinar & Oki Wedding Invitation · Demo Showcase';
                  document.body.append(label);
                }""")
                
                page.wait_for_timeout(600)
                started = time.monotonic()
                trim = started - video_start
                
                def at(seconds):
                    remaining = seconds - (time.monotonic() - started)
                    if remaining > 0:
                        page.wait_for_timeout(remaining * 1000)
                
                # Poster from hero
                page.screenshot(path=str(Path(temporary) / "poster.png"))
                page.screenshot(path=str(ARTIFACTS / "wedding-invitation-hero.png"))
                
                at(1.5)
                # Click 'Buka Undangan' with force=True
                open_btn = page.locator("button").filter(has_text="Buka Undangan").first
                if open_btn.is_visible():
                    box = open_btn.bounding_box()
                    if box:
                        page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2, steps=10)
                        page.wait_for_timeout(100)
                    open_btn.click(force=True)
                else:
                    page.keyboard.press("Escape")
                
                at(3.5)
                # Scroll couple section
                page.mouse.move(640, 400, steps=10)
                page.mouse.wheel(0, 550)
                at(6.0)
                
                # Scroll story
                page.mouse.wheel(0, 500)
                at(8.5)
                
                # Scroll events
                page.mouse.wheel(0, 600)
                at(11.0)
                
                # Scroll gallery / RSVP
                page.mouse.wheel(0, 600)
                at(13.5)
                page.screenshot(path=str(ARTIFACTS / "wedding-invitation-rsvp.png"))
                
                at(DURATION + 0.3)
                
                # Save poster
                with Image.open(Path(temporary) / "poster.png") as image:
                    image.save(OUTPUT / "undangan-poster.webp", "WEBP", quality=88)
                
                context.close()
                raw = video.path()
                
                target_mp4 = OUTPUT / "undangan-demo.mp4"
                subprocess.run([
                    get_ffmpeg_exe(), "-hide_banner", "-loglevel", "error", "-y", "-ss", f"{trim:.3f}",
                    "-i", str(raw), "-t", str(DURATION), "-an", "-vf", "fps=30,scale=1280:800",
                    "-c:v", "libx264", "-crf", "22", "-preset", "medium", "-pix_fmt", "yuv420p",
                    "-movflags", "+faststart", str(target_mp4),
                ], check=True)
                
                size = target_mp4.stat().st_size
                print(f"Wedding demo video recorded: {target_mp4} ({size} bytes, {size/1024:.1f} KB)")
                
            browser.close()
    finally:
        httpd.shutdown()

if __name__ == "__main__":
    capture_wedding()
