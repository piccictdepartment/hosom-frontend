import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Operations · Administration' };

export default function OperationsPage() {
  return <PortalSection role="administration" section="Operations" />;
}
