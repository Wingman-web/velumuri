'use client';

// Journal index (/blogs) — opens with the same full-bleed image banner
// the About page uses (PageBanner: photo + scrim + centred eyebrow and
// two-line title), animated the same way — eyebrow fades up, each title
// line slides up out of its mask, the photo settles from a slight zoom
// and drifts for parallax — so the two pages read as one family. A
// client component because that reveal is GSAP-driven; the article
// rows below are JournalList's own.
import { useLayoutEffect, useRef, useState } from 'react';
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
      gsap.from('.journal-head', { y: 16, opacity: 0, duration: .8, scrollTrigger: { trigger: '.journal-section', start: 'top 85%', once: true } });
    }, root);
    return () => context.revert();
  }, []);

  return (
    <div ref={root}>
      <PageBanner eyebrow="Journal" lines={['Stories, guides &', 'project updates.']} image="hero/hero.png" alt="The Godavari arch bridge at Rajamahendravaram" />
      <section className="legacy-section journal-section">
        <div className="journal-head">
          <p className="legacy-kicker">All articles</p>
          <span className="journal-count">{String(entries.length).padStart(2, '0')} stories</span>
        </div>
        <JournalList entries={pageEntries} key={page} />
        <JournalPagination page={page} totalPages={totalPages} onChange={goToPage} />
      </section>
    </div>
  );
}
