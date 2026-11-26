import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Events · System Administrator' };

export default function EventsPage() {
  return <PortalSection role="system-admin" section="Events" />;
}
