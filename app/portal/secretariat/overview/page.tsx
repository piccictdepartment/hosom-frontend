import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Overview · Secretariat' };

export default function OverviewPage() {
  return <PortalSection role="secretariat" section="Overview" />;
}
