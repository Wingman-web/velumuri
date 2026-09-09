'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const img = (path: string) => `/velumuri-assets/images/${path}`;

const faqs: [string, string][] = [
  ['Is Velumuri Vistas RERA registered?', 'Yes — Velumuri Vistas is fully RERA registered. We follow every government, statutory and legal requirement, so your investment is completely risk-free.'],
  ['What is the payment schedule for booking a flat?', 'Bookings begin with a token advance, followed by a construction-linked payment plan tied to project milestones. Our sales team will walk you through the exact schedule for your chosen unit.'],
  ['Do you offer home loan assistance?', 'Yes — we work with leading banks and NBFCs to help simplify your home loan approval and disbursement process, from documentation to sanction.'],
  ['What amenities are included in the gated community?', 'Velumuri Vistas includes a clubhouse, children’s play area, sports courts, landscaped podium gardens, 24/7 security, power backup, and dedicated visitor parking.'],
  ['When is possession expected for ongoing projects?', 'Possession timelines vary by block and are shared upfront at the time of booking. Visit our Ongoing Projects page or speak with our team for the latest construction status.'],
  ['How can I schedule a site visit?', 'Use the “Schedule A Visit” button in the footer, fill out the form above, or call us directly — our team will arrange a convenient time to show you around.'],
];

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);
  const bodyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const firstRun = useRef(true);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (firstRun.current) {
      firstRun.current = false;
      bodyRefs.current.forEach((body, i) => { if (body) gsap.set(body, { height: i === openIndex ? 'auto' : 0 }); });
      return;
    }
    bodyRefs.current.forEach((body, i) => {
      if (!body) return;
      if (i === openIndex) {
        gsap.set(body, { height: 'auto' });
        const target = body.offsetHeight;
        gsap.fromTo(body, { height: 0 }, { height: target, duration: reduceMotion ? 0 : .4, ease: 'power2.inOut', onComplete: () => gsap.set(body, { height: 'auto' }) });
      } else {
        gsap.to(body, { height: 0, duration: reduceMotion ? 0 : .35, ease: 'power2.inOut' });
      }
    });
  }, [openIndex]);

  return (
    <div className="faq-list">
      {faqs.map(([q, a], i) => (
        <details className="faq-item" key={q} open={i === openIndex}>
          <summary onClick={(e) => { e.preventDefault(); setOpenIndex((cur) => (cur === i ? -1 : i)); }}>
            {q}<span className="faq-icon" aria-hidden="true" />
          </summary>
          <div className="faq-body" ref={(el) => { bodyRefs.current[i] = el; }}><p>{a}</p></div>
        </details>
      ))}
    </div>
  );
}

function ContactForm() {
  const [status, setStatus] = useState('');
  return (
    <form className="contact-form" id="contact-form" onSubmit={(e) => { e.preventDefault(); setStatus('Thanks for reaching out — our team will get back to you shortly.'); e.currentTarget.reset(); }}>
      <div className="field">
        <label htmlFor="ct-name">Full Name <span className="req">*</span></label>
        <input type="text" id="ct-name" name="name" placeholder="John Doe" autoComplete="name" required />
      </div>
      <div className="field">
        <label htmlFor="ct-email">Email <span className="req">*</span></label>
        <input type="email" id="ct-email" name="email" placeholder="you@example.com" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor="ct-subject">Subject</label>
        <input type="text" id="ct-subject" name="subject" placeholder="Enter subject…" />
      </div>
      <div className="field">
        <label htmlFor="ct-message">Message <span className="req">*</span></label>
        <textarea id="ct-message" name="message" rows={4} placeholder="Enter your message…" required />
      </div>
      <button type="submit" className="contact-submit">Submit</button>
      <p className="form-status" role="status" aria-live="polite">{status}</p>
    </form>
  );
}

