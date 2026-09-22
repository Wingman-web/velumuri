'use client';

// Journal index — an editorial list of alternating rows rather than a
// card grid: odd rows put the copy on the left and the photo on the
// right, even rows flip that (photo left, copy right), so the page reads
// as a zig-zag down the screen. The photo wipes in bottom-to-top via
// clip-path while its image settles from a slight zoom — the exact
// masked-image reveal the homepage (.ac-velumuri, .image-expand) and
// the About page (.mv-media-mask) already use — and the copy column
// fades up in sequence, once, as each row scrolls into view.
import Link from 'next/link';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export type JournalEntry = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
};

export function JournalList({ entries }: { entries: JournalEntry[] }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scope = root.current;
    if (!scope || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('js');
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.journal-item', scope).forEach((item) => {
        const mask = item.querySelector<HTMLElement>('.journal-media-mask');
        const image = mask?.querySelector('img');
        if (mask) {
          const reveal = { trigger: mask, start: 'top 92%', end: 'top 45%', scrub: .6 };
          gsap.fromTo(mask, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', ease: 'none', scrollTrigger: reveal });
          if (image) gsap.fromTo(image, { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: reveal });
        }
        gsap.from(item.querySelectorAll('.journal-copy > *'), {
          y: 22, opacity: 0, duration: .9, stagger: .1, ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 76%', once: true },
        });
      });
    }, scope);

    return () => context.revert();
  }, []);

  return (
    <div className="journal-list" ref={root}>
      {entries.map((entry) => {
        const href = `/blog/${entry.id}`;
        return (
          <article className="journal-item" key={entry.id}>
            {/* The photo is a second link to the same article; it's
                hidden from the tab order so keyboard users land on the
                title link once instead of twice per row. */}
            <Link className="journal-media" href={href} tabIndex={-1} aria-hidden="true">
              <span className="journal-media-mask"><img src={entry.image} alt="" loading="lazy" /></span>
            </Link>
            <div className="journal-copy">
              <h2 className="journal-title"><Link href={href}>{entry.title}</Link></h2>
              <p className="journal-excerpt">{entry.excerpt}</p>
              <Link className="journal-link" href={href}>Read article <span className="journal-link-arrow" aria-hidden="true">&rarr;</span></Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
