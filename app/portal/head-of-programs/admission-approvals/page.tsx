import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Admission Approvals · Head of Programs' };

export default function AdmissionApprovalsPage() {
  return <PortalSection role="head-of-programs" section="Admission Approvals" />;
}
