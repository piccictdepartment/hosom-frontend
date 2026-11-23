'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { roles, portalHref, type RoleSlug } from '@/lib/demo-data';
import './login-form.css';

export function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<string>('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!role) {
      setNotice('Please select a role to proceed.');
      return;
    }
    // As functionalities will be added later, route to the preview of selected role workspace
    setNotice(`Signing in as ${roles[role as RoleSlug]?.label || role}... Redirecting to workspace.`);
    setTimeout(() => {
      router.push(portalHref(role as RoleSlug));
    }, 600);
  }

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        {notice && (
          <div className="login-alert" role="status">
            {notice}
          </div>
        )}

        <div className="login-field">
          <label htmlFor="login-role">
            <span>Role (Select option of the role)</span>
            <span className="required-star">*</span>
          </label>
          <div className="select-wrap">
            <select
              id="login-role"
              name="role"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setNotice(null);
              }}
              required
            >
              <option value="" disabled>
                -- Select option of the role --
              </option>
              {(Object.keys(roles) as RoleSlug[]).map((key) => (
                <option key={key} value={key}>
                  {roles[key].label} ({roles[key].subtitle})
                </option>
              ))}
            </select>
            <span className="select-arrow" aria-hidden="true">▾</span>
          </div>
          <small className="field-hint">Select the designated role to access your portal</small>
        </div>

        <div className="login-field">
          <label htmlFor="login-id">
            <span>ID</span>
            <span className="required-star">*</span>
          </label>
          <input
            id="login-id"
            name="id"
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="e.g. HOSOM/2026/014 or Staff ID"
            autoComplete="username"
            required
          />
          <small className="field-hint">Enter your student ID, lecturer ID, or staff identity number</small>
        </div>

        <div className="login-field">
          <div className="field-label-row">
            <label htmlFor="login-password">
              <span>Password</span>
              <span className="required-star">*</span>
            </label>
            <a
              href="#forgot-password"
              onClick={(e) => {
                e.preventDefault();
                setNotice('Password reset flow will be enabled once backend authentication is connected.');
              }}
              className="forgot-link"
            >
              Forgot password?
            </a>
          </div>
          <div className="password-input-wrap">
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <small className="field-hint">Your confidential portal access credentials</small>
        </div>

        <div className="login-aux-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Remember my ID</span>
          </label>
        </div>

        <button type="submit" className="login-button">
          Sign In
        </button>

        <p className="login-status-note">
          <span className="status-badge">Preview Mode</span>
          Backend authentication functionality will be added later. Submitting will direct you to the selected role workspace.
        </p>
      </form>

      <div className="role-preview-section">
        <div className="section-divider">
          <span>Or explore sample workspaces directly</span>
        </div>
        <div className="role-preview-grid">
          {(Object.keys(roles) as RoleSlug[]).map((key) => (
            <Link href={portalHref(key)} key={key} className="role-preview-item">
              <div>
                <b>{roles[key].label}</b>
                <small>{roles[key].subtitle}</small>
              </div>
              <span className="preview-arrow">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
