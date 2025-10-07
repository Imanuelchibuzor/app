import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

type Props = {
  /** Scroll duration in milliseconds (default 600). */
  duration?: number;
};

export default function ScrollToTop({ duration = 600 }: Props) {
  const { pathname } = useLocation();
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Respect user's reduced motion preference
    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const start = window.scrollY ?? window.pageYOffset;
    const startTime = performance.now();
    const target = 0;
    const distance = target - start;

    // easing function (easeInOutCubic)
    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = ease(t);
      const current = Math.round(start + distance * eased);
      window.scrollTo(0, current);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    };

    // start animation
    rafRef.current = requestAnimationFrame(step);

    // cleanup: cancel animation if pathname changes or component unmounts
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [pathname, duration]);

  return null;
}
