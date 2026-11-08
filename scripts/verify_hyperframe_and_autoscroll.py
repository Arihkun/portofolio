import time
from pathlib import Path
from playwright.sync_api import sync_playwright

artifacts_dir = Path(r"C:\Users\smartuser.SMART-PC\.gemini\antigravity-cli\brain\18a7ff0b-a652-49f6-96d5-d7a7357b6a2a")
artifacts_dir.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    page.goto("http://localhost:3000", wait_until="domcontentloaded")
    page.wait_for_selector(".header-pill", timeout=10000)
    page.wait_for_timeout(1000)

    # 1. Verify arrow removal on "All 16 projects"
    all_projects_link = page.locator("a:has-text('All 16 projects')")
    all_projects_link.scroll_into_view_if_needed()
    page.wait_for_timeout(500)
    page.screenshot(
        path=str(artifacts_dir / "all-projects-no-arrow.png"),
        clip=page.locator(".work-heading").bounding_box() or None
    )

    # 2. Verify arrow removal on "Resume and certifications"
    resume_link = page.locator("a:has-text('Resume and certifications')")
    resume_link.scroll_into_view_if_needed()
    page.wait_for_timeout(500)
    page.screenshot(
        path=str(artifacts_dir / "resume-certifications-no-arrow.png"),
        clip=page.locator(".experience-header").bounding_box() or None
    )

    # 3. Verify Hyperframe mockup on Koii demo card
    koii_showcase = page.locator(".showcase-koii")
    koii_showcase.scroll_into_view_if_needed()
    page.wait_for_timeout(800)
    page.screenshot(
        path=str(artifacts_dir / "hyperframe-koii-demo.png"),
        clip=page.locator(".showcase-koii .hyperframe-mockup").bounding_box() or None
    )

    # 4. Verify Hyperframe mockup on KasMate demo card
    kasmate_showcase = page.locator(".showcase-kasmate")
    kasmate_showcase.scroll_into_view_if_needed()
    page.wait_for_timeout(800)
    page.screenshot(
        path=str(artifacts_dir / "hyperframe-kasmate-demo.png"),
        clip=page.locator(".showcase-kasmate .hyperframe-mockup").bounding_box() or None
    )

    # 5. Test auto-scroll on click
    # Scroll to top
    page.evaluate("window.scrollTo(0, 0)")
    page.wait_for_timeout(400)
    
    # Click "Work" in pill nav
    page.click(".nav-link-item:has-text('Work')")
    page.wait_for_timeout(800)
    y_work = page.evaluate("window.scrollY")
    print("Scrolled to Work y:", y_work)
    assert y_work > 200, "Should auto-scroll down to Work"

    # Click "Resume" in pill nav
    page.click(".nav-link-item:has-text('Resume')")
    page.wait_for_timeout(800)
    y_resume = page.evaluate("window.scrollY")
    print("Scrolled to Resume y:", y_resume)
    assert y_resume > y_work, "Should auto-scroll down to Resume"

    browser.close()

print("All verifications and screenshots completed successfully!")
