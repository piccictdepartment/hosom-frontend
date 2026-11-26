'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Brand } from '@/components/site/brand';
import { useAuth } from '@/components/providers/auth-provider';
import { roleEnumToSlug } from '@/lib/api';
import { portalHref, roles, type RoleSlug } from '@/lib/demo-data';

export function PortalShell({ role, children }: { role: RoleSlug; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, demoMode, logout } = useAuth();
  const roleMeta = roles[role];

  useEffect(() => {
    if (loading) return;
    if (user) {
      const authorizedSlug = roleEnumToSlug(user.role);
      if (authorizedSlug !== role) {
        router.replace(portalHref(authorizedSlug));
      }
      return;
    }
    if (!demoMode) {
      router.replace('/login');
    }
  }, [loading, user, demoMode, role, router]);

  async function handleSignOut() {
    await logout();
    router.push('/login');
  }

  if (loading || (!user && !demoMode) || (user && roleEnumToSlug(user.role) !== role)) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#183555' }}>
        <p>Checking session…</p>
      </div>
    );
  }

  const displayName = user ? `${user.firstName} ${user.surname}` : roleMeta.person;
  const displayIdentifier = user
    ? user.student?.studentNumber || user.email
    : roleMeta.id;
  const initial = displayName.slice(0, 1).toUpperCase();

  return (
    <div className="portal">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className={`portal-sidebar ${open ? 'is-open' : ''}`}>
        <div className="side-brand">
          <Brand light />
          <button className="close-menu" aria-label="Close navigation" onClick={() => setOpen(false)}>×</button>
        </div>
        <div className="side-person">
          <div className="side-avatar">{initial}</div>
          <div>
            <strong>{displayName}</strong>
            <span>{roleMeta.label}</span>
          </div>
        </div>
        <nav aria-label={`${roleMeta.label} navigation`}>
          {roleMeta.groups.map((group) => (
            <div className="nav-group" key={group.label}>
              <span className="nav-group-label">{group.label}</span>
              {group.items.map((item, index) => {
                const href = portalHref(role, item);
                return (
                  <Link
                    key={item}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={pathname === href ? 'active' : ''}
                    aria-current={pathname === href ? 'page' : undefined}
                  >
                    <span className="nav-icon" aria-hidden="true">
                      {index === 0 ? '◫' : ['◈', '▤', '◎', '▥', '◇'][index % 5]}
                    </span>
                    {item}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="side-bottom">
          {user ? (
            <button
              type="button"
              onClick={handleSignOut}
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#fff',
                borderRadius: 6,
                padding: '8px 12px',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 600,
              }}
            >
              Sign out
            </button>
          ) : (
            <Link href="/login">Sign in / Switch role</Link>
          )}
          <Link href="/">← Public website</Link>
          <small>
            HELMS · Hope School of Ministry
            <br />
            {user ? 'Connected to backend' : 'Interface preview'}
          </small>
        </div>
      </div>
      {open && (
        <button className="sidebar-scrim" aria-label="Close menu" onClick={() => setOpen(false)} />
      )}
      <div className="portal-area">
        <header className="portal-topbar">
          <button className="mobile-menu" onClick={() => setOpen(true)} aria-label="Open navigation">☰</button>
          <div className="breadcrumb">
            HOSOM <span>/ {roleMeta.label} portal</span>
          </div>
          <div className="topbar-right">
            <span className="demo-tag">{user ? 'LIVE API' : 'DEMO VIEW'}</span>
            <div className="topbar-user">
              <strong>{displayName}</strong>
              <small>{displayIdentifier}</small>
            </div>
            <span className="topbar-avatar">{initial}</span>
          </div>
        </header>
        <main id="main-content" className="portal-content">
          {children}
        </main>
      </div>
    </div>
  );
}
