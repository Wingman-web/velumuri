'use client';

// Journal index (/blogs) — opens with the same full-bleed image banner
// the About page uses (PageBanner: photo + scrim + centred eyebrow and
// two-line title), animated the same way — eyebrow fades up, each title
// line slides up out of its mask, the photo settles from a slight zoom
// and drifts for parallax — so the two pages read as one family. A
// client component because that reveal is GSAP-driven; the article
// rows below are JournalList's own.
import { useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageBanner } from '@/components/page-banner';
import { JournalList, type JournalEntry } from '@/components/journal-list';
import { getLenisInstance } from '@/lib/lenis-instance';

const PAGE_SIZE = 4;

function JournalPagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="journal-pagination" aria-label="Journal pages">
      <button
        type="button"
        className="journal-page-arrow"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        &larr;
      </button>
      <ul className="journal-page-numbers">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <li key={n}>
            <button
              type="button"
              className="journal-page-number"
              aria-current={n === page ? 'page' : undefined}
              onClick={() => onChange(n)}
            >
              {n}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="journal-page-arrow"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        &rarr;
      </button>
    </nav>
  );
}

export function JournalPage({ entries }: { entries: JournalEntry[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE));
  const pageEntries = entries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goToPage = (n: number) => {
    if (n < 1 || n > totalPages || n === page) return;
    setPage(n);
    const target = document.querySelector<HTMLElement>('.journal-section');
    if (!target) return;
    const headerHeight = document.querySelector<HTMLElement>('#site-header')?.offsetHeight ?? 0;
    const offset = -(headerHeight + 24);
    const lenis = getLenisInstance();
    if (lenis) lenis.scrollTo(target, { offset, duration: 1.1 });
    else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' });
  };

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
      gsap.from('.journal-intro .about-intro-eyebrow', { y: 16, opacity: 0, duration: .9, scrollTrigger: { trigger: '.journal-intro', start: 'top 78%', once: true } });
      gsap.to('.journal-intro h2 .hero-line-inner', { y: 0, duration: 1, stagger: .14, scrollTrigger: { trigger: '.journal-intro', start: 'top 78%', once: true } });
      gsap.from('.journal-intro .about-intro-copy p', { y: 20, opacity: 0, duration: .9, stagger: .15, scrollTrigger: { trigger: '.journal-intro', start: 'top 68%', once: true } });
      gsap.to('.journal-cta h2 .hero-line-inner', { y: 0, duration: 1, scrollTrigger: { trigger: '.journal-cta', start: 'top 85%', once: true } });
      gsap.from('.journal-cta p, .journal-cta .btn-explore', { y: 18, opacity: 0, duration: .9, stagger: .1, scrollTrigger: { trigger: '.journal-cta', start: 'top 85%', once: true } });
      gsap.from('.journal-head', { y: 16, opacity: 0, duration: .8, scrollTrigger: { trigger: '.journal-section', start: 'top 85%', once: true } });
    }, root);
    return () => context.revert();
  }, []);

  return (
    <div ref={root} className="journal-page">
      <PageBanner eyebrow="The Journal" lines={['Perspectives on Property,', 'Places & Possibilities']} image="banners/blog_desktop.jpg" tablet="banners/blog_tablet.jpg" mobile="banners/blog_mobile.jpg" align="left" raised alt="The Godavari arch bridge at Rajamahendravaram" />
      <section className="about-intro about-page-intro journal-intro" aria-labelledby="journal-intro-h">
        <div className="container about-intro-grid">
          <p className="eyebrow about-intro-eyebrow">Insights &amp; Updates</p>
          <div className="about-intro-copy">
            <h2 id="journal-intro-h">
              <span className="hero-line"><span className="hero-line-inner">Ideas Worth Exploring</span></span>
              <span className="hero-line"><span className="hero-line-inner">Stories Worth Sharing</span></span>
            </h2>
            <p>Stay informed with insights from the world of real estate, practical homebuying guides, evolving lifestyle trends, and the latest developments from Velumuri Infra.</p>
            <p>A space for knowledge, inspiration, and informed decisions.</p>
          </div>
        </div>
      </section>
      <section className="legacy-section journal-section">
        <div className="journal-head">
          <p className="legacy-kicker">All articles</p>
          <span className="journal-count">{String(entries.length).padStart(2, '0')} stories</span>
        </div>
        <JournalList entries={pageEntries} key={page} />
        <JournalPagination page={page} totalPages={totalPages} onChange={goToPage} />
      </section>

      <section className="about-cta journal-cta" aria-labelledby="journal-cta-h">
        <div className="container about-cta-inner">
          <h2 id="journal-cta-h">
            <span className="hero-line"><span className="hero-line-inner">Looking Beyond the Headlines?</span></span>
          </h2>
          <p>Explore the developments and experience behind Velumuri Infra.</p>
          <Link className="btn-explore" href="/projects">Explore Our Projects <span className="arrow">→</span></Link>
        </div>
      </section>
    </div>
  );
}
