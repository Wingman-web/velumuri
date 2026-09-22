'use client';

import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEnquiryModal } from '@/components/enquiry-modal';

const STORAGE_KEY = 'achyutha-cookie-consent';

function CookieBanner({ visible, onDismiss }: { visible: boolean; onDismiss: (value: string) => void }) {
  return (
    <div className={visible ? 'cookie-banner is-visible' : 'cookie-banner'} hidden={!visible} role="dialog" aria-live="polite" aria-label="Cookie consent">
      <p>We use cookies to improve your experience and understand how you use our site. See our <Link href="/privacy-policy">Privacy Policy</Link> for details.</p>
      <div className="cookie-banner-actions">
        <button type="button" className="cookie-decline" onClick={() => onDismiss('declined')}>Decline</button>
        <button type="button" className="cookie-accept" onClick={() => onDismiss('accepted')}>Accept</button>
      </div>
    </div>
  );
}

export function SiteFooter() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cookieVisible, setCookieVisible] = useState(false);
  const openEnquiryModal = useEnquiryModal();

  useEffect(() => {
    let alreadyChosen = false;
    try {
      alreadyChosen = !!localStorage.getItem(STORAGE_KEY);
    } catch {
      alreadyChosen = false;
    }
    if (!alreadyChosen) setCookieVisible(true);
  }, []);

  const dismissCookieBanner = (value: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // storage blocked — dismissal still works for this page view
    }
    setCookieVisible(false);
  };

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('js');
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.to('.footer-cta h2 .hero-line-inner', { y: 0, duration: 1, stagger: .14, ease: 'power3.out', scrollTrigger: { trigger: '.footer-cta', start: 'top 85%', once: true } });
    }, root);
    return () => context.revert();
  }, []);

  // Autoplay only when motion is actually wanted — a looping
  // background video is exactly the kind of ambient motion
  // prefers-reduced-motion asks sites to skip. Driven imperatively
  // (rather than the `autoPlay` attribute) so it never starts and then
  // gets stopped a frame later.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.play().catch(() => {
        // Autoplay can be blocked by the browser; the poster frame is
        // still a reasonable static background either way.
      });
    }
  }, []);

  return (
    <footer id="site-footer" ref={root}>
      <video
        ref={videoRef}
        className="footer-video"
        src="/images/hero/footer_bridge_video.mp4"
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="footer-video-scrim" aria-hidden="true" />
      <div className="container footer-inner">
        <div className="footer-cta" id="visit" aria-labelledby="cta-h">
          <h2 id="cta-h">
            <span className="hero-line"><span className="hero-line-inner">Ready To See Your</span></span>
            <span className="hero-line"><span className="hero-line-inner">Next Home?</span></span>
          </h2>
          <button type="button" className="btn-schedule" onClick={() => openEnquiryModal()}>Schedule A Visit <span className="arrow">→</span></button>
        </div>

        <div className="footer-top">
          <div className="footer-brand">
            <img src="/velumuri-assets/images/velumuri_transparent.png" alt="Achyutha" width={153} height={166} loading="lazy" />
            <p className="footer-tagline">Building spaces. Creating legacies.</p>
            <p>Achyutha — building communities in Rajahmundry since 2008. RERA registered, CREDAI member.</p>
            <div className="footer-social">
              <a href="https://www.facebook.com/velumuriinfraprivatelimited" aria-label="Achyutha on Facebook" target="_blank" rel="noopener">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" /></svg>
              </a>
              <a href="https://twitter.com/VelumuriD" aria-label="Achyutha on Twitter" target="_blank" rel="noopener">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 5.9c-.75.33-1.55.55-2.39.65a4.17 4.17 0 0 0 1.83-2.3 8.3 8.3 0 0 1-2.64 1.01 4.15 4.15 0 0 0-7.08 3.78A11.78 11.78 0 0 1 3.16 4.9a4.15 4.15 0 0 0 1.29 5.54 4.1 4.1 0 0 1-1.88-.52v.05a4.16 4.16 0 0 0 3.33 4.08 4.2 4.2 0 0 1-1.87.07 4.16 4.16 0 0 0 3.88 2.89A8.33 8.33 0 0 1 2 18.58a11.75 11.75 0 0 0 6.36 1.87c7.63 0 11.8-6.32 11.8-11.8l-.01-.54A8.4 8.4 0 0 0 22 5.9Z" /></svg>
              </a>
              <a href="https://www.instagram.com/velumuriinfraprivatelimited/" aria-label="Achyutha on Instagram" target="_blank" rel="noopener">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07ZM12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.56a5.9 5.9 0 0 0-2.13 1.39A5.9 5.9 0 0 0 .62 4.15C.32 4.9.12 5.77.06 7.05.01 8.33 0 8.74 0 12s.01 3.67.06 4.95c.06 1.28.26 2.15.56 2.91.3.79.71 1.46 1.38 2.13.67.67 1.34 1.08 2.13 1.38.76.3 1.63.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.06c1.28-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84Zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4Zm6.41-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44Z" /></svg>
              </a>
              <a href="https://www.youtube.com/channel/UCVqYQFHoVH-zH54lDcyQUcg" aria-label="Achyutha on YouTube" target="_blank" rel="noopener">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.56A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.27 3.6Z" /></svg>
              </a>
            </div>
          </div>

          <div className="footer-col footer-contact">
            <h4>Contact</h4>
            <ul>
              <li>
                <span className="footer-icon" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
                </span>
                <span className="footer-contact-text">
                  <a href="mailto:sales@velumuriinfra.com">sales@velumuriinfra.com</a>,{' '}
                  <a href="mailto:vistasrajmundery0056@gmail.com">vistasrajmundery0056@gmail.com</a>
                </span>
              </li>
              <li>
                <span className="footer-icon" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z" /></svg>
                </span>
                <span className="footer-contact-text"><a href="tel:+917660877333">(+91) 76608 77333</a></span>
              </li>
              <li>
                <span className="footer-icon" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s7-7.5 7-12a7 7 0 0 0-14 0c0 4.5 7 12 7 12Z" /><circle cx="12" cy="10" r="2.5" /></svg>
                </span>
                <span className="footer-contact-text">R.S.No. 42/2B, 45/1A1, Opposite Mahalakshmi Market, Beside D-Mart, SriRam Nagar, Near Morampudi Junction, Hukumpeta, Rajahmundry</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={cookieVisible ? 'footer-bottom has-cookie-notice' : 'footer-bottom'}>
          <div className="footer-legal">
            <p>© {new Date().getFullYear()} Velumuri Infra. All rights reserved.</p>
            <p><Link href="/privacy-policy">Privacy Policy</Link></p>
          </div>
          <p><a href="https://wingmanbrandworks.com/" target="_blank" rel="noopener">Designed &amp; Developed by <span className="footer-credit-highlight">Wingman Brandworks LLP</span></a></p>
        </div>
      </div>

      <CookieBanner visible={cookieVisible} onDismiss={dismissCookieBanner} />
    </footer>
  );
}
