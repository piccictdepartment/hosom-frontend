import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Overview · Administration' };

export default function OverviewPage() {
  return <PortalSection role="administration" section="Overview" />;
}
