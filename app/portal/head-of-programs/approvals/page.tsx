import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Approvals · Head of Programs' };

export default function ApprovalsPage() {
  return <PortalSection role="head-of-programs" section="Approvals" />;
}
