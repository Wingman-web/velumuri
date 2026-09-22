'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageBanner } from '@/components/page-banner';

const img = (path: string) => `/velumuri-assets/images/${path}`;

const whyChoose: [React.ReactNode, string, string][] = [
  [
    <svg key="rera" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M24 4 8 10v11c0 10 7 16.5 16 19 9-2.5 16-9 16-19V10Z" /><path d="M16 24l6 6 11-12" /></svg>,
    'Fully Complying RERA',
    'We follow every government, statutory and legal requirement to the letter, so every home you buy from us is completely risk-free.',
  ],
  [
    <svg key="service" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 26v-4a16 16 0 0 1 32 0v4" /><rect x="4" y="24" width="8" height="10" rx="3" /><rect x="36" y="24" width="8" height="10" rx="3" /><path d="M40 34v2a6 6 0 0 1-6 6h-6" /></svg>,
    'Customer Service',
    'Our team stays responsive long after the sale — because every letter in Velumuri carries the spirit of the service we promise.',
  ],
  [
    <svg key="support" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="24" cy="24" r="18" /><path d="M24 14v10l7 5" /></svg>,
    '24 Hours Support',
    'Have a question about a flat, a site visit, or an existing home? Our team is a call away, any time, day or night.',
  ],
];

export function AboutPage() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('js');
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.from('.page-banner-content .eyebrow', { y: 16, opacity: 0, duration: .8, scrollTrigger: { trigger: '.page-banner', start: 'top 90%', once: true } });
      gsap.to('.page-banner-content h1 .hero-line-inner', { y: 0, duration: 1, stagger: .12, scrollTrigger: { trigger: '.page-banner', start: 'top 90%', once: true } });
      const bannerImg = document.querySelector<HTMLElement>('.page-banner .hero-media img');
      if (bannerImg) {
        gsap.set(bannerImg, { scale: 1.12 });
        gsap.to(bannerImg, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.page-banner', start: 'top bottom', end: 'bottom top', scrub: true } });
      }

      gsap.from('.chairman-photo', { y: 32, opacity: 0, duration: .95, scrollTrigger: { trigger: '.chairman', start: 'top 78%', once: true } });
      gsap.to('.chairman-copy h2 .hero-line-inner', { y: 0, duration: 1, stagger: .12, scrollTrigger: { trigger: '.chairman', start: 'top 78%', once: true } });
      gsap.from('.chairman-copy blockquote, .chairman-copy p, .chairman-credai, .chairman-sign', { y: 20, opacity: 0, duration: .9, stagger: .1, scrollTrigger: { trigger: '.chairman', start: 'top 78%', once: true } });

      document.querySelectorAll<HTMLElement>('.mv-col').forEach((col) => {
        const eyebrow = col.querySelector('.eyebrow');
        if (eyebrow) gsap.from(eyebrow, { y: 16, opacity: 0, duration: .8, scrollTrigger: { trigger: col, start: 'top 85%', once: true } });
        gsap.to(col.querySelectorAll('h3 .hero-line-inner'), { y: 0, duration: 1, stagger: .12, scrollTrigger: { trigger: col, start: 'top 85%', once: true } });
        const text = col.querySelector('.mv-text');
        if (text) gsap.from(text, { y: 16, opacity: 0, duration: .9, scrollTrigger: { trigger: col, start: 'top 82%', once: true } });
        const mask = col.querySelector<HTMLElement>('.mv-media-mask');
        const maskImg = mask?.querySelector('img');
        if (mask) {
          gsap.fromTo(mask, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', ease: 'none', scrollTrigger: { trigger: mask, start: 'top 95%', end: 'top 35%', scrub: .6 } });
          if (maskImg) gsap.fromTo(maskImg, { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: mask, start: 'top 95%', end: 'top 35%', scrub: .6 } });
        }
      });

      gsap.from('.wc-card', { y: 24, opacity: 0, duration: .9, stagger: .12, scrollTrigger: { trigger: '.wc-grid', start: 'top 80%', once: true } });
      gsap.to('.wc-card h3 .hero-line-inner', { y: 0, duration: 1, stagger: .12, scrollTrigger: { trigger: '.wc-grid', start: 'top 80%', once: true } });
    }, root);
    return () => context.revert();
  }, []);

  return (
    <div ref={root}>
      <PageBanner eyebrow="About Us" lines={['Building Rajahmundry’s Future,', 'One Home At A Time.']} image="hero/banner-dusk.png" alt="Velumuri Vistas at dusk" />

      <section className="chairman" aria-labelledby="chairman-h">
        <div className="container chairman-grid">
          <p className="eyebrow chairman-eyebrow">Leadership</p>

          <div className="chairman-photo">
            <img
              src="/images/hero/Chairman.png"
              alt="Bhima Shankar Rao Velumuri, Chairman & Managing Director of Velumuri Infra"
              loading="lazy"
              width={480}
              height={600}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.closest('.chairman-photo')?.classList.add('is-missing');
              }}
            />
            <span className="chairman-photo-fallback" aria-hidden="true">BSV</span>
          </div>

          <div className="chairman-copy">
            <h2 id="chairman-h"><span className="hero-line"><span className="hero-line-inner">Chairman&rsquo;s Message</span></span></h2>
            <blockquote>&ldquo;We are not just builders but we are family.&rdquo;</blockquote>
            <p>Mr. Bhima Shankar Rao Velumuri is synonymous with Mr. Reliable in Rajahmundry for residential real estate development. He has been associated with the sector since 2003, and ventured into active construction on his own since 2008 — completing 16 residential projects and gaining the support of hundreds of satisfied customers.</p>
            <div className="chairman-credai">
              <img className="chairman-credai-logo" src={img('member_credai.png')} alt="Member of CREDAI" width={430} height={117} loading="lazy" />
              <p>He has been an active member, and has held responsible office-bearer positions, in <strong>CREDAI</strong> (Confederation of Real Estate Developers&rsquo; Associations of India) at both Rajahmundry and Andhra Pradesh level &mdash; an association whose focus is to promote real estate development in an ethical manner while protecting the interests of all stakeholders.</p>
            </div>
            <p>A sincere believer of the motto &ldquo;Service to humanity is service to God,&rdquo; he actively contributes to many social and community welfare organisations like YMVA, Vysya Hostel and Vysya Seva Sadanam. &ldquo;Growing together along with the eco-system with healthy networking and skill development&rdquo; is another of his key philosophies, which finds expression through his active leadership in organisations like BNI and JCI.</p>
            <p>His vision is to provide quality homes that will be affordable to all.</p>
            <div className="chairman-sign">
              <span className="chairman-name">Mr. Bhima Shankar Rao Velumuri</span>
              <span className="chairman-title">Chairman &amp; Managing Director — Over 15 Years&rsquo; Experience In Real Estate Development</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mission-vision mood-cream" aria-labelledby="mv-h">
        <div className="container">
          <h2 className="visually-hidden" id="mv-h">Mission and Vision</h2>
          <div className="mv-layout">
            <div className="mv-col mv-col-mission">
              <p className="eyebrow">Our Mission</p>
              <h3>
                <span className="hero-line"><span className="hero-line-inner">Homes Built</span></span>
                <span className="hero-line"><span className="hero-line-inner">On Trust.</span></span>
              </h3>
              <p className="mv-text">To deliver thoughtfully designed, honestly built homes on schedule and within promise — treating every customer&rsquo;s trust as our most valuable asset, from the first site visit to long after the keys are handed over.</p>
              <div className="mv-media"><div className="mv-media-mask"><img src={img('gallery/entrance.jpeg')} alt="Entrance to a Velumuri Infra gated community" loading="lazy" width={1280} height={720} /></div></div>
            </div>

            <div className="mv-col mv-col-vision">
              <p className="eyebrow">Our Vision</p>
              <h3>
                <span className="hero-line"><span className="hero-line-inner">Rajahmundry&rsquo;s Most</span></span>
                <span className="hero-line"><span className="hero-line-inner">Trusted Name.</span></span>
              </h3>
              <p className="mv-text">To be Rajahmundry&rsquo;s most trusted name in real estate — recognised not just for the homes we build, but for the communities and relationships we build around them.</p>
              <div className="mv-media"><div className="mv-media-mask"><img src={img('hero/hero-aerial.jpg')} alt="Aerial view of Velumuri Vistas" loading="lazy" width={1920} height={1030} /></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="why-choose" aria-labelledby="wc-h">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Why Choose Us</p>
            <h2 id="wc-h">Built On Trust, Backed By Commitment.</h2>
          </div>
          <div className="wc-grid">
            {whyChoose.map(([icon, title, copy]) => (
              <div className="wc-card" key={title}>
                <span className="wc-icon" aria-hidden="true">{icon}</span>
                <h3><span className="hero-line"><span className="hero-line-inner">{title}</span></span></h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
