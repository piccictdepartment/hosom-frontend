import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Overview · System Administrator' };

export default function OverviewPage() {
  return <PortalSection role="system-admin" section="Overview" />;
}
