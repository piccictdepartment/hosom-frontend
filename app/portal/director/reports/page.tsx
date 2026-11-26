import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Reports · Director' };

export default function ReportsPage() {
  return <PortalSection role="director" section="Reports" />;
}
