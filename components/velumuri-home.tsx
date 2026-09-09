'use client';

import Link from 'next/link';
import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenisInstance } from '@/lib/lenis-instance';

const img = (path: string) => `/velumuri-assets/images/${path}`;
const advantage = [
  ['01', 'Rajamahendravaram’s tallest building', 'vistas/hero-2.jpg'],
  ['02', 'Godavari view', 'hero/hero-aerial.jpg'],
  ['03', 'Luxury in every detail', 'gallery/waiting-hall.png'],
];
const advantageStats: [string, string][] = [
  ['280', 'Residences'],
  ['25', 'Amenities'],
  ['3.05', 'Acres'],
  ['18+', 'Years of Experience'],
];
const phaseIcons = [
  <svg key="podium" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 42h32" /><path d="M14 42V14" /><path d="M14 14 38 8" /><path d="M14 18 30 14" /><path d="M30 14v6l6-2" /><path d="M14 14v-4" /></svg>,
  <svg key="clubhouse" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="24" cy="24" r="18" /><path d="M30 18 21 21 18 30 27 27Z" /></svg>,
  <svg key="terrace" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="24" cy="24" r="18" /><path d="M16 24l6 6 12-13" /></svg>,
];
const radialHeads: [string, string][] = [
  ['Refined & Bold', 'Essential'],
  ['Simplicity & Clarity', 'of Approach'],
  ['Considered & Calm', 'in Every Detail'],
  ['Honest Materials', 'Built to Last'],
  ['Light, Space', '& Proportion'],
  ['Quiet Confidence', 'Timeless Form'],
  ['Function First', 'Then Beauty'],
  ['Crafted with Care', 'Delivered on Trust'],
];
const quotes = [
  ['Your investment is safe with Achyutha; our homes are worth every bit of investment and offer good returns.', 'Lokesh'],
  ['The availability and attention for a completed project long after delivery is what makes Achyutha trustworthy.', 'Jagan'],
  ['Very good location selection and construction quality that lasts a generation — that is what I can say as a happy customer.', 'Krishna'],
];

