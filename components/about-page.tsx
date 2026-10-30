'use client';

import { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageBanner } from '@/components/page-banner';

const img = (path: string) => `/velumuri-assets/images/${path}`;

const stats: [number, string, string, string][] = [
  [23, '+', 'Years', 'Of Industry Experience'],
  [20, '', 'Projects', 'Completed Across Sectors'],
  [600, '+', 'Homes', 'Delivered'],
  [280, '', 'Residences', 'At Velumuri Vistas'],
];

const values: [React.ReactNode, string, string][] = [
  [
    <svg key="trust" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="24" cy="24" r="18" /><path d="M16 24l6 6 11-13" /></svg>,
    'Trust & Reliability',
    'Delivering on commitments and building relationships that last.',
  ],
  [
    <svg key="quality" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="24" cy="18" r="10" /><path d="M18 26l-4 14 10-6 10 6-4-14" /></svg>,
    'Quality & Excellence',
    'Maintaining high standards in planning, construction, and execution.',
  ],
  [
    <svg key="innovation" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M24 6a12 12 0 0 0-7 21.8c1.3 1 2 2.6 2 4.2v1h10v-1c0-1.6.7-3.2 2-4.2A12 12 0 0 0 24 6Z" /><path d="M20 38h8" /><path d="M21 42h6" /></svg>,
    'Innovation',
    'Embracing progressive ideas to create better living environments.',
  ],
  [
    <svg key="customer" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M24 40S6 29 6 17a9 9 0 0 1 16-5.6A9 9 0 0 1 38 17c0 12-14 23-14 23Z" /></svg>,
    'Customer First',
    'Putting people, their needs, and their aspirations at the heart of everything we do.',
  ],
];

