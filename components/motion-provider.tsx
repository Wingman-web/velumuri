'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setLenisInstance } from '@/lib/lenis-instance';

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // lerp a touch lower than Lenis's own default (0.1) for a heavier,
    // more premium settle on every section; wheelMultiplier eased back
    // slightly so a single wheel notch doesn't feel like it's skipping
    // ahead of that smoothing.
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true, wheelMultiplier: 0.9 });
    lenisRef.current = lenis;
    setLenisInstance(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    let animationFrame = 0;
    const raf = (time: number) => { lenis.raf(time); animationFrame = requestAnimationFrame(raf); };
    animationFrame = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(animationFrame); lenisRef.current = null; setLenisInstance(null); lenis.destroy(); };
  }, []);

  // Lenis outlives every page (it's created once, up here in the root
  // layout) and drives scrolling itself via its own raf loop, so on a
  // client-side navigation it just keeps writing the previous page's
  // scroll position back onto the window every frame — Next's own
  // scroll-to-top (or scroll-to-hash-anchor, for links like
  // /contact#visit) never sticks because Lenis immediately overwrites
  // it. On the homepage that meant the pinned hero opened mid/post
  // day→night transition (yellow .ac-sticky ground + night imagery)
  // instead of at its daylight top state; on every other page it meant
  // landing scrolled halfway down instead of at the hero.
  // lenis.scrollTo(..., { immediate: true, force: true }) both jumps
  // straight to the right target (0, or the #hash element) and resets
  // Lenis's internal target/velocity to match, so it has nothing stale
  // left to fight back to. useLayoutEffect (not useEffect) so this runs
  // in the same commit as the new page, before the next Lenis frame.
  useLayoutEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    const hash = window.location.hash.slice(1);
    const jump = () => {
      const target = hash ? document.getElementById(hash) : null;
      lenis.scrollTo(target ?? 0, { immediate: true, force: true });
      ScrollTrigger.refresh();
    };
    // The hashed target lives in the new page's own content, which can
    // mount a frame after this route-level commit — give it one before
    // falling back to jumping straight to it.
    if (hash) requestAnimationFrame(jump);
    else jump();
  }, [pathname]);

  return children;
}
