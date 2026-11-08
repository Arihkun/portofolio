# A personal portfolio, with room to breathe

The approved direction replaces the rigid Research Studio presentation. Lead with Ari and the work; keep technical details where they help explain an actual project.

## Visual system

- Warm paper: `#faf8f4`; text: `#252b29`; secondary text: `#62675f`; restrained accent: `#ac432d`.
- Project surfaces: sage `#e8eddf`, peach `#f4e4d7`, lavender `#efedf5`.
- IBM Plex Sans 400/500/600, served locally from Fontsource packages. IBM Plex Mono 400 is reserved for benchmark values, code, and the 404 identifier. Both font packages include SIL OFL licenses.
- Content width 1160px; side gutters 48px desktop, 32px tablet, 20px mobile. Main hero caps at 72px, with -0.04em tracking and a 1.1 line height.
- Keep readable text measures and generous section separation. Use soft 16px media corners, minimal borders, and natural image framing.

## Composition

Homepage: short personal introduction → selected work → portrait/profile → complete project library → email contact.

The benchmark gets a wide two-column showcase; CDE/OCR sit together; Koii is wider than KasMate on desktop. Their existing interface recordings carry the product sections. Mobile follows a single reading order. Facts live in Markdown; short editorial summaries and media references live in `lib/presentation.ts`.

Case studies use an opening artifact, a readable article with table of contents, evidence, and related projects. Shared navigation, About, Resume, footer, 404, favicon, and OG image use the same identity.

## Interaction

- Content is visible at first render. The old global reveal observer is no longer mounted.
- CSS transitions: 180–200ms, specific properties only; no animated layout dimensions.
- The homepage CDE diagram highlights its three stages as it crosses the desktop viewport. Native scrolling, no pinning or extra scroll distance. Below 1024×700, without JS, or under reduced motion, all stages remain static.
- Koii/KasMate: a clickable poster opens playback with native controls, `preload="none"`, no autoplay or automatic resume. Pause below 25% visibility or when the browser tab is hidden. Without JavaScript, the native player remains available.
- Persistent Work/About/Resume navigation on mobile; active route indicated by color and underline. Standard keyboard focus and skip link.

## Verification artifacts

`artifacts/redesign/` contains local screenshots, browser-check reports, and A4 print evidence. The browser script runs against a production server and covers every page at five widths. These artifacts are excluded from Git and public assets.
