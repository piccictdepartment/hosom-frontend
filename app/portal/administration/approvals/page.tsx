import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Approvals · Administration' };

export default function ApprovalsPage() {
  return <PortalSection role="administration" section="Approvals" />;
}
