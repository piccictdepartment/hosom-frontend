import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Operations · Secretariat' };

export default function OperationsPage() {
  return <PortalSection role="secretariat" section="Operations" />;
}