export function AboutPage() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!root.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // The count-up below never runs under reduced motion — set each
      // stat straight to its final value instead of leaving the "0"
      // placeholder on screen permanently.
      root.current.querySelectorAll<HTMLElement>('.about-stat-num[data-count-to]').forEach((el) => {
        el.textContent = Number(el.dataset.countTo || '0').toLocaleString('en-IN');
      });
      return;
    }
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

      gsap.from('.about-intro-eyebrow', { y: 16, opacity: 0, duration: .9, scrollTrigger: { trigger: '.about-intro', start: 'top 78%', once: true } });
      gsap.to('.about-intro-copy h2 .hero-line-inner', { y: 0, duration: 1, stagger: .14, scrollTrigger: { trigger: '.about-intro', start: 'top 78%', once: true } });
      gsap.from('.about-intro-copy p', { y: 20, opacity: 0, duration: .9, stagger: .15, scrollTrigger: { trigger: '.about-intro', start: 'top 68%', once: true } });

      gsap.from('.about-stats .eyebrow', { y: 16, opacity: 0, duration: .8, scrollTrigger: { trigger: '.about-stats', start: 'top 85%', once: true } });
      gsap.to('.about-stats h2 .hero-line-inner', { y: 0, duration: 1, stagger: .12, scrollTrigger: { trigger: '.about-stats', start: 'top 85%', once: true } });
      gsap.from('.about-stat', { y: 24, opacity: 0, duration: .8, stagger: .1, scrollTrigger: { trigger: '.about-stats-grid', start: 'top 85%', once: true } });
      gsap.utils.toArray<HTMLElement>('.about-stat-num[data-count-to]').forEach((el, i) => {
        const to = Number(el.dataset.countTo || '0');
        const counter = { val: 0 };
        gsap.to(counter, {
          val: to,
          duration: 1.3,
          delay: i * .12,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(counter.val).toLocaleString('en-IN'); },
          scrollTrigger: { trigger: '.about-stats-grid', start: 'top 85%', once: true },
        });
      });

      gsap.from('.chairman-photo', { y: 32, opacity: 0, duration: .95, scrollTrigger: { trigger: '.chairman', start: 'top 78%', once: true } });
      gsap.to('.chairman-copy h2 .hero-line-inner', { y: 0, duration: 1, stagger: .12, scrollTrigger: { trigger: '.chairman', start: 'top 78%', once: true } });
      gsap.from('.chairman-copy p, .chairman-credai, .chairman-sign', { y: 20, opacity: 0, duration: .9, stagger: .1, scrollTrigger: { trigger: '.chairman', start: 'top 78%', once: true } });

      gsap.from('.mission-vision .section-head .eyebrow', { y: 16, opacity: 0, duration: .8, scrollTrigger: { trigger: '.mission-vision', start: 'top 82%', once: true } });
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

      gsap.from('.our-values .section-head .eyebrow', { y: 16, opacity: 0, duration: .8, scrollTrigger: { trigger: '.our-values', start: 'top 85%', once: true } });
      gsap.to('.our-values .section-head h2 .hero-line-inner', { y: 0, duration: 1, stagger: .12, scrollTrigger: { trigger: '.our-values', start: 'top 85%', once: true } });
      gsap.from('.value-card', { y: 24, opacity: 0, duration: .9, stagger: .12, scrollTrigger: { trigger: '.value-grid', start: 'top 80%', once: true } });
      gsap.to('.value-card h3 .hero-line-inner', { y: 0, duration: 1, stagger: .12, scrollTrigger: { trigger: '.value-grid', start: 'top 80%', once: true } });

      gsap.to('.about-cta h2 .hero-line-inner', { y: 0, duration: 1, stagger: .12, scrollTrigger: { trigger: '.about-cta', start: 'top 85%', once: true } });
      gsap.from('.about-cta p, .about-cta .btn-explore', { y: 18, opacity: 0, duration: .9, stagger: .1, scrollTrigger: { trigger: '.about-cta', start: 'top 85%', once: true } });
    }, root);
    return () => context.revert();
  }, []);

  return (
    <div ref={root}>
      <PageBanner eyebrow="About Us" lines={['Building Rajahmundry’s Future,', 'One Home at a Time']} image="banners/about_desktop.jpg" tablet="banners/about_tablet.jpg" mobile="banners/about_mobile.jpg" align="right" alt="Velumuri Vistas at dusk" />

      <section className="about-intro about-page-intro" aria-labelledby="about-intro-h">
        <div className="container about-intro-grid">
          <p className="eyebrow about-intro-eyebrow">Who We Are</p>
          <div className="about-intro-copy">
            <h2 id="about-intro-h">
              <span className="hero-line"><span className="hero-line-inner">A Legacy of Trust</span></span>
              <span className="hero-line"><span className="hero-line-inner">A Vision for Tomorrow</span></span>
            </h2>
            <p>Since 2003, our journey has been defined by a commitment to quality, innovation, and lasting relationships.</p>
            <p>We started off with plotted developments in Rajahmundry and have since grown into a diverse real estate portfolio spanning residential, commercial, and hospitality projects across Andhra Pradesh and Karnataka.</p>
            <p>With over two decades of experience, we continue to create spaces that reflect thoughtful planning, dependable construction, and a vision for better living.</p>
          </div>
        </div>
      </section>

      <section className="about-stats" aria-labelledby="about-stats-h">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Our Legacy In Numbers</p>
            <h2 id="about-stats-h">
              <span className="hero-line"><span className="hero-line-inner">Experience That</span></span>
              <span className="hero-line"><span className="hero-line-inner">Reassures</span></span>
            </h2>
          </div>
          <div className="about-stats-grid">
            {stats.map(([value, suffix, unit, label]) => (
              <div className="about-stat" key={unit}>
                <span className="about-stat-value">
                  <span className="about-stat-num" data-count-to={value}>0</span>{suffix} <span className="about-stat-unit">{unit}</span>
                </span>
                <span className="about-stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="chairman" aria-labelledby="chairman-h">
        <div className="container chairman-grid">
          <p className="eyebrow chairman-eyebrow">The Visionary Behind Velumuri</p>

          <div className="chairman-photo">
            <img
              src="/images/hero/Chairman.png"
              alt="Velumuri Bhima Shankar Rao, Founder of Velumuri Infra"
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
            <h2 id="chairman-h">
              <span className="hero-line"><span className="hero-line-inner">Building With Vision</span></span>
              <span className="hero-line"><span className="hero-line-inner">Leading With Integrity</span></span>
            </h2>
            <p>With over two decades of real estate experience, Mr. Velumuri Bhima Shankar Rao has been integral in shaping Velumuri Infra into a trusted name in property development.</p>
            <p>His journey is built on a strong foundation of integrity, quality, and an unwavering commitment to customers.</p>
            <div className="chairman-credai">
              <img className="chairman-credai-logo" src={img('member_credai.png')} alt="Member of CREDAI" width={430} height={117} loading="lazy" />
              <p>An active member of <strong>CREDAI</strong> and a former Joint Secretary at the Andhra Pradesh state level, he brings industry expertise, responsible leadership, and a progressive outlook to every development.</p>
            </div>
            <p>His vision continues to guide Velumuri Infra towards new milestones, while staying true to the values on which it was built.</p>
            <div className="chairman-sign">
              <span className="chairman-name">Mr. Velumuri Bhima Shankar Rao</span>
              <span className="chairman-title">Founder, Velumuri Infra</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mission-vision mood-cream" aria-labelledby="mv-h">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Our Purpose</p>
            <h2 className="visually-hidden" id="mv-h">Vision and Mission</h2>
          </div>
          <div className="mv-layout">
            <div className="mv-col mv-col-vision">
              <h3>
                <span className="hero-line"><span className="hero-line-inner">Our Vision</span></span>
              </h3>
              <p className="mv-text">To set new benchmarks in real estate through sustainable and innovative developments that enrich lives and create lasting value.</p>
              <div className="mv-media"><div className="mv-media-mask"><img src={img('vision.jpg')} alt="A resident looking out over Rajahmundry at sunrise" loading="lazy" width={620} height={770} /></div></div>
            </div>

            <div className="mv-col mv-col-mission">
              <h3>
                <span className="hero-line"><span className="hero-line-inner">Our Mission</span></span>
              </h3>
              <p className="mv-text">To deliver exceptional spaces through quality construction, responsible practices, and an uncompromising commitment to customer trust and satisfaction.</p>
              <div className="mv-media"><div className="mv-media-mask"><img src={img('mission.jpg')} alt="Reviewing an architectural model of a residential development" loading="lazy" width={620} height={770} /></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="our-values" aria-labelledby="ov-h">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">What We Stand For</p>
            <h2 id="ov-h">
              <span className="hero-line"><span className="hero-line-inner">Values That Define</span></span>
              <span className="hero-line"><span className="hero-line-inner">Every Development</span></span>
            </h2>
          </div>
          <div className="value-grid">
            {values.map(([icon, title, copy]) => (
              <div className="value-card" key={title}>
                <span className="value-icon" aria-hidden="true">{icon}</span>
                <h3><span className="hero-line"><span className="hero-line-inner">{title}</span></span></h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta" aria-labelledby="about-cta-h">
        <div className="container about-cta-inner">
          <h2 id="about-cta-h">
            <span className="hero-line"><span className="hero-line-inner">A Legacy Built Over Decades</span></span>
            <span className="hero-line"><span className="hero-line-inner">A Future Built Together</span></span>
          </h2>
          <p>Discover the developments that define Velumuri Infra.</p>
          <Link className="btn-explore" href="/projects">Explore Our Projects <span className="arrow">→</span></Link>
        </div>
      </section>
    </div>
  );
}
