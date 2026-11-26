import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Reports · Head of HOSOM' };

export default function ReportsPage() {
  return <PortalSection role="head-of-hosom" section="Reports" />;
}