export function ContactPage() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('js');
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.from('.contact-intro-heading .eyebrow', { y: 16, opacity: 0, duration: .8, scrollTrigger: { trigger: '.contact-intro', start: 'top 88%', once: true } });
      gsap.to('.contact-intro-heading h1 .hero-line-inner', { y: 0, duration: 1, stagger: .12, scrollTrigger: { trigger: '.contact-intro', start: 'top 88%', once: true } });
      gsap.from('.contact-intro-desc', { y: 16, opacity: 0, duration: .9, scrollTrigger: { trigger: '.contact-intro', start: 'top 85%', once: true } });
      gsap.from('.contact-form .field, .contact-form .contact-submit', { y: 16, opacity: 0, duration: .9, stagger: .08, scrollTrigger: { trigger: '.contact-intro', start: 'top 72%', once: true } });

      const commitment = document.querySelector<HTMLElement>('.contact-commitment');
      if (commitment) {
        const commitmentImg = commitment.querySelector('img');
        gsap.fromTo(commitment, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', ease: 'none', scrollTrigger: { trigger: commitment, start: 'top 95%', end: 'top 45%', scrub: .6 } });
        if (commitmentImg) gsap.fromTo(commitmentImg, { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: commitment, start: 'top 95%', end: 'top 45%', scrub: .6 } });
      }

      gsap.from('.contact-map', { y: 24, opacity: 0, duration: .9, scrollTrigger: { trigger: '.contact-map', start: 'top 85%', once: true } });

      gsap.from('.faq-intro .eyebrow', { y: 16, opacity: 0, duration: .8, scrollTrigger: { trigger: '.faq-layout', start: 'top 85%', once: true } });
      gsap.to('.faq-intro h2 .hero-line-inner', { y: 0, duration: 1, stagger: .12, scrollTrigger: { trigger: '.faq-layout', start: 'top 85%', once: true } });
      gsap.from('.faq-intro p', { y: 16, opacity: 0, duration: .9, scrollTrigger: { trigger: '.faq-layout', start: 'top 82%', once: true } });
      gsap.from('.faq-item', { y: 16, opacity: 0, duration: .9, stagger: .08, scrollTrigger: { trigger: '.faq-layout', start: 'top 80%', once: true } });
    }, root);
    return () => context.revert();
  }, []);

  return (
    <div ref={root}>
      <section className="contact-intro" aria-labelledby="contact-h">
        <div className="container contact-intro-head">
          <div className="contact-intro-heading">
            <p className="eyebrow">Contact Us</p>
            <h1 id="contact-h">
              <span className="hero-line"><span className="hero-line-inner">Let&rsquo;s Help You Find</span></span>
              <span className="hero-line"><span className="hero-line-inner">The Right Home.</span></span>
            </h1>
          </div>
          <p className="contact-intro-desc">Whether you&rsquo;re looking to buy, explore our ongoing projects, or just have a question — our team is ready to guide every step with clarity.</p>
        </div>

        <div className="container">
          <div className="contact-card">
            <div className="contact-commitment">
              <img src={img('gallery/podium-tree-court.jpg')} alt="Landscaped courtyard at a Velumuri Infra gated community" loading="lazy" width={1280} height={720} />
              <div className="contact-commitment-scrim" aria-hidden="true" />
              <div className="contact-commitment-bottom">
                <span className="contact-commitment-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>
                </span>
                <h3>Our Commitment</h3>
                <p>Helping you discover homes that truly match your lifestyle — with clarity, trust, and simplicity.</p>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      <section className="contact-map" aria-label="Our location">
        <iframe
          src="https://www.google.com/maps?q=Near+Morampudi+Junction%2C+Hukumpeta%2C+Rajahmundry&output=embed"
          width="100%" height="100%" style={{ border: 0 }}
          loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          title="Velumuri Vistas location — Near Morampudi Junction, Rajahmundry"
        />
      </section>

      <section className="contact-faq" aria-labelledby="faq-h">
        <div className="container faq-layout">
          <div className="faq-intro">
            <p className="eyebrow">FAQ</p>
            <h2 id="faq-h">
              <span className="hero-line"><span className="hero-line-inner">Things You Should</span></span>
              <span className="hero-line"><span className="hero-line-inner">Know.</span></span>
            </h2>
            <p>We&rsquo;ve answered the most common questions to help you get started with clarity.</p>
          </div>

          <FaqAccordion />
        </div>
      </section>
    </div>
  );
}
