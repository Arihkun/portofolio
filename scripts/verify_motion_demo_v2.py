"""Browser regression checks for streamed-page reveals and versioned demo playback."""

import argparse
import json
from pathlib import Path

from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument("--url", default="http://127.0.0.1:3000")
parser.add_argument("--round", default="development")
args = parser.parse_args()
output = Path(__file__).resolve().parents[1] / "artifacts" / "motion-demo-v2" / args.round
output.mkdir(parents=True, exist_ok=True)
report = {"checks": [], "page_errors": []}


def check(name, condition, details=None):
    report["checks"].append({"name": name, "passed": bool(condition), "details": details})


with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", headless=True)
    for width in [1440, 390, 320]:
        context = browser.new_context(viewport={"width": width, "height": 900},
                                      record_video_dir=str(output / "scroll-recordings"))
        page = context.new_page()
        page.on("pageerror", lambda error: report["page_errors"].append(str(error)))
        page.goto(args.url, wait_until="domcontentloaded")
        page.wait_for_selector("[data-reveal-state='pending']", state="attached")
        check(f"observer registers after hydration {width}", page.locator("[data-reveal-state='pending']").count() > 0)
        check(f"hero stays visible {width}", page.locator(".home-hero").evaluate("e=>getComputedStyle(e).opacity==='1'"))
        # Cards already visible during hydration intentionally do not animate again.
        card = page.locator(".showcase[data-reveal-state='pending']").first.element_handle()
        assert card is not None
        sample = card.evaluate("""e=>new Promise(resolve=>{
          scrollTo({top:e.getBoundingClientRect().top+scrollY-innerHeight*.55,behavior:'instant'});
          let attempts=0;
          const sample=()=>{
            const style=getComputedStyle(e), opacity=Number(style.opacity);
            const offset=parseFloat(style.translate.split(' ').at(-1))||0;
            const moving=(opacity>0&&opacity<1)||(offset>0&&offset<24);
            if(moving||++attempts>120) resolve({opacity,translate:style.translate,moving});
            else requestAnimationFrame(sample);
          };
          requestAnimationFrame(sample);
        })""")
        check(f"reveal has visible intermediate frame {width}", sample["moving"], sample)
        page.screenshot(path=str(output / f"reveal-mid-{width}.png"))
        page.wait_for_timeout(700)
        check(f"reveal finishes {width}", card.evaluate("e=>getComputedStyle(e).opacity==='1'"))
        page.evaluate("scrollTo({top:0,behavior:'instant'})")
        page.wait_for_timeout(80)
        check(f"reveal does not replay {width}", card.get_attribute("data-reveal-state") == "visible")
        # Scroll the actual page in small steps so the resulting video shows each entrance.
        height = page.evaluate("document.documentElement.scrollHeight")
        for position in range(0, height, 220):
            page.evaluate("y=>scrollTo({top:y,behavior:'instant'})", position)
            page.wait_for_timeout(120)
        page.wait_for_timeout(700)
        check(f"all reveals visible after scroll {width}", page.locator("[data-reveal-state='pending']").count() == 0)
        check(f"no horizontal page overflow {width}", page.evaluate("document.documentElement.scrollWidth<=innerWidth"))
        page.locator('.main-nav a[href="/about"]').click()
        page.wait_for_url("**/about")
        page.locator('.site-header a[href="/"]').first.click()
        page.wait_for_url(args.url.rstrip("/") + "/")
        page.wait_for_selector("[data-reveal-state='pending']", state="attached")
        check(f"route return registers new page {width}", page.locator("[data-reveal-state='pending']").count() > 0)
        page.locator(".home-contact a").first.focus()
        check(f"keyboard focus reveals content {width}", page.locator(".home-contact").evaluate("e=>getComputedStyle(e).opacity==='1'"))
        page.emulate_media(reduced_motion="reduce")
        page.wait_for_timeout(100)
        check(f"live reduced-motion change clears hidden content {width}", page.locator("[data-reveal-state='pending']").count() == 0)
        context.close()

    for reduced in ["no-preference", "reduce"]:
        context = browser.new_context(viewport={"width": 1440, "height": 900}, reduced_motion=reduced)
        page = context.new_page()
        page.goto(args.url, wait_until="domcontentloaded")
        page.wait_for_timeout(600)
        for slug in ["koii", "kasmate"]:
            video = page.locator(f".video-{slug} video")
            video.evaluate("e=>e.scrollIntoView({block:'center',behavior:'instant'})")
            page.wait_for_timeout(900)
            page.wait_for_function("slug=>document.querySelector('.video-'+slug+' video').readyState>=1", arg=slug)
            details = video.evaluate("v=>({duration:v.duration,muted:v.muted,loop:v.loop,paused:v.paused,src:v.currentSrc})")
            check(f"versioned playable 18-second clip {slug} {reduced}", "-v2.mp4" in details["src"] and abs(details["duration"] - 18) < 0.15, details)
            check(f"muted loop {slug} {reduced}", details["muted"] and details["loop"])
            if reduced == "reduce":
                check(f"reduced motion stops autoplay {slug}", details["paused"])
                page.get_by_role("button", name=f"Play {'Koii' if slug=='koii' else 'KasMate'} demo", exact=True).click()
                page.wait_for_timeout(150)
                check(f"manual playback under reduced motion {slug}", video.evaluate("v=>!v.paused"))
            else:
                check(f"autoplay in view {slug}", not details["paused"])
                page.evaluate("Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))")
                check(f"hidden-tab event pauses video {slug}", video.evaluate("v=>v.paused"))
                page.evaluate("delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))")
                page.wait_for_timeout(150)
                check(f"visible-tab event resumes eligible video {slug}", video.evaluate("v=>!v.paused"))
            page.get_by_role("button", name=f"Pause {'Koii' if slug=='koii' else 'KasMate'} demo", exact=True).click()
            check(f"pause button works {slug} {reduced}", video.evaluate("v=>v.paused"))
            page.evaluate("scrollTo({top:0,behavior:'instant'})")
            page.wait_for_timeout(200)
            video.evaluate("e=>e.scrollIntoView({block:'center',behavior:'instant'})")
            page.wait_for_timeout(400)
            check(f"manual pause persists after scroll {slug} {reduced}", video.evaluate("v=>v.paused"))
        context.close()

    context = browser.new_context(viewport={"width": 390, "height": 844}, java_script_enabled=False)
    page = context.new_page()
    page.goto(args.url)
    check("no JS content remains visible", page.locator("[data-reveal-state]").count() == 0 and page.locator(".home-contact").evaluate("e=>getComputedStyle(e).opacity==='1'"))
    check("no JS native video controls", page.locator("video").evaluate_all("es=>es.every(v=>v.controls&&!v.autoplay)"))
    context.close()

    context = browser.new_context()
    context.route("**/media/koii-demo-v2.mp4", lambda route: route.abort())
    page = context.new_page()
    page.goto(args.url, wait_until="domcontentloaded")
    page.wait_for_function("document.querySelector('.video-koii video').controls===false")
    page.locator(".video-koii video").evaluate("v=>v.scrollIntoView({block:'center',behavior:'instant'})")
    page.wait_for_selector(".video-koii .video-error")
    check("video failure exposes direct fallback link", page.locator(".video-koii .video-error a").get_attribute("href") == "/media/koii-demo-v2.mp4")
    context.close()
    browser.close()

check("no runtime page errors", not report["page_errors"], report["page_errors"])
(output / "report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
failures = [item for item in report["checks"] if not item["passed"]]
print(json.dumps({"checks": len(report["checks"]), "failures": failures, "artifacts": str(output)}, indent=2))
raise SystemExit(bool(failures))
