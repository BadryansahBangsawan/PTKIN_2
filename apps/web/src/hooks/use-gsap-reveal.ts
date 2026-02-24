"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type RevealItem = {
  selector: string;
  triggerSelector?: string;
  x?: number;
  y?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  start?: string;
  once?: boolean;
};

let scrollTriggerRegistered = false;

function ensureGsapPlugins() {
  if (!scrollTriggerRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    scrollTriggerRegistered = true;
  }
}

export function useGsapReveal<T extends HTMLElement>(
  items: RevealItem[],
) {
  const scopeRef = useRef<T | null>(null);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    ensureGsapPlugins();

    const ctx = gsap.context(() => {
      items.forEach((item) => {
        const targets = gsap.utils.toArray<HTMLElement>(item.selector, scope);
        if (targets.length === 0) return;

        const trigger =
          (item.triggerSelector
            ? (scope.querySelector(item.triggerSelector) as HTMLElement | null)
            : null) ?? targets[0];

        gsap.fromTo(
          targets,
          {
            autoAlpha: 0,
            y: item.y ?? 24,
            x: item.x ?? 0,
          },
          {
            autoAlpha: 1,
            y: 0,
            x: 0,
            duration: item.duration ?? 0.7,
            delay: item.delay ?? 0,
            stagger: item.stagger ?? 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger,
              start: item.start ?? "top 88%",
              once: item.once ?? true,
            },
          },
        );
      });
    }, scope);

    return () => {
      ctx.revert();
    };
    // `items` is expected to be a static config array defined at module scope.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return scopeRef;
}

