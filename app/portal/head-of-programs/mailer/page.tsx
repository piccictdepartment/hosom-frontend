import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Mailer · Head of Programs' };

export default function MailerPage() {
  return <PortalSection role="head-of-programs" section="Mailer" />;
}
