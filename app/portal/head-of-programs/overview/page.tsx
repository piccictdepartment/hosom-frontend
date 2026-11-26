import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Overview · Head of Programs' };

export default function OverviewPage() {
  return <PortalSection role="head-of-programs" section="Overview" />;
}
