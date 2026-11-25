'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { programmes } from '@/lib/demo-data';
import { SectionLink } from './section-link';

export type PublicDialog =
  | { type: 'contact' }
  | { type: 'support' }
  | { type: 'forgot-password' }
  | { type: 'programme'; code: string }
  | null;

type PublicDialogContextValue = {
  open: (dialog: Exclude<PublicDialog, null>) => void;
  close: () => void;
};

const PublicDialogContext = createContext<PublicDialogContextValue>({
  open: () => undefined,
  close: () => undefined,
});

export function usePublicDialog() {
  return useContext(PublicDialogContext);
}

export function PublicDialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<PublicDialog>(null);
  const [notice, setNotice] = useState('');
  const value = useMemo<PublicDialogContextValue>(() => ({
    open: next => { setNotice(''); setDialog(next); },
    close: () => { setNotice(''); setDialog(null); },
  }), []);
  const programme = dialog?.type === 'programme' ? programmes.find(item => item.code === dialog.code) : undefined;

  return (
    <PublicDialogContext.Provider value={value}>
      {children}
      {dialog && (
        <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) value.close(); }}>
          <section className="modal" role="dialog" aria-modal="true">
            <button className="modal-close" type="button" aria-label="Close dialog" onClick={value.close}>×</button>
            {dialog.type === 'contact' && <>
              <p className="eyebrow">Contact HOSOM</p>
              <h2>We would love to hear from you.</h2>
              <div className="dialog-facts">
                <span><b>School email</b><a href="mailto:hopeschool@piccworldwide.org">hopeschool@piccworldwide.org</a></span>
                <span><b>General enquiries</b><a href="mailto:info@piccworldwide.org">info@piccworldwide.org</a></span>
                <span><b>Telephone</b><a href="tel:+265999045869">+265 999 045 869</a><br /><a href="tel:+265992603608">+265 992 603 608</a></span>
                <span><b>Location</b>Lilongwe, Malawi</span>
              </div>
              <button className="button full" type="button" onClick={() => setNotice('Please contact the Secretariat for assistance.')}>Start an enquiry</button>
            </>}
            {dialog.type === 'support' && <>
              <p className="eyebrow">Support</p>
              <h2>How can we help?</h2>
              <p>Contact the school at <a href="mailto:hopeschool@piccworldwide.org">hopeschool@piccworldwide.org</a> or call <a href="tel:+265999045869">+265 999 045 869</a> / <a href="tel:+265992603608">+265 992 603 608</a>.</p>
              <p>Choose a topic and describe the help you need.</p>
              <label>Support topic
                <select defaultValue="Accessing the portal">
                  <option>Accessing the portal</option>
                  <option>Course learning materials</option>
                  <option>Fees or payments</option>
                  <option>Other</option>
                </select>
              </label>
              <label>Your message
                <textarea rows={4} placeholder="Tell us what you need…" />
              </label>
              <button className="button full" type="button" onClick={() => setNotice('Online support requests are currently unavailable. Please contact the Secretariat.')}>Send request</button>
            </>}
            {dialog.type === 'forgot-password' && <>
              <p className="eyebrow">Account recovery</p>
              <h2>Reset your password</h2>
              <p>Password reset delivery is not connected in this trial. Contact the authorised account administrator for assistance.</p>
              <label>Email address<input type="email" placeholder="name@example.com" /></label>
              <button className="button full" type="button" disabled>Reset service unavailable</button>
            </>}
            {dialog.type === 'programme' && programme && <>
              <p className="eyebrow">{programme.code} · {programme.type}</p>
              <h2>{programme.name}</h2>
              <p>{programme.description}</p>
              <div className="dialog-facts">
                <span><b>Duration</b>{programme.duration}</span>
                <span><b>Study mode</b>Online &amp; blended</span>
                <span><b>Applications</b>{programme.status}</span>
              </div>
              <div className="modal-actions">
                <button className="outline-button" type="button" onClick={value.close}>Close</button>
                <button className="button" type="button" onClick={() => { value.close(); document.querySelector('#admissions')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>Start application →</button>
              </div>
            </>}
            {notice && <p className="lw-notice" role="status">{notice}</p>}
          </section>
        </div>
      )}
    </PublicDialogContext.Provider>
  );
}

export function PublicShell({ children, simple = false, footer = false }: { children: ReactNode; simple?: boolean; footer?: boolean }) {
  return (
    <PublicDialogProvider>
      {simple ? <SimpleHeader /> : <PublicHeader />}
      {children}
      {footer ? <SiteFooter /> : null}
    </PublicDialogProvider>
  );
}

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <BrandLink />
      <button className="menu-toggle" type="button" aria-label="Open navigation" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
      <nav className={open ? 'open' : ''} aria-label="Main navigation" onClick={() => setOpen(false)}>
        <SectionLink className="nav-text" target="#about">About</SectionLink>
        <SectionLink className="nav-text" target="#programmes">Programmes</SectionLink>
        <SectionLink className="nav-text" target="#admissions">Admissions</SectionLink>
        <Link href="/#curriculum">Curriculum</Link>
        <a href="#contact">Contact</a>
        <SectionLink className="nav-login nav-text" target="#experience">Portal login</SectionLink>
        <SectionLink className="button button-sm" target="#admissions">Apply now</SectionLink>
      </nav>
    </header>
  );
}

export function SimpleHeader() {
  return (
    <header className="simple-header">
      <BrandLink />
      <Link className="back-link" href="/">← Back to homepage</Link>
    </header>
  );
}

export function SiteFooter() {
  const { open } = usePublicDialog();
  return (
    <footer className="site-footer" id="contact">
      <div>
        <BrandLink light />
        <p>Equipping leaders for faithful service.</p>
      </div>
      <div>
        <b>Explore</b>
        <Link href="/#curriculum">Curriculum</Link>
        <SectionLink target="#about">About HOSOM</SectionLink>
        <SectionLink target="#programmes">Programmes</SectionLink>
        <SectionLink target="#admissions">Admissions</SectionLink>
      </div>
      <div>
        <b>Connect</b>
        <button type="button" onClick={() => open({ type: 'contact' })}>Contact us</button>
        <SectionLink target="#experience">Student portal</SectionLink>
        <button type="button" onClick={() => open({ type: 'support' })}>Support</button>
      </div>
      <div>
        <b>Contact</b>
        <a href="mailto:hopeschool@piccworldwide.org">hopeschool@piccworldwide.org</a>
        <a href="mailto:info@piccworldwide.org">info@piccworldwide.org</a>
        <a href="tel:+265999045869">+265 999 045 869</a>
        <a href="tel:+265992603608">+265 992 603 608</a>
        <button type="button" onClick={() => open({ type: 'contact' })}>Lilongwe, Malawi</button>
      </div>
      <small className="copyright">© 2026 Hope School of Ministry. All rights reserved.</small>
    </footer>
  );
}

function BrandLink({ light = false }: { light?: boolean }) {
  return (
    <Link className={`brand ${light ? 'brand-light' : ''}`} href="/" aria-label="HOSOM Hope School of Ministry">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/hosom-logo.png" alt="Pentecost International Christian Centre logo" width={42} height={42} />
      <span><b>HOSOM</b><small>Hope School of Ministry</small></span>
    </Link>
  );
}
