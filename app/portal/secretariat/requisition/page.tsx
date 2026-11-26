import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Requisition · Secretariat' };

export default function RequisitionPage() {
  return <PortalSection role="secretariat" section="Requisition" />;
}
