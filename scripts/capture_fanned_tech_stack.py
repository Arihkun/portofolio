import os
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
    page_desktop.wait_for_selector(".tech-squircle-card", timeout=10000)
    page_desktop.wait_for_timeout(1000)
    
    # Scroll to the Tech Stack section
    tech_section = page_desktop.locator(".tech-stack-showcase-wrapper")
    tech_section.scroll_into_view_if_needed()
    page_desktop.wait_for_timeout(800)
    
    section_parent = page_desktop.locator("section:has(.tech-stack-showcase-wrapper)")
    box = section_parent.bounding_box()
    
    # Take screenshot of the desktop section
    page_desktop.screenshot(
        path=str(artifacts_dir / "fanned-tech-stack-desktop.png"),
        clip=box or None
    )
    
    # Hover over one of the cards (e.g. GoRules card, index 1)
    cards = page_desktop.locator(".tech-squircle-card")
    if cards.count() > 1:
        cards.nth(1).hover()
        page_desktop.wait_for_timeout(500)
        page_desktop.screenshot(
            path=str(artifacts_dir / "fanned-tech-stack-hover.png"),
            clip=box or None
        )
    
    context_desktop.close()
    
    # 2. Mobile View (390x844 iPhone 14 style)
    context_mobile = browser.new_context(viewport={"width": 390, "height": 844})
    page_mobile = context_mobile.new_page()
    page_mobile.goto("http://localhost:3000", wait_until="domcontentloaded")
    page_mobile.wait_for_selector(".tech-squircle-card", timeout=10000)
    page_mobile.wait_for_timeout(1000)
    
    tech_section_mobile = page_mobile.locator(".tech-stack-showcase-wrapper")
    tech_section_mobile.scroll_into_view_if_needed()
    page_mobile.wait_for_timeout(800)
    
    box_mobile = page_mobile.locator("section:has(.tech-stack-showcase-wrapper)").bounding_box()
    
    page_mobile.screenshot(
        path=str(artifacts_dir / "fanned-tech-stack-mobile.png"),
        clip=box_mobile or None
    )
    
    context_mobile.close()
    browser.close()

print("Screenshots captured successfully!")
