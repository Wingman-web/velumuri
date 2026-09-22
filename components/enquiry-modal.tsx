'use client';

// Sitewide "Schedule A Visit" enquiry popup — one instance mounted at
// the root layout, opened from anywhere via useEnquiryModal() (the
// navbar's Schedule a Visit button, the fixed side tab, etc.) so every
// trigger shares the same dialog instead of each page needing its own.
// Same no-backend, cosmetic-submit convention as ContactForm
// (components/contact-page.tsx) — there's no API route behind this yet.
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

const EnquiryModalContext = createContext<() => void>(() => {});

export function useEnquiryModal() {
  return useContext(EnquiryModalContext);
}

export function EnquiryModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const lastFocused = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const openModal = () => { setStatus(''); setOpen(true); };
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';
    const onKeydown = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKeydown);
    panelRef.current?.querySelector<HTMLElement>('input')?.focus();

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeydown);
      lastFocused.current?.focus();
    };
  }, [open]);

  return (
    <EnquiryModalContext.Provider value={openModal}>
      {children}
      <div className={open ? 'enquiry-modal is-open' : 'enquiry-modal'} aria-hidden={!open}>
        <div className="enquiry-modal-backdrop" onClick={close} />
        <div className="modal-form enquiry-modal-panel" role="dialog" aria-modal="true" aria-labelledby="enquiry-modal-h" ref={panelRef}>
          <button type="button" className="enquiry-modal-close" onClick={close} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
          <p className="legacy-kicker">Schedule A Visit</p>
          <h3 id="enquiry-modal-h">Let&apos;s find the right home for you.</h3>
          <form autoComplete="off" onSubmit={(e) => { e.preventDefault(); setStatus('Thanks for reaching out — our team will get back to you shortly.'); e.currentTarget.reset(); }}>
            {/* Chrome's "Addresses and more" autofill (the dropdown showing
                saved phone numbers/emails under a person's name) keys
                off input type (email/tel) far more than off name/id or
                autocomplete="off" — which it only honors for a handful
                of categories, address/phone/email not among them. Using
                type="text" everywhere removes that signal entirely;
                format validation moves to `pattern`. autoComplete="new-
                password" is a commonly used stronger override than
                "off" that Chrome does still respect on non-password
                fields. data-1p-ignore/data-lpignore additionally opt
                out of 1Password/LastPass's own suggestion icons. */}
            <div className="field">
              <input type="text" name="visit-name" aria-label="Full Name" placeholder="Full Name *" autoComplete="new-password" data-1p-ignore data-lpignore="true" required />
            </div>
            <div className="field">
              <input type="text" inputMode="email" pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" name="visit-email" aria-label="Email" placeholder="Email *" autoComplete="new-password" data-1p-ignore data-lpignore="true" required />
            </div>
            <div className="field">
              <input type="text" inputMode="tel" pattern="^[0-9+\-\s()]{7,15}$" name="visit-phone" aria-label="Phone Number" placeholder="Phone Number *" autoComplete="new-password" data-1p-ignore data-lpignore="true" required />
            </div>
            <div className="field">
              <input type="text" name="visit-location" aria-label="Location" placeholder="Location *" autoComplete="new-password" data-1p-ignore data-lpignore="true" required />
            </div>
            <button type="submit" className="contact-submit">Schedule My Visit <span aria-hidden="true">→</span></button>
            <p className="form-status" role="status" aria-live="polite">{status}</p>
          </form>
        </div>
      </div>
    </EnquiryModalContext.Provider>
  );
}
