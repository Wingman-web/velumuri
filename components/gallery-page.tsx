'use client';

// Gallery (/gallery) — same PageBanner reveal every other converted page
// uses (see journal-page.tsx), followed by a plain photo grid of the
// existing, already-vetted community/amenity photography (no new or
// unverified imagery).
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageBanner } from '@/components/page-banner';

const image = (path: string) => `/velumuri-assets/images/gallery/${path}`;

const PHOTOS: [string, string][] = [
  ['entrance.jpeg', 'Gate'],
  ['pathway.jpeg', 'Walking track'],
  ['podium.jpg', 'Multipurpose plaza'],
  ['podium-tree-court.jpg', 'Tree house'],
  ['half-basketball.jpeg', 'Half basketball court'],
  ['badminton-court.jpeg', 'Badminton court'],
  ['cricket-practice-net.jpg', 'Cricket pitch'],
  ['skating-rink.jpeg', 'Skating rink'],
  ['kids-play-area.jpeg', 'Children’s playground'],
  ['guest-waiting-lounge.png', 'Guest lounge'],
  ['waiting-hall.png', 'Waiting hall'],
  ['live-1.jpg', 'Construction update'],
  ['live-2.jpg', 'Construction update'],
  ['live-3.jpg', 'Construction update'],
  ['live-4.jpg', 'Construction update'],
  ['live-5.jpg', 'Construction update'],
  ['live-6.jpg', 'Construction update'],
];

export function GalleryPage() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('js');
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.from('.page-banner-content .eyebrow', { y: 16, opacity: 0, duration: .8, scrollTrigger: { trigger: '.page-banner', start: 'top 90%', once: true } });
      gsap.to('.page-banner-content h1 .hero-line-inner', { y: 0, duration: 1, stagger: .12, scrollTrigger: { trigger: '.page-banner', start: 'top 90%', once: true } });
      const bannerImg = root.current?.querySelector<HTMLElement>('.page-banner .hero-media img');
      if (bannerImg) {
        gsap.set(bannerImg, { scale: 1.12 });
        gsap.to(bannerImg, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.page-banner', start: 'top bottom', end: 'bottom top', scrub: true } });
      }
      gsap.from('.gallery-grid figure', { y: 24, opacity: 0, duration: .7, stagger: .05, scrollTrigger: { trigger: '.gallery-grid', start: 'top 88%', once: true } });
    }, root);
    return () => context.revert();
  }, []);

  return (
    <div ref={root}>
      <PageBanner eyebrow="Gallery" lines={['A closer look at', 'life at Achyutha.']} image="hero/hero-playground.jpg" alt="Children's play area at a Velumuri community" />
      <section className="legacy-section gallery-section">
        <p className="legacy-kicker">Community & construction</p>
        <div className="gallery-grid">
          {PHOTOS.map(([file, caption]) => (
            <figure key={file}>
              <img src={image(file)} alt={caption} loading="lazy" />
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
