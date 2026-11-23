'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brand } from './brand';
import { portalHref, roles, type RoleSlug } from '@/lib/demo-data';
export function PortalShell({ role, children }: { role: RoleSlug; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const user = roles[role];
  return <div className="portal"><a className="skip-link" href="#main-content">Skip to content</a><div className={`portal-sidebar ${open ? 'is-open' : ''}`}><div className="side-brand"><Brand light /><button className="close-menu" aria-label="Close navigation" onClick={() => setOpen(false)}>×</button></div><div className="side-person"><div className="side-avatar">{user.person.slice(0, 1)}</div><div><strong>{user.person}</strong><span>{user.label}</span></div></div><nav aria-label={`${user.label} navigation`}>{user.groups.map(group => <div className="nav-group" key={group.label}><span className="nav-group-label">{group.label}</span>{group.items.map((item, index) => { const href = portalHref(role, item); return <Link key={item} href={href} onClick={() => setOpen(false)} className={pathname === href ? 'active' : ''} aria-current={pathname === href ? 'page' : undefined}><span className="nav-icon" aria-hidden="true">{index === 0 ? '◫' : ['◈','▤','◎','▥','◇'][index % 5]}</span>{item}</Link>; })}</div>)}</nav><div className="side-bottom"><Link href="/login">Switch demo role</Link><Link href="/">← Public website</Link><small>HELMS · Hope School of Ministry<br />Interface preview</small></div></div>{open && <button className="sidebar-scrim" aria-label="Close menu" onClick={() => setOpen(false)} />}<div className="portal-area"><header className="portal-topbar"><button className="mobile-menu" onClick={() => setOpen(true)} aria-label="Open navigation">☰</button><div className="breadcrumb">HOSOM <span>/ {user.label} portal</span></div><div className="topbar-right"><span className="demo-tag">DEMO VIEW</span><div className="topbar-user"><strong>{user.person}</strong><small>{user.id}</small></div><span className="topbar-avatar">{user.person.slice(0, 1)}</span></div></header><main id="main-content" className="portal-content">{children}</main></div></div>;
}
