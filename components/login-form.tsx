'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { roles, portalHref, type RoleSlug } from '@/lib/demo-data';
import { ApiClientError, apiRequest, roleEnumToSlug } from '@/lib/api';
import { useAuth } from '@/components/auth-provider';
import './login-form.css';

const seededTestAccounts = [
  { label: 'Student (Thoko Banda)', email: 'thoko.banda@student.hosom.edu' },
  { label: 'Lecturer (Dr. Daniel Phiri)', email: 'lecturer1@hosom.edu' },
  { label: 'Secretariat (Mary Tembo)', email: 'secretariat@hosom.edu' },
  { label: 'Head of Programs (Ruth Mbewe)', email: 'headofprograms@hosom.edu' },
  { label: 'System Admin (Alex Mercer)', email: 'sysadmin@hosom.edu' },
];

export function LoginForm() {
  const router = useRouter();
  const { login, enableDemoMode } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [resetMode, setResetMode] = useState<'none' | 'forgot' | 'reset'>('none');
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);
    try {
      const user = await login(email.trim(), password);
      const slug = roleEnumToSlug(user.role);
      setNotice(`Signed in as ${user.firstName} ${user.surname}. Opening ${roles[slug].label} portal…`);
      router.push(portalHref(slug));
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Unable to sign in. Please check your credentials and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);
    try {
      const { data } = await apiRequest<{ message: string }>('/api/auth/forgot-password', {
        method: 'POST',
        body: { email: resetEmail.trim() },
        token: null,
      });
      setNotice(`${data.message} (In development mode, check the backend terminal for the reset token.)`);
      setResetMode('reset');
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Could not request password reset.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);
    try {
      const { data } = await apiRequest<{ message: string }>('/api/auth/reset-password', {
        method: 'POST',
        body: { token: resetToken.trim(), password: newPassword },
        token: null,
      });
      setNotice(data.message);
      setResetMode('none');
      setResetToken('');
      setNewPassword('');
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Could not reset password.');
    } finally {
      setSubmitting(false);
    }
  }

  function enterDemoWorkspace(selectedRole: RoleSlug) {
    enableDemoMode();
    router.push(portalHref(selectedRole));
  }

  return (
    <div className="login-form-container">
      {error && (
        <div
          className="login-alert"
          role="alert"
          style={{ background: '#fef2f2', borderColor: '#fecaca', color: '#991b1b', marginBottom: 12 }}
        >
          {error}
        </div>
      )}
      {notice && (
        <div className="login-alert" role="status" style={{ marginBottom: 12 }}>
          {notice}
        </div>
      )}

      {resetMode === 'none' ? (
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="login-field">
            <label htmlFor="login-email">
              Email address <span className="required-star">*</span>
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@hosom.edu"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <div className="field-label-row">
              <label htmlFor="login-password">
                Password <span className="required-star">*</span>
              </label>
              <button
                type="button"
                className="forgot-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                onClick={() => {
                  setResetMode('forgot');
                  setResetEmail(email);
                  setError(null);
                  setNotice(null);
                }}
              >
                Forgot password?
              </button>
            </div>
            <div className="password-input-wrap">
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="seeded-account-select">Quick-fill seeded account (local testing)</label>
            <div className="select-wrap">
              <select
                id="seeded-account-select"
                defaultValue=""
                onChange={(event) => {
                  const chosen = event.target.value;
                  if (!chosen) return;
                  setEmail(chosen);
                  setPassword('Password123!');
                  setError(null);
                }}
              >
                <option value="">Choose a seeded test account…</option>
                {seededTestAccounts.map((acc) => (
                  <option key={acc.email} value={acc.email}>
                    {acc.label} — {acc.email}
                  </option>
                ))}
              </select>
              <span className="select-arrow" aria-hidden="true">▾</span>
            </div>
            <small className="field-hint">
              Password for all seeded accounts: <code>Password123!</code>
            </small>
          </div>

          <button type="submit" className="login-button" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in to workspace'} <span aria-hidden="true">→</span>
          </button>
        </form>
      ) : resetMode === 'forgot' ? (
        <form onSubmit={handleForgotPassword} className="auth-form">
          <div className="login-field">
            <label htmlFor="reset-email">Account email</label>
            <input
              id="reset-email"
              type="email"
              required
              value={resetEmail}
              onChange={(event) => setResetEmail(event.target.value)}
              placeholder="name@hosom.edu"
            />
          </div>
          <button type="submit" className="login-button" disabled={submitting}>
            {submitting ? 'Sending…' : 'Request reset token'}
          </button>
          <button
            type="button"
            className="forgot-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            onClick={() => {
              setResetMode('none');
              setError(null);
            }}
          >
            ← Back to sign in
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="auth-form">
          <div className="login-field">
            <label htmlFor="reset-token">Reset token</label>
            <input
              id="reset-token"
              type="text"
              required
              value={resetToken}
              onChange={(event) => setResetToken(event.target.value)}
              placeholder="Paste token from backend terminal"
            />
          </div>
          <div className="login-field">
            <label htmlFor="new-password">New password (min 8 characters)</label>
            <input
              id="new-password"
              type="password"
              minLength={8}
              required
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </div>
          <button type="submit" className="login-button" disabled={submitting}>
            {submitting ? 'Resetting…' : 'Reset password'}
          </button>
          <button
            type="button"
            className="forgot-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            onClick={() => {
              setResetMode('none');
              setError(null);
            }}
          >
            ← Back to sign in
          </button>
        </form>
      )}

      <div className="role-preview-section">
        <div className="section-divider">
          <span>Or preview UI in demo mode (no backend auth)</span>
        </div>
        <div className="role-preview-grid">
          {(Object.keys(roles) as RoleSlug[]).map((key) => (
            <button
              type="button"
              key={key}
              onClick={() => enterDemoWorkspace(key)}
              className="role-preview-item"
              style={{ textAlign: 'left', cursor: 'pointer' }}
            >
              <div>
                <b>{roles[key].label}</b>
                <small>{roles[key].subtitle}</small>
              </div>
              <span className="preview-arrow" aria-hidden="true">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
