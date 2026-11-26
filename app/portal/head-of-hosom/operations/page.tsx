import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Operations · Head of HOSOM' };

export default function OperationsPage() {
  return <PortalSection role="head-of-hosom" section="Operations" />;
}
