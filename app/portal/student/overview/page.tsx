import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Overview · Student' };

export default function OverviewPage() {
  return <PortalSection role="student" section="Overview" />;
}
