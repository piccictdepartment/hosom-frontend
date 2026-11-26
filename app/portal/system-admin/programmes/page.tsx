import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Programmes · System Administrator' };

export default function ProgrammesPage() {
  return <PortalSection role="system-admin" section="Programmes" />;
}
