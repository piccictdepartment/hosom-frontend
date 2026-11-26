import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Overview · Head of HOSOM' };

export default function OverviewPage() {
  return <PortalSection role="head-of-hosom" section="Overview" />;
}
