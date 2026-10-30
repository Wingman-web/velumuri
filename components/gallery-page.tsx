'use client';

// Gallery (/gallery) — same PageBanner reveal every other converted page
// uses (see journal-page.tsx), followed by a plain photo grid of the
// existing, already-vetted community/amenity photography (no new or
// unverified imagery).
import { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
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
      gsap.from('.gallery-intro .about-intro-eyebrow', { y: 16, opacity: 0, duration: .9, scrollTrigger: { trigger: '.gallery-intro', start: 'top 78%', once: true } });
      gsap.to('.gallery-intro h2 .hero-line-inner', { y: 0, duration: 1, scrollTrigger: { trigger: '.gallery-intro', start: 'top 78%', once: true } });
      gsap.from('.gallery-intro .about-intro-copy p', { y: 20, opacity: 0, duration: .9, stagger: .15, scrollTrigger: { trigger: '.gallery-intro', start: 'top 68%', once: true } });
      gsap.to('.gallery-cta h2 .hero-line-inner', { y: 0, duration: 1, scrollTrigger: { trigger: '.gallery-cta', start: 'top 85%', once: true } });
      gsap.from('.gallery-cta p, .gallery-cta .btn-explore', { y: 18, opacity: 0, duration: .9, stagger: .1, scrollTrigger: { trigger: '.gallery-cta', start: 'top 85%', once: true } });
      gsap.from('.gallery-grid figure', { y: 24, opacity: 0, duration: .7, stagger: .05, scrollTrigger: { trigger: '.gallery-grid', start: 'top 88%', once: true } });
    }, root);
    return () => context.revert();
  }, []);

  return (
    <div ref={root} className="gallery-page">
      <PageBanner eyebrow="Our Gallery" lines={['A Glimpse Into the', 'World of Velumuri']} image="banners/gallery_desktop.jpg" tablet="banners/gallery_tablet.jpg" mobile="banners/gallery_mobile.jpg" alt="Children's play area at a Velumuri community" />
      <section className="about-intro about-page-intro gallery-intro" aria-labelledby="gallery-intro-h">
        <div className="container about-intro-grid">
          <p className="eyebrow about-intro-eyebrow">Our World, In Pictures</p>
          <div className="about-intro-copy">
            <h2 id="gallery-intro-h">
              <span className="hero-line"><span className="hero-line-inner">Every Detail Tells a Story</span></span>
            </h2>
            <p>Explore the architecture, spaces, and developments that reflect Velumuri Infra&rsquo;s journey.</p>
            <p>From completed landmarks to the spaces that bring communities together, our gallery offers a closer look at the quality and thought behind our work.</p>
          </div>
        </div>
      </section>
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

      <section className="about-cta gallery-cta" aria-labelledby="gallery-cta-h">
        <div className="container about-cta-inner">
          <h2 id="gallery-cta-h">
            <span className="hero-line"><span className="hero-line-inner">Inspired by What You See?</span></span>
          </h2>
          <p>Discover the experience and commitment behind every Velumuri development.</p>
          <Link className="btn-explore" href="/projects">View Our Projects <span className="arrow">→</span></Link>
        </div>
      </section>
    </div>
  );
}
