import type { Metadata } from 'next';
import Link from 'next/link';
import { Brand } from '@/components/brand';
import { LoginForm } from '@/components/login-form';

export const metadata: Metadata = {
  title: 'Login | Portal Access',
  description: 'Sign in to the Hope School of Ministry (HOSOM) e-learning and academic management portal.',
};

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-aside">
        <Brand light />
        <div>
          <p className="eyebrow">HOSOM HELMS</p>
          <h1>One place for every part of your learning journey.</h1>
          <p>
            Access the role-specific e-learning workspaces, academic administration, and student services portal.
          </p>
        </div>
        <Link href="/">← Back to homepage</Link>
      </div>
      <main className="login-main">
        <div className="login-card">
          <p className="eyebrow">PORTAL ACCESS</p>
          <h2>Sign in to HOSOM HELMS</h2>
          <p>
            Enter your HOSOM email and password to open your role-based workspace.
          </p>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
