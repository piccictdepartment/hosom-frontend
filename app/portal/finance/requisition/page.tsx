import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Requisition · Finance' };

export default function RequisitionPage() {
  return <PortalSection role="finance" section="Requisition" />;
}
