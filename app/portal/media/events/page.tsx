import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Events · Media' };

export default function EventsPage() {
  return <PortalSection role="media" section="Events" />;
}
