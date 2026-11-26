import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Requisitions · Head of HOSOM' };

export default function RequisitionsPage() {
  return <PortalSection role="head-of-hosom" section="Requisitions" />;
}
