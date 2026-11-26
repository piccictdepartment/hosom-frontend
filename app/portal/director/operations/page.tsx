import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Operations · Director' };

export default function OperationsPage() {
  return <PortalSection role="director" section="Operations" />;
}
