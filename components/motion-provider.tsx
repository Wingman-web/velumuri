'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setLenisInstance } from '@/lib/lenis-instance';

export function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // lerp a touch lower than Lenis's own default (0.1) for a heavier,
    // more premium settle on every section; wheelMultiplier eased back
    // slightly so a single wheel notch doesn't feel like it's skipping
    // ahead of that smoothing.
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true, wheelMultiplier: 0.9 });
    setLenisInstance(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    let animationFrame = 0;
    const raf = (time: number) => { lenis.raf(time); animationFrame = requestAnimationFrame(raf); };
    animationFrame = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(animationFrame); setLenisInstance(null); lenis.destroy(); };
  }, []);
  return children;
}
