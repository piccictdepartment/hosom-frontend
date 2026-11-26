import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Mailer · Media' };

export default function MailerPage() {
  return <PortalSection role="media" section="Mailer" />;
}
