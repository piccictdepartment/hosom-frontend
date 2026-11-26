import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Mailer · Director' };

export default function MailerPage() {
  return <PortalSection role="director" section="Mailer" />;
}
