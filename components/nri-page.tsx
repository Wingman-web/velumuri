'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageBanner } from '@/components/page-banner';

const img = (path: string) => `/velumuri-assets/images/${path}`;

const services: [React.ReactNode, string, string][] = [
  [
    <svg key="explore" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22 20 10l14 12" /><path d="M10 19v19h12" /><circle cx="33" cy="33" r="7" /><path d="m38 38 5 5" /></svg>,
    'Explore Properties',
    'Discover available developments and find options that suit your requirements.',
  ],
  [
    <svg key="assist" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 26v-3a14 14 0 0 1 28 0v3" /><rect x="6" y="24" width="8" height="12" rx="3" /><rect x="34" y="24" width="8" height="12" rx="3" /><path d="M38 36v3a6 6 0 0 1-6 6h-6" /></svg>,
    'Personalised Assistance',
    'Connect with our team to discuss project details, preferences, and enquiries.',
  ],
  [
    <svg key="info" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4h16l8 8v32H12Z" /><path d="M28 4v8h8" /><path d="M18 24h12M18 30h12M18 36h8" /></svg>,
    'Property Information',
    'Understand the available configurations, specifications, and documentation requirements.',
  ],
  [
    <svg key="comms" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 10h26v16H16l-6 5v-5H6Z" /><path d="M32 18h10v16h-4v5l-6-5H20v-8" /></svg>,
    'Ongoing Communication',
    'Stay connected with our team throughout your enquiry and purchase process.',
  ],
];

function NriContactForm() {
  const [status, setStatus] = useState('');
  return (
    <form className="nri-contact-form" onSubmit={(e) => { e.preventDefault(); setStatus('Thanks for reaching out — our team will get back to you shortly.'); e.currentTarget.reset(); }}>
      <div className="nri-field-grid">
        <div className="nri-field">
          <label htmlFor="nri-name">Full Name <span className="req">*</span></label>
          <input type="text" id="nri-name" name="name" placeholder="John Doe" autoComplete="name" required />
        </div>
        <div className="nri-field">
          <label htmlFor="nri-email">Email <span className="req">*</span></label>
          <input type="email" id="nri-email" name="email" placeholder="you@example.com" autoComplete="email" required />
        </div>
        <div className="nri-field">
          <label htmlFor="nri-country">Country Of Residence</label>
          <input type="text" id="nri-country" name="country" placeholder="e.g. United Arab Emirates" autoComplete="country-name" />
        </div>
        <div className="nri-field">
          <label htmlFor="nri-phone">Phone (With Country Code)</label>
          <input type="tel" id="nri-phone" name="phone" placeholder="+971 50 000 0000" autoComplete="tel" />
        </div>
        <div className="nri-field nri-field--full">
          <label htmlFor="nri-interest">I&rsquo;m Interested In</label>
          <select id="nri-interest" name="interest">
            <option value="achyutha">Velumuri Achyutha (Ongoing)</option>
            <option value="upcoming">Upcoming projects</option>
            <option value="loan">Home loan assistance</option>
            <option value="general">General NRI enquiry</option>
          </select>
        </div>
        <div className="nri-field nri-field--full">
          <label htmlFor="nri-message">Message</label>
          <textarea id="nri-message" name="message" rows={3} placeholder="Budget, configuration, timeline…" />
        </div>
      </div>

      <div className="nri-contact-actions">
        <button type="submit" className="nri-submit">Connect With Our Team <span className="arrow" aria-hidden="true">→</span></button>
        <p className="form-status" role="status" aria-live="polite">{status}</p>
      </div>
    </form>
  );
}

