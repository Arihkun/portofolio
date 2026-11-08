# Local demo and scroll update

The homepage retains its existing dark theme. Scroll reveals move 24px over 600ms, once per page visit, with a 100ms desktop stagger. The observer discovers streamed page content, clears registrations on navigation, and reveals keyboard targets immediately. Reduced motion and JavaScript-disabled rendering keep content readable.

The existing development server had stopped hydrating the page and failed its HMR connection. Restarting that server restored hydration; the late-content observer also covers layout/page mount ordering. Browser verification must check actual intermediate animation frames, not only final visibility.

## Product videos

- `public/media/koii-demo-v2.mp4`: Wishlist, Agenda, itinerary, Memories, and a photo lightbox. The three travel photos are AI-generated fictional assets documented in `D:/Project/koii/public/portfolio-demo/ASSETS.md`.
- `public/media/kasmate-demo-v2.mp4`: real Dashboard, Transactions, and Budgets screen components, mounted with a separate fictional state and an inert backend client. This records UI, not a verified production workflow.
- Previous clips and posters remain unchanged. Both new clips are silent 1280×800 H.264 files, about 18 seconds long, encoded at 30fps from Playwright's 25fps browser capture.
- Videos autoplay only when at least 25% visible, pause offscreen or in a hidden tab, and respect an explicit manual pause. Reduced motion uses manual playback. Play/pause controls and error fallback links remain available; native controls work without JavaScript.

## Reproduction

Run `scripts/capture_project_media_v2.py` only while the development-only fixture routes are intentionally running on Koii port 3001 and KasMate port 5174. It records browser UI rather than constructing synthetic app screens. It permits localhost demo assets, OpenMoji icons, and public font files; API and other external requests are rejected.

The capture report in `artifacts/demo-v2/capture-report.json` documents the KasMate recording recovery after a public font request was blocked. The raw recording was preserved and reviewed; its initial blank frames were removed and its budget ending held to complete the loop.

Run `python scripts/verify_motion_demo_v2.py --url http://127.0.0.1:3000 --round development` for scroll recordings, intermediate animation screenshots, route changes, keyboard focus, reduced motion, no-JavaScript playback controls, and video fallback checks. Run it against a production server as well, then use the existing `scripts/verify_redesign.py` for the full page regression suite.

No deployment is part of this update. Koii and KasMate development servers were stopped at the user's request and must not be automatically restarted.
