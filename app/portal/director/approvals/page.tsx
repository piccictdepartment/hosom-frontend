import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Approvals · Director' };

export default function ApprovalsPage() {
  return <PortalSection role="director" section="Approvals" />;
}
