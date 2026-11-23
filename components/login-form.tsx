'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { roles, portalHref, type RoleSlug } from '@/lib/demo-data';
import './login-form.css';

/** Temporary, credential-free access for reviewing the frontend workspaces. */
export function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<RoleSlug | ''>('');
  const [notice, setNotice] = useState<string | null>(null);

  function enterWorkspace(selectedRole: RoleSlug) {
    setNotice(`Opening the ${roles[selectedRole].label} workspace…`);
    router.push(portalHref(selectedRole));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!role) {
      setNotice('Please select a workspace to continue.');
      return;
    }
    enterWorkspace(role);
  }

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="login-demo-banner" role="status">
          <span className="login-demo-banner-icon" aria-hidden="true">✓</span>
          <span>
            <strong>Demo access is enabled</strong>
            <small>Choose a workspace below. No username, ID or password is required.</small>
          </span>
        </div>

        {notice && <div className="login-alert" role="status">{notice}</div>}

        <div className="login-field">
          <label htmlFor="login-role">Choose your workspace</label>
          <div className="select-wrap">
            <select
              id="login-role"
              name="role"
              value={role}
              onChange={(event) => {
                setRole(event.target.value as RoleSlug | '');
                setNotice(null);
              }}
              required
            >
              <option value="">Select a HOSOM workspace</option>
              {(Object.keys(roles) as RoleSlug[]).map((key) => (
                <option key={key} value={key}>
                  {roles[key].label} — {roles[key].subtitle}
                </option>
              ))}
            </select>
            <span className="select-arrow" aria-hidden="true">▾</span>
          </div>
          <small className="field-hint">You can switch to another workspace at any time.</small>
        </div>

        <button type="submit" className="login-button">
          Enter selected workspace <span aria-hidden="true">→</span>
        </button>
      </form>

      <div className="role-preview-section">
        <div className="section-divider">
          <span>Or enter a workspace directly</span>
        </div>
        <div className="role-preview-grid">
          {(Object.keys(roles) as RoleSlug[]).map((key) => (
            <Link href={portalHref(key)} key={key} className="role-preview-item">
              <div>
                <b>{roles[key].label}</b>
                <small>{roles[key].subtitle}</small>
              </div>
              <span className="preview-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </div>

      <p className="login-status-note">
        <span className="status-badge">Preview mode</span>
        These workspaces use illustrative sample records. This temporary access is for review and testing only; it does not provide real account authentication or protect private records.
      </p>
    </div>
  );
}
