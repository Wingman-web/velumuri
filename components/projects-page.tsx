'use client';

// Projects overview (/projects) — same PageBanner treatment and
// scroll-reveal vocabulary as the other converted pages (about-page,
// journal-page, gallery-page): banner reveal + parallax, then the
// card grid and enquiry section each fade in on their own scroll
// trigger instead of appearing flat with the rest of legacy-pages.tsx.
import { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageBanner } from '@/components/page-banner';

const image = (path: string) => `/velumuri-assets/images/${path}`;

const PROJECT_CARDS: [string, string, string, string, string][] = [
  ['Ongoing', 'Velumuri Achyutha', '280 gated 2 & 3 BHK homes near Morampudi Junction, Rajahmundry.', 'projects/velumuri-vistas.jpg', '/ongoing-projects'],
  ['Upcoming', 'The Next Chapter', 'New gated-community developments across Rajahmundry are taking shape.', 'upcoming.jpg', '/upcoming-projects'],
  ['Completed', '16 homes delivered', 'A legacy of homes delivered on time and supported long after handover.', 'completed.jpg', '/previous-projects'],
];

export function ProjectsPage() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('js');
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.from('.page-banner-content .eyebrow', { y: 16, opacity: 0, duration: .8, scrollTrigger: { trigger: '.page-banner', start: 'top 90%', once: true } });
      gsap.to('.page-banner-content h1 .hero-line-inner', { y: 0, duration: 1, stagger: .12, scrollTrigger: { trigger: '.page-banner', start: 'top 90%', once: true } });
      gsap.from('.page-banner-desc', { y: 14, opacity: 0, duration: .8, delay: .3, scrollTrigger: { trigger: '.page-banner', start: 'top 90%', once: true } });
      const bannerImg = root.current?.querySelector<HTMLElement>('.page-banner .hero-media img');
      if (bannerImg) {
        gsap.set(bannerImg, { scale: 1.12 });
        gsap.to(bannerImg, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.page-banner', start: 'top bottom', end: 'bottom top', scrub: true } });
      }

      gsap.from('.projects-grid-section .legacy-kicker', { y: 16, opacity: 0, duration: .8, scrollTrigger: { trigger: '.projects-grid-section', start: 'top 85%', once: true } });
      gsap.from('.projects-grid-section .legacy-card', { y: 28, opacity: 0, duration: .8, stagger: .12, scrollTrigger: { trigger: '.legacy-card-grid', start: 'top 85%', once: true } });
    }, root);
    return () => context.revert();
  }, []);

  return (
    <div ref={root}>
      <PageBanner
        eyebrow="Projects"
        lines={['Every Home We Build,', 'A Promise We Keep.']}
        description="Sixteen delivered. One rising. More to come."
        image="hero/hero-aerial.jpg"
        alt="Aerial view of a Velumuri Infra gated community"
      />
      <section className="legacy-section projects-grid-section">
        <p className="legacy-kicker">Since 2008</p>
        <div className="legacy-card-grid">
          {PROJECT_CARDS.map(([type, title, copy, visual, href]) => (
            <article className="legacy-card" key={title}>
              <img src={image(visual)} alt="" />
              <p>{type}</p>
              <h3>{title}</h3>
              <div>{copy}</div>
              <Link href={href}>Explore <span>→</span></Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
