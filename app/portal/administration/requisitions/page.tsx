import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Requisitions · Administration' };

export default function RequisitionsPage() {
  return <PortalSection role="administration" section="Requisitions" />;
}
