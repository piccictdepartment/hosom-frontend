import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Overview · Director' };

export default function OverviewPage() {
  return <PortalSection role="director" section="Overview" />;
}
