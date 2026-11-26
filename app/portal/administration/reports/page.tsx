import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Reports · Administration' };

export default function ReportsPage() {
  return <PortalSection role="administration" section="Reports" />;
}
