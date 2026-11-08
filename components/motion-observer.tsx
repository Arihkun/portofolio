"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const revealSelector = "[data-reveal]";

export function MotionObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = new Set<HTMLElement>();
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.revealState = "visible";
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
    );

    const register = () => {
      document.querySelectorAll<HTMLElement>(revealSelector).forEach((element) => {
        if (elements.has(element)) return;
        elements.add(element);
        if (preference.matches) {
          element.dataset.revealState = "visible";
          return;
        }
        element.dataset.revealState = "pending";
        // If already in or near the initial viewport, animate in smoothly right after the Hero entrance
        if (element.getBoundingClientRect().top < window.innerHeight * 1.05) {
          if (!element.style.getPropertyValue("--reveal-delay")) {
            element.style.setProperty("--reveal-delay", "420ms");
          }
          requestAnimationFrame(() => {
            element.dataset.revealState = "visible";
          });
          return;
        }
        observer.observe(element);
      });
    };

    const mutations = new MutationObserver(register);
    mutations.observe(document.getElementById("main-content") ?? document.body, {
      childList: true,
      subtree: true,
    });
    register();

    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest<HTMLElement>("[data-reveal-state='pending']");
      if (!element) return;
      element.dataset.revealState = "visible";
      observer.unobserve(element);
    };
    const onPreferenceChange = () => {
      if (!preference.matches) return;
      observer.disconnect();
      mutations.disconnect();
      elements.forEach((element) => delete element.dataset.revealState);
    };
    document.addEventListener("focusin", onFocus);
    preference.addEventListener("change", onPreferenceChange);

    return () => {
      observer.disconnect();
      mutations.disconnect();
      document.removeEventListener("focusin", onFocus);
      preference.removeEventListener("change", onPreferenceChange);
      elements.forEach((element) => delete element.dataset.revealState);
    };
  }, [pathname]);

  return null;
}
