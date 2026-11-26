import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Audit Trail · System Administrator' };

export default function AuditTrailPage() {
  return <PortalSection role="system-admin" section="Audit Trail" />;
}
