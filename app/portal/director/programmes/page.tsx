import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Programmes · Director' };

export default function ProgrammesPage() {
  return <PortalSection role="director" section="Programmes" />;
}
