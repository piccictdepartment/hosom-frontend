import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Mailer · System Administrator' };

export default function MailerPage() {
  return <PortalSection role="system-admin" section="Mailer" />;
}
