import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Events · Head of HOSOM' };

export default function EventsPage() {
  return <PortalSection role="head-of-hosom" section="Events" />;
}
