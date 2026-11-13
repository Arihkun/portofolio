import json
import subprocess
import time
from pathlib import Path
from tempfile import TemporaryDirectory
from imageio_ffmpeg import get_ffmpeg_exe
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "media"
ARTIFACTS = ROOT / "artifacts" / "demo-v2"
DURATION = 18

def capture_koii():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome", headless=True)
        with TemporaryDirectory(prefix="koii-redesign-") as temporary:
            context = browser.new_context(
                viewport={"width": 1280, "height": 800},
                device_scale_factor=1,
                record_video_dir=temporary,
                record_video_size={"width": 1280, "height": 800},
            )
            page = context.new_page()
            video = page.video
            video_start = time.monotonic()
            
            page.goto("http://localhost:3005/portfolio-demo", wait_until="networkidle")
            page.evaluate("document.fonts.ready")
            
            # Pointer & badge style
            page.add_style_tag(content="""
              nextjs-portal { display: none !important; }
              #demo-pointer { position:fixed; width:14px; height:14px; border-radius:50%;
                border:2px solid white; background:#ac432d; box-shadow:0 1px 6px rgba(0,0,0,0.3);
                pointer-events:none; z-index:2147483647; transform:translate(-50%,-50%); transition:left 80ms ease, top 80ms ease; }
              #demo-disclosure { position:fixed; right:14px; bottom:12px; padding:6px 10px;
                background:#ffffffef; color:#78350f; border:1px solid #fde68a; border-radius:8px;
                font:11px system-ui, sans-serif; font-weight:500; pointer-events:none; z-index:2147483646; }
            """)
            page.evaluate("""() => {
              const pointer=document.createElement('div'); pointer.id='demo-pointer';
              pointer.style.left='1150px'; pointer.style.top='730px'; document.body.append(pointer);
              document.addEventListener('mousemove',e=>{pointer.style.left=e.clientX+'px';pointer.style.top=e.clientY+'px'});
              const label=document.createElement('div');label.id='demo-disclosure';
              label.textContent='Koii Redesign · Local interactive showcase';
              document.body.append(label);
            }""")
            
            page.wait_for_timeout(800)
            started = time.monotonic()
            trim = started - video_start
            
            def at(seconds):
                remaining = seconds - (time.monotonic() - started)
                if remaining > 0:
                    page.wait_for_timeout(remaining * 1000)
                    
            def click(locator):
                locator.scroll_into_view_if_needed()
                box = locator.bounding_box()
                if box:
                    page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2, steps=15)
                    page.wait_for_timeout(140)
                locator.click(force=True)

            page.locator(".home-polaroid").first.wait_for()
            page.screenshot(path=str(Path(temporary) / "poster.png"))
            page.screenshot(path=str(ARTIFACTS / "koii-redesign-home.png"))
            
            # Hover over Latest Memory Polaroid
            at(2.5)
            page.mouse.move(480, 360, steps=15)
            at(4.5)
            
            # Scroll down to 3-column cards
            page.mouse.wheel(0, 480)
            at(6.5)
            page.mouse.move(780, 520, steps=15)
            page.screenshot(path=str(ARTIFACTS / "koii-redesign-shelf.png"))
            at(8.0)
            
            # Click Wishlist tab on dock
            click(page.locator(".capsule-tab-btn.tab-wishlist"))
            page.evaluate("window.scrollTo({top:0,behavior:'smooth'})")
            at(10.5)
            page.mouse.move(620, 340, steps=15)
            page.screenshot(path=str(ARTIFACTS / "koii-redesign-wishlist.png"))
            at(12.5)
            
            # Click Memories tab on dock
            click(page.locator(".capsule-tab-btn.tab-memories"))
            page.evaluate("window.scrollTo({top:0,behavior:'smooth'})")
            at(14.5)
            page.mouse.move(580, 380, steps=15)
            page.screenshot(path=str(ARTIFACTS / "koii-redesign-memories.png"))
            at(16.0)
            
            # Return to Home tab
            click(page.locator(".capsule-tab-btn.tab-home"))
            page.evaluate("window.scrollTo({top:0,behavior:'smooth'})")
            at(18.0)
            
            context.close()
            
            # Export poster as WebP
            poster_png = Path(temporary) / "poster.png"
            poster_webp = OUTPUT / "koii-poster-v3.webp"
            with Image.open(poster_png) as im:
                im.save(poster_webp, "WEBP", quality=90)
            print(f"Generated {poster_webp} ({poster_webp.stat().st_size} bytes)")
            
            # Process video with ffmpeg
            recorded = list(Path(temporary).glob("*.webm"))[0]
            mp4_out = OUTPUT / "koii-demo-v4.mp4"
            ffmpeg = get_ffmpeg_exe()
            
            cmd = [
                ffmpeg, "-y",
                "-ss", f"{trim:.3f}",
                "-i", str(recorded),
                "-t", str(DURATION),
                "-vf", "fps=30,scale=1280:800:flags=lanczos",
                "-c:v", "libx264",
                "-crf", "26",
                "-preset", "slow",
                "-pix_fmt", "yuv420p",
                "-an",
                "-movflags", "+faststart",
                str(mp4_out)
            ]
            print("Encoding MP4:", " ".join(cmd))
            subprocess.run(cmd, check=True)
            print(f"Generated {mp4_out} ({mp4_out.stat().st_size} bytes)")
            assert mp4_out.stat().st_size <= 2 * 1024 * 1024, "Video exceeds 2MB limit"
            
        browser.close()

if __name__ == "__main__":
    capture_koii()
