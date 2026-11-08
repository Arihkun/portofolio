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
    page_desktop.wait_for_selector(".brand-avatar", timeout=10000)
    page_desktop.wait_for_timeout(1000)
    
    # Capture the floating pill navbar at the top
    header = page_desktop.locator(".site-header")
    page_desktop.screenshot(
        path=str(artifacts_dir / "floating-navbar-desktop.png"),
        clip={"x": 0, "y": 0, "width": 1280, "height": 180}
    )
    
    # Hover over the brand avatar
    brand = page_desktop.locator(".brand")
    brand.hover()
    page_desktop.wait_for_timeout(400)
    page_desktop.screenshot(
        path=str(artifacts_dir / "floating-navbar-hover.png"),
        clip={"x": 0, "y": 0, "width": 1280, "height": 180}
    )
    
    # Scroll to profile photo section to capture the cleaned photo
    profile_photo = page_desktop.locator(".profile-photo")
    profile_photo.scroll_into_view_if_needed()
    page_desktop.wait_for_timeout(600)
    page_desktop.screenshot(
        path=str(artifacts_dir / "profile-photo-cleaned.png"),
        clip=page_desktop.locator(".home-profile").bounding_box() or None
    )
    
    context_desktop.close()
    
    # 2. Mobile View (390x844 iPhone 14 style)
    context_mobile = browser.new_context(viewport={"width": 390, "height": 844})
    page_mobile = context_mobile.new_page()
    page_mobile.goto("http://localhost:3000", wait_until="domcontentloaded")
    page_mobile.wait_for_selector(".brand-avatar", timeout=10000)
    page_mobile.wait_for_timeout(1000)
    
    page_mobile.screenshot(
        path=str(artifacts_dir / "floating-navbar-mobile.png"),
        clip={"x": 0, "y": 0, "width": 390, "height": 160}
    )
    
    context_mobile.close()
    browser.close()

print("Screenshots captured successfully!")
