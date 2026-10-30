'use client';

// Projects overview (/projects) — same PageBanner treatment and
// scroll-reveal vocabulary as the other converted pages (about-page,
// journal-page, gallery-page). Ongoing/Upcoming/Completed now live in
// one tabbed section instead of three separate cards, each tab's own
// content fading in on switch (not scroll-linked — only the tab bar
// and whichever panel is active on first scroll-in use ScrollTrigger).
import { useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageBanner } from '@/components/page-banner';
import { useEnquiryModal } from '@/components/enquiry-modal';

const image = (path: string) => `/velumuri-assets/images/${path}`;

type Feature = { image: string; title: string; location: string; tagline: string; status: string; cta: string; href: string };

const FEATURES: Record<'ongoing' | 'upcoming', Feature> = {
  ongoing: {
    image: 'achyutha/elevation-night.jpg',
    title: 'Velumuri Achyutha',
    location: 'Rajahmundry, Andhra Pradesh',
    tagline: 'A New Perspective on Elevated Living.',
    status: 'Ongoing Project',
    cta: 'Explore Project',
    href: '/ongoing-projects',
  },
  upcoming: {
    image: 'upcoming.jpg',
    title: 'The Next Chapter',
    location: 'Rajahmundry, Andhra Pradesh',
    tagline: 'New Gated-Community Developments Across Rajahmundry.',
    status: 'Upcoming Project',
    cta: 'Learn More',
    href: '/upcoming-projects',
  },
};

// Location/type pulled from the client brief — a highlighted subset,
// not the full roster (all 16 are already listed on /previous-projects).
// "Namish Arcade" has no photo of its own yet, so it borrows a generic
// commercial-adjacent stand-in (gallery/entrance.jpeg) until one exists.
const COMPLETED: { name: string; type: string; location: string; image: string }[] = [
  { name: 'Velumuri Vistas', type: '280-Residence Gated Community · Completed December 2023', location: 'Sriram Nagar, Rajahmundry', image: 'vistas/hero-1.jpg' },
  { name: 'Lakshmi Elite', type: 'Residential Development', location: 'Srinivasa Nagar Extension, Rajahmundry', image: 'previous-projects/lakshmi-elite.jpg' },
  { name: 'Fortune Landmark', type: 'Residential Development', location: 'Narayanapuram, Rajahmundry', image: 'previous-projects/fortune-landmark.jpg' },
  { name: 'Velumuri Indraprastha', type: 'Residential Development', location: 'Venkateswara Nagar, Rajahmundry', image: 'previous-projects/velumuri-indraprastha.jpg' },
  { name: 'Myspace Elite', type: 'Residential Development', location: 'Bengaluru, Karnataka', image: 'previous-projects/myspace-elite.jpeg' },
  { name: 'Myspace Akshaya', type: 'Residential Development', location: 'Bengaluru, Karnataka', image: 'previous-projects/myspace-akshaya.jpeg' },
  { name: 'Fortune Trinity', type: 'Commercial Development', location: 'Danavaipeta, Rajahmundry', image: 'previous-projects/fortune-trinity.jpg' },
  { name: 'Namish Arcade', type: 'Commercial Development', location: 'Danavaipeta, Rajahmundry', image: 'gallery/entrance.jpeg' },
];

