'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenisInstance } from '@/lib/lenis-instance';

const DOWN_TEXT = 'SCROLL DOWN • ACHYUTHA • SCROLL DOWN • ACHYUTHA •';
const UP_TEXT = 'SCROLL UP • ACHYUTHA • SCROLL UP • ACHYUTHA •';

export function ScrollBadge() {
  const [isFooter, setIsFooter] = useState(false);
  const [text, setText] = useState(DOWN_TEXT);
  const root = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const ring = root.current?.querySelector('.scroll-badge-ring');
      if (ring && !reduceMotion) {
        const spin = gsap.to(ring, { rotation: 360, duration: 22, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
        ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => spin.timeScale(self.direction === 1 ? 1 : -1) });
      }
      const footer = document.getElementById('site-footer');
      if (footer) {
        ScrollTrigger.create({
          trigger: footer,
          start: 'top 75%',
          onEnter: () => { setIsFooter(true); setText(UP_TEXT); },
          onLeaveBack: () => { setIsFooter(false); setText(DOWN_TEXT); },
        });
      }
    });
    return () => context.revert();
  }, []);

  const scrollToTop = () => {
    const lenis = getLenisInstance();
    if (lenis) lenis.scrollTo(0, { duration: 1.1 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button type="button" className={isFooter ? 'scroll-badge is-footer' : 'scroll-badge'} id="scroll-badge" aria-label="Scroll to top" onClick={scrollToTop} ref={root}>
      <svg className="scroll-badge-ring" viewBox="0 0 200 200">
        <defs>
          <path id="scroll-badge-path" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
        </defs>
        <text fontFamily="'Poppins', sans-serif" fontWeight={600} fontSize={13} letterSpacing={3} fill="currentColor">
          <textPath href="#scroll-badge-path" startOffset="0%">{text}</textPath>
        </text>
      </svg>
      <span className="scroll-badge-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M12 4v16M6 14l6 6 6-6" /></svg>
      </span>
    </button>
  );
}
