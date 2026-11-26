import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Operations · Head of Programs' };

export default function OperationsPage() {
  return <PortalSection role="head-of-programs" section="Operations" />;
}