const TABS = [
  { id: 'ongoing', label: 'Ongoing' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
] as const;

type TabId = (typeof TABS)[number]['id'];

function ProjectFeature({ feature }: { feature: Feature }) {
  return (
    <div className="legacy-split project-feature">
      <img src={image(feature.image)} alt={feature.title} loading="lazy" />
      <div>
        <p className="legacy-kicker">{feature.location}</p>
        <h2>{feature.title}</h2>
        <p>{feature.tagline}</p>
        <span className="project-feature-status">{feature.status}</span>
        <Link className="btn-explore" href={feature.href}>{feature.cta} <span className="arrow">→</span></Link>
      </div>
    </div>
  );
}

export function ProjectsPage() {
  const root = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabId>('ongoing');
  const openEnquiryModal = useEnquiryModal();
  const reducedMotion = useRef(false);

  useLayoutEffect(() => {
    if (!root.current) return;
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion.current) return;
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

      gsap.from('.about-intro-eyebrow', { y: 16, opacity: 0, duration: .9, scrollTrigger: { trigger: '.about-page-intro', start: 'top 78%', once: true } });
      gsap.to('.about-intro-copy h2 .hero-line-inner', { y: 0, duration: 1, stagger: .14, scrollTrigger: { trigger: '.about-page-intro', start: 'top 78%', once: true } });
      gsap.from('.about-intro-copy p', { y: 20, opacity: 0, duration: .9, stagger: .15, scrollTrigger: { trigger: '.about-page-intro', start: 'top 68%', once: true } });

      gsap.from('.projects-tablist', { y: 16, opacity: 0, duration: .8, scrollTrigger: { trigger: '.projects-tabs', start: 'top 82%', once: true } });
      gsap.from('.project-feature', { y: 24, opacity: 0, duration: .9, scrollTrigger: { trigger: '.projects-tabs', start: 'top 75%', once: true } });
      gsap.from('.completed-grid .project-card', { y: 24, opacity: 0, duration: .8, stagger: .08, scrollTrigger: { trigger: '.projects-tabs', start: 'top 75%', once: true } });

      gsap.to('.projects-cta h2 .hero-line-inner', { y: 0, duration: 1, stagger: .12, scrollTrigger: { trigger: '.projects-cta', start: 'top 85%', once: true } });
      gsap.from('.projects-cta p, .projects-cta button', { y: 18, opacity: 0, duration: .9, stagger: .1, scrollTrigger: { trigger: '.projects-cta', start: 'top 85%', once: true } });
    }, root);
    return () => context.revert();
  }, []);

  // Tab switches are user-initiated, not scroll-linked — a plain
  // crossfade on the panel that just became active rather than a
  // ScrollTrigger (which would never fire again after the one-shot
  // reveal above already ran).
  useLayoutEffect(() => {
    if (reducedMotion.current) return;
    const panel = root.current?.querySelector<HTMLElement>(`[data-panel="${activeTab}"]`);
    if (panel) gsap.fromTo(panel, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .5, ease: 'power2.out' });
  }, [activeTab]);

  return (
    <div ref={root} className="projects-page">
      <PageBanner
        eyebrow="Our Projects"
        lines={['Every Project, A Reflection', 'Of Our Promise']}
        image="banners/project_desktop.jpg"
        tablet="banners/project_tablet.jpg"
        mobile="banners/project_mobile.jpg"
        align="left"
        raised
        alt="Aerial view of a Velumuri Infra gated community"
      />

      <section className="about-intro about-page-intro" aria-labelledby="projects-intro-h">
        <div className="container about-intro-grid">
          <p className="eyebrow about-intro-eyebrow">Our Portfolio</p>
          <div className="about-intro-copy">
            <h2 id="projects-intro-h">
              <span className="hero-line"><span className="hero-line-inner">Developments That</span></span>
              <span className="hero-line"><span className="hero-line-inner">Define Our Journey</span></span>
            </h2>
            <p>From residential apartments and gated communities to commercial spaces and hospitality, Velumuri Infra has consistently expanded its horizons.</p>
            <p>Every development reflects our dedication to quality, thoughtful design, and creating lasting value.</p>
          </div>
        </div>
      </section>

      <section className="projects-tabs" aria-label="Projects by status">
        <div className="container">
          <div className="projects-tablist" role="tablist" aria-label="Project status">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                className="projects-tab"
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'ongoing' && (
            <div className="projects-panel" id="panel-ongoing" role="tabpanel" aria-labelledby="tab-ongoing" data-panel="ongoing">
              <ProjectFeature feature={FEATURES.ongoing} />
            </div>
          )}

          {activeTab === 'upcoming' && (
            <div className="projects-panel" id="panel-upcoming" role="tabpanel" aria-labelledby="tab-upcoming" data-panel="upcoming">
              <ProjectFeature feature={FEATURES.upcoming} />
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="projects-panel" id="panel-completed" role="tabpanel" aria-labelledby="tab-completed" data-panel="completed">
              <div className="legacy-card-grid completed-grid">
                {COMPLETED.map((p) => (
                  <article className="project-card" key={p.name}>
                    <img src={image(p.image)} alt={p.name} loading="lazy" />
                    <span className="project-card-tag">Completed</span>
                    <div className="project-card-body">
                      <p className="project-card-type">{p.type}</p>
                      <h3>{p.name}</h3>
                      <p className="project-card-location">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
                        {p.location}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
              <Link className="legacy-link completed-view-all" href="/previous-projects">View All Completed Projects →</Link>
            </div>
          )}
        </div>
      </section>

      <section className="about-cta projects-cta" aria-labelledby="projects-cta-h">
        <div className="container about-cta-inner">
          <h2 id="projects-cta-h">
            <span className="hero-line"><span className="hero-line-inner">Explore Our Portfolio</span></span>
          </h2>
          <p>Discover more about our projects and the experience behind every Velumuri address.</p>
          <button type="button" className="btn-explore" onClick={openEnquiryModal}>Enquire Now <span className="arrow">→</span></button>
        </div>
      </section>
    </div>
  );
}
