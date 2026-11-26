import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Requisitions · Head of Programs' };

export default function RequisitionsPage() {
  return <PortalSection role="head-of-programs" section="Requisitions" />;
}