export function NriPage() {
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

      gsap.from('.nri-intro .section-head-eyebrow', { y: 16, opacity: 0, duration: .8, scrollTrigger: { trigger: '.nri-intro', start: 'top 88%', once: true } });
      gsap.to('.nri-intro .section-head-copy h2 .hero-line-inner', { y: 0, duration: 1, stagger: .12, scrollTrigger: { trigger: '.nri-intro', start: 'top 88%', once: true } });
      gsap.from('.nri-intro .section-head-copy p', { y: 16, opacity: 0, duration: .9, scrollTrigger: { trigger: '.nri-intro', start: 'top 84%', once: true } });

      gsap.from('.nri-services .section-head-eyebrow', { y: 16, opacity: 0, duration: .8, scrollTrigger: { trigger: '.nri-services', start: 'top 85%', once: true } });
      gsap.to('.nri-services .section-head-copy h2 .hero-line-inner', { y: 0, duration: 1, stagger: .12, scrollTrigger: { trigger: '.nri-services', start: 'top 85%', once: true } });
      gsap.from('.nri-card', { y: 24, opacity: 0, duration: .9, stagger: .1, scrollTrigger: { trigger: '.nri-grid', start: 'top 82%', once: true } });

      gsap.from('.nri-invest-copy .eyebrow', { y: 16, opacity: 0, duration: .8, scrollTrigger: { trigger: '.nri-invest', start: 'top 84%', once: true } });
      gsap.to('.nri-invest-copy h2 .hero-line-inner', { y: 0, duration: 1, stagger: .12, scrollTrigger: { trigger: '.nri-invest', start: 'top 84%', once: true } });
      gsap.from('.nri-invest-copy > p:not(.eyebrow)', { y: 16, opacity: 0, duration: .9, stagger: .06, scrollTrigger: { trigger: '.nri-invest', start: 'top 80%', once: true } });
      const investMedia = document.querySelector<HTMLElement>('.nri-invest-media');
      if (investMedia) {
        const investImg = investMedia.querySelector('img');
        gsap.fromTo(investMedia, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', ease: 'none', scrollTrigger: { trigger: '.nri-invest', start: 'top 88%', end: 'top 45%', scrub: .6 } });
        if (investImg) gsap.fromTo(investImg, { scale: 1.14 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.nri-invest', start: 'top 88%', end: 'top 45%', scrub: .6 } });
      }

      gsap.to('.nri-contact-head h2 .hero-line-inner', { y: 0, duration: 1, stagger: .12, scrollTrigger: { trigger: '.nri-contact', start: 'top 85%', once: true } });
      gsap.from('.nri-contact-head > p', { y: 16, opacity: 0, duration: .9, scrollTrigger: { trigger: '.nri-contact', start: 'top 82%', once: true } });
      gsap.from('.nri-contact-card', { y: 28, opacity: 0, duration: .9, scrollTrigger: { trigger: '.nri-contact', start: 'top 78%', once: true } });
    }, root);
    return () => context.revert();
  }, []);

  return (
    <div ref={root}>
      <PageBanner eyebrow="NRI Services" lines={['Own a Home Back Home,', 'With the Same Lifestyle']} image="banners/nri_desktop.png" tablet="banners/nri_tablet.jpg" mobile="banners/nri_mobile.jpg" alt="Velumuri Vistas at dusk" />

      <section className="nri-intro" aria-labelledby="ni-h">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow section-head-eyebrow">Connected To Your Roots</p>
            <div className="section-head-copy">
              <h2 id="ni-h">
                <span className="hero-line"><span className="hero-line-inner">Wherever Life Takes You,</span></span>
                <span className="hero-line"><span className="hero-line-inner">Home Stays Close</span></span>
              </h2>
              <p>For those living beyond India&rsquo;s borders, owning a home back home is more than a property decision. It is a connection to family, memories, and the future.</p>
              <p>At Velumuri Infra, we understand that choosing a property from abroad requires clarity, confidence, and dependable communication.</p>
              <p>Our team is here to help you explore your options in Rajahmundry.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="nri-invest" aria-labelledby="nv-h">
        <div className="container nri-invest-grid">
          <div className="nri-invest-media">
            <img src={img('nri-city.webp')} alt="Rajahmundry and the Godavari at sunset" width={1600} height={1195} loading="lazy" />
          </div>
          <div className="nri-invest-copy">
            <p className="eyebrow">A Name You Can Trust</p>
            <h2 id="nv-h">
              <span className="hero-line"><span className="hero-line-inner">Local Expertise</span></span>
              <span className="hero-line"><span className="hero-line-inner">Lasting Confidence</span></span>
            </h2>
            <p>With over two decades of experience in real estate development, Velumuri Infra brings a strong understanding of Rajahmundry&rsquo;s residential landscape.</p>
            <p>Our portfolio of completed developments and commitment to customer relationships offer a foundation of confidence for buyers, wherever they are in the world.</p>
          </div>
        </div>
      </section>

      <section className="nri-services" aria-labelledby="ns-h">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow section-head-eyebrow">Your Property Journey</p>
            <div className="section-head-copy">
              <h2 id="ns-h">
                <span className="hero-line"><span className="hero-line-inner">Simple Conversations</span></span>
                <span className="hero-line"><span className="hero-line-inner">Clearer Decisions</span></span>
              </h2>
            </div>
          </div>

          <div className="nri-grid">
            {services.map(([icon, title, copy]) => (
              <article className="nri-card" key={title}>
                <span className="nri-card-icon" aria-hidden="true">{icon}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="nri-contact" id="enquire" aria-labelledby="nf-h">
        <div className="container">
          <div className="nri-contact-head">
            <h2 id="nf-h">
              <span className="hero-line"><span className="hero-line-inner">Your Connection to</span></span>
              <span className="hero-line"><span className="hero-line-inner">Home Starts Here</span></span>
            </h2>
            <p>Let us help you explore your property options in Rajahmundry.</p>
          </div>

          <div className="nri-contact-card">
            <NriContactForm />

            <div className="nri-contact-strip">
              <a href="mailto:sales@velumuriinfra.com">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
                sales@velumuriinfra.com
              </a>
              <a href="tel:+917660877333">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z" /></svg>
                (+91) 76608 77333
              </a>
              <span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
                Reply within one business day
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
