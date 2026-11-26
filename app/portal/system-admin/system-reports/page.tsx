import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'System Reports · System Administrator' };

export default function SystemReportsPage() {
  return <PortalSection role="system-admin" section="System Reports" />;
}
