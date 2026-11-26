import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Requisitions · Director' };

export default function RequisitionsPage() {
  return <PortalSection role="director" section="Requisitions" />;
}
