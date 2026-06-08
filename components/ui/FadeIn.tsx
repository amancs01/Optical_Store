"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type FadeInDelay = 0 | 100 | 200 | 300;

export function FadeIn({
  children,
  delay = 0,
  className = "",
  immediate = false,
}: {
  children: ReactNode;
  delay?: FadeInDelay;
  className?: string;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (immediate) {
      setIsVisible(true);
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      node.classList.add("is-visible", "opacity-100", "translate-y-0");
      node.classList.remove("opacity-0", "translate-y-4", "transition", "duration-500", "ease-out");
      node.style.transitionDelay = "0ms";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [immediate]);

  return (
    <div
      ref={ref}
      className={[
        "translate-y-4 opacity-0 transition duration-500 ease-out",
        isVisible ? "is-visible translate-y-0 opacity-100" : "",
        className,
      ].filter(Boolean).join(" ")}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
