import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Events · Director' };

export default function EventsPage() {
  return <PortalSection role="director" section="Events" />;
}
