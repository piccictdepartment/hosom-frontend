import type { Metadata } from 'next';
import { PortalSection } from '@/components/portal/portal-section';

export const metadata: Metadata = { title: 'Results Publication · Secretariat' };

export default function ResultsPublicationPage() {
  return <PortalSection role="secretariat" section="Results Publication" />;
}
