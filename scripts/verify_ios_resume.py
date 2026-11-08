"""Exercise media recovery and public resume in Chromium and desktop WebKit."""
import asyncio
import json
import sys
from pathlib import Path
from playwright.async_api import async_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3192"
OUT = Path("artifacts/iphone-resume")


async def exercise(browser, label):
    context = await browser.new_context(viewport={"width": 390, "height": 844})
    page = await context.new_page()
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    response = await page.goto(BASE + "/resume", wait_until="domcontentloaded")
    await page.evaluate("document.fonts.ready")
    assert response.status == 200
    assert await page.locator(".resume-projects article").count() == 2
    text = await page.locator(".resume-document").inner_text()
    assert "+62" not in text and "812-8105" not in text
    assert "arih.ai.id" in text and "Polars" in text
    assert not await page.evaluate("document.documentElement.scrollWidth > innerWidth + 1")
    await page.screenshot(path=str(OUT / f"{label}-resume-mobile.png"), full_page=True)
    pdf = await page.request.get(BASE + "/downloads/CV_Ari_Hendrawan_Public.pdf")
    assert pdf.status == 200 and (await pdf.body()).startswith(b"%PDF")
    print(label, "resume and public PDF passed", flush=True)
    await page.set_viewport_size({"width": 1440, "height": 900})
    await page.reload(wait_until="domcontentloaded")
    await page.evaluate("document.fonts.ready")
    await page.screenshot(path=str(OUT / f"{label}-resume-desktop.png"), full_page=True)

    for slug in ["koii", "kasmate"]:
        await page.goto(BASE + "/projects/" + slug, wait_until="domcontentloaded")
        await page.wait_for_timeout(500)
        await page.locator(".case-visual video").scroll_into_view_if_needed()
        await page.wait_for_function("document.querySelector('.case-visual video').currentTime > 0.15")
        assert await page.locator(".video-frame button").count() == 0
        assert not await page.locator(".case-visual video").evaluate("v => v.controls")
    print(label, "both demos autoplay without controls", flush=True)

    await page.emulate_media(reduced_motion="reduce")
    await page.goto(BASE + "/projects/koii", wait_until="domcontentloaded")
    await page.wait_for_timeout(500)
    video = page.locator(".case-visual video")
    await video.scroll_into_view_if_needed()
    await page.wait_for_timeout(400)
    assert await video.evaluate("v => v.paused")
    await video.click()
    await page.wait_for_function("document.querySelector('.case-visual video').currentTime > 0.15")
    await video.click()
    assert await video.evaluate("v => v.paused")
    await page.emulate_media(reduced_motion="no-preference")
    await page.evaluate("scrollTo(0,0)")
    await video.scroll_into_view_if_needed()
    await page.wait_for_timeout(300)
    assert await video.evaluate("v => v.paused"), "manual pause was overridden"
    print(label, "manual playback and reduced motion passed", flush=True)
    await page.screenshot(path=str(OUT / f"{label}-video-control.png"))

    # Simulate a browser autoplay-policy rejection, then allow a manual retry.
    await context.add_init_script("""(() => {
      const play = HTMLMediaElement.prototype.play;
      window.allowDemoPlayback = false;
      HTMLMediaElement.prototype.play = function() {
        return window.allowDemoPlayback ? play.call(this) : Promise.reject(new DOMException('Autoplay blocked', 'NotAllowedError'));
      };
    })();""")
    await page.goto(BASE + "/projects/kasmate", wait_until="domcontentloaded")
    await page.wait_for_timeout(500)
    video = page.locator(".case-visual video")
    await video.scroll_into_view_if_needed()
    await page.wait_for_timeout(350)
    assert await page.locator(".video-error").count() == 0
    assert await page.locator(".video-frame button").count() == 0
    await page.evaluate("window.allowDemoPlayback = true")
    await video.click()
    await page.wait_for_function("document.querySelector('.case-visual video').currentTime > 0.15")
    assert await page.locator(".video-error").count() == 0

    # A media failure should offer a retry and clear after playback recovers.
    print(label, "autoplay rejection and recovery passed", flush=True)
    await context.close()
    context = await browser.new_context(viewport={"width": 390, "height": 844})
    page = await context.new_page()
    page.on("pageerror", lambda error: errors.append(str(error)))
    await page.goto(BASE + "/projects/kasmate", wait_until="domcontentloaded")
    await page.wait_for_timeout(500)
    await page.locator(".case-visual video").scroll_into_view_if_needed()
    await page.locator(".case-visual video").evaluate("v => { v.src = '/media/missing-playback-test.mp4'; v.load(); }")
    if await page.locator(".case-visual video").evaluate("v => v.paused"):
        await page.locator(".case-visual video").click()
    await page.wait_for_selector(".video-error")
    await page.locator(".case-visual video").evaluate("v => { v.src = '/media/kasmate-demo-v3.mp4'; }")
    await page.locator(".case-visual video").click()
    await page.wait_for_function("document.querySelector('.case-visual video').currentTime > 0.15")
    assert await page.locator(".video-error").count() == 0
    assert not errors, errors
    await context.close()
    return {"engine": label, "passed": True, "browser_errors": errors}


async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    results = []
    async with async_playwright() as p:
        for engine, label, options in [(p.chromium, "chromium", {"channel": "chrome"}), (p.webkit, "webkit", {})]:
            browser = await engine.launch(headless=True, **options)
            try:
                results.append(await exercise(browser, label))
                print("PASS", label, flush=True)
            finally:
                await browser.close()
    (OUT / "browser-checks.json").write_text(json.dumps({"base": BASE, "results": results}, indent=2))


if __name__ == "__main__":
    asyncio.run(main())
