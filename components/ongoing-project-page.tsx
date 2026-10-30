'use client';

// Ongoing project (/ongoing-projects) — Velumuri Achyutha. Same PageBanner
// treatment and scroll-reveal vocabulary as the other converted pages; it was
// previously a static legacy page, so its .hero-line headings never got the
// GSAP reveal and stayed masked once <html> carried .js.
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageBanner } from '@/components/page-banner';
import { useEnquiryModal } from '@/components/enquiry-modal';

const image = (path: string) => `/velumuri-assets/images/${path}`;

const AMENITIES = [
  {
    title: 'Club & Common',
    items: ['Clubhouse', 'Multipurpose hall', 'Gym', 'Yoga room', 'Pool', 'Spa', 'Theatre', 'Guest rooms'],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 21h18M5 21V9l7-5 7 5v12" /><path d="M9 21v-6h6v6" /></svg>,
  },
  {
    title: 'Indoor Sports',
    items: ['Table tennis', 'Billiards', 'Carrom', 'Chess'],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="9" r="5" /><path d="m12.5 12.5 6.5 6.5" /><circle cx="19" cy="5" r="1.6" /></svg>,
  },
  {
    title: 'Outdoor Life',
    items: ['Badminton', 'Basketball', 'Cricket', 'Children’s play court', 'Walking track', 'Outdoor gym'],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v18" /><path d="M12 8c-3 0-5-2-5-5 3 0 5 2 5 5Zm0 4c3 0 5-2 5-5-3 0-5 2-5 5Z" /><path d="M5 21h14" /></svg>,
  },
];

export function OngoingProjectPage() {
  const root = useRef<HTMLDivElement>(null);
  const openEnquiryModal = useEnquiryModal();

  useLayoutEffect(() => {
    if (!root.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('js');
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.from('.page-banner-content .eyebrow', { y: 16, opacity: 0, duration: .8, scrollTrigger: { trigger: '.page-banner', start: 'top 90%', once: true } });
      gsap.to('.page-banner-content h1 .hero-line-inner', { y: 0, duration: 1, stagger: .12, scrollTrigger: { trigger: '.page-banner', start: 'top 90%', once: true } });
      gsap.from('.page-banner-desc', { y: 14, opacity: 0, duration: .8, delay: .3, scrollTrigger: { trigger: '.page-banner', start: 'top 90%', once: true } });

      gsap.from('.ongoing-intro-media', { y: 24, opacity: 0, duration: 1, scrollTrigger: { trigger: '.ongoing-intro', start: 'top 78%', once: true } });
      gsap.from('.ongoing-intro .eyebrow', { y: 16, opacity: 0, duration: .8, scrollTrigger: { trigger: '.ongoing-intro', start: 'top 78%', once: true } });
      gsap.to('.ongoing-intro h2 .hero-line-inner', { y: 0, duration: 1, stagger: .12, scrollTrigger: { trigger: '.ongoing-intro', start: 'top 78%', once: true } });
      gsap.from('.ongoing-intro-copy p, .ongoing-intro-copy .btn-explore', { y: 18, opacity: 0, duration: .9, stagger: .1, scrollTrigger: { trigger: '.ongoing-intro', start: 'top 70%', once: true } });

      gsap.from('.ongoing-amenities .eyebrow', { y: 16, opacity: 0, duration: .8, scrollTrigger: { trigger: '.ongoing-amenities', start: 'top 82%', once: true } });
      gsap.to('.ongoing-amenities h2 .hero-line-inner', { y: 0, duration: 1, stagger: .12, scrollTrigger: { trigger: '.ongoing-amenities', start: 'top 82%', once: true } });
      gsap.from('.amenity-card', { y: 24, opacity: 0, duration: .9, stagger: .12, scrollTrigger: { trigger: '.amenity-grid', start: 'top 82%', once: true } });

      gsap.from('.ongoing-cta-card', { y: 24, opacity: 0, duration: .9, scrollTrigger: { trigger: '.ongoing-cta', start: 'top 85%', once: true } });
      gsap.to('.ongoing-cta h2 .hero-line-inner', { y: 0, duration: 1, stagger: .12, scrollTrigger: { trigger: '.ongoing-cta', start: 'top 85%', once: true } });
    }, root);
    return () => context.revert();
  }, []);

  return (
    <div ref={root} className="ongoing-page">
      <PageBanner
        eyebrow="Ongoing Project"
        lines={['Velumuri Achyutha']}
        description="280 homes, raised with intention, across 3.05 acres near Morampudi Junction."
        image="achyutha/elevation-night.jpg"
        alt="Velumuri Achyutha at night"
        align="left"
      />

      <section className="ongoing-intro" aria-labelledby="ongoing-intro-h">
        <div className="container ongoing-intro-grid">
          <div className="ongoing-intro-media">
            <img src={image('achyutha/podium-night.jpg')} alt="Velumuri Achyutha podium amenities at night" loading="lazy" />
          </div>
          <div className="ongoing-intro-copy">
            <p className="eyebrow">About The Project</p>
            <h2 id="ongoing-intro-h">
              <span className="hero-line"><span className="hero-line-inner">A Master Plan Built</span></span>
              <span className="hero-line"><span className="hero-line-inner">Around Green Space</span></span>
            </h2>
            <p>Five blocks and a clubhouse arranged around shared courts and landscaped corridors — every home is within a short walk of the amenities that matter.</p>
            <button type="button" className="btn-explore" onClick={openEnquiryModal}>Book A Site Visit <span className="arrow">→</span></button>
          </div>
        </div>
      </section>

      <section className="ongoing-amenities" aria-labelledby="ongoing-amenities-h">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Amenities</p>
            <h2 id="ongoing-amenities-h">
              <span className="hero-line"><span className="hero-line-inner">Everything A Community</span></span>
              <span className="hero-line"><span className="hero-line-inner">Needs, Inside The Gate</span></span>
            </h2>
          </div>
          <div className="amenity-grid">
            {AMENITIES.map((group, i) => (
              <article className="amenity-card" key={group.title}>
                <div className="amenity-card-top">
                  <span className="value-icon amenity-icon">{group.icon}</span>
                  <span className="amenity-index">0{i + 1}</span>
                </div>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ongoing-cta" aria-labelledby="ongoing-cta-h">
        <div className="ongoing-cta-card">
          <p className="eyebrow">Schedule A Visit</p>
          <h2 id="ongoing-cta-h">
            <span className="hero-line"><span className="hero-line-inner">Let&apos;s Find The Right</span></span>
            <span className="hero-line"><span className="hero-line-inner">Home For You</span></span>
          </h2>
          <button type="button" className="ongoing-cta-btn" onClick={openEnquiryModal}>Schedule A Visit <span className="arrow">→</span></button>
        </div>
      </section>
    </div>
  );
}
