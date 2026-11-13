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

def capture_kasmate():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome", headless=True)
        with TemporaryDirectory(prefix="kasmate-redesign-") as temporary:
            context = browser.new_context(
                viewport={"width": 1280, "height": 800},
                device_scale_factor=1,
                record_video_dir=temporary,
                record_video_size={"width": 1280, "height": 800},
            )
            page = context.new_page()
            video = page.video
            video_start = time.monotonic()
            
            page.goto("http://127.0.0.1:5174/portfolio-demo", wait_until="networkidle")
            page.evaluate("document.fonts.ready")
            
            # Pointer & badge
            page.add_style_tag(content="""
              nextjs-portal { display: none !important; }
              #demo-pointer { position:fixed; width:14px; height:14px; border-radius:50%;
                border:2px solid white; background:#4f46e5; box-shadow:0 1px 6px rgba(0,0,0,0.3);
                pointer-events:none; z-index:2147483647; transform:translate(-50%,-50%); transition:left 80ms ease, top 80ms ease; }
              #demo-disclosure { position:fixed; right:14px; bottom:12px; padding:6px 10px;
                background:#ffffffef; color:#4338ca; border:1px solid #c7d2fe; border-radius:8px;
                font:11px system-ui, sans-serif; font-weight:500; pointer-events:none; z-index:2147483646; }
            """)
            page.evaluate("""() => {
              const pointer=document.createElement('div'); pointer.id='demo-pointer';
              pointer.style.left='1150px'; pointer.style.top='730px'; document.body.append(pointer);
              document.addEventListener('mousemove',e=>{pointer.style.left=e.clientX+'px';pointer.style.top=e.clientY+'px'});
              const label=document.createElement('div');label.id='demo-disclosure';
              label.textContent='KasMate Redesign · Local interactive showcase';
              document.body.append(label);
            }""")
            
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
                if box:
                    page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2, steps=15)
                    page.wait_for_timeout(150)
                locator.click()

            page.locator("main h1").first.wait_for()
            page.screenshot(path=str(Path(temporary) / "poster.png"))
            page.screenshot(path=str(ARTIFACTS / "kasmate-redesign-overview.png"))
            
            # Hover over health gauge and cards
            at(2.5)
            page.mouse.move(600, 320, steps=15)
            at(4.5)
            page.mouse.wheel(0, 380)
            at(6.5)
            
            # Click Transactions
            click(page.locator("aside nav").get_by_role("link", name="Transactions", exact=True))
            page.evaluate("window.scrollTo({top:0,behavior:'smooth'})")
            at(9.0)
            page.mouse.move(750, 420, steps=15)
            page.mouse.wheel(0, 220)
            at(11.0)
            
            # Click Budgets
            click(page.locator("aside nav").get_by_role("link", name="Budgets", exact=True))
            page.evaluate("window.scrollTo({top:0,behavior:'smooth'})")
            at(13.5)
            page.mouse.move(800, 480, steps=15)
            page.screenshot(path=str(ARTIFACTS / "kasmate-redesign-budgets.png"))
            at(15.5)
            
            # Back to Overview
            click(page.locator("aside nav").get_by_role("link", name="Overview", exact=True))
            page.evaluate("window.scrollTo({top:0,behavior:'smooth'})")
            at(DURATION + 0.3)
            
            # Save poster
            with Image.open(Path(temporary) / "poster.png") as image:
                image.save(OUTPUT / "kasmate-poster-v2.webp", "WEBP", quality=88)
                
            context.close()
            raw = video.path()
            
            target_v3 = OUTPUT / "kasmate-demo-v3.mp4"
            target_v2 = OUTPUT / "kasmate-demo-v2.mp4"
            
            subprocess.run([
                get_ffmpeg_exe(), "-hide_banner", "-loglevel", "error", "-y", "-ss", f"{trim:.3f}",
                "-i", str(raw), "-t", str(DURATION), "-an", "-vf", "fps=30,scale=1280:800",
                "-c:v", "libx264", "-crf", "22", "-preset", "medium", "-pix_fmt", "yuv420p",
                "-movflags", "+faststart", str(target_v3),
            ], check=True)
            
            # Duplicate to v2 for backwards compatibility
            import shutil
            shutil.copy2(target_v3, target_v2)
            
            size_v3 = target_v3.stat().st_size
            print(f"KasMate redesign video recorded: {target_v3} ({size_v3} bytes, {size_v3/1024:.1f} KB)")
            
        browser.close()

if __name__ == "__main__":
    capture_kasmate()
