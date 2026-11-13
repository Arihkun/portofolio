"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { demoMedia } from "@/lib/presentation";
import { ArrowRight } from "@/components/icons";

export function ProjectVisual({ slug, large = false }: { slug: string; large?: boolean }) {
  const media = demoMedia[slug];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playError, setPlayError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const manuallyPaused = useRef(false);

  const autoPlay = media?.autoPlayOnScroll !== false;

  const requestPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    void video.play().then(() => {
      setIsPlaying(true);
    }).catch((cause: unknown) => {
      if (!video.isConnected) return;
      const name = cause instanceof Error ? cause.name : "";
      if (name === "AbortError" || name === "NotAllowedError") return;
      if (video.error || name === "NotSupportedError") {
        setPlayError("The demo could not load. Tap the video to retry or open it directly.");
      }
    });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoPlay) return;

    video.defaultMuted = true;
    video.muted = true;
    video.controls = false;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    manuallyPaused.current = false;
    let isVisible = false;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
      if (isVisible) {
        if (!preference.matches && !manuallyPaused.current && !document.hidden) {
          video.muted = true;
          requestPlay();
        }
      } else {
        if (!video.paused) {
          video.pause();
          setIsPlaying(false);
        }
      }
    }, { threshold: [0, 0.25] });

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (!video.paused) {
          video.pause();
          setIsPlaying(false);
        }
      } else if (isVisible && !preference.matches && !manuallyPaused.current) {
        video.muted = true;
        requestPlay();
      }
    };

    observer.observe(video);
    document.addEventListener("visibilitychange", onVisibilityChange);
    const onPreferenceChange = () => { if (preference.matches) { video.pause(); setIsPlaying(false); } };
    preference.addEventListener("change", onPreferenceChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      preference.removeEventListener("change", onPreferenceChange);
    };
  }, [slug, requestPlay, autoPlay]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    manuallyPaused.current = !video.paused;
    if (video.paused) {
      setPlayError("");
      if (video.error) video.load();
      if (!autoPlay) {
        video.controls = true;
      }
      requestPlay();
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const domainMap: Record<string, { domain: string; badge: string; appName: string }> = {
    koii: { domain: "koii.ai.id/demo", badge: "PREVIEW", appName: "Koii" },
    kasmate: { domain: "kasmate.app/demo", badge: "DEMO", appName: "KasMate" },
    "wedding-invitation": { domain: "kinaroki.wedding/invite", badge: "INVITATION", appName: "Wedding Invitation" },
  };
  const meta = domainMap[slug] || { domain: "demo.app", badge: "DEMO", appName: "Project" };

  if (media) return (
    <figure className={`project-visual project-visual-video video-${slug} ${large ? "project-visual-large" : ""}`}>
      <div className="hyperframe-mockup">
        <div className="hyperframe-header" aria-hidden="true">
          <div className="hyperframe-dots">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <div className="hyperframe-url">
            <span className="hyperframe-lock">🔒</span>
            <span className="hyperframe-domain">{meta.domain}</span>
          </div>
          <div className="hyperframe-badge">{meta.badge}</div>
        </div>
        <div className="video-frame">
          <video
            ref={videoRef}
            src={media.src}
            poster={media.poster}
            playsInline
            muted
            loop={autoPlay}
            controls={!autoPlay && isPlaying}
            preload="metadata"
            disablePictureInPicture
            onClick={togglePlayback}
            onPlaying={() => { setPlayError(""); setIsPlaying(true); }}
            onPause={() => setIsPlaying(false)}
            onError={() => setPlayError("The demo could not load. Tap the video to retry or open it directly.")}
            aria-label={`${meta.appName} demo: ${media.caption}`}
          >
            <a href={media.src}>Open the demo video</a>
          </video>
          {!autoPlay && !isPlaying && (
            <button
              type="button"
              className="video-play-overlay"
              onClick={togglePlayback}
              aria-label="Play demo video"
            >
              <span className="play-icon" aria-hidden="true">▶</span>
              <span className="play-text">Watch Demo</span>
            </button>
          )}
        </div>
      </div>
      {playError && <p className="video-error" role="status">{playError} <a href={media.src}>Open video</a></p>}
      <figcaption>{media.caption}{slug === "koii" && <> Icons: <a href="https://openmoji.org/" target="_blank" rel="noreferrer">OpenMoji</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>.</>}</figcaption>
    </figure>
  );

  if (slug === "credit-scoring-ml") return (
    <figure className={`project-visual benchmark-visual ${large ? "project-visual-large" : ""}`}>
      <figcaption>Public-data credit-scoring benchmark</figcaption>
      <p className="visual-label">Independent public-data benchmark · UCI</p>
      <dl className="benchmark-results">
        <div><dt>ROC-AUC</dt><dd>0.7773</dd><span>Ranking discrimination</span></div>
        <div><dt>PR-AUC</dt><dd>0.5518</dd><span>Precision and recall</span></div>
        <div><dt>Brier score</dt><dd>0.1354</dd><span>Probability error</span></div>
      </dl>
      <div className="capture-result"><span className="capture-bar" aria-hidden="true"><i /></span><p><strong>31.5%</strong> of defaults captured in the top 10%.</p></div>
      <p className="visual-footnote">6,000-row random holdout · Histogram gradient boosting.<br />Educational results; not employer-model or out-of-time performance.</p>
    </figure>
  );
  if (slug === "cde-gorules") return (
    <figure className="project-visual flow-visual">
      <figcaption>Decision flow example</figcaption>
      <div className="flow-steps"><span>Input</span><ArrowRight /><span>Rules</span><ArrowRight /><span>Decision</span></div>
      <p>The rules evaluate the input and return a decision with a reason.</p>
      <p className="visual-footnote">Illustrative system pattern, not a live decision engine.</p>
    </figure>
  );
  if (slug === "indonesian-document-ocr") return (
    <figure className="project-visual ocr-visual">
      <figcaption>Document extraction and review</figcaption>
      <div className="ocr-pipeline">
        <div className="ocr-document"><span>Fictional document</span><dl><dt>Name</dt><dd>Demo Person</dd><dt>Document</dt><dd>Sample only</dd></dl></div>
        <ArrowRight />
        <div className="ocr-extracted"><span>Extracted fields</span><dl><dt>Name</dt><dd>Demo Person</dd><dt>Review</dt><dd>Required</dd></dl></div>
      </div>
      <p className="visual-footnote">KTP extraction + KK layout processing.<br />No real identity data. KK remains in development.</p>
    </figure>
  );
  return null;
}
