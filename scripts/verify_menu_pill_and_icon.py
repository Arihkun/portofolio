from pathlib import Path
from playwright.sync_api import sync_playwright

artifacts_dir = Path(r"C:\Users\smartuser.SMART-PC\.gemini\antigravity-cli\brain\18a7ff0b-a652-49f6-96d5-d7a7357b6a2a")
artifacts_dir.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", headless=True)
    
    # 1. Desktop View (1280x900)
    context_desktop = browser.new_context(viewport={"width": 1280, "height": 900})
    page_desktop = context_desktop.new_page()
    page_desktop.goto("http://localhost:3000", wait_until="domcontentloaded")
    page_desktop.wait_for_selector(".header-pill", timeout=10000)
    page_desktop.wait_for_timeout(1000)
    
    # Check favicon link tags in DOM
    favicon_hrefs = page_desktop.evaluate("""() => {
        const links = Array.from(document.querySelectorAll("link[rel*='icon']"));
        return links.map(l => ({ rel: l.rel, href: l.href }));
    }""")
    print("Favicon links found:", favicon_hrefs)
    
    # Take screenshot of the top hero showing the centered floating menu pill
    page_desktop.screenshot(
        path=str(artifacts_dir / "centered-menu-pill-desktop.png"),
        clip={"x": 0, "y": 0, "width": 1280, "height": 260}
    )
    
    # Hover over "About" nav item
    about_link = page_desktop.locator(".nav-link-item:has-text('About')")
    about_link.hover()
    page_desktop.wait_for_timeout(400)
    page_desktop.screenshot(
        path=str(artifacts_dir / "centered-menu-pill-hover.png"),
        clip={"x": 0, "y": 0, "width": 1280, "height": 260}
    )
    
    context_desktop.close()
    
    # 2. Mobile View (390x844 iPhone 14 style)
    context_mobile = browser.new_context(viewport={"width": 390, "height": 844})
    page_mobile = context_mobile.new_page()
    page_mobile.goto("http://localhost:3000", wait_until="domcontentloaded")
    page_mobile.wait_for_selector(".header-pill", timeout=10000)
    page_mobile.wait_for_timeout(1000)
    
    page_mobile.screenshot(
        path=str(artifacts_dir / "centered-menu-pill-mobile.png"),
        clip={"x": 0, "y": 0, "width": 390, "height": 200}
    )
    
    context_mobile.close()
    
    # 3. Direct verification of the /icon.png served by Next.js
    page_icon = browser.new_page(viewport={"width": 400, "height": 400})
    page_icon.goto("http://localhost:3000/icon.png", wait_until="domcontentloaded")
    page_icon.screenshot(path=str(artifacts_dir / "tab-icon-3d-rendered.png"))
    page_icon.close()

    browser.close()

print("All screenshots captured successfully!")
