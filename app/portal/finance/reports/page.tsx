import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Reports · Finance' };

export default function ReportsPage() {
  return <PortalSection role="finance" section="Reports" />;
}