export function VelumuriHome() {
  const [quote, setQuote] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const spokesRef = useRef<SVGGElement>(null);
  const numsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('js');
    gsap.registerPlugin(ScrollTrigger);
    const scope = root.current;
    const extraCleanup: Array<() => void> = [];

    const context = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } }).to('.hero-brandmark-line-inner, .hero-title .hero-line-inner', { y: 0, duration: 1, stagger: .12 }, .15).from('.hero-subtitle, .hero-content .btn-explore', { y: 18, opacity: 0, duration: .7, stagger: .1 }, .55);

      gsap.from('.about-intro-eyebrow', { y: 16, opacity: 0, duration: .9, scrollTrigger: { trigger: '.about-intro', start: 'top 78%', once: true } });
      gsap.to('.about-intro-copy h2 .hero-line-inner', { y: 0, duration: 1, stagger: .14, scrollTrigger: { trigger: '.about-intro', start: 'top 78%', once: true } });
      gsap.from('.about-intro-copy p', { y: 20, opacity: 0, duration: .9, stagger: .15, scrollTrigger: { trigger: '.about-intro', start: 'top 68%', once: true } });

      gsap.from('.editorial-people-label, .editorial-people-statement', { y: 20, opacity: 0, duration: .9, stagger: .12, scrollTrigger: { trigger: '.editorial-people-section', start: 'top 75%', once: true } });
      gsap.from('.editorial-people-stat', { y: 16, opacity: 0, duration: .7, stagger: .08, scrollTrigger: { trigger: '.editorial-people-section', start: 'top 70%', once: true } });

      // ---- Advantage cards: sticky stack — each card pins in place and
      // recedes (scales/dims/blurs) as the next one scrolls up to cover it ----
      if (window.matchMedia('(min-width: 900px)').matches) {
        const cardEls = gsap.utils.toArray<HTMLElement>('.editorial-people-card', scope);
        cardEls.forEach((card, i) => {
          if (i === cardEls.length - 1) return;
          gsap.to(card, {
            scale: .93, opacity: .62, filter: 'blur(2px)', transformOrigin: '50% 0%', ease: 'none',
            scrollTrigger: { trigger: cardEls[i + 1], start: 'top 90%', end: 'top 20%', scrub: .5 },
          });
        });
      }

      // ---- Image expand: hero cell grows to fill the screen on scroll, desktop only ----
      const stage = scope.querySelector<HTMLElement>('.image-expand-stage');
      if (stage && window.matchMedia('(min-width: 900px)').matches) {
        const heroEl = stage.querySelector<HTMLElement>('.ie-hero');
        const satellites = gsap.utils.toArray<HTMLElement>('.ie-satellite', stage);
        const heading = stage.querySelector<HTMLElement>('.image-expand-heading');
        if (heroEl) {
          [heroEl, ...satellites].forEach((el) => {
            const image = el.querySelector('img');
            gsap.fromTo(el, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 60%', scrub: .6 } });
            if (image) gsap.fromTo(image, { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 60%', scrub: .6 } });
          });
          const tl = gsap.timeline({ scrollTrigger: { trigger: '.image-expand', start: 'top top', end: '+=260%', scrub: 1, pin: true, invalidateOnRefresh: true } });
          tl.to(heroEl, { top: '0%', left: '0%', width: '100%', height: '100%', borderRadius: 0, ease: 'none' }, 0)
            .to(satellites, { opacity: 0, scale: .85, stagger: .05, ease: 'none' }, 0);
          if (heading) tl.to(heading, { opacity: 1, y: 0, duration: .55, ease: 'none' }, .55).to({}, { duration: .4 });
        }
      } else if (stage) {
        gsap.utils.toArray<HTMLElement>('.image-expand-grid .ie-img').forEach((el) => {
          const image = el.querySelector('img');
          gsap.fromTo(el, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 55%', scrub: .6 } });
          if (image) gsap.fromTo(image, { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 55%', scrub: .6 } });
        });
      }

      // ---- Project phases: one wheel notch = one slide, desktop only ----
      const ppSection = scope.querySelector<HTMLElement>('.project-phases');
      const ppPin = ppSection?.querySelector<HTMLElement>('.project-phases-pin');
      if (ppPin && window.matchMedia('(min-width: 900px)').matches) {
        const bgs = gsap.utils.toArray<HTMLElement>('.pp-bg', ppPin);
        const slides = gsap.utils.toArray<HTMLElement>('.pp-slide', ppPin);
        const segs = gsap.utils.toArray<HTMLElement>('.pp-seg', ppPin);
        const counter = ppPin.querySelector('.pp-current');
        if (bgs.length) {
          let active = 0;
          let animating = false;
          gsap.set(bgs, { xPercent: (i: number) => (i === 0 ? 0 : 100) });

          const goTo = (i: number, direction: number) => {
            if (animating || i === active || i < 0 || i >= bgs.length) return;
            const prev = active;
            active = i;
            animating = true;
            segs.forEach((el, idx) => el.classList.toggle('is-active', idx <= i));
            if (counter) counter.textContent = String(i + 1).padStart(2, '0');
            const slide = slides[i];
            const heading = slide.querySelector('h3');
            const desc = slide.querySelector('p');
            const icon = slide.querySelector('.pp-icon');
            const num = slide.querySelector('.pp-num');
            bgs.forEach((el, idx) => el.classList.toggle('is-active', idx === i));
            slides.forEach((el) => el.classList.remove('is-active'));
            slide.classList.add('is-active');
            gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: () => { animating = false; } })
              .to(bgs[prev], { xPercent: direction > 0 ? -100 : 100, duration: 1 }, 0)
              .fromTo(bgs[i], { xPercent: direction > 0 ? 100 : -100 }, { xPercent: 0, duration: 1 }, 0)
              .set([heading, desc, icon, num], { opacity: 0, y: 18 }, .15)
              .to(icon, { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }, .4)
              .to(heading, { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }, .46)
              .to(desc, { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }, .54)
              .to(num, { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }, .4);
          };

          const st = ScrollTrigger.create({
            trigger: ppPin,
            start: 'top top',
            end: '+=15%',
            pin: true,
            invalidateOnRefresh: true,
            onEnter: () => getLenisInstance()?.stop(),
            onEnterBack: () => getLenisInstance()?.stop(),
            onLeave: () => getLenisInstance()?.start(),
            onLeaveBack: () => getLenisInstance()?.start(),
          });

          const release = (toEnd: boolean) => {
            if (animating) return;
            animating = true;
            const lenis = getLenisInstance();
            const target = (toEnd ? st.end : st.start) + (toEnd ? 40 : -40);
            if (lenis) { lenis.start(); lenis.scrollTo(target, { duration: .9, easing: (t: number) => 1 - Math.pow(1 - t, 3) }); }
            else window.scrollTo({ top: target, behavior: 'smooth' });
            setTimeout(() => { animating = false; }, 950);
          };

          const onWheel = (e: WheelEvent) => {
            if (!st.isActive || Math.abs(e.deltaY) < 4) return;
            if (e.deltaY > 0) { if (active < bgs.length - 1) goTo(active + 1, 1); else release(true); }
            else if (active > 0) goTo(active - 1, -1);
            else release(false);
          };
          window.addEventListener('wheel', onWheel, { passive: true });
          extraCleanup.push(() => { window.removeEventListener('wheel', onWheel); getLenisInstance()?.start(); });
        }
      }

      gsap.from('.interruption-out, .interruption-in', { y: 24, opacity: 0, duration: .9, stagger: .15, scrollTrigger: { trigger: '.interruption', start: 'top 80%', once: true } });
      gsap.to('.interruption-out', { xPercent: -6, ease: 'none', scrollTrigger: { trigger: '.interruption', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.to('.interruption-in', { xPercent: 6, ease: 'none', scrollTrigger: { trigger: '.interruption', start: 'top bottom', end: 'bottom top', scrub: true } });

      // ---- Editorial radial: rotating spoke wheel + 8-heading cycle ----
      const spokesG = spokesRef.current;
      const numsHost = numsRef.current;
      const wheelEl = scope.querySelector<HTMLElement>('.editorial-radial-wheel');
      const headsEls = Array.from(scope.querySelectorAll<HTMLElement>('.editorial-radial-h'));
      if (spokesG && numsHost && wheelEl && headsEls.length) {
        const headLines = headsEls.map((h) => Array.from(h.querySelectorAll<HTMLElement>('.editorial-rline')));
        const spinLine = (lines: HTMLElement[]) => lines.filter((el) => el.classList.contains('editorial-rline--spin'));
        const cx = 456.5, cy = 456.5, numR = 382, spokeLen = numR;
        const spokes: { path: SVGPathElement; ex: number; ey: number; inx: number; iny: number; outx: number; outy: number; px: number; py: number }[] = [];
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const dx = Math.cos(angle), dy = Math.sin(angle);
          const ex = cx + dx * spokeLen, ey = cy + dy * spokeLen;
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('class', 'editorial-radial-spoke');
          spokesG.appendChild(path);
          spokes.push({ path, ex, ey, inx: cx + dx * spokeLen * .45, iny: cy + dy * spokeLen * .45, outx: cx + dx * spokeLen * .82, outy: cy + dy * spokeLen * .82, px: -Math.sin(angle), py: Math.cos(angle) });
          const num = document.createElement('span');
          num.className = 'editorial-radial-num';
          num.textContent = String(i + 1).padStart(2, '0');
          const numRPct = ((numR + 26) / 913) * 100;
          num.style.left = (50 + Math.cos(angle) * numRPct).toFixed(2) + '%';
          num.style.top = (50 + Math.sin(angle) * numRPct).toFixed(2) + '%';
          numsHost.appendChild(num);
        }
        extraCleanup.push(() => { spokesG.innerHTML = ''; numsHost.innerHTML = ''; });

        const drawSpokes = (bend: number) => {
          spokes.forEach((s) => {
            const c1x = s.inx + s.px * bend * .15, c1y = s.iny + s.py * bend * .15;
            const c2x = s.outx + s.px * bend, c2y = s.outy + s.py * bend;
            s.path.setAttribute('d', `M${cx},${cy} C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${s.ex.toFixed(1)},${s.ey.toFixed(1)}`);
          });
        };
        drawSpokes(0);

        gsap.set(headsEls, { autoAlpha: 0 });
        gsap.set(headsEls[0], { autoAlpha: 1 });
        gsap.set(headLines[0], { y: 0, rotation: 0 });

        if (!window.matchMedia('(max-width: 900px)').matches) {
          const bendState = { v: 0 };
          let bendTween: gsap.core.Tween | null = null;
          const pulseBend = (velocity: number) => {
            const target = gsap.utils.clamp(-38, 38, velocity / 45);
            if (bendTween) bendTween.kill();
            bendTween = gsap.to(bendState, {
              v: target, duration: .5, ease: 'elastic.out(1, 0.35)', onUpdate: () => drawSpokes(bendState.v),
              onComplete: () => { bendTween = gsap.to(bendState, { v: 0, duration: .6, ease: 'elastic.out(1, 0.4)', onUpdate: () => drawSpokes(bendState.v) }); },
            });
          };

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: '.editorial-radial-section', start: 'top top', end: '+=240%', scrub: .4,
              pin: '.editorial-radial-pin', anticipatePin: 1, invalidateOnRefresh: true,
              onUpdate: (self) => pulseBend(self.getVelocity()),
            },
          });
          tl.to(wheelEl, { rotation: 360, ease: 'none', duration: 10 }, 0);

          const lineH = (el: HTMLElement) => el.getBoundingClientRect().height;
          const swapFrom = 1;
          const swapGap = (8.5 - swapFrom) / (headsEls.length - 1);
          for (let i = 0; i < headsEls.length - 1; i++) {
            const at = swapFrom + i * swapGap;
            const dur = 1.1;
            const outLines = headLines[i];
            const inLines = headLines[i + 1];
            tl.to(outLines, { y: (_j: number, el: HTMLElement) => -lineH(el), ease: 'power2.inOut', duration: dur, stagger: .05 }, at);
            tl.to(headsEls[i], { autoAlpha: 0, duration: dur * .5 }, at + dur * .55);
            tl.to(headsEls[i + 1], { autoAlpha: 1, duration: dur * .4 }, at);
            tl.fromTo(inLines, { y: (_j: number, el: HTMLElement) => lineH(el) }, { y: 0, ease: 'power2.inOut', duration: dur, stagger: .05 }, at);
            tl.fromTo(spinLine(inLines), { rotation: -110 }, { rotation: 0, ease: 'power3.out', duration: dur * 1.15 }, at);
          }
        }
      }
    }, scope);

    return () => { context.revert(); extraCleanup.forEach((fn) => fn()); };
  }, []);

  return <div ref={root} className="reference-home">
    <section className="hero mood-image" id="hero" aria-label="Introduction">
      <div className="hero-media">
        <img src={img('hero/hero.png')} alt="Aerial view of Achyutha" className="hero-media-img" />
      </div>
      <div className="hero-scrim" />
      <div className="hero-brandmark" aria-hidden="true"><span className="hero-brandmark-line"><span className="hero-brandmark-line-inner">Velumuri</span></span><span className="hero-brandmark-line"><span className="hero-brandmark-line-inner">Achyutha</span></span></div>
      <div className="container hero-content"><h1 className="hero-title"><span className="hero-line"><span className="hero-line-inner">Your Property</span></span><span className="hero-line"><span className="hero-line-inner">Is Our Priority.</span></span></h1><p className="hero-subtitle">Premium 2 & 3 BHK residences near Morampudi Junction, Rajamahendravaram.</p><Link className="btn-explore" href="/ongoing-projects">View project <span className="arrow">→</span></Link></div>
    </section>
    <section className="about-intro" aria-labelledby="about-intro-h"><div className="container about-intro-grid"><p className="eyebrow about-intro-eyebrow">About Achyutha</p><div className="about-intro-copy"><h2 id="about-intro-h"><span className="hero-line"><span className="hero-line-inner">Designed around</span></span><span className="hero-line"><span className="hero-line-inner">how you live.</span></span></h2><p>Each apartment at Achyutha is individually planned to maximise space and light, with options that suit how you actually live.</p><p>We are not just builders; we are family. Every home we deliver carries that same care, long after the keys are handed over.</p></div></div></section>
    <section className="editorial-people-section" id="editorial-people-section" aria-label="What sets Achyutha apart"><div className="editorial-people-layout"><div className="editorial-people-head"><p className="editorial-people-label">Achyutha&apos;s<br />Advantage</p><h3 className="editorial-people-statement">Height, presence, and craftsmanship come together in a home built to stand apart.</h3><div className="editorial-people-stats">{advantageStats.map(([num, label]) => <div className="editorial-people-stat" key={label}><span className="editorial-people-stat-num">{num}</span><span className="editorial-people-stat-label">{label}</span></div>)}</div></div><div className="editorial-people-cards">{advantage.map(([number, title, photo], index) => <article className="editorial-people-card" key={number} style={{ top: `calc(14vh + ${index * 66}px)`, zIndex: index + 1 }}><img className="editorial-people-card-img" src={img(photo)} alt="" /><span className="editorial-people-card-scrim" aria-hidden="true" /><span className="editorial-people-card-sheen" aria-hidden="true" /><div className="editorial-people-card-top"><span className="editorial-people-card-num">{number}</span></div><h4 className="editorial-people-card-title">{title}</h4></article>)}<div className="editorial-people-cards-spacer" /></div></div></section>
    <section className="image-expand mood-cream" aria-label="Life at Achyutha"><div className="image-expand-stage desktop-only"><figure className="ie-img ie-hero"><img src={img('gallery/pathway.jpeg')} alt="Landscaped pathway at Achyutha" /></figure><figure className="ie-img ie-satellite ie-s1"><img src={img('gallery/kids-play-area.jpeg')} alt="Children’s play area" /></figure><figure className="ie-img ie-satellite ie-s2"><img src={img('gallery/cricket-practice-net.jpg')} alt="Cricket practice net" /></figure><figure className="ie-img ie-satellite ie-s3"><img src={img('gallery/skating-rink.jpeg')} alt="Skating rink" /></figure><h2 className="image-expand-heading">Every Level.</h2></div><div className="image-expand-grid mobile-only"><figure className="ie-img"><img src={img('gallery/pathway.jpeg')} alt="Landscaped pathway" /></figure><figure className="ie-img"><img src={img('gallery/kids-play-area.jpeg')} alt="Children’s play area" /></figure><figure className="ie-img"><img src={img('gallery/cricket-practice-net.jpg')} alt="Cricket practice net" /></figure><figure className="ie-img"><img src={img('gallery/skating-rink.jpeg')} alt="Skating rink" /></figure></div></section>
    <section className="project-phases" aria-label="Amenities at every level"><div className="project-phases-pin desktop-only"><div className="pp-media"><img className="pp-bg" src={img('hero/hero-courts.jpg')} alt="Podium-level sports courts" /><img className="pp-bg" src={img('gallery/waiting-hall.png')} alt="Clubhouse waiting lounge" /><img className="pp-bg" src={img('hero/banner-dusk.png')} alt="Achyutha skyline at dusk" /><div className="pp-scrim" /></div><div className="project-phases-panel">{[['01','Podium','A landscaped podium deck above covered parking — a walking pathway, cricket practice net, half-basketball court and kids’ play area.'],['02','Clubhouse','A state-of-the-art clubhouse with a swimming pool, gym, yoga studio, indoor games and a preview theatre.'],['03','Terrace','Open-air terraces above every block frame long, quiet views over Rajamahendravaram.']].map(([number,title,copy], index) => <div className={`pp-slide ${index === 0 ? 'is-active' : ''}`} key={number}><span className="pp-num">{number}</span><div className="pp-slide-head"><span className="pp-icon" aria-hidden="true">{phaseIcons[index]}</span><h3>{title}</h3></div><p>{copy}</p><Link className="pp-card-link" href="/ongoing-projects">Explore {title} <span className="arrow">→</span></Link></div>)}<div className="pp-progress"><span className="pp-seg is-active" /><span className="pp-seg" /><span className="pp-seg" /></div><div className="pp-counter"><span className="pp-current">01</span> / 03</div></div></div><div className="project-phases-grid mobile-only">{[['Podium','hero/hero-courts.jpg'],['Clubhouse','gallery/waiting-hall.png'],['Terrace','hero/banner-dusk.png']].map(([title,photo], index) => <article className="pp-card" key={title}><img src={img(photo)} alt="" /><div className="pp-card-content"><span className="pp-icon" aria-hidden="true">{phaseIcons[index]}</span><h3>{title}</h3><Link className="pp-card-link" href="/ongoing-projects">Explore <span className="arrow">→</span></Link></div></article>)}</div></section>
    <section className="interruption" aria-label="Achyutha philosophy"><div className="container"><h2 className="interruption-out">We Don&apos;t Just Build Homes.</h2><h2 className="interruption-in">We Create <span className="accent-word">Places</span> To Belong.</h2></div></section>
    <section className="editorial-radial-section" id="editorial-radial-section" aria-label="What drives our design">
      <div className="editorial-radial-pin">
        <div className="editorial-radial-heads">
          {radialHeads.map(([line1, line2], i) => <h2 className="editorial-radial-h" key={i}><span className="editorial-rmask"><span className="editorial-rline">{line1}</span></span><span className="editorial-rmask"><span className="editorial-rline editorial-rline--spin">{line2}</span></span></h2>)}
        </div>
        <div className="editorial-radial-wheel">
          <svg className="editorial-radial-svg" viewBox="0 0 913 913" aria-hidden="true">
            <g ref={spokesRef} />
          </svg>
          <div className="editorial-radial-nums" ref={numsRef} />
        </div>
      </div>
    </section>
    <section className="testimonials mood-navy" aria-label="Client stories"><div className="container testimonials-inner"><p className="eyebrow">Client Stories</p><div className="testimonials-stage"><span className="testimonial-mark">“</span><div className="testimonial-slide is-active"><blockquote className="testimonial-quote">{quotes[quote][0]}</blockquote><div className="testimonial-meta"><cite className="testimonial-author">{quotes[quote][1]}</cite></div></div></div><div className="testimonial-controls"><button className="testimonial-arrow" onClick={() => setQuote((quote + quotes.length - 1) % quotes.length)} aria-label="Previous testimonial">←</button><span className="testimonial-count">0{quote + 1} / 0{quotes.length}</span><button className="testimonial-arrow" onClick={() => setQuote((quote + 1) % quotes.length)} aria-label="Next testimonial">→</button></div></div></section>
  </div>;
}
