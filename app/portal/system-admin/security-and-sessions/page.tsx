import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Security & Sessions · System Administrator' };

export default function SecurityAndSessionsPage() {
  return <PortalSection role="system-admin" section="Security & Sessions" />;
}
