import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Results Approval · Head of Programs' };

export default function ResultsApprovalPage() {
  return <PortalSection role="head-of-programs" section="Results Approval" />;
}
