'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Brand } from './brand';
export function PublicHeader() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><Brand /><button className="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button><nav className={open ? 'open' : ''} aria-label="Main navigation" onClick={() => setOpen(false)}><Link href="/about">About</Link><Link href="/programmes">Programmes</Link><Link href="/admissions">Admissions</Link><Link href="/#curriculum">Curriculum</Link><Link href="/#experience">The experience</Link><Link href="/#contact">Contact</Link><Link className="nav-login" href="/login">Portal login</Link><Link className="button button-sm" href="/admissions">Apply now <span>↗</span></Link></nav></header>;
}
