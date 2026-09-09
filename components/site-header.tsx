'use client';

import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const primaryLinks = [
  { href: '/about', label: 'About' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
  { href: '/nri', label: 'NRI' },
];
const projectLinks = [
  { href: '/projects', label: 'Overview' },
  { href: '/ongoing-projects', label: 'Ongoing' },
  { href: '/upcoming-projects', label: 'Upcoming' },
  { href: '/previous-projects', label: 'Completed' },
];

function ScheduleVisit({ className }: { className?: string }) {
  return (
    <Link className={className ?? 'nav-book'} href="/contact#visit">
      <span className="nav-book-label">Schedule a Visit</span>
      <span className="nav-book-icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const lastFocused = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Nav stays fully hidden over the hero and only reveals once the hero
  // (or, on pages without one, a small initial scroll) has been passed —
  // hides again if the user scrolls back up into it.
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const navItems = header.querySelectorAll<HTMLElement>('.nav-inner > *');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.set(navItems, { opacity: 0, y: -10 });

    let shown = false;
    const setNavVisible = (visible: boolean) => {
      if (shown === visible) return;
      shown = visible;
      gsap.to(navItems, {
        opacity: visible ? 1 : 0,
        y: visible ? 0 : -10,
        duration: reduceMotion ? 0.01 : .5,
        ease: 'power2.out',
        stagger: reduceMotion ? 0 : (visible ? .06 : 0),
      });
    };

    const hero = document.querySelector<HTMLElement>('.hero');
    let trigger: ScrollTrigger | undefined;
    let onScroll: (() => void) | undefined;

    if (hero) {
      gsap.registerPlugin(ScrollTrigger);
      trigger = ScrollTrigger.create({
        trigger: hero,
        start: 'bottom top',
        onEnter: () => { setSolid(true); setNavVisible(true); },
        onLeaveBack: () => { setSolid(false); setNavVisible(false); },
      });
    } else {
      const threshold = 40;
      onScroll = () => {
        const past = window.scrollY > threshold;
        setSolid(past);
        setNavVisible(past);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    return () => {
      trigger?.kill();
      if (onScroll) window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';
    const onKeydown = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKeydown);

    document.documentElement.classList.add('js');
    const links = menuRef.current?.querySelectorAll('a') ?? [];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(links, { opacity: 1, y: 0 });
    } else {
      gsap.fromTo(links, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out', stagger: .06, delay: .1 });
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeydown);
      lastFocused.current?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header id="site-header" className={solid ? 'is-solid' : ''} ref={headerRef}>
        <div className="nav-inner container">
          <div className="nav-brand">
            <Link className="nav-logo" href="/" aria-label="Achyutha — home">
              <img src="/velumuri-assets/images/velumuri_transparent.png" alt="Achyutha" width={153} height={166} loading="eager" fetchPriority="high" />
            </Link>
            <Link className="nav-logo nav-logo-achyutha" href="/projects/achyutha" aria-label="Achyutha project">
              <img src="/images/hero/achyutha.png" alt="" width={187} height={57} loading="eager" />
            </Link>
          </div>
          <div className="nav-actions">
            <ScheduleVisit />
            <button type="button" className="nav-toggle" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)}>
              <span className="nav-toggle-label">Menu</span>
              <span className="nav-toggle-icon" aria-hidden="true"><span className="bar" /></span>
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={open ? 'mobile-menu is-open' : 'mobile-menu'} aria-hidden={!open} ref={menuRef}>
        <div className="mobile-menu-backdrop" onClick={close} />
        <div className="mobile-menu-panel">
          <div className="mobile-menu-top">
            <ScheduleVisit />
            <button type="button" className="mobile-menu-close" onClick={close}>
              <span className="nav-toggle-label">Close</span>
              <span className="mobile-menu-close-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </span>
            </button>
          </div>

          <nav className="mobile-menu-links" aria-label="Primary">
            <Link href="/about" onClick={close}>About</Link>
            <div className="mobile-menu-link-group">
              <Link href="/projects" onClick={close}>Projects</Link>
              <div className="mobile-menu-sub">
                {projectLinks.map(l => <Link href={l.href} key={l.href} onClick={close}>{l.label}</Link>)}
              </div>
            </div>
            {primaryLinks.filter(l => l.href !== '/about').map(l => <Link href={l.href} key={l.href} onClick={close}>{l.label}</Link>)}
          </nav>

          <div className="mobile-menu-meta">
            <div className="mobile-menu-group">
              <h4>Get in touch</h4>
              <div className="mobile-menu-social">
                <a href="mailto:sales@velumuriinfra.com" aria-label="Email Achyutha">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
                </a>
                <a href="tel:+917660877333" aria-label="Call Achyutha">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z" /></svg>
                </a>
              </div>
            </div>
            <div className="mobile-menu-group">
              <h4>Follow Us</h4>
              <div className="mobile-menu-social">
                <a href="https://www.facebook.com/velumuriinfraprivatelimited" aria-label="Achyutha on Facebook" target="_blank" rel="noopener">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" /></svg>
                </a>
                <a href="https://twitter.com/VelumuriD" aria-label="Achyutha on Twitter" target="_blank" rel="noopener">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 5.9c-.75.33-1.55.55-2.39.65a4.17 4.17 0 0 0 1.83-2.3 8.3 8.3 0 0 1-2.64 1.01 4.15 4.15 0 0 0-7.08 3.78A11.78 11.78 0 0 1 3.16 4.9a4.15 4.15 0 0 0 1.29 5.54 4.1 4.1 0 0 1-1.88-.52v.05a4.16 4.16 0 0 0 3.33 4.08 4.2 4.2 0 0 1-1.87.07 4.16 4.16 0 0 0 3.88 2.89A8.33 8.33 0 0 1 2 18.58a11.75 11.75 0 0 0 6.36 1.87c7.63 0 11.8-6.32 11.8-11.8l-.01-.54A8.4 8.4 0 0 0 22 5.9Z" /></svg>
                </a>
                <a href="https://www.instagram.com/velumuriinfraprivatelimited/" aria-label="Achyutha on Instagram" target="_blank" rel="noopener">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07ZM12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.56a5.9 5.9 0 0 0-2.13 1.39A5.9 5.9 0 0 0 .62 4.15C.32 4.9.12 5.77.06 7.05.01 8.33 0 8.74 0 12s.01 3.67.06 4.95c.06 1.28.26 2.15.56 2.91.3.79.71 1.46 1.38 2.13.67.67 1.34 1.08 2.13 1.38.76.3 1.63.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.06c1.28-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84Zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4Zm6.41-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44Z" /></svg>
                </a>
                <a href="https://www.youtube.com/channel/UCVqYQFHoVH-zH54lDcyQUcg" aria-label="Achyutha on YouTube" target="_blank" rel="noopener">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.56A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.27 3.6Z" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
